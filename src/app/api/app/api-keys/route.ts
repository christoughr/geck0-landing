import { NextRequest, NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { getActorRole } from "@/lib/team";
import {
  createWorkspaceApiKey,
  listWorkspaceApiKeys,
  revokeWorkspaceApiKey,
} from "@/lib/api-keys";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await listWorkspaceApiKeys(session.workspaceId);
  return NextResponse.json({ keys });
}

export async function POST(request: NextRequest) {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getActorRole(session.workspaceId, session.email);
  if (role !== "owner" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  if (body.action === "create") {
    const created = await createWorkspaceApiKey(
      session.workspaceId,
      session.email,
      typeof body.label === "string" ? body.label : "API key"
    );
    if (!created) {
      return NextResponse.json({ error: "Store unavailable" }, { status: 503 });
    }
    return NextResponse.json({ ok: true, key: created.key, record: created.record });
  }

  if (body.action === "revoke" && typeof body.id === "string") {
    await revokeWorkspaceApiKey(session.workspaceId, body.id);
    return NextResponse.json({ ok: true, keys: await listWorkspaceApiKeys(session.workspaceId) });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
