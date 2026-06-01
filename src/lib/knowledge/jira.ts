import { getJiraCredentials, setConnector, upsertDocument } from "./store";

type JiraIssue = {
  key: string;
  fields?: {
    summary?: string;
    description?: string | { content?: unknown[] };
    status?: { name?: string };
  };
};

function jiraDescription(fields: JiraIssue["fields"]): string {
  const d = fields?.description;
  if (typeof d === "string") return d;
  if (d && typeof d === "object" && "content" in d) {
    return JSON.stringify(d.content).slice(0, 4000);
  }
  return "";
}

export async function syncJiraWorkspace(workspaceId: string): Promise<{
  synced: number;
  error?: string;
}> {
  const creds = await getJiraCredentials(workspaceId);
  if (!creds?.site || !creds.email || !creds.token) {
    return { synced: 0, error: "Jira not configured" };
  }

  const site = creds.site.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const auth = Buffer.from(`${creds.email}:${creds.token}`).toString("base64");

  await setConnector(workspaceId, {
    id: "jira",
    status: "syncing",
    lastSyncAt: null,
    detail: "Syncing Jira issues…",
    documentCount: 0,
  });

  try {
    const res = await fetch(
      `https://${site}/rest/api/3/search?maxResults=25&fields=summary,description,status`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Jira API ${res.status}`);
    }
    const data = (await res.json()) as { issues?: JiraIssue[] };
    let synced = 0;

    for (const issue of data.issues ?? []) {
      const summary = issue.fields?.summary ?? issue.key;
      const body = jiraDescription(issue.fields);
      const status = issue.fields?.status?.name ?? "";
      const content = `${summary}\n\nStatus: ${status}\n\n${body}`.trim();
      if (!content) continue;

      await upsertDocument({
        id: `jira_${issue.key}`,
        workspaceId,
        title: `${issue.key}: ${summary}`,
        source: "Jira",
        connector: "jira",
        content: content.slice(0, 12000),
        tags: ["jira", status.toLowerCase()].filter(Boolean),
        team: "Engineering",
      });
      synced += 1;
    }

    await setConnector(workspaceId, {
      id: "jira",
      status: "connected",
      lastSyncAt: new Date().toISOString(),
      detail: `Synced ${synced} issues`,
      documentCount: synced,
    });
    return { synced };
  } catch (e) {
    await setConnector(workspaceId, {
      id: "jira",
      status: "error",
      lastSyncAt: new Date().toISOString(),
      detail: e instanceof Error ? e.message : "Sync failed",
      documentCount: 0,
    });
    return { synced: 0, error: "sync_failed" };
  }
}
