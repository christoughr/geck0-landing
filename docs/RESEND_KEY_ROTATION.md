# Resend API key rotation

If an API key was exposed (chat, screenshot, commit), rotate it immediately.

## Steps

1. [Resend Dashboard](https://resend.com/api-keys) → **API Keys**
2. **Create API Key** — name e.g. `geck0-landing-prod-2026-05`
3. Copy the new key (shown once)
4. **Vercel** → Project `geck0-landing` → Settings → Environment Variables  
   Update `RESEND_API_KEY` for **Production** (and Preview if used)
5. Redeploy production (`vercel deploy --prod` or push to main)
6. Verify:
   ```bash
   curl https://geck0.ai/api/health | jq .checks.resend
   npm run smoke
   ```
7. Delete the old key in Resend

## Domain

Sending uses `CONTACT_FROM_EMAIL` (`hello@geck0.ai`). Ensure **geck0.ai** is verified under Resend → Domains (SPF/DKIM green).

## No code changes required

Contact form uses `RESEND_API_KEY` from env only (`src/lib/contact-store.ts`).
