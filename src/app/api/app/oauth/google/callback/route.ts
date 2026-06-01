import { NextRequest, NextResponse } from "next/server";
import { appBaseUrl, oauthCallbackUrl, verifyOAuthState } from "@/lib/oauth";
import { saveOAuthToken } from "@/lib/knowledge/store";
import { syncDriveWorkspace } from "@/lib/knowledge/drive";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const back = `${appBaseUrl()}/app/settings/integrations`;

  if (!code || !state) {
    return NextResponse.redirect(`${back}?error=google_denied`);
  }

  const verified = verifyOAuthState(state, "google");
  if (!verified) {
    return NextResponse.redirect(`${back}?error=invalid_state`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${back}?error=google_not_configured`);
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: oauthCallbackUrl("google"),
    }),
  });

  const data = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
  };

  if (!data.access_token) {
    return NextResponse.redirect(`${back}?error=google_token`);
  }

  await saveOAuthToken(verified.workspaceId, "google", {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });
  await syncDriveWorkspace(verified.workspaceId);

  return NextResponse.redirect(`${back}?connected=drive`);
}
