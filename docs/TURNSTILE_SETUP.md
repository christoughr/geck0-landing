# Cloudflare Turnstile 설정

## Hostname Management (필수)

각 hostname 입력 후 **「+ Add a hostname」** 클릭:

| Hostname | 용도 |
|----------|------|
| `geck0.ai` | 프로덕션 |
| `www.geck0.ai` | www 리다이렉트 전 |
| `app.geck0.ai` | 앱 셸 |

**`*.vercel.app` 프리뷰 URL은 추가하지 않아도 됩니다** — 코드에서 프리뷰에서는 Turnstile 위젯을 띄우지 않습니다.

## Sentry `TurnstileError 110200`

- **의미:** 현재 도메인이 위젯 허용 목록에 없음
- **흔한 원인:** Vercel 프리뷰 (`geck0-landing-xxxx.vercel.app`) 또는 HeadlessChrome 봇
- **조치:** geck0.ai에서만 Turnstile 사용 (이미 코드 반영). Sentry는 해당 오류 무시

## Vercel env

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

변경 후 `npx vercel deploy --prod --yes`
