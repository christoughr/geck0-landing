import { NextRequest, NextResponse } from "next/server";
import { authenticatePublicApi } from "@/lib/public-api";
import { listDocuments } from "@/lib/knowledge";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await authenticatePublicApi(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docs = await listDocuments(auth.workspaceId);
  return NextResponse.json({
    documents: docs.map((d) => ({
      id: d.id,
      title: d.title,
      source: d.source,
      connector: d.connector,
      tags: d.tags,
      updatedAt: d.updatedAt,
    })),
  });
}
