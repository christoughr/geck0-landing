#!/usr/bin/env node
/** E2E test for app.geck0.ai beta (step 1 checklist). */
let BASE = (process.argv[2] ?? "https://app.geck0.ai").replace(/\/$/, "");
if (BASE.endsWith("/app")) BASE = BASE.slice(0, -4);
const EMAIL = process.argv[3] ?? "hello@geck0.ai";

const results = [];

function pass(name) {
  results.push({ name, ok: true });
  console.log(`✓ ${name}`);
}
function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`✗ ${name}: ${detail}`);
}

async function main() {
  const gateRes = await fetch(`${BASE}/app`);
  const gateHtml = await gateRes.text();
  if (gateRes.status !== 200) fail("GET /app", `status ${gateRes.status}`);
  else if (!/Enter beta app|베타 앱 입장/.test(gateHtml)) fail("GET /app", "missing login form");
  else pass("GET /app gate");

  const authRes = await fetch(`${BASE}/api/app/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL }),
  });
  const authBody = await authRes.json().catch(() => ({}));
  const setCookie = authRes.headers.getSetCookie?.() ?? [];
  const sessionCookie = setCookie.find((c) => c.startsWith("geck0_app_session="));

  if (!authRes.ok) {
    fail("POST /api/app/auth", `${authRes.status} ${JSON.stringify(authBody)}`);
  } else if (!sessionCookie) {
    fail("POST /api/app/auth", "no session cookie");
  } else {
    pass("POST /api/app/auth");
  }

  const cookieHeader = sessionCookie
    ? { Cookie: sessionCookie.split(";")[0] }
    : {};

  const dashRes = await fetch(`${BASE}/app/dashboard`, {
    redirect: "manual",
    headers: cookieHeader,
  });
  const dashHtml = await dashRes.text();
  if (!sessionCookie) {
    fail("GET /app/dashboard", "skipped (no session)");
  } else if (dashRes.status >= 300 && dashRes.status < 400) {
    fail("GET /app/dashboard", `redirect ${dashRes.status} → ${dashRes.headers.get("location")}`);
  } else if (dashRes.status !== 200) {
    fail("GET /app/dashboard", `status ${dashRes.status}`);
  } else if (!/Dashboard|대시보드/.test(dashHtml) || /WaitlistForm|베타 앱 입장/.test(dashHtml)) {
    fail("GET /app/dashboard", "not authenticated shell");
  } else pass("GET /app/dashboard");

  const badAuth = await fetch(`${BASE}/api/app/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "not-invited-test@example.com" }),
  });
  if (badAuth.status === 403) pass("POST /api/app/auth rejects stranger");
  else fail("POST /api/app/auth rejects stranger", `status ${badAuth.status}`);

  if (sessionCookie) {
    const qaRes = await fetch(`${BASE}/api/app/qa`, {
      method: "POST",
      headers: { ...cookieHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ query: "Q1 customer churn?" }),
    });
    const qaBody = await qaRes.json().catch(() => ({}));
    if (qaRes.status !== 200) fail("POST /api/app/qa", `${qaRes.status} ${JSON.stringify(qaBody)}`);
    else if (!qaBody.answer || !qaBody.sources?.length) fail("POST /api/app/qa", "missing answer/sources");
    else pass("POST /api/app/qa");
  } else {
    fail("POST /api/app/qa", "skipped (no session)");
  }

  for (const path of [
    "/app/graph",
    "/app/insights",
    "/app/settings/integrations",
    "/app/settings/team",
    "/app/settings/api",
    "/app/qa",
  ]) {
    const res = await fetch(`${BASE}${path}`, { redirect: "manual", headers: cookieHeader });
    if (!sessionCookie) {
      fail(`GET ${path}`, "skipped");
      continue;
    }
    if (res.status >= 300 && res.status < 400) {
      fail(`GET ${path}`, `redirect to ${res.headers.get("location")}`);
    } else if (res.status !== 200) {
      fail(`GET ${path}`, `status ${res.status}`);
    } else pass(`GET ${path}`);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
