import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sitePricing } from "@/lib/pricing";
import {
  getSiteBaseUrl,
  getStripe,
  getStripePriceId,
  isStripeCheckoutConfigured,
  validateCheckoutInput,
} from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = await rateLimit(`checkout:${ip}`, 20, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isStripeCheckoutConfigured()) {
    return NextResponse.json(
      {
        error: "Online billing is not available yet",
        reason: "billing_deferred",
        fallback: true,
        waitlistUrl: "/#contact",
        detail: "Korea-friendly payments coming later. Use the waitlist.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = validateCheckoutInput(body.plan, body.seats);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { plan, seats } = parsed;
    const priceId = getStripePriceId(plan);
    if (!priceId) {
      return NextResponse.json({ error: "Plan price not configured" }, { status: 503 });
    }

    const locale = body.locale === "en" ? "en" : "ko";
    const baseUrl = getSiteBaseUrl();
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: seats }],
      subscription_data: {
        trial_period_days: sitePricing.trialDays,
        metadata: {
          plan,
          seats: String(seats),
          source: "geck0-landing",
        },
      },
      metadata: {
        plan,
        seats: String(seats),
        locale,
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel?plan=${plan}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_creation: "always",
      locale: locale === "ko" ? "ko" : "en",
    });

    if (!session.url) {
      return NextResponse.json({ error: "Checkout session failed" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[checkout]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    enabled: isStripeCheckoutConfigured(),
    trialDays: sitePricing.trialDays,
    plans: sitePricing.plans,
  });
}
