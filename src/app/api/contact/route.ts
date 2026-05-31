import { NextRequest, NextResponse } from "next/server";

const inquiries: Array<{ name: string; email: string; message: string; at: string }> = [];

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const entry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      at: new Date().toISOString(),
    };

    inquiries.push(entry);
    console.log("[contact]", JSON.stringify(entry));

    // Production: forward to Slack webhook, Resend, or CRM via env
    const webhook = process.env.SLACK_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `📩 New contact from geck0.ai\n*${entry.name}* (${entry.email})\n${entry.message}`,
        }),
      });
    }

    return NextResponse.json({ message: "Received", id: inquiries.length });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
