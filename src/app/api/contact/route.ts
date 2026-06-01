import { NextRequest, NextResponse } from "next/server";
import { saveContact } from "@/lib/contact-store";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isHoneypotTriggered, verifyTurnstile } from "@/lib/api-utils";
import { isTurnstileSkippedHost } from "@/lib/turnstile-host";

const MAX_BODY = 8000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = await rateLimit(`contact:${ip}`, 5, 60_000);
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
      return NextResponse.json({ message: "Received", persisted: true, emailSent: true });
    }

    const host = request.headers.get("host");
    const turnstileOk =
      isTurnstileSkippedHost(host) || (await verifyTurnstile(body.turnstileToken));
    if (!turnstileOk) {
      return NextResponse.json({ error: "Verification failed" }, { status: 403 });
    }

    const { name, email, message, company } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    if (message.trim().length > 5000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const entry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      company: typeof company === "string" ? company.trim() : undefined,
      at: new Date().toISOString(),
    };

    const { persisted, emailSent, channels } = await saveContact(entry);

    if (!persisted) {
      return NextResponse.json(
        {
          error: "Unable to save your message. Please email hello@geck0.ai directly.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      message: "Received",
      persisted: true,
      emailSent,
      channels,
    });
  } catch (err) {
    console.error("[contact:route]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
