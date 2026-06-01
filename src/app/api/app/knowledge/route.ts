import { NextRequest, NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { listDocuments, upsertDocument, deleteDocument } from "@/lib/knowledge/store";
import { refreshConnectorCounts } from "@/lib/knowledge/store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const docs = await listDocuments(session.workspaceId);
  return NextResponse.json({ documents: docs, count: docs.length });
}

export async function POST(request: NextRequest) {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const source = typeof body.source === "string" ? body.source.trim() : "Upload";

    if (!title || !content || content.length > 100_000) {
      return NextResponse.json({ error: "Invalid title or content" }, { status: 400 });
    }

    const id = `upload_${Date.now()}`;
    const doc = await upsertDocument({
      id,
      workspaceId: session.workspaceId,
      title,
      source,
      connector: "upload",
      content,
      tags: ["upload"],
      team: typeof body.team === "string" ? body.team : "Product",
    });

    await refreshConnectorCounts(session.workspaceId);
    return NextResponse.json({ ok: true, document: doc });
  } catch (err) {
    console.error("[knowledge ingest]", err);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await deleteDocument(session.workspaceId, id);
  await refreshConnectorCounts(session.workspaceId);
  return NextResponse.json({ ok: true });
}
