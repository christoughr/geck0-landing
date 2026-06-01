import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  isAppAuthConfigured,
  isBetaEmailAllowed,
  sessionCookieOptions,
} from "@/lib/app-auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = await rateLimit(`app-auth:${ip}`, 10, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isAppAuthConfigured()) {
    return NextResponse.json(
      { error: "App auth not configured. Set APP_SESSION_SECRET on Vercel." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!isBetaEmailAllowed(email)) {
      return NextResponse.json(
        {
          error: "not_invited",
          message: "This email is not on the beta list yet. Join the waitlist at geck0.ai.",
        },
        { status: 403 }
      );
    }

    const token = createSessionToken(email);
    if (!token) {
      return NextResponse.json({ error: "Session failed" }, { status: 500 });
    }

    const res = NextResponse.json({ ok: true, email });
    res.cookies.set(sessionCookieOptions(token));
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "geck0_app_session",
    value: "",
    maxAge: 0,
    path: "/",
  });
  return res;
}
