import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sessionCookieOptions, signInEmailOrError } from "@/lib/app-auth";

/** HTML form login (works without client JavaScript). */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = await rateLimit(`app-auth:${ip}`, 10, 60_000);
  if (!ok) {
    return NextResponse.redirect(new URL("/app?error=rate_limit", request.url));
  }

  const form = await request.formData();
  const email = form.get("email")?.toString() ?? "";
  const result = signInEmailOrError(email);
  const gateUrl = new URL("/app", request.url);

  if (!result.ok) {
    gateUrl.searchParams.set("error", result.code);
    return NextResponse.redirect(gateUrl);
  }

  const res = NextResponse.redirect(new URL("/app/dashboard", request.url));
  res.cookies.set(sessionCookieOptions(result.token));
  return res;
}
