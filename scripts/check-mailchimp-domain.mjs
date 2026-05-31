#!/usr/bin/env node
/**
 * Check Mailchimp domain authentication status.
 * Usage: node scripts/check-mailchimp-domain.mjs [domain]
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filename) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(".env.vercel");
loadEnvFile(".env.local");

const domain = process.argv[2] ?? "geck0.ai";
const apiKey = process.env.MAILCHIMP_API_KEY;
const prefix = process.env.MAILCHIMP_SERVER_PREFIX;

if (!apiKey || !prefix) {
  console.error("Set MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX");
  process.exit(1);
}

const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");

async function main() {
  const res = await fetch(
    `https://${prefix}.api.mailchimp.com/3.0/verified-domains?count=50`,
    { headers: { Authorization: `Basic ${auth}` } }
  );

  if (!res.ok) {
    console.error(`Mailchimp API error: ${res.status}`);
    process.exit(1);
  }

  const data = await res.json();
  const domains = data.domains ?? [];
  const match = domains.find((d) => d.domain === domain);

  if (!match) {
    console.log(`Domain "${domain}" not found in Mailchimp verified domains.`);
    console.log("Add it in Mailchimp → Account → Domains and configure DNS records.");
    process.exit(2);
  }

  console.log(`Domain: ${match.domain}`);
  console.log(`Verified: ${match.verified}`);
  console.log(`Authenticated: ${match.authenticated}`);
  if (match.verification_email) {
    console.log(`Verification email: ${match.verification_email}`);
  }

  process.exit(match.authenticated ? 0 : 2);
}

main();
