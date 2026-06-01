# api.geck0.ai DNS setup

The app already handles `api.geck0.ai` in **middleware** (`/v1/*` → `/api/v1/*`) and **vercel.json** (root → docs).

## Steps

1. **Vercel** → geck0-landing → Settings → **Domains**
2. Add domain: `api.geck0.ai`
3. **DNS** (Cloudflare or registrar) — same as `geck0.ai`:
   - Type: `CNAME`
   - Name: `api`
   - Target: `cname.vercel-dns.com` (or value Vercel shows)
4. Wait for SSL (usually minutes).

## Test

```bash
curl -s https://api.geck0.ai/v1/health
# {"status":"operational","service":"geck0-product-api","version":"v1"}

# Fallback (always works if main domain is live):
curl -s https://geck0.ai/api/v1/health
```

## Q&A with API key

Create key in app → Settings → API, then:

```bash
curl -X POST https://api.geck0.ai/v1/qa \
  -H "Authorization: Bearer gk_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"Q1 customer churn?","locale":"en"}'
```
