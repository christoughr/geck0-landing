# Vercel environment variables (copy-paste checklist)

Vercel → **geck0-landing** → Settings → Environment Variables → **Production**

## Required (app product)

| Variable | Example / notes |
|----------|-----------------|
| `APP_SESSION_SECRET` | 32+ char random string |
| `BETA_ALLOWED_EMAILS` | `christoughr@gmail.com,hello@geck0.ai` |
| `KV_REST_API_URL` | From Upstash dashboard |
| `KV_REST_API_TOKEN` | From Upstash dashboard |

## Strongly recommended

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | AI answers + vector embeddings (`text-embedding-3-small`) |
| `CRON_SECRET` | Random string; Vercel Cron sends `Authorization: Bearer <value>` |

## OAuth (optional — UI works without; connect buttons need these)

| Variable | Where to get |
|----------|----------------|
| `SLACK_CLIENT_ID` | Slack app → OAuth & Permissions |
| `SLACK_CLIENT_SECRET` | Same app |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → OAuth client (Web) |
| `GOOGLE_CLIENT_SECRET` | Same client |

**Google OAuth redirect URIs (add both):**

- `https://app.geck0.ai/api/app/oauth/google/callback` (Drive)
- `https://app.geck0.ai/api/app/auth/google/callback` (Sign-in)

**Slack redirect URI:**

- `https://app.geck0.ai/api/app/oauth/slack/callback`

## Optional

| Variable | Purpose |
|----------|---------|
| `NOTION_INTERNAL_TOKEN` | Auto-save token on first workspace init (sync via cron/manual) |
| `OPENAI_MODEL` | Default `gpt-4o-mini` |
| `OPENAI_EMBED_MODEL` | Default `text-embedding-3-small` |
| `NEXT_PUBLIC_APP_URL` | `https://app.geck0.ai` (OAuth callbacks) |

## After changing env

```bash
npx vercel deploy --prod --yes
```

Or redeploy from Vercel dashboard.

## Verify

```bash
npm run test:all hello@geck0.ai
```
