import { NextRequest, NextResponse } from "next/server";
import { appBaseUrl, verifyOAuthState } from "@/lib/oauth";
import { sessionCookieOptions, signInEmailOrError } from "@/lib/app-auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const gate = `${appBaseUrl()}/app`;

  if (!code || !state) {
    return NextResponse.redirect(`${gate}?error=google_denied`);
  }

  const verified = verifyOAuthState(state, "google_login");
  if (!verified || verified.workspaceId !== "login") {
    return NextResponse.redirect(`${gate}?error=invalid_state`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${gate}?error=google_not_configured`);
  }

  const redirectUri = `${appBaseUrl()}/api/app/auth/google/callback`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  const tokens = (await tokenRes.json()) as { access_token?: string };
  if (!tokens.access_token) {
    return NextResponse.redirect(`${gate}?error=google_token`);
  }

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const user = (await userRes.json()) as { email?: string };
  const email = user.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.redirect(`${gate}?error=no_email`);
  }

  const result = await signInEmailOrError(email);
  if (!result.ok) {
    return NextResponse.redirect(`${gate}?error=${result.code}`);
  }

  const res = NextResponse.redirect(`${appBaseUrl()}/app/dashboard`);
  res.cookies.set(sessionCookieOptions(result.token));
  return res;
}
