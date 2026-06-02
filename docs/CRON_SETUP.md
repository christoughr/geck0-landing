# 6단계 — 자동 재동기화 (Cron)

매일 03:00 UTC에 Notion/Slack/Drive/Jira 연결된 워크스페이스를 재동기화합니다.

## Vercel env

| Name | Value |
|------|--------|
| `CRON_SECRET` | 아무 긴 랜덤 문자열 (예: `openssl rand -hex 32`) |

Redeploy

## 확인

Vercel → Project → **Cron Jobs** → `/api/cron/sync` 보이면 OK

수동 테스트 (로컬):

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://geck0.ai/api/cron/sync
```

`{"ok":true,...}` 반환

## Hobby 플랜

Vercel Hobby는 **하루 1회** cron만 가능 (현재 설정: `0 3 * * *`).
