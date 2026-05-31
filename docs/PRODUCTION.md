# geck0 Landing — Production Checklist

## Required Vercel environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://geck0.ai` |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://app.geck0.ai` |
| `MAILCHIMP_*` (3 vars) | Yes | Waitlist API |
| `MAILCHIMP_DOUBLE_OPTIN` | Yes | `true` for GDPR |
| `BLOB_READ_WRITE_TOKEN` or `SLACK_WEBHOOK_URL` | Yes | Contact form persistence |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` | Recommended | Analytics |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Recommended | Bot protection (set both) |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Recommended | Distributed rate limits |
| `ADMIN_API_KEY` | Recommended | Subscribe admin health ping |

## Vercel Blob (contact storage)

```bash
vercel blob create-store geck0-landing-contacts --access private --yes \
  --environment production --environment preview
```

This auto-adds `BLOB_READ_WRITE_TOKEN` to the project.

## Upstash Redis (rate limiting)

1. Vercel Dashboard → Integrations → Upstash → Add to `geck0-landing`
2. Create Redis database (free tier OK)
3. Connect to Production + Preview
4. Redeploy — env vars `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are injected

## Cloudflare Turnstile

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → Turnstile → Add site
2. Domain: `geck0.ai`
3. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to Vercel
4. Redeploy

## Pre-launch verification

```bash
npm run typecheck && npm run lint && npm run build
npm run smoke                    # against https://geck0.ai
curl -H "Authorization: Bearer $ADMIN_API_KEY" https://geck0.ai/api/subscribe
```

Manual checks:
- [ ] OG preview: https://www.opengraph.xyz/?url=https://geck0.ai
- [ ] Mobile: Hero, nav menu, forms, cookie banner
- [ ] EN/KO switch + tab title per page
- [ ] Subscribe + contact forms end-to-end
- [ ] Cookie decline blocks Plausible
- [ ] Mailchimp domain authenticated (SPF/DKIM)
- [ ] `/status` shows all services green

## CI

GitHub Actions on push to `master`: typecheck, lint, build.

## Smoke tests

```bash
npm run smoke          # production
npm run smoke:local    # localhost:3000
```
