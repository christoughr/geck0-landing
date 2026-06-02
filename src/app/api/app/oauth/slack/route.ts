import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { appBaseUrl, createOAuthState, oauthCallbackUrl } from "@/lib/oauth";

export async function GET() {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = process.env.SLACK_CLIENT_ID?.trim();
  if (!clientId) {
    return NextResponse.redirect(
      `${appBaseUrl()}/app/settings/integrations?error=slack_not_configured`
    );
  }

  const state = createOAuthState(session.workspaceId, "slack");
  if (!state) {
    return NextResponse.redirect(`${appBaseUrl()}/app/settings/integrations?error=oauth_state`);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope:
      "channels:history,channels:read,groups:history,groups:read,users:read",
    redirect_uri: oauthCallbackUrl("slack"),
    state,
  });

  return NextResponse.redirect(`https://slack.com/oauth/v2/authorize?${params}`);
}
