import { NextResponse } from "next/server";
import { appBaseUrl, createOAuthState } from "@/lib/oauth";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.redirect(`${appBaseUrl()}/app?error=google_not_configured`);
  }

  const state = createOAuthState("login", "google_login");
  if (!state) {
    return NextResponse.redirect(`${appBaseUrl()}/app?error=oauth_state`);
  }

  const redirectUri = `${appBaseUrl()}/api/app/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
