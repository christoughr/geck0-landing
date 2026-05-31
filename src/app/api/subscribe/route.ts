import { NextRequest, NextResponse } from "next/server";
import { addMailchimpSubscriber, isMailchimpConfigured, pingMailchimp } from "@/lib/mailchimp";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isHoneypotTriggered, sanitizeSource, verifyTurnstile } from "@/lib/api-utils";

const MAX_BODY = 4096;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = await rateLimit(`subscribe:${ip}`, 10, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await request.json();

    if (isHoneypotTriggered(body)) {
      return NextResponse.json({ message: "Subscribed successfully" });
    }

    const turnstileOk = await verifyTurnstile(body.turnstileToken);
    if (!turnstileOk) {
      return NextResponse.json({ error: "Verification failed" }, { status: 403 });
    }

    const { email } = body;
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!isMailchimpConfigured()) {
      console.error("[subscribe] Mailchimp not configured — cannot accept subscription");
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    const source = sanitizeSource(body.source);
    await addMailchimpSubscriber(trimmed, source);

    return NextResponse.json({
      message: "Subscribed successfully",
      email: trimmed,
      persisted: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[subscribe]", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${adminKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mailchimp = await pingMailchimp();

  return NextResponse.json({
    ok: mailchimp.ok,
    mailchimp,
    doubleOptIn: process.env.MAILCHIMP_DOUBLE_OPTIN === "true",
    timestamp: new Date().toISOString(),
  });
}
