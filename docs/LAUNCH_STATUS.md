# geck0 Launch Status

## ✅ Done (code + infra)

- Landing: Hero, accuracy section, demo page, docs, waitlist on all surfaces
- Mailchimp waitlist + double opt-in
- Vercel Blob contact storage
- Upstash KV rate limiting (all green on /status)
- Turnstile wired (dummy keys — replace with Cloudflare real keys)
- app.geck0.ai app shell at `/app` (middleware rewrite)
- Sentry SDK ready (add DSN to enable)
- GA4 CSP ready (add `NEXT_PUBLIC_GA_ID` to enable)
- Plausible analytics + cookie consent
- `NEXT_PUBLIC_BETA_COUNT=47`

## 🔲 You do in browser (screenshots you sent)

### Turnstile (Photo 1) — NOT done yet
See [TURNSTILE_SETUP.md](./TURNSTILE_SETUP.md)
1. Widget name: `geck0-landing`
2. Add hostnames: `geck0.ai`, `www.geck0.ai`, `app.geck0.ai`
3. Create → paste keys into Vercel → redeploy

### Mailchimp (Photo 2) — NOT done yet
See [MAILCHIMP_SETUP.md](./MAILCHIMP_SETUP.md)
- **Payment:** Not required today. Free tier works. Add card before 13-day grace ends for continued sends.
- **Domain:** Click **Add & Verify Domain** → `geck0.ai` → add DNS records

### Contact = email only
No Slack needed. Form saves to Blob. Add **Resend** (`RESEND_API_KEY`) to also email `hello@geck0.ai` on each submission.

### app.geck0.ai
Domain is on another Vercel project. Either:
- Move `app.geck0.ai` to `geck0-landing` in Vercel Domains, OR
- Point DNS CNAME to geck0-landing deployment

Code at `/app` is ready (beta waitlist shell).

## Optional polish

| Item | Action |
|------|--------|
| Demo video | Set `NEXT_PUBLIC_DEMO_VIDEO_URL` (YouTube/Loom embed URL) |
| Sentry | Accept terms at Vercel Integrations → Sentry, or set `SENTRY_DSN` |
| GA4 | Create GA4 property → `NEXT_PUBLIC_GA_ID` |
| Resend | [resend.com](https://resend.com) API key → `RESEND_API_KEY` |

## Accuracy (honest)

- **94%** = internal benchmark, n=120, SME gold answers — not a production SLA
- Published on landing `/#accuracy` and `/docs#accuracy`
- Enterprise customers get dedicated eval reports

## YC-level still in progress

- [ ] Record 2-min product demo video → set `NEXT_PUBLIC_DEMO_VIDEO_URL`
- [ ] Mailchimp domain verified
- [ ] Turnstile production keys
- [ ] Real product at app.geck0.ai (separate codebase)
- [ ] OpenAPI spec public (currently "coming soon" on /docs/api)
