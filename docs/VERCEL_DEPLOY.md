# Vercel deploy (Hobby + GitHub)

## Git deploy blocked?

If redeploy shows:

> *GitHub could not associate the committer with a GitHub user. Hobby teams do not support collaboration.*

**Cause:** Commits authored by `geck0-bot` or with `Co-authored-by: Cursor <cursoragent@cursor.com>`.

**Fix (pick one):**

1. **CLI deploy (fastest)** — does not use Git author check:
   ```bash
   npx vercel deploy --prod --yes
   ```
2. **Commit as your GitHub user** — email must match GitHub (`christoughr@gmail.com`):
   ```bash
   git config user.email "christoughr@gmail.com"
   git config user.name "Your Name"
   git commit -m "your message"
   git push origin master
   ```
3. **Upgrade Vercel to Pro** — if you need multiple committers on one Hobby team.

## Required production env (contact form)

| Variable | Example |
|----------|---------|
| `RESEND_API_KEY` | `re_...` from Resend → API Keys |
| `CONTACT_FROM_EMAIL` | `geck0 <hello@geck0.ai>` |
| `CONTACT_INBOX_EMAIL` | `hello@geck0.ai` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (optional backup) |

**Do not leave `CONTACT_FROM_EMAIL` empty** — Resend will never send and you will not see `[contact-store:email]` success logs.

After changing env vars → **Redeploy** (env applies on next deployment).

## Test Resend on production

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_API_KEY" \
  https://geck0.ai/api/admin/contact-test
```

Expect `{ "ok": true }` and a row in Resend → Emails.
