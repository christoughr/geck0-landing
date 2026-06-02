# 4단계 — Slack OAuth 연동

앱 → **연동** → **Slack OAuth 연결** 버튼이 동작하려면 Slack 앱 + Vercel env가 필요합니다.

## A. Slack 앱 만들기

1. **https://api.slack.com/apps** → **Create New App** → **From scratch**
2. App Name: `geck0` (아무 이름)
3. Workspace: 본인 Slack 워크스페이스 선택

## B. Redirect URL

**OAuth & Permissions** → **Redirect URLs** → Add:

```text
https://app.geck0.ai/api/app/oauth/slack/callback
```

**Save URLs**

## C. Bot Token Scopes

같은 페이지 **Scopes** → **Bot Token Scopes** → Add:

| Scope | 용도 |
|-------|------|
| `channels:read` | 공개 채널 목록 |
| `channels:history` | 공개 채널 메시지 |
| `groups:history` | 비공개 채널 (봇 초대된 경우) |
| `users:read` | 사용자 정보 |

## D. Client ID / Secret

**Basic Information** → **App Credentials**:

- **Client ID** → 복사
- **Client Secret** → Show → 복사

## E. Vercel env

Vercel → geck0-landing → **Environment Variables** → **Production**:

| Name | Value |
|------|--------|
| `SLACK_CLIENT_ID` | (위 Client ID) |
| `SLACK_CLIENT_SECRET` | (위 Client Secret) |
| `NEXT_PUBLIC_APP_URL` | `https://app.geck0.ai` |

**Redeploy** (Deployments → 최신 → Redeploy)

## F. 워크스페이스에 앱 설치

Slack 앱 페이지 → **Install App** → **Install to Workspace** → Allow

## G. geck0에서 연결

1. **https://app.geck0.ai/app/settings/integrations**
2. **Slack OAuth 연결** 클릭
3. Slack Allow → 돌아오면 채널 동기화됨
4. **Q&A**에서 Slack에서 가져온 내용 질문

## 문제 해결

| 증상 | 해결 |
|------|------|
| `slack_not_configured` | Vercel env + redeploy |
| `invalid_state` | `APP_SESSION_SECRET` 확인 |
| 채널 0개 | Slack에서 봇을 채널에 `/invite @geck0` |
| 비공개 채널 | 앱을 채널에 초대 후 재동기화 |

## 수동 import (OAuth 없이)

연동 페이지 하단 **Slack export JSON** 붙여넣기도 가능합니다.
