import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { addMailchimpSubscriber, tagMailchimpMember } from "@/lib/mailchimp";
import { saveSubscriptionRecord } from "@/lib/subscription-store";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

async function notifySlack(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  }).catch(() => undefined);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const email =
    session.customer_details?.email ??
    (typeof session.customer_email === "string" ? session.customer_email : null);

  const plan = session.metadata?.plan ?? "unknown";
  const seats = session.metadata?.seats ?? "1";

  if (email) {
    await addMailchimpSubscriber(email, "pricing", [`plan-${plan}`]).catch((err) =>
      console.error("[stripe webhook] mailchimp subscribe", err)
    );
    await tagMailchimpMember(email, [
      "stripe-customer",
      `plan-${plan}`,
      `seats-${seats}`,
      "trial-active",
    ]).catch((err) => console.error("[stripe webhook] mailchimp tags", err));
  }

  await notifySlack(
    `Stripe checkout completed: ${email ?? "unknown"} · plan=${plan} · seats=${seats}`
  );
}

async function handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
  const plan = subscription.metadata?.plan ?? "unknown";
  const seats =
    subscription.items.data[0]?.quantity ??
    Number.parseInt(subscription.metadata?.seats ?? "1", 10);

  await saveSubscriptionRecord({
    customerId: String(subscription.customer),
    subscriptionId: subscription.id,
    plan,
    seats,
    status: subscription.status,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
    updatedAt: new Date().toISOString(),
  });

  if (subscription.status === "active" && subscription.trial_end) {
    const trialEnd = subscription.trial_end * 1000;
    if (Date.now() >= trialEnd) {
      await notifySlack(`Trial converted to paid: sub=${subscription.id} plan=${plan}`);
    }
  }

  if (subscription.status === "canceled") {
    await notifySlack(`Subscription canceled: sub=${subscription.id}`);
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_failed":
        await notifySlack(`Stripe payment failed: invoice=${(event.data.object as Stripe.Invoice).id}`);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe webhook]", event.type, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
