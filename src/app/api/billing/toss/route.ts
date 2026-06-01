import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sitePricing } from "@/lib/pricing";
import {
  generateCustomerKey,
  generateOrderId,
  getSiteBaseUrl,
  getTossClientKey,
  isTossConfigured,
  orderAmountKrw,
  orderName,
  validateCheckoutInput,
} from "@/lib/toss";
import { saveTossPending } from "@/lib/toss-pending-store";

export async function GET() {
  return NextResponse.json({
    enabled: isTossConfigured(),
    trialDays: sitePricing.trialDays,
    plans: sitePricing.plans,
    currency: "KRW",
    provider: "toss",
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = await rateLimit(`toss-checkout:${ip}`, 15, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isTossConfigured()) {
    return NextResponse.json(
      {
        error: "Toss billing not available yet",
        reason: "toss_merchant_pending",
        fallback: true,
        waitlistUrl: "/#contact",
        detail:
          "Apply for a Toss Payments merchant account, then set TOSS_SECRET_KEY and NEXT_PUBLIC_TOSS_CLIENT_KEY on Vercel.",
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
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
    const customerKey = generateCustomerKey();
    const orderId = generateOrderId();
    const amount = orderAmountKrw(plan, seats);
    const baseUrl = getSiteBaseUrl();

    await saveTossPending(customerKey, {
      plan,
      seats,
      email,
      orderId,
      amount,
      createdAt: new Date().toISOString(),
    });

    const successUrl = `${baseUrl}/checkout/toss/success`;
    const failUrl = `${baseUrl}/checkout/cancel?plan=${plan}&provider=toss`;

    return NextResponse.json({
      clientKey: getTossClientKey(),
      customerKey,
      orderId,
      orderName: orderName(plan, seats),
      amount,
      successUrl,
      failUrl,
      trialDays: sitePricing.trialDays,
    });
  } catch (err) {
    console.error("[toss checkout]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Checkout prepare failed" }, { status: 500 });
  }
}
