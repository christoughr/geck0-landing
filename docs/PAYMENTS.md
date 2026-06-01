# Payments — Korea-first (Toss, later Paddle for intl)

**Status:** Card checkout **skipped**. Waitlist + manual onboarding only.

## Stripe

Not used — limited Korea merchant support for KRW subscriptions.

## Toss vs Paddle (recommendation)

| | **토스페이먼츠** | **Paddle** |
|---|----------------|------------|
| **Best for** | Korean companies, KRW, domestic cards/계좌 | Global SaaS, USD/EUR, tax as MoR |
| **International** | Primarily Korea-focused | Yes — 200+ countries |
| **Subscriptions** | Billing keys, 정기결제 | Built-in subscriptions |
| **B2B invoices** | 세금계산서 / 국내 정산에 유리 | 해외 B2B에 유리 |

### Recommended path for geck0

1. **Now (beta):** Waitlist only — no payment UI.
2. **Launch KR billing:** **Toss Payments** — per-seat KRW, 1-day trial via billing key or subscription API.
3. **Later (optional):** **Paddle** (or Lemon Squeezy) on a separate `/en/pricing` flow or `?currency=usd` for non-KR teams — only when you have meaningful overseas demand.

**Do not run Stripe + Toss + Paddle at once on day one.** Start with **Toss only** for Korea; add Paddle when >10% of pipeline is non-KR.

## Implementation note (future)

- Keep `/api/checkout` stub; add `/api/billing/toss` when ready.
- Webhook: subscription status → Mailchimp tags + app access (same pattern as Stripe webhook today).

See [STEP_BY_STEP.md](./STEP_BY_STEP.md) — Step 5 remains skipped until Toss merchant account is ready.

Reference (deferred): [STRIPE_SETUP.md](./STRIPE_SETUP.md)
