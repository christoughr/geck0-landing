# Cloudflare Turnstile 설정 (5분)

> 스크린샷 기준 — hostname은 **입력만** 되어 있고 **Add 안 됨** → 빨간 **「At least 1 hostname must be added」** 표시

## 1. Widget name
```
geck0-landing
```

## 2. Hostname Management
각 hostname 입력 후 **「+ Add a hostname」** 클릭 (목록에 들어가야 함):
- `geck0.ai`
- `www.geck0.ai`
- `app.geck0.ai`

빨간 에러가 사라질 때까지 반복.

## 3. Widget Mode
**Managed (Recommended)** 선택 유지

## 4. Create → 키 복사
생성 후:
- **Site Key** → Vercel `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- **Secret Key** → Vercel `TURNSTILE_SECRET_KEY`

```bash
# Vercel CLI 예시 (값은 Cloudflare에서 복사)
vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY production --value "YOUR_SITE_KEY" --yes --force
vercel env add TURNSTILE_SECRET_KEY production --value "YOUR_SECRET_KEY" --yes --force
vercel deploy --prod
```

## 현재 상태
지금 Vercel에는 **Cloudflare 테스트 더미키**가 들어있습니다. 위 단계로 **실키**로 교체해야 실제 봇 차단이 됩니다.
