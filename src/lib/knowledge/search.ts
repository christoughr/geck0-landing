import { embedQuery, cosineSimilarity, loadDocEmbeddings } from "./embeddings";
import { getAllChunks, listDocuments } from "./store";
import type { KnowledgeDocument } from "./types";

export type SearchHit = {
  doc: KnowledgeDocument;
  chunkText: string;
  score: number;
};

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[\s,.!?;:()[\]{}"']+/)
    .filter((t) => t.length > 1);
}

export async function searchKnowledge(
  workspaceId: string,
  query: string,
  limit = 6
): Promise<SearchHit[]> {
  const keywordHits = await scoreChunksKeyword(workspaceId, query, limit * 2);
  const vectorHits = await scoreChunksVector(
    workspaceId,
    query,
    limit,
    keywordHits.map((h) => h.doc.id)
  );

  const merged = new Map<string, SearchHit>();
  for (const h of [...vectorHits, ...keywordHits]) {
    const prev = merged.get(h.doc.id);
    if (!prev || h.score > prev.score) {
      merged.set(h.doc.id, h);
    }
  }

  const hits = Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (hits.length > 0) return hits;
  return keywordHits;
}

async function scoreChunksKeyword(
  workspaceId: string,
  query: string,
  limit: number
): Promise<SearchHit[]> {
  const terms = tokenize(query);
  const chunks = await getAllChunks(workspaceId);

  const scored = chunks
    .map(({ doc, text }) => {
      const lower = text.toLowerCase();
      const titleLower = doc.title.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (titleLower.includes(t)) score += 3;
        if (lower.includes(t)) score += 1;
      }
      if (doc.tags.some((tag) => terms.some((t) => tag.includes(t) || t.includes(tag)))) {
        score += 2;
      }
      return { doc, chunkText: text, score };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const hits: SearchHit[] = [];
  for (const h of scored) {
    if (seen.has(h.doc.id)) continue;
    seen.add(h.doc.id);
    hits.push(h);
    if (hits.length >= limit) break;
  }

  if (hits.length === 0 && chunks.length > 0) {
    const docs = await listDocuments(workspaceId);
    return docs.slice(0, Math.min(limit, docs.length)).map((doc) => ({
      doc,
      chunkText: doc.content.slice(0, 400),
      score: 0.1,
    }));
  }

  return hits;
}

async function scoreChunksVector(
  workspaceId: string,
  query: string,
  limit: number,
  candidateDocIds: string[] = []
): Promise<SearchHit[]> {
  const qVec = await embedQuery(query);
  if (!qVec) return [];

  const chunks = await getAllChunks(workspaceId);
  const candidateSet = new Set(candidateDocIds);
  const byDoc = new Map<string, typeof chunks>();
  for (const c of chunks) {
    if (candidateSet.size > 0 && !candidateSet.has(c.doc.id)) continue;
    const list = byDoc.get(c.doc.id) ?? [];
    list.push(c);
    byDoc.set(c.doc.id, list);
  }

  const hits: SearchHit[] = [];

  for (const [docId, docChunks] of Array.from(byDoc.entries())) {
    const vectors = await loadDocEmbeddings(workspaceId, docId);
    if (!vectors?.length) continue;

    let bestScore = 0;
    let bestText = "";
    docChunks.forEach((c, i) => {
      const vec = vectors[i];
      if (!vec) return;
      const sim = cosineSimilarity(qVec, vec);
      if (sim > bestScore) {
        bestScore = sim;
        bestText = c.text;
      }
    });

    if (bestScore > 0.35 && docChunks[0]) {
      hits.push({
        doc: docChunks[0].doc,
        chunkText: bestText,
        score: bestScore * 10,
      });
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

export async function synthesizeAnswer(
  query: string,
  hits: SearchHit[],
  locale: "ko" | "en" = "ko"
): Promise<{ answer: string; mode: string }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const context = hits
    .map(
      (h, i) =>
        `[${i + 1}] ${h.doc.title} (${h.doc.source})\n${h.chunkText}`
    )
    .join("\n\n");

  if (apiKey) {
    const system = `You are geck0, a company knowledge assistant for internal teams.
Answer in ${locale === "ko" ? "Korean" : "English"} using ONLY the context below.
Rules: be concise (3–6 bullets or short paragraphs); cite sources as [1], [2]; never invent facts; if context is thin, say what document or connector would help.
Context:
${context}`;

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
        max_tokens: 700,
        temperature: 0.2,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) {
        const usedVector = hits.some((h) => h.score > 3);
        return {
          answer: text,
          mode: usedVector ? "openai-vector-rag" : "openai-rag",
        };
      }
    }
  }

  if (hits.length === 0) {
    return {
      answer:
        locale === "ko"
          ? "관련 문서를 찾지 못했습니다. 연동 설정에서 문서를 추가하거나 다른 키워드로 질문해 주세요."
          : "No relevant documents found. Add documents in Integrations or try different keywords.",
      mode: "no-results",
    };
  }

  const top = hits[0];
  const bullets = hits
    .slice(0, 3)
    .map((h) => `• ${h.chunkText.slice(0, 200)}${h.chunkText.length > 200 ? "…" : ""}`)
    .join("\n");

  const vectorMode = hits.some((h) => h.score > 3);

  return {
    answer:
      locale === "ko"
        ? `「${top.doc.title}」 등 ${hits.length}개 문서에서 찾았습니다.\n\n${bullets}`
        : `Found in ${hits.length} document(s), including "${top.doc.title}":\n\n${bullets}`,
    mode: vectorMode ? "vector-rag" : "keyword-rag",
  };
}
