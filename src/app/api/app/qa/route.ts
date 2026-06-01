import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, APP_SESSION_COOKIE } from "@/lib/app-auth";
import { answerFromDemoKnowledge } from "@/lib/app-knowledge";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

async function answerWithOpenAI(query: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const context = answerFromDemoKnowledge(query);
  const system = `You are geck0, a company knowledge assistant. Answer using ONLY the context below. Cite sources briefly. If unsure, say so.
Context documents:
${context.sources.map((s) => `- ${s.title} (${s.source}): ${s.excerpt}`).join("\n")}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: query },
      ],
      max_tokens: 600,
      temperature: 0.2,
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

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

    const demo = answerFromDemoKnowledge(query);
    const aiAnswer = await answerWithOpenAI(query);
    const answer = aiAnswer ?? demo.answer;
    const mode = aiAnswer ? "openai" : "demo";

    return NextResponse.json({
      answer,
      sources: demo.sources.map((s) => ({
        id: s.id,
        title: s.title,
        source: s.source,
      })),
      mode,
      latencyMs: mode === "openai" ? undefined : 1200,
    });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
