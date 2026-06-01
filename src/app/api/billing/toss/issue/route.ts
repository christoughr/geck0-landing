import { NextRequest, NextResponse } from "next/server";
import { addMailchimpSubscriber, tagMailchimpMember } from "@/lib/mailchimp";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sitePricing } from "@/lib/pricing";
import { isTossConfigured, tossApi } from "@/lib/toss";
import { getTossPending, saveTossBillingRecord } from "@/lib/toss-pending-store";

export const runtime = "nodejs";

type BillingIssueResponse = {
  billingKey: string;
  customerKey: string;
  cardCompany?: string;
  cardNumber?: string;
};

async function notifySlack(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  }).catch(() => undefined);
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = await rateLimit(`toss-issue:${ip}`, 10, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isTossConfigured()) {
    return NextResponse.json({ error: "Toss not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const authKey = typeof body.authKey === "string" ? body.authKey.trim() : "";
    const customerKey = typeof body.customerKey === "string" ? body.customerKey.trim() : "";

    if (!authKey || !customerKey) {
      return NextResponse.json({ error: "Missing authKey or customerKey" }, { status: 400 });
    }

    const pending = await getTossPending(customerKey);
    if (!pending) {
      return NextResponse.json({ error: "Checkout session expired" }, { status: 400 });
    }

    const billing = await tossApi<BillingIssueResponse>("/v1/billing/authorizations/issue", {
      method: "POST",
      json: { authKey, customerKey },
    });

    const trialEnd = new Date(
      Date.now() + sitePricing.trialDays * 24 * 60 * 60 * 1000
    ).toISOString();

    await saveTossBillingRecord({
      customerKey,
      billingKey: billing.billingKey,
      plan: pending.plan,
      seats: pending.seats,
      email: pending.email,
      status: "trialing",
      trialEnd,
    });

    if (pending.email) {
      await addMailchimpSubscriber(pending.email, "pricing", [`plan-${pending.plan}`]).catch(
        (err) => console.error("[toss issue] mailchimp subscribe", err)
      );
      await tagMailchimpMember(pending.email, [
        "toss-customer",
        `plan-${pending.plan}`,
        `seats-${pending.seats}`,
        "trial-active",
      ]).catch((err) => console.error("[toss issue] mailchimp tags", err));
    }

    await notifySlack(
      `Toss billing key issued: ${pending.email ?? customerKey} · plan=${pending.plan} · seats=${pending.seats}`
    );

    return NextResponse.json({
      ok: true,
      customerKey,
      plan: pending.plan,
      seats: pending.seats,
      trialDays: sitePricing.trialDays,
      trialEnd,
    });
  } catch (err) {
    console.error("[toss issue]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Billing issue failed" },
      { status: 500 }
    );
  }
}
