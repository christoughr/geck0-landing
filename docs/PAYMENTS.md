# Payments — deferred (Korea)

**Status:** Online card checkout is **skipped** for now.

## Why

- **Stripe** has limited Korea merchant support for domestic KRW/subscriptions.
- geck0 targets Korean B2B teams first → waitlist + manual onboarding until a local-friendly provider ships.

## What works today

| Flow | Status |
|------|--------|
| Waitlist (`/#contact`, pricing CTAs) | ✅ Mailchimp + Turnstile |
| Plan tag (`?plan=starter` / `growth`) | ✅ Mailchimp tags `plan-*` |
| Per-seat **display** pricing | ✅ `src/lib/pricing.ts` |
| Card checkout | ❌ Not offered on site |

## Future options (pick one later)

1. **토스페이먼츠** — KRW, domestic cards, subscriptions
2. **Paddle / Lemon Squeezy** — merchant of record, global + less KR friction
3. **Stripe** — only if/when KR entity + KRW prices are viable

## Code note

`/api/checkout` and `/api/webhooks/stripe` remain in the repo for a future enable flag but are **not linked from the UI**. Do not set Stripe env vars on Vercel until a provider is chosen.

See also: [STRIPE_SETUP.md](./STRIPE_SETUP.md) (reference only, deferred).
