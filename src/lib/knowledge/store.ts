import { Redis } from "@upstash/redis";
import { chunkText } from "./chunk";
import type {
  ConnectorId,
  ConnectorState,
  KnowledgeChunk,
  KnowledgeDocument,
  QaHistoryEntry,
} from "./types";

function redis(): Redis | null {
  try {
    if (!process.env.KV_REST_API_URL?.trim() && !process.env.UPSTASH_REDIS_REST_URL?.trim()) {
      return null;
    }
    return Redis.fromEnv();
  } catch {
    return null;
  }
}

function docKey(ws: string, id: string) {
  return `knowledge:${ws}:doc:${id}`;
}
function docIndexKey(ws: string) {
  return `knowledge:${ws}:doc-ids`;
}
function chunkKey(ws: string, docId: string) {
  return `knowledge:${ws}:chunks:${docId}`;
}
function connectorKey(ws: string) {
  return `knowledge:${ws}:connectors`;
}
function historyKey(ws: string) {
  return `knowledge:${ws}:history`;
}
function notionTokenKey(ws: string) {
  return `knowledge:${ws}:notion-token`;
}

export async function listDocuments(workspaceId: string): Promise<KnowledgeDocument[]> {
  const r = redis();
  if (!r) return [];
  const ids = (await r.get<string[]>(docIndexKey(workspaceId))) ?? [];
  const docs = await Promise.all(
    ids.map((id) => r.get<KnowledgeDocument>(docKey(workspaceId, id)))
  );
  return docs.filter(Boolean) as KnowledgeDocument[];
}

export async function getDocument(
  workspaceId: string,
  docId: string
): Promise<KnowledgeDocument | null> {
  const r = redis();
  if (!r) return null;
  return r.get<KnowledgeDocument>(docKey(workspaceId, docId));
}

export async function upsertDocument(
  doc: Omit<KnowledgeDocument, "createdAt" | "updatedAt"> & {
    createdAt?: string;
    updatedAt?: string;
  }
): Promise<KnowledgeDocument> {
  const r = redis();
  if (!r) throw new Error("Knowledge store unavailable (KV not configured)");

  const now = new Date().toISOString();
  const existing = await r.get<KnowledgeDocument>(docKey(doc.workspaceId, doc.id));
  const full: KnowledgeDocument = {
    ...doc,
    createdAt: existing?.createdAt ?? doc.createdAt ?? now,
    updatedAt: now,
  };

  const chunks = chunkText(full.content).map((text, index) => ({
    id: `${full.id}_c${index}`,
    docId: full.id,
    text,
    index,
  }));

  await r.set(docKey(doc.workspaceId, full.id), full);
  await r.set(chunkKey(doc.workspaceId, full.id), chunks);

  const ids = new Set((await r.get<string[]>(docIndexKey(doc.workspaceId))) ?? []);
  ids.add(full.id);
  await r.set(docIndexKey(doc.workspaceId), Array.from(ids));

  return full;
}

export async function deleteDocument(workspaceId: string, docId: string): Promise<void> {
  const r = redis();
  if (!r) return;
  await r.del(docKey(workspaceId, docId));
  await r.del(chunkKey(workspaceId, docId));
  const ids = ((await r.get<string[]>(docIndexKey(workspaceId))) ?? []).filter((id) => id !== docId);
  await r.set(docIndexKey(workspaceId), ids);
}

export async function getAllChunks(workspaceId: string): Promise<
  (KnowledgeChunk & { doc: KnowledgeDocument })[]
> {
  const docs = await listDocuments(workspaceId);
  const r = redis();
  if (!r) return [];

  const out: (KnowledgeChunk & { doc: KnowledgeDocument })[] = [];
  for (const doc of docs) {
    const chunks = (await r.get<KnowledgeChunk[]>(chunkKey(workspaceId, doc.id))) ?? [];
    for (const c of chunks) {
      out.push({ ...c, doc });
    }
  }
  return out;
}

export async function getConnectors(workspaceId: string): Promise<ConnectorState[]> {
  const r = redis();
  const defaults: ConnectorState[] = [
    { id: "notion", status: "disconnected", lastSyncAt: null, detail: null, documentCount: 0 },
    { id: "slack", status: "disconnected", lastSyncAt: null, detail: null, documentCount: 0 },
    { id: "drive", status: "disconnected", lastSyncAt: null, detail: null, documentCount: 0 },
    { id: "jira", status: "disconnected", lastSyncAt: null, detail: null, documentCount: 0 },
  ];
  if (!r) return defaults;
  const stored = await r.get<ConnectorState[]>(connectorKey(workspaceId));
  if (!stored?.length) return defaults;
  const byId = Object.fromEntries(stored.map((c) => [c.id, c]));
  return defaults.map((d) => byId[d.id] ?? d);
}

export async function setConnector(workspaceId: string, state: ConnectorState): Promise<void> {
  const r = redis();
  if (!r) return;
  const all = await getConnectors(workspaceId);
  const next = all.map((c) => (c.id === state.id ? state : c));
  await r.set(connectorKey(workspaceId), next);
}

export async function saveNotionToken(workspaceId: string, token: string): Promise<void> {
  const r = redis();
  if (!r) return;
  await r.set(notionTokenKey(workspaceId), token, { ex: 60 * 60 * 24 * 90 });
}

export async function getNotionToken(workspaceId: string): Promise<string | null> {
  const r = redis();
  if (!r) return null;
  return r.get<string>(notionTokenKey(workspaceId));
}

export async function appendQaHistory(
  workspaceId: string,
  entry: Omit<QaHistoryEntry, "id" | "createdAt">
): Promise<void> {
  const r = redis();
  if (!r) return;
  const full: QaHistoryEntry = {
    ...entry,
    id: `qa_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const key = historyKey(workspaceId);
  const list = (await r.get<QaHistoryEntry[]>(key)) ?? [];
  await r.set(key, [full, ...list].slice(0, 40), { ex: 60 * 60 * 24 * 120 });
}

export async function getQaHistory(workspaceId: string): Promise<QaHistoryEntry[]> {
  const r = redis();
  if (!r) return [];
  return (await r.get<QaHistoryEntry[]>(historyKey(workspaceId))) ?? [];
}

export async function countDocumentsByConnector(
  workspaceId: string,
  connector: ConnectorId | "upload" | "seed"
): Promise<number> {
  const docs = await listDocuments(workspaceId);
  return docs.filter((d) => d.connector === connector).length;
}

export async function refreshConnectorCounts(workspaceId: string): Promise<ConnectorState[]> {
  const connectors = await getConnectors(workspaceId);
  const updated = await Promise.all(
    connectors.map(async (c) => {
      if (c.id === "jira") {
        return { ...c, status: "disconnected" as const, detail: "Coming soon", documentCount: 0 };
      }
      const count = await countDocumentsByConnector(workspaceId, c.id);
      if (count > 0 && c.status === "disconnected") {
        return {
          ...c,
          status: "connected" as const,
          documentCount: count,
          detail: `${count} documents indexed`,
        };
      }
      return { ...c, documentCount: count };
    })
  );
  const r = redis();
  if (r) await r.set(connectorKey(workspaceId), updated);
  return updated;
}
