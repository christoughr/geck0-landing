# Stripe billing setup (per-seat + 1-day trial)

> **DEFERRED** — Not used for geck0.ai while Korea-friendly billing is pending.  
> See [PAYMENTS.md](./PAYMENTS.md). Do **not** add Stripe keys to Vercel for now.

---

Reference for when/if Stripe is enabled (non-KR or entity ready):

## 1. Create products & prices (Stripe Dashboard)

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Products**
2. Create **geck0 Starter** — recurring price **$99/seat/month** (or KRW if using single currency)
3. Create **geck0 Growth** — recurring price **$399/seat/month**
4. Copy each **Price ID** (`price_...`)

Match marketing caps in `src/lib/pricing.ts`:

| Plan | Max seats | Display (EN) | Display (KO) |
|------|-----------|----------------|--------------|
| Starter | 20 | $99/seat/mo | ₩99,000/seat/mo |
| Growth | 100 | $399/seat/mo | ₩390,000/seat/mo |

Trial length is enforced in code: **1 day** (`trial_period_days: 1`).

## 2. Webhook

1. Developers → **Webhooks** → Add endpoint  
   `https://geck0.ai/api/webhooks/stripe`
2. Events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
3. Copy **Signing secret** (`whsec_...`)

## 3. Vercel env vars

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
```

Redeploy after setting vars. Pricing buttons redirect to Stripe when `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set; otherwise they fall back to the waitlist.

## 4. Verify

```bash
curl https://geck0.ai/api/checkout
# { "enabled": true, "trialDays": 1, ... }

npm run smoke
```

Test checkout with [Stripe test cards](https://docs.stripe.com/testing).

## 5. Side effects

On successful checkout the webhook:

- Tags the customer in Mailchimp (`stripe-customer`, `plan-*`, `trial-active`)
- Stores subscription metadata in Vercel KV (if `KV_REST_API_*` is set)
- Posts to `SLACK_WEBHOOK_URL` if configured

Product app (`app.geck0.ai`) should read subscription state from your product DB or KV when ready.
