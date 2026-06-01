import { NextRequest, NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import {
  getActorRole,
  inviteTeamMember,
  listTeamMembers,
  removeTeamMember,
} from "@/lib/team";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const members = await listTeamMembers(session.workspaceId);
  const role = await getActorRole(session.workspaceId, session.email);
  return NextResponse.json({ members, role });
}

export async function POST(request: NextRequest) {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const action = body.action;

  if (action === "invite" && typeof body.email === "string") {
    const result = await inviteTeamMember(
      session.workspaceId,
      session.email,
      body.email
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }
    return NextResponse.json({ ok: true, members: await listTeamMembers(session.workspaceId) });
  }

  if (action === "remove" && typeof body.email === "string") {
    const result = await removeTeamMember(
      session.workspaceId,
      session.email,
      body.email
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }
    return NextResponse.json({ ok: true, members: await listTeamMembers(session.workspaceId) });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
