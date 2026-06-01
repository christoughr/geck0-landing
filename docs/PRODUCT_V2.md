# geck0 Product v2 (in this repo)

## What is real now

| Feature | Implementation |
|---------|----------------|
| Workspace per email/domain | `src/lib/workspace.ts` + KV |
| Knowledge index | Documents + chunks in Upstash KV |
| Q&A | Keyword RAG + optional OpenAI (`OPENAI_API_KEY`) |
| Q&A history | KV, last 40 questions |
| Knowledge Graph | Built from docs (teams, tags) |
| Insights | Rule-based on indexed content |
| Notion | Integration token → sync pages API |
| Manual upload | POST `/api/app/knowledge` |
| Dashboard stats | Live from KV |

## Env (Vercel)

```
APP_SESSION_SECRET=...
BETA_ALLOWED_EMAILS=hello@geck0.ai
KV_REST_API_URL=...          # required for knowledge
KV_REST_API_TOKEN=...
OPENAI_API_KEY=...           # optional, better answers
NOTION_INTERNAL_TOKEN=...    # optional, auto-sync on first login
```

## Still not enterprise-complete

- Slack / Drive OAuth (upload + Notion only)
- Vector embeddings (keyword search today)
- Team RBAC, SSO, billing automation
- Full api.geck0.ai public API

## Test

```bash
npm run test:all hello@geck0.ai
```
