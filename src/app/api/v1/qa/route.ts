import { NextRequest, NextResponse } from "next/server";
import { authenticatePublicApi } from "@/lib/public-api";
import { answerWorkspaceQuery } from "@/lib/knowledge";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const auth = await authenticatePublicApi(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { ok } = await rateLimit(
    `api-v1-qa:${auth.workspaceId}:${ip}`,
    60,
    60_000
  );
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const locale = body.locale === "en" ? "en" : "ko";
    if (!query) {
      return NextResponse.json({ error: "query required" }, { status: 400 });
    }

    const result = await answerWorkspaceQuery(auth.workspaceId, query, locale);
    return NextResponse.json({
      answer: result.answer,
      sources: result.sources,
      mode: result.mode,
    });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
