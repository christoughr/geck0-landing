import Stripe from "stripe";
import { sitePricing } from "@/lib/pricing";

export type BillingPlan = keyof typeof sitePricing.plans;

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.STRIPE_WEBHOOK_SECRET?.trim() &&
      process.env.STRIPE_PRICE_STARTER?.trim() &&
      process.env.STRIPE_PRICE_GROWTH?.trim()
  );
}

export function isStripeCheckoutConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.STRIPE_PRICE_STARTER?.trim() &&
      process.env.STRIPE_PRICE_GROWTH?.trim()
  );
}

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

export function getStripePriceId(plan: BillingPlan): string | null {
  const id =
    plan === "starter"
      ? process.env.STRIPE_PRICE_STARTER
      : process.env.STRIPE_PRICE_GROWTH;
  return id?.trim() || null;
}

export function validateCheckoutInput(
  plan: unknown,
  seats: unknown
): { plan: BillingPlan; seats: number } | { error: string } {
  if (plan !== "starter" && plan !== "growth") {
    return { error: "Invalid plan" };
  }

  const seatCount =
    typeof seats === "number"
      ? seats
      : typeof seats === "string"
        ? Number.parseInt(seats, 10)
        : NaN;

  if (!Number.isFinite(seatCount) || seatCount < 1) {
    return { error: "Seats must be at least 1" };
  }

  const maxSeats = sitePricing.plans[plan].maxSeats;
  if (seatCount > maxSeats) {
    return { error: `Maximum ${maxSeats} seats for ${plan}` };
  }

  return { plan, seats: seatCount };
}

export function getSiteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://geck0.ai").replace(/\/$/, "");
}
