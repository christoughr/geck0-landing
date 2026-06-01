import { Redis } from "@upstash/redis";
import { workspaceIdFromEmail } from "@/lib/workspace";
import { ensureWorkspaceSeeded } from "./seed";
import {
  appendQaHistory,
  getQaHistory,
  listDocuments,
  refreshConnectorCounts,
  saveNotionToken,
} from "./store";
import { searchKnowledge, synthesizeAnswer } from "./search";
import { buildKnowledgeGraph } from "./graph";
import { buildInsights } from "./insights";
import { syncNotionWorkspace } from "./notion";
import { syncSlackWorkspace } from "./slack";
import { syncDriveWorkspace } from "./drive";
import { syncJiraWorkspace } from "./jira";

function redis() {
  try {
    return Redis.fromEnv();
  } catch {
    return null;
  }
}

/** Fast path for Q&A — seed once, no Notion sync, no connector refresh. */
export async function ensureWorkspaceReady(email: string): Promise<string> {
  const workspaceId = workspaceIdFromEmail(email);
  const r = redis();
  const initKey = `knowledge:${workspaceId}:init`;

  if (r) {
    const done = await r.get<boolean>(initKey);
    if (!done) {
      await ensureWorkspaceSeeded(workspaceId);
      const internalNotion = process.env.NOTION_INTERNAL_TOKEN?.trim();
      if (internalNotion) {
        await saveNotionToken(workspaceId, internalNotion);
      }
      await r.set(initKey, true);
    }
  } else {
    await ensureWorkspaceSeeded(workspaceId);
  }

  return workspaceId;
}

/** Full prep for dashboard / integrations (connector counts only). */
export async function prepareWorkspace(email: string): Promise<string> {
  const workspaceId = await ensureWorkspaceReady(email);
  await refreshConnectorCounts(workspaceId);
  return workspaceId;
}

export async function answerWorkspaceQuery(
  workspaceId: string,
  query: string,
  locale: "ko" | "en" = "ko"
) {
  const hits = await searchKnowledge(workspaceId, query);
  const { answer, mode } = await synthesizeAnswer(query, hits, locale);
  const sources = hits.map((h) => ({
    id: h.doc.id,
    title: h.doc.title,
    source: h.doc.source,
  }));

  void appendQaHistory(workspaceId, {
    query,
    answer,
    sourceIds: sources.map((s) => s.id),
    mode,
  }).catch(() => {});

  return { answer, sources, mode, hits: hits.length };
}

export {
  listDocuments,
  getQaHistory,
  buildKnowledgeGraph,
  buildInsights,
  syncNotionWorkspace,
  syncSlackWorkspace,
  syncDriveWorkspace,
  syncJiraWorkspace,
  refreshConnectorCounts,
  saveNotionToken,
};
