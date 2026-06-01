import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { listDocuments } from "@/lib/knowledge/store";
import { syncNotionWorkspace } from "@/lib/knowledge/notion";
import { syncSlackWorkspace } from "@/lib/knowledge/slack";
import { syncDriveWorkspace } from "@/lib/knowledge/drive";
import { syncJiraWorkspace } from "@/lib/knowledge/jira";
import {
  getJiraCredentials,
  getNotionToken,
  getOAuthToken,
} from "@/lib/knowledge/store";

export const runtime = "nodejs";
export const maxDuration = 60;

async function listWorkspaceIds(): Promise<string[]> {
  try {
    const r = Redis.fromEnv();
    const keys = await r.keys("knowledge:*:doc-ids");
    return keys
      .map((k) => {
        const m = /^knowledge:(.+):doc-ids$/.exec(k);
        return m?.[1];
      })
      .filter(Boolean) as string[];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceIds = await listWorkspaceIds();
  let synced = 0;

  for (const ws of workspaceIds.slice(0, 20)) {
    const docs = await listDocuments(ws);
    if (docs.length === 0) continue;

    const notion = (await getNotionToken(ws)) ?? process.env.NOTION_INTERNAL_TOKEN;
    if (notion) {
      await syncNotionWorkspace(ws, notion).catch(() => {});
      synced += 1;
    }

    const slack = await getOAuthToken(ws, "slack");
    if (slack?.access_token) {
      await syncSlackWorkspace(ws).catch(() => {});
      synced += 1;
    }

    const google = await getOAuthToken(ws, "google");
    if (google?.access_token) {
      await syncDriveWorkspace(ws).catch(() => {});
      synced += 1;
    }

    const jira = await getJiraCredentials(ws);
    if (jira?.token) {
      await syncJiraWorkspace(ws).catch(() => {});
      synced += 1;
    }
  }

  return NextResponse.json({ ok: true, workspaces: workspaceIds.length, syncRuns: synced });
}
