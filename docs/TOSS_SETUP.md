# Toss Payments — step-by-step (planned)

**Status:** Not implemented. Waitlist-only until Toss merchant is approved.

## Why Toss first

- Korean entity, KRW, domestic cards / 계좌이체
- B2B 정기결제(빌링) 지원
- Paddle은 **나중에** 해외 팀용으로 분리 검토

## Phase 0 — 지금 (완료 전)

- [x] 웨이트리스트 + per-seat 가격 표시
- [ ] 이 문서 따라 토스 가맹점 신청

## Phase 1 — 가맹점 & 키

1. [토스페이먼츠](https://www.tosspayments.com/) 가맹점 신청 (사업자등록 필요)
2. 테스트 → 라이브 **Client Key / Secret Key** 발급
3. Vercel env (나중에 추가):
   ```
   TOSS_CLIENT_KEY=
   TOSS_SECRET_KEY=
   TOSS_WEBHOOK_SECRET=
   ```

## Phase 2 — 제품 설계 (geck0)

| 항목 | 결정 |
|------|------|
| 모델 | 좌석당 월 구독 (Starter / Growth) |
| 체험 | 1일 (빌링키 등록 후 1일 뒤 첫 결제 또는 trial 플래그) |
| Enterprise | 영업 문의 (토스 X) |

## Phase 3 — 구현 (코드, 추후 PR)

1. `POST /api/billing/toss/checkout` — 결제창 URL 또는 billing auth
2. `POST /api/webhooks/toss` — 결제 성공/실패/구독 갱신
3. Pricing CTA → 토스 (Stripe UI 제거 유지)
4. Mailchimp 태그 `toss-customer`, `plan-*`

## Phase 4 — 검증

- 테스트 카드로 1일 체험 → 취소 플로우
- `/status` + smoke + 수동 환불 테스트

---

Until Phase 3 ships, all CTAs stay on **waitlist** (`docs/PAYMENTS.md`).
