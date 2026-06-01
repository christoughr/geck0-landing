import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, APP_SESSION_COOKIE } from "@/lib/app-auth";
import { answerWorkspaceQuery, prepareWorkspace } from "@/lib/knowledge";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(APP_SESSION_COOKIE)?.value;
  const email = token ? verifySessionToken(token) : null;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { ok } = await rateLimit(`app-qa:${ip}`, 30, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    if (!query || query.length > 2000) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const locale = body.locale === "en" ? "en" : "ko";
    const workspaceId = await prepareWorkspace(email);
    const result = await answerWorkspaceQuery(workspaceId, query, locale);

    return NextResponse.json({
      answer: result.answer,
      sources: result.sources,
      mode: result.mode,
      workspaceId,
    });
  } catch (err) {
    console.error("[app qa]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Q&A failed" }, { status: 500 });
  }
}
