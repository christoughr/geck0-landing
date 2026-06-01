# app.geck0.ai — Beta product

Product MVP lives in this repo under `/app/*`. **Toss Payments** comes after beta stabilizes (`docs/TOSS_SETUP.md`).

## Routes

| Path | Purpose |
|------|---------|
| `/app` | Beta gate — email sign-in + waitlist |
| `/app/dashboard` | Workspace overview (protected) |
| `/app/qa` | Q&A (demo knowledge + optional OpenAI) |
| `/app/graph` | Knowledge graph preview |
| `/app/insights` | Insight Pulse preview |
| `/app/settings/integrations` | Connector stubs |

## Vercel env (Production)

| Variable | Required | Notes |
|----------|----------|-------|
| `APP_SESSION_SECRET` | Yes | Random 32+ char secret for session cookies |
| `BETA_ALLOWED_EMAILS` | One of | Comma-separated invite list |
| `BETA_ALLOWED_DOMAIN` | optional | e.g. `yourcompany.com` — all `@domain` emails allowed |
| `APP_BETA_OPEN` | optional | `true` = any valid email can sign in (dev only) |
| `OPENAI_API_KEY` | optional | Better Q&A answers; falls back to demo knowledge |

`APP_SESSION_SECRET` can fall back to `ADMIN_API_KEY` if unset (not recommended long-term).

## Sign-in flow (use https://app.geck0.ai)

1. Open **https://app.geck0.ai** (recommended) or https://geck0.ai/app  
2. In the **purple-bordered box** (Step 1), enter your invite email → **베타 앱 입장**  
3. You should land on `/app/dashboard` — tap **Q&A** in the top menu (mobile: tabs under the header)  
4. The waitlist form below “Step 2” is **not** login — do not use it to enter the app  

Session cookie uses `Domain=.geck0.ai` so login works on both `geck0.ai` and `app.geck0.ai`.

## Step 2 — Add beta invites (Vercel)

1. Vercel → **geck0-landing** → Settings → Environment Variables  
2. Edit **`BETA_ALLOWED_EMAILS`** (Production): comma-separated, no spaces required  
   - Example: `you@company.com,teammate@company.com,hello@geck0.ai`  
3. **Redeploy** (or `npx vercel deploy --prod --yes`) — env changes need a new deployment  

**Company-wide:** set `BETA_ALLOWED_DOMAIN=yourcompany.com` (every `@yourcompany.com` email).

**Automated check:** `node scripts/test-app-beta.mjs https://app.geck0.ai your@email.com`

### Production allowlist (current)

- `christoughr@gmail.com`
- `hello@geck0.ai`

## Local test

```bash
# .env.local
APP_SESSION_SECRET=dev-secret-change-me
APP_BETA_OPEN=true
```

```bash
npm run dev
# open http://localhost:3000/app
```

## Deploy

Commits must use **christoughr@gmail.com** (no Cursor co-author) for Vercel Git deploy on Hobby, or:

```bash
npx vercel deploy --prod --yes
```
