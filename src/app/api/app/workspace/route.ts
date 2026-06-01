import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { listDocuments, getQaHistory } from "@/lib/knowledge/store";
import { refreshConnectorCounts } from "@/lib/knowledge/store";
import { displayWorkspaceName } from "@/lib/workspace";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const docs = await listDocuments(session.workspaceId);
  const history = await getQaHistory(session.workspaceId);
  const connectors = await refreshConnectorCounts(session.workspaceId);

  return NextResponse.json({
    workspaceId: session.workspaceId,
    name: displayWorkspaceName(session.email),
    email: session.email,
    stats: {
      documents: docs.length,
      qaThisWeek: history.filter((h) => {
        const d = new Date(h.createdAt);
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return d.getTime() > weekAgo;
      }).length,
      connectedSources: connectors.filter((c) => c.status === "connected").length,
    },
    connectors,
  });
}
