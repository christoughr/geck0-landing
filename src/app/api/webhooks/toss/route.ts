import { NextRequest, NextResponse } from "next/server";
import { tagMailchimpMember } from "@/lib/mailchimp";
import { verifyTossWebhookSignature } from "@/lib/toss";

export const runtime = "nodejs";

type TossWebhookEvent = {
  eventType?: string;
  data?: {
    orderId?: string;
    status?: string;
    customerKey?: string;
    totalAmount?: number;
  };
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
  const raw = await request.text();
  const signature =
    request.headers.get("toss-signature") ??
    request.headers.get("Toss-Signature") ??
    request.headers.get("x-toss-signature");

  if (!verifyTossWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: TossWebhookEvent;
  try {
    event = JSON.parse(raw) as TossWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.eventType ?? "unknown";
  const status = event.data?.status;
  const customerKey = event.data?.customerKey;

  console.info("[toss webhook]", eventType, status, customerKey);

  if (eventType.includes("PAYMENT") && status === "DONE") {
    await notifySlack(
      `Toss payment done: order=${event.data?.orderId} amount=${event.data?.totalAmount}`
    );
  }

  if (eventType.includes("BILLING") || eventType.includes("SUBSCRIPTION")) {
    await notifySlack(`Toss webhook: ${eventType} status=${status}`);
  }

  return NextResponse.json({ received: true });
}
