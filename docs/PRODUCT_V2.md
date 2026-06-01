# geck0 Product v2

## Implemented

| Area | Details |
|------|---------|
| Workspace + KV | Per email/domain workspace, documents, chunks, embeddings |
| Q&A | Keyword + vector hybrid RAG, OpenAI synthesis optional |
| Connectors | Notion token, Slack OAuth + export, Google Drive OAuth, Jira API token |
| Team | Invite members → login without global beta list |
| API | `gk_` keys, `POST /api/v1/qa`, `GET /api/v1/knowledge` |
| Auth | Email beta, Google SSO, workspace invites |
| Cron | `/api/cron/sync` daily 03:00 UTC (set `CRON_SECRET`) |
| UI | Dashboard, Graph, Insights, Integrations, Team, API keys |

## Vercel env

```
APP_SESSION_SECRET=
BETA_ALLOWED_EMAILS=
KV_REST_API_URL=
KV_REST_API_TOKEN=
OPENAI_API_KEY=              # RAG + embeddings
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CRON_SECRET=
NOTION_INTERNAL_TOKEN=       # optional server default
```

## URLs

- App: https://app.geck0.ai/app
- API: https://api.geck0.ai/v1/health (or https://geck0.ai/api/v1/health)

## Test

```bash
npm run test:all hello@geck0.ai
```
