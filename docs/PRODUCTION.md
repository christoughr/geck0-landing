# geck0 Landing — Production Checklist

## Environment variables (Vercel)

| Variable | Status | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SITE_URL` | ✅ Set | `https://geck0.ai` |
| `NEXT_PUBLIC_APP_URL` | ✅ Set | `https://app.geck0.ai` |
| `MAILCHIMP_*` (3 vars) | ✅ Set | Waitlist API |
| `MAILCHIMP_DOUBLE_OPTIN` | ✅ Set | GDPR double opt-in |
| `BLOB_READ_WRITE_TOKEN` | ✅ Set | Contact form → Vercel Blob |
| `KV_REST_API_*` | ✅ Set | Distributed rate limiting (Upstash KV) |
| `NEXT_PUBLIC_TURNSTILE_*` + `TURNSTILE_SECRET_KEY` | ✅ Set | Bot protection (replace dummy keys with Cloudflare production keys) |
| `ADMIN_API_KEY` | ✅ Set | Admin subscribe health ping |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` | ✅ Set | Analytics |
| `SLACK_WEBHOOK_URL` | ⬜ Optional | Slack contact notifications |
| `SENTRY_DSN` | ⬜ Optional | Error monitoring |
| `NEXT_PUBLIC_GA_ID` | ⬜ Optional | Google Analytics 4 |

## Waitlist source attribution

Each surface sends a distinct Mailchimp tag via `source`:

| Surface | Source tag | Component |
|---------|------------|-----------|
| Hero | `hero` | `Hero.tsx` |
| Footer CTA | `footer` | `CtaFooter.tsx` |
| Login | `login` | `LoginView.tsx` |
| Enterprise | `enterprise` | `enterprise/page.tsx` |
| Blog | `blog` | `BlogList.tsx` |

## Commands

```bash
npm run typecheck && npm run lint && npm run build
npm run smoke                    # production smoke tests
npm run check:mailchimp          # domain auth (needs local env)
curl -H "Authorization: Bearer $ADMIN_API_KEY" https://geck0.ai/api/subscribe
```

## Remaining manual steps

1. **Cloudflare Turnstile (real keys)** — Replace dummy keys with production site keys at [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile → Add `geck0.ai`
2. **Mailchimp domain auth** — Mailchimp → Account → Domains → add `geck0.ai` → configure SPF/DKIM DNS
3. **Slack webhook** (optional) — Create incoming webhook → `SLACK_WEBHOOK_URL` on Vercel
4. **Sentry** (optional) — Create project → `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN` on Vercel
5. **app.geck0.ai** — Deploy product app to this subdomain (redirect to landing removed)

## CI

GitHub Actions: typecheck, lint, build, production smoke tests on `master`.
