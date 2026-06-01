import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { appBaseUrl, createOAuthState, oauthCallbackUrl } from "@/lib/oauth";

export async function GET() {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.redirect(
      `${appBaseUrl()}/app/settings/integrations?error=google_not_configured`
    );
  }

  const state = createOAuthState(session.workspaceId, "google");
  if (!state) {
    return NextResponse.redirect(`${appBaseUrl()}/app/settings/integrations?error=oauth_state`);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: oauthCallbackUrl("google"),
    response_type: "code",
    scope: "https://www.googleapis.com/auth/drive.readonly",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
