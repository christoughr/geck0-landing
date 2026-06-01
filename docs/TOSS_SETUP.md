# Toss Payments — step-by-step (planned)

**Status:** Code scaffold live. **Waitlist default** until Toss keys are on Vercel.

## Why Toss first

- Korean entity, KRW, domestic cards / 계좌이체
- B2B 정기결제(빌링) 지원
- Paddle은 **나중에** 해외 팀용으로 분리 검토

## Phase 0 — 지금

- [x] 웨이트리스트 + per-seat 가격 표시
- [x] app.geck0.ai 베타 제품 MVP
- [ ] **당신이 할 일:** 토스페이먼츠 가맹점 신청 (사업자등록)

## Phase 1 — 가맹점 & 키

1. [토스페이먼츠](https://www.tosspayments.com/) 가맹점 신청 (사업자등록 필요)
2. 테스트 → 라이브 **Client Key / Secret Key** 발급
3. Vercel env (Production):
   ```
   NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...   # or live_ck_
   TOSS_SECRET_KEY=test_sk_...
   TOSS_WEBHOOK_SECRET=                       # optional until webhooks configured
   ```

## Phase 2 — 제품 설계 (geck0)

| 항목 | 결정 |
|------|------|
| 모델 | 좌석당 월 구독 (Starter / Growth) |
| 체험 | 1일 (빌링키 등록 후 1일 뒤 첫 결제 또는 trial 플래그) |
| Enterprise | 영업 문의 (토스 X) |

## Phase 3 — 구현 (코드 ✅ in repo)

| Item | Route / path |
|------|----------------|
| Checkout prepare | `POST /api/billing/toss` |
| Billing key issue | `POST /api/billing/toss/issue` |
| Webhook | `POST /api/webhooks/toss` |
| Checkout UI | `/checkout/toss` → success `/checkout/toss/success` |
| Pricing CTA | Toss when keys set, else waitlist |

Mailchimp tags: `toss-customer`, `plan-*`, `trial-active`

**Still TODO:** cron/Vercel Cron to charge billing key after trial (`POST /v1/billing/{billingKey}`).

## Phase 4 — 검증

- 테스트 카드로 1일 체험 → 취소 플로우
- `/status` + smoke + 수동 환불 테스트

---

Until Phase 3 ships, all CTAs stay on **waitlist** (`docs/PAYMENTS.md`).
