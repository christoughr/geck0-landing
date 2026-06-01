import { NextRequest, NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import {
  getConnectors,
  refreshConnectorCounts,
  saveNotionToken,
} from "@/lib/knowledge/store";
import { syncNotionWorkspace } from "@/lib/knowledge/notion";

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

    if (action === "notion_token" && typeof body.token === "string") {
      const token = body.token.trim();
      if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
      await saveNotionToken(session.workspaceId, token);
      const result = await syncNotionWorkspace(session.workspaceId, token);
      const connectors = await refreshConnectorCounts(session.workspaceId);
      return NextResponse.json({ ok: true, ...result, connectors });
    }

    if (action === "notion_sync") {
      const { getNotionToken } = await import("@/lib/knowledge/store");
      const token = (await getNotionToken(session.workspaceId)) ?? process.env.NOTION_INTERNAL_TOKEN;
      if (!token) {
        return NextResponse.json({ error: "Notion not connected" }, { status: 400 });
      }
      const result = await syncNotionWorkspace(session.workspaceId, token);
      const connectors = await refreshConnectorCounts(session.workspaceId);
      return NextResponse.json({ ok: true, ...result, connectors });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[connectors]", err);
    return NextResponse.json({ error: "Connector action failed" }, { status: 500 });
  }
}
