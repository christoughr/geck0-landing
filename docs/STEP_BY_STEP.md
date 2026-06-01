# geck0 launch — step by step

Status: https://geck0.ai/status

---

## Step 1 — Turnstile ✅

- [x] Widget hostnames: geck0.ai, www, app
- [x] Vercel keys set
- [x] Preview `*.vercel.app` excluded (no Sentry 110200 spam)

---

## Step 2 — Mailchimp DKIM ✅

- [x] Authenticated in Mailchimp

---

## Step 3 — Resend / support ✅

- [x] Domain `geck0.ai` verified
- [x] `CONTACT_FROM_EMAIL` = `geck0 <hello@geck0.ai>`
- [x] Contact form delivers to inbox
- [ ] **Rotate Resend API key** (was exposed in chat) → [RESEND_KEY_ROTATION.md](./RESEND_KEY_ROTATION.md)

**Support:** https://geck0.ai/support

---

## Step 4 — Bot Fight Mode ✅

- [x] Enabled in Cloudflare

---

## Step 5 — Payments (Toss) ⏸

Waitlist only until Toss merchant approval.

Roadmap: [TOSS_SETUP.md](./TOSS_SETUP.md) · [PAYMENTS.md](./PAYMENTS.md)

---

## Step 6 — Verify ✅

```bash
npm run smoke
npm run test:e2e
```

---

## Step 7 — Optional

| Item | Status |
|------|--------|
| Demo video `NEXT_PUBLIC_DEMO_VIDEO_URL` | optional |
| GA4 `NEXT_PUBLIC_GA_ID` | optional |
| Sentry DSN | configured |
| Resend key rotation | **recommended** |

---

## Deploy rules

- Commit as `christoughr@gmail.com` (no Cursor co-author)
- Git blocked on Hobby → `npx vercel deploy --prod --yes`
- See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

---

## ADMIN_API_KEY

Vercel hides values after save (greyed out). Only needed for `curl /api/admin/contact-test` — **not required for normal site use.**
