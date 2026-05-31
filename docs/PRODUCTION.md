# geck0 Landing — Production Checklist

## Required Vercel environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://geck0.ai` |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://app.geck0.ai` |
| `MAILCHIMP_*` (3 vars) | Yes | Waitlist API |
| `BLOB_READ_WRITE_TOKEN` or `SLACK_WEBHOOK_URL` | Yes | Contact form persistence |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` | Recommended | Analytics |
| `MAILCHIMP_DOUBLE_OPTIN` | Recommended | `true` for GDPR |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Recommended | Bot protection |
| `TURNSTILE_SECRET_KEY` | Recommended | Bot protection |
| `ADMIN_API_KEY` | Optional | Subscribe status endpoint |

## Pre-launch verification

- [ ] `npm run typecheck && npm run lint && npm run build`
- [ ] OG preview: https://www.opengraph.xyz/?url=https://geck0.ai
- [ ] Mobile: Hero, nav menu, forms, cookie banner
- [ ] EN/KO switch + tab title per page
- [ ] Subscribe returns 503 without Mailchimp (staging test)
- [ ] Contact returns 503 without Blob/Slack (staging test)
- [ ] Cookie decline blocks Plausible
- [ ] Mailchimp domain authenticated

## CI

GitHub Actions runs on push to `master`: typecheck, lint, build.
