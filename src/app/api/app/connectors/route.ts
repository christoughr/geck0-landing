import { NextRequest, NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import {
  getConnectors,
  getNotionToken,
  refreshConnectorCounts,
  saveJiraCredentials,
  saveNotionToken,
} from "@/lib/knowledge/store";
import { syncNotionWorkspace } from "@/lib/knowledge/notion";
import { syncSlackWorkspace, importSlackExport } from "@/lib/knowledge/slack";
import { syncDriveWorkspace } from "@/lib/knowledge/drive";
import { syncJiraWorkspace } from "@/lib/knowledge/jira";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const connectors = await refreshConnectorCounts(session.workspaceId);
  return NextResponse.json({ connectors });
}

export async function POST(request: NextRequest) {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const action = body.action;
    const ws = session.workspaceId;

    if (action === "notion_token" && typeof body.token === "string") {
      const token = body.token.trim();
      if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
      await saveNotionToken(ws, token);
      const result = await syncNotionWorkspace(ws, token);
      const connectors = await refreshConnectorCounts(ws);
      return NextResponse.json({ ok: true, ...result, connectors });
    }

    if (action === "notion_sync") {
      const token = (await getNotionToken(ws)) ?? process.env.NOTION_INTERNAL_TOKEN;
      if (!token) {
        return NextResponse.json({ error: "Notion not connected" }, { status: 400 });
      }
      const result = await syncNotionWorkspace(ws, token);
      const connectors = await refreshConnectorCounts(ws);
      return NextResponse.json({ ok: true, ...result, connectors });
    }

    if (action === "slack_sync") {
      const result = await syncSlackWorkspace(ws);
      const connectors = await refreshConnectorCounts(ws);
      return NextResponse.json({ ok: true, ...result, connectors });
    }

    if (action === "drive_sync") {
      const result = await syncDriveWorkspace(ws);
      const connectors = await refreshConnectorCounts(ws);
      return NextResponse.json({ ok: true, ...result, connectors });
    }

    if (
      action === "jira_credentials" &&
      typeof body.site === "string" &&
      typeof body.email === "string" &&
      typeof body.token === "string"
    ) {
      await saveJiraCredentials(ws, {
        site: body.site.trim(),
        email: body.email.trim(),
        token: body.token.trim(),
      });
      const result = await syncJiraWorkspace(ws);
      const connectors = await refreshConnectorCounts(ws);
      return NextResponse.json({ ok: true, ...result, connectors });
    }

    if (action === "jira_sync") {
      const result = await syncJiraWorkspace(ws);
      const connectors = await refreshConnectorCounts(ws);
      return NextResponse.json({ ok: true, ...result, connectors });
    }

    if (
      action === "slack_export" &&
      typeof body.channel === "string" &&
      Array.isArray(body.messages)
    ) {
      const synced = await importSlackExport(ws, body.channel, body.messages);
      const connectors = await refreshConnectorCounts(ws);
      return NextResponse.json({ ok: true, synced, connectors });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[connectors]", err);
    return NextResponse.json({ error: "Connector action failed" }, { status: 500 });
  }
}
