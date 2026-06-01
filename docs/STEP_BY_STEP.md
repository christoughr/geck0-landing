# geck0 launch — step by step (no Stripe)

Work through in order. Skip anything already green on https://geck0.ai/status .

---

## Step 1 — Turnstile (bot protection on forms) ✅ if /status shows turnstile operational

1. Cloudflare → Turnstile → widget `geck0-landing`
2. Hostnames: `geck0.ai`, `www.geck0.ai`, `app.geck0.ai` (+ Add each)
3. Vercel → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
4. Redeploy → test waitlist on https://geck0.ai/#contact

Details: [TURNSTILE_SETUP.md](./TURNSTILE_SETUP.md)

---

## Step 2 — Mailchimp DKIM (email deliverability)

1. Mailchimp → Domains → `geck0.ai` → copy DNS records
2. Cloudflare DNS → add CNAME/TXT → **DNS only (grey cloud)** for `k1._domainkey`, `k2`, `k3`
3. Wait for “Authenticated” in Mailchimp
4. `npm run check:mailchimp`

Details: [MAILCHIMP_SETUP.md](./MAILCHIMP_SETUP.md)

---

## Step 3 — Resend (contact form → hello@geck0.ai)

1. resend.com → Domains → verify `geck0.ai`
2. **Rotate API key** if it was ever exposed: [RESEND_KEY_ROTATION.md](./RESEND_KEY_ROTATION.md)
3. Vercel → `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_INBOX_EMAIL`
4. Test https://geck0.ai/support

---

## Step 4 — Cloudflare Bot Fight Mode (optional site-wide bot friction)

Not a CAPTCHA on every page — complements Turnstile on forms.

**Dashboard:** Security → Bots → Bot Fight Mode → On

**CLI** (needs API token with Zone Settings Edit):

```bash
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ZONE_ID=...
npm run cloudflare:bot-fight
```

Details: [CLOUDFLARE_DNS.md](./CLOUDFLARE_DNS.md)

---

## Step 5 — Payments ⏸ SKIPPED

Stripe/card checkout **not** offered (Korea). Waitlist + per-seat list prices only.

Details: [PAYMENTS.md](./PAYMENTS.md)

---

## Step 6 — Verify production

```bash
npm run smoke
npm run test:e2e
```

---

## Step 7 — Optional polish

| Item | Env / action |
|------|----------------|
| Demo video | `NEXT_PUBLIC_DEMO_VIDEO_URL` |
| GA4 | `NEXT_PUBLIC_GA_ID` |
| Sentry | `NEXT_PUBLIC_SENTRY_DSN` |
| Beta count | `NEXT_PUBLIC_BETA_COUNT` |
