#!/usr/bin/env node
/**
 * Diagnose contact form / Resend configuration.
 * Usage: node scripts/diagnose-contact.mjs
 * Loads .env.local if present (dotenv not required — manual read).
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

loadEnvLocal();

const apiKey = process.env.RESEND_API_KEY?.trim();
const from = process.env.CONTACT_FROM_EMAIL?.trim() ?? "geck0 Contact <onboarding@resend.dev>";
const to = process.env.CONTACT_INBOX_EMAIL?.trim() ?? "hello@geck0.ai";

console.log("Contact diagnostics\n");
console.log("RESEND_API_KEY:", apiKey ? `${apiKey.slice(0, 8)}…` : "MISSING");
console.log("CONTACT_FROM_EMAIL:", from);
console.log("CONTACT_INBOX_EMAIL:", to);
console.log("BLOB_READ_WRITE_TOKEN:", process.env.BLOB_READ_WRITE_TOKEN ? "set" : "missing");
console.log("KV/Upstash:", process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL ? "set" : "missing");

if (!apiKey) {
  console.log("\nFix: set RESEND_API_KEY on Vercel Production.");
  process.exit(1);
}

const domainsRes = await fetch("https://api.resend.com/domains", {
  headers: { Authorization: `Bearer ${apiKey}` },
});
console.log("\nGET /domains:", domainsRes.status);
if (domainsRes.ok) {
  const domains = await domainsRes.json();
  const list = domains.data ?? [];
  for (const d of list) {
    console.log(`  - ${d.name}: ${d.status}`);
  }
  const geck0 = list.find((d) => d.name === "geck0.ai");
  if (!geck0 || geck0.status !== "verified") {
    console.log("\n⚠ geck0.ai must be verified in Resend for FROM:", from);
    console.log("  Until then, set CONTACT_FROM_EMAIL=geck0 <onboarding@resend.dev> (test only)");
  }
}

const testRes = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from,
    to: [to],
    subject: "[geck0] contact diagnostic",
    text: "If you receive this, Resend contact delivery works.",
  }),
});

console.log("\nPOST /emails (test send):", testRes.status);
const body = await testRes.text();
console.log(body.slice(0, 500));

process.exit(testRes.ok ? 0 : 1);
