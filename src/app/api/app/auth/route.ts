import { NextRequest, NextResponse } from "next/server";
import { isAppAuthConfigured, sessionCookieOptions, signInEmailOrError, clearSessionCookieOptions } from "@/lib/app-auth";
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
    const email = typeof body.email === "string" ? body.email : "";
    const result = signInEmailOrError(email);

    if (!result.ok) {
      const status =
        result.code === "not_invited"
          ? 403
          : result.code === "not_configured"
            ? 503
            : 400;
      return NextResponse.json({ error: result.code, message: result.message }, { status });
    }

    const res = NextResponse.json({ ok: true, email: email.trim().toLowerCase() });
    res.cookies.set(sessionCookieOptions(result.token));
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearSessionCookieOptions());
  return res;
}
