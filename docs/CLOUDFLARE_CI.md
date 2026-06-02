# Cloudflare and CI smoke tests

GitHub Actions runners often receive **HTTP 403** from `https://geck0.ai` when Cloudflare Bot Fight Mode or WAF rules treat CI traffic as automated.

## What we do in this repo

- **Required gate:** `smoke` job starts `next start` locally and runs `npm run smoke:local`.
- **Informational:** `smoke-production` runs `npm run smoke` against production with `continue-on-error: true`.

## If you want production smoke to pass

In the Cloudflare dashboard for `geck0.ai`:

1. **Security → WAF** or **Bots** — review Bot Fight / Super Bot Fight rules.
2. Allowlist one of:
   - User-Agent containing `geck0-smoke-test` (see `scripts/smoke-test.mjs`).
   - GitHub Actions IP ranges (changes over time; prefer a low-traffic path rule).
3. Optional: create a **Bypass** rule for `URI Path` equals `/api/health` for monitoring only (does not fix HTML routes).

## Local verification

```bash
npm run build
npm run start &
npm run smoke:local
```

## Manual production check

```bash
SMOKE_BASE_URL=https://geck0.ai npm run smoke
```

If this fails with 403 from your laptop, the site is blocking bots broadly — adjust Cloudflare or test from a browser on the live domain.
