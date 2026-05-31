import { NextRequest, NextResponse } from "next/server";
import { addMailchimpSubscriber, isMailchimpConfigured } from "@/lib/mailchimp";

const fallbackSubscribers = new Map<string, { source?: string; at: string }>();

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (isMailchimpConfigured()) {
      await addMailchimpSubscriber(trimmed, typeof source === "string" ? source : "waitlist");
    } else {
      if (fallbackSubscribers.has(trimmed)) {
        return NextResponse.json({ message: "Already subscribed", email: trimmed });
      }
      fallbackSubscribers.set(trimmed, {
        source: typeof source === "string" ? source : "waitlist",
        at: new Date().toISOString(),
      });
      console.log(`[subscribe:fallback] ${trimmed} source=${source ?? "waitlist"}`);
    }

    return NextResponse.json({
      message: "Subscribed successfully",
      email: trimmed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[subscribe]", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    configured: isMailchimpConfigured(),
    fallbackCount: fallbackSubscribers.size,
  });
}
