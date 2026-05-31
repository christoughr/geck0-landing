# Mailchimp 설정 가이드

## 스크린샷 기준 — 아직 안 한 것

| 항목 | 현재 | 해야 할 것 |
|------|------|-----------|
| Email domain | `gmail.com`만 있음 | **Add & Verify Domain** → `geck0.ai` |
| Website domain | 없음 | (선택) 랜딩은 geck0.ai/Vercel — Mailchimp website 불필요 |
| 결제 | "13 days left" 배너 | 아래 참고 |

## 돈 내야 해?

**지금 당장 필수는 아닙니다.** Mailchimp 무료 플랜:
- 연락처 ~500명
- 월 ~1,000통 발송

배너는 **체험/Grace 기간 13일 후**에도 계속 쓰려면 **결제 수단 등록**이 필요하다는 뜻입니다. 웨이트리스트 규모가 작으면 무료로 충분합니다.

## geck0.ai 도메인 인증 (무료, 필수 권장)

1. Mailchimp → **Account → Settings → Domains**
2. **Add & Verify Domain** 클릭
3. `geck0.ai` 입력
4. Mailchimp가 알려주는 **SPF / DKIM DNS 레코드**를 도메인 등록업체(Vercel DNS, Cloudflare 등)에 추가
5. Mailchimp에서 **Verify** 클릭

확인:
```bash
npm run check:mailchimp
```

## 발신 주소

인증 후 `hello@geck0.ai` 또는 `noreply@geck0.ai`로 발송하면 스팸함 확률이 크게 줄어듭니다.

## gmail.com?

공개 도메인(gmail.com)은 Mailchimp에서 "인증 불필요"로 표시되지만, **브랜드 발신에는 geck0.ai 인증이 필요**합니다.
