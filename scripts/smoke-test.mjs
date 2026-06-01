#!/usr/bin/env node
/**
 * Smoke test for geck0 landing APIs.
 * Usage: node scripts/smoke-test.mjs [baseUrl]
 */

const BASE = process.argv[2] ?? process.env.SMOKE_BASE_URL ?? "https://geck0.ai";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { res, body };
}

test("GET /api/health status field", async () => {
  const { body } = await request("/api/health");
  if (!body?.status) throw new Error("Missing status in health response");
  if (!["operational", "degraded", "unavailable"].includes(body.status)) {
    throw new Error(`Unexpected status: ${body.status}`);
  }
});

test("GET /demo returns 200", async () => {
  const res = await fetch(`${BASE}/demo`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /status returns 200", async () => {
  const res = await fetch(`${BASE}/status`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /app returns 200", async () => {
  const res = await fetch(`${BASE}/app`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /openapi.yaml returns 200", async () => {
  const res = await fetch(`${BASE}/openapi.yaml`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /docs/api returns 200", async () => {
  const res = await fetch(`${BASE}/docs/api`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /blog returns 200", async () => {
  const res = await fetch(`${BASE}/blog`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /blog/startup-timing returns 200", async () => {
  const res = await fetch(`${BASE}/blog/startup-timing`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /api/health returns 200", async () => {
  const { res, body } = await request("/api/health");
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  if (!body?.services) throw new Error("Missing services in health response");
});

test("GET / returns 200", async () => {
  const res = await fetch(`${BASE}/`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /?lang=ko returns 200", async () => {
  const res = await fetch(`${BASE}/?lang=ko`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("POST /api/subscribe empty body → 400 or 403", async () => {
  const { res } = await request("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  if (res.status !== 400 && res.status !== 403) {
    throw new Error(`Expected 400 or 403, got ${res.status}`);
  }
});

test("POST /api/contact empty body → 400 or 403", async () => {
  const { res } = await request("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  if (res.status !== 400 && res.status !== 403) {
    throw new Error(`Expected 400 or 403, got ${res.status}`);
  }
});

test("POST /api/subscribe honeypot → 200 fake success", async () => {
  const { res } = await request("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "bot@spam.com", _gotcha: "filled" }),
  });
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /api/subscribe admin without key → 401 or 404", async () => {
  const { res } = await request("/api/subscribe");
  if (res.status !== 404 && res.status !== 401) {
    throw new Error(`Expected 401 or 404, got ${res.status}`);
  }
});

test("GET /checkout/success returns 200", async () => {
  const res = await fetch(`${BASE}/checkout/success`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /api/checkout returns trial metadata", async () => {
  const { res, body } = await request("/api/checkout");
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  if (body?.trialDays !== 1) throw new Error(`Expected trialDays=1, got ${body?.trialDays}`);
});

test("POST /api/checkout invalid plan → 400", async () => {
  const { res } = await request("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan: "enterprise", seats: 1 }),
  });
  if (res.status !== 400 && res.status !== 503) {
    throw new Error(`Expected 400 or 503, got ${res.status}`);
  }
});

test("GET /robots.txt returns 200", async () => {
  const res = await fetch(`${BASE}/robots.txt`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

test("GET /sitemap.xml returns 200", async () => {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

async function main() {
  console.log(`Smoke testing ${BASE}\n`);
  let passed = 0;
  let failed = 0;

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passed += 1;
    } catch (err) {
      console.error(`✗ ${name}`);
      console.error(`  ${err instanceof Error ? err.message : err}`);
      failed += 1;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
