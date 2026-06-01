import type { KnowledgeChunk } from "./types";
import { getChunkEmbeddings, setChunkEmbeddings } from "./store";

const MODEL = process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small";

export async function embedTexts(texts: string[]): Promise<number[][] | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || texts.length === 0) return null;

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, input: texts.slice(0, 32) }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { data?: { embedding: number[] }[] };
  return data.data?.map((d) => d.embedding) ?? null;
}

export async function indexDocumentEmbeddings(
  workspaceId: string,
  docId: string,
  chunks: KnowledgeChunk[]
): Promise<void> {
  const texts = chunks.map((c) => c.text);
  const vectors = await embedTexts(texts);
  if (vectors?.length) {
    await setChunkEmbeddings(workspaceId, docId, vectors);
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function embedQuery(query: string): Promise<number[] | null> {
  const vecs = await embedTexts([query]);
  return vecs?.[0] ?? null;
}

export async function loadDocEmbeddings(workspaceId: string, docId: string) {
  return getChunkEmbeddings(workspaceId, docId);
}
