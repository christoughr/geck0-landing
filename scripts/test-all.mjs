#!/usr/bin/env node
/**
 * Full production checklist for geck0.
 * Usage: node scripts/test-all.mjs [email]
 */
import { spawn } from "node:child_process";

const EMAIL = process.argv[2] ?? "hello@geck0.ai";
const SITE = "https://geck0.ai";
const APP_HOST = "https://app.geck0.ai";

const results = [];
function pass(n) {
  results.push({ n, ok: true });
  console.log(`✓ ${n}`);
}
function fail(n, d) {
  results.push({ n, ok: false, d });
  console.log(`✗ ${n}: ${d}`);
}

async function fetchText(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* html */
  }
  return { res, text, json };
}

async function runSmoke() {
  return new Promise((resolve, reject) => {
    const p = spawn("node", ["scripts/smoke-test.mjs", SITE], { stdio: "inherit", shell: true });
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`smoke exit ${code}`))));
  });
}

async function runAppBeta(base, label) {
  return new Promise((resolve, reject) => {
    const p = spawn("node", ["scripts/test-app-beta.mjs", base, EMAIL], {
      stdio: "inherit",
      shell: true,
    });
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${label} app beta exit ${code}`))
    );
  });
}

async function main() {
  console.log(`\n=== geck0 full test · ${EMAIL} ===\n`);

  console.log("--- Smoke (geck0.ai) ---");
  try {
    await runSmoke();
    pass("smoke-test.mjs");
  } catch (e) {
    fail("smoke-test.mjs", e.message);
  }

  console.log("\n--- App subdomain redirect ---");
  const root = await fetchText(APP_HOST, { redirect: "manual" });
  if (root.res.status === 307 && root.res.headers.get("location")?.includes("/app")) {
    pass("app.geck0.ai/ → /app redirect");
  } else {
    fail("app.geck0.ai/ redirect", `status ${root.res.status} loc ${root.res.headers.get("location")}`);
  }

  console.log("\n--- App gate HTML ---");
  const gate = await fetchText(`${APP_HOST}/app`);
  if (!/1단계.*베타 로그인|Step 1.*Beta sign-in/.test(gate.text)) {
    fail("app gate UI", "missing step-1 login box");
  } else if (/지식이 연결될 때/.test(gate.text) && !/geck0 앱|geck0 App/.test(gate.text)) {
    fail("app gate UI", "shows landing hero without app title");
  } else {
    pass("app gate UI");
  }

  console.log("\n--- App beta E2E (app.geck0.ai) ---");
  try {
    await runAppBeta(APP_HOST, "subdomain");
    pass("test-app-beta (app.geck0.ai)");
  } catch (e) {
    fail("test-app-beta (app.geck0.ai)", e.message);
  }

  console.log("\n--- App beta E2E (geck0.ai) ---");
  try {
    await runAppBeta(SITE, "main");
    pass("test-app-beta (geck0.ai)");
  } catch (e) {
    fail("test-app-beta (geck0.ai)", e.message);
  }

  console.log("\n--- /login redirect ---");
  const login = await fetchText(`${SITE}/login`, { redirect: "manual" });
  const loc = login.res.headers.get("location") ?? "";
  if (login.res.status >= 300 && login.res.status < 400 && loc.includes("app.geck0.ai") && loc.includes("/app")) {
    pass("/login → app");
  } else {
    fail("/login redirect", `status ${login.res.status} loc ${loc}`);
  }

  console.log("\n--- Form login (hello@geck0.ai) ---");
  const form = await fetchText(`${APP_HOST}/api/app/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `email=${encodeURIComponent(EMAIL)}`,
    redirect: "manual",
  });
  if (form.res.status === 307 && form.res.headers.get("location")?.includes("/app/dashboard")) {
    pass("form login → dashboard");
  } else {
    fail("form login", `status ${form.res.status} loc ${form.res.headers.get("location")}`);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} suites passed ===\n`);
  if (failed.length) {
    failed.forEach((f) => console.log(`  - ${f.n}: ${f.d}`));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
