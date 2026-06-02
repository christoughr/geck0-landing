# 5단계 — Google Drive OAuth (+ Google 로그인)

## A. Google Cloud 프로젝트

1. **https://console.cloud.google.com/**
2. 프로젝트 선택 또는 **New Project** (`geck0`)
3. **APIs & Services** → **Library** → **Google Drive API** → **Enable**

## B. OAuth consent screen

**APIs & Services** → **OAuth consent screen**:

- User Type: **External** (테스트는 Test users에 이메일 추가)
- App name: `geck0`
- Support email: `hello@geck0.ai`
- Scopes: 나중에 클라이언트에서 추가

## C. OAuth Client ID

**Credentials** → **Create Credentials** → **OAuth client ID**:

- Type: **Web application**
- Name: `geck0 app`

**Authorized redirect URIs** (둘 다 추가):

```text
https://app.geck0.ai/api/app/oauth/google/callback
https://app.geck0.ai/api/app/auth/google/callback
```

Create → **Client ID** + **Client secret** 복사

## D. Vercel env

| Name | Value |
|------|--------|
| `GOOGLE_CLIENT_ID` | (Client ID) |
| `GOOGLE_CLIENT_SECRET` | (Client secret) |
| `NEXT_PUBLIC_APP_URL` | `https://app.geck0.ai` |

Redeploy

## E. geck0에서 연결

1. **연동** → **Connect Google Drive**
2. Google 계정 허용
3. **재동기화** → Drive 문서가 지식 베이스에 추가

**Google 로그인** (앱 게이트): 같은 Client ID/Secret 사용

## F. Test users (External + Testing 상태)

Consent screen이 **Testing**이면 **Test users**에  
`hello@geck0.ai`, `christoughr@gmail.com` 추가
