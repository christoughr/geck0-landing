import { NextRequest, NextResponse } from "next/server";
import { appBaseUrl, oauthCallbackUrl, verifyOAuthState } from "@/lib/oauth";
import { saveOAuthToken } from "@/lib/knowledge/store";
import { syncSlackWorkspace } from "@/lib/knowledge/slack";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const back = `${appBaseUrl()}/app/settings/integrations`;

  if (!code || !state) {
    return NextResponse.redirect(`${back}?error=slack_denied`);
  }

  const verified = verifyOAuthState(state, "slack");
  if (!verified) {
    return NextResponse.redirect(`${back}?error=invalid_state`);
  }

  const clientId = process.env.SLACK_CLIENT_ID?.trim();
  const clientSecret = process.env.SLACK_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${back}?error=slack_not_configured`);
  }

  const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: oauthCallbackUrl("slack"),
    }),
  });

  const data = (await tokenRes.json()) as {
    ok?: boolean;
    access_token?: string;
    error?: string;
  };

  if (!data.ok || !data.access_token) {
    return NextResponse.redirect(`${back}?error=slack_token`);
  }

  await saveOAuthToken(verified.workspaceId, "slack", {
    access_token: data.access_token,
  });
  await syncSlackWorkspace(verified.workspaceId);

  return NextResponse.redirect(`${back}?connected=slack`);
}
