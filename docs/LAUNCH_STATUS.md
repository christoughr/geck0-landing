# geck0 Launch Status

## ✅ Done (code + infra)

- Landing: Hero, accuracy section, demo page, docs, waitlist on all surfaces
- Mailchimp waitlist + double opt-in
- Vercel Blob contact storage
- Upstash KV rate limiting (all green on /status)
- Turnstile wired (production keys on Vercel — see TURNSTILE_SETUP.md)
- Resend contact email (`RESEND_API_KEY` + `CONTACT_FROM_EMAIL` on Vercel)
- Stripe Checkout API + webhook (`docs/STRIPE_SETUP.md`) — set price IDs on Vercel to enable billing
- Per-seat pricing UI + 1-day trial in code (`src/lib/pricing.ts`)
- Cloudflare Bot Fight script (`npm run cloudflare:bot-fight`) — needs API token
- Resend key rotation guide (`docs/RESEND_KEY_ROTATION.md`)
- app.geck0.ai app shell at `/app` (middleware rewrite)
- Sentry SDK ready (add DSN to enable)
- GA4 CSP ready (add `NEXT_PUBLIC_GA_ID` to enable)
- Plausible analytics + cookie consent
- `NEXT_PUBLIC_BETA_COUNT=47`

## 🔲 You do in browser (screenshots you sent)

### Turnstile — hostname Add 버튼 필요
See [TURNSTILE_SETUP.md](./TURNSTILE_SETUP.md)
1. Widget name: `geck0-landing` ✓
2. 각 hostname 입력 후 **「+ Add a hostname」** 클릭 (3개)
3. **Create** → Vercel에 실키 → redeploy

### Mailchimp — DKIM Proxy 수정
See [MAILCHIMP_SETUP.md](./MAILCHIMP_SETUP.md)
- Status: **Authentication in progress**
- Cloudflare에서 `k1._domainkey` **DNS only(회색)** 로 변경 + `k3._domainkey` 확인
- **Payment:** Stripe products + Vercel env — see [STRIPE_SETUP.md](./STRIPE_SETUP.md)

### app.geck0.ai
Domain is on another Vercel project. Either:
- Move `app.geck0.ai` to `geck0-landing` in Vercel Domains, OR
- Point DNS CNAME to geck0-landing deployment

Code at `/app` is ready (beta waitlist shell).

## Optional polish

| Item | Action |
|------|--------|
| Demo video | ★ 나중에 — `NEXT_PUBLIC_DEMO_VIDEO_URL` |
| Sentry | [Vercel에서 약관 수락](https://vercel.com/onlyus/~/integrations/accept-terms/sentry) → `vercel integration add sentry` |
| GA4 | GA4 속성 생성 후 `G-XXXXXXXX` 알려주면 Vercel에 추가 |
| Resend domain | resend.com → Domains → `geck0.ai` 인증 후 `hello@geck0.ai` 발신 |

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
