/** Client-safe Stripe availability (publishable key only). */
export function isStripeCheckoutEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim());
}
