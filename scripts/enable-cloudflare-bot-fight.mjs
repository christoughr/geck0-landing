#!/usr/bin/env node
/**
 * Enable Cloudflare Bot Fight Mode for geck0.ai zone.
 *
 * Requires:
 *   CLOUDFLARE_API_TOKEN  — Zone Settings Edit + Zone Read
 *   CLOUDFLARE_ZONE_ID    — from Cloudflare dashboard Overview
 *
 * Usage:
 *   node scripts/enable-cloudflare-bot-fight.mjs
 *   node scripts/enable-cloudflare-bot-fight.mjs --status
 */

const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim();
const statusOnly = process.argv.includes("--status");

if (!token || !zoneId) {
  console.error("Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID (see docs/CLOUDFLARE_DNS.md)");
  process.exit(1);
}

async function cf(path, options = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(JSON.stringify(data.errors ?? data));
  }
  return data.result;
}

async function main() {
  const current = await cf("/settings/bot_fight_mode");
  console.log("Bot Fight Mode:", current.value ?? current);

  if (statusOnly) return;

  if (current.value === "on") {
    console.log("Already enabled.");
    return;
  }

  const updated = await cf("/settings/bot_fight_mode", {
    method: "PATCH",
    body: JSON.stringify({ value: "on" }),
  });
  console.log("Updated:", updated.value ?? updated);
  console.log("\nNote: This is NOT a full-site CAPTCHA. Form protection remains Cloudflare Turnstile.");
  console.log("For DDoS-only, Under Attack Mode is separate (Security → Settings).");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
