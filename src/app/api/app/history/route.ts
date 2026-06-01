import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { getQaHistory } from "@/lib/knowledge/store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const history = await getQaHistory(session.workspaceId);
  return NextResponse.json({ history });
}
