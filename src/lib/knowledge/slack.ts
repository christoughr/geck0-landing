import { getOAuthToken, setConnector, upsertDocument } from "./store";

type SlackChannel = { id: string; name: string };
type SlackMessage = { text?: string; user?: string };

export async function syncSlackWorkspace(workspaceId: string): Promise<{
  synced: number;
  error?: string;
}> {
  const token = await getOAuthToken(workspaceId, "slack");
  if (!token?.access_token) {
    return { synced: 0, error: "Slack not connected" };
  }

  await setConnector(workspaceId, {
    id: "slack",
    status: "syncing",
    lastSyncAt: null,
    detail: "Syncing Slack channels…",
    documentCount: 0,
  });

  const headers = { Authorization: `Bearer ${token.access_token}` };

  try {
    const listRes = await fetch(
      "https://slack.com/api/conversations.list?types=public_channel,private_channel&limit=20",
      { headers }
    );
    const listData = (await listRes.json()) as {
      ok?: boolean;
      channels?: SlackChannel[];
      error?: string;
    };
    if (!listData.ok) {
      const err = listData.error ?? "channels.list failed";
      if (err === "missing_scope") {
        throw new Error(
          "Slack scope missing — add groups:read in Slack app, then reconnect OAuth"
        );
      }
      throw new Error(err);
    }

    let synced = 0;
    const channels = listData.channels ?? [];
    for (const ch of channels) {
      const histRes = await fetch(
        `https://slack.com/api/conversations.history?channel=${ch.id}&limit=50`,
        { headers }
      );
      const hist = (await histRes.json()) as {
        ok?: boolean;
        messages?: SlackMessage[];
      };
      if (!hist.ok || !hist.messages?.length) continue;

      const lines = hist.messages
        .filter((m) => m.text)
        .map((m) => m.text)
        .reverse()
        .join("\n");
      if (!lines.trim()) continue;

      await upsertDocument({
        id: `slack_${ch.id}`,
        workspaceId,
        title: `#${ch.name}`,
        source: "Slack",
        connector: "slack",
        content: lines.slice(0, 12000),
        tags: ["slack", ch.name],
        team: "Engineering",
      });
      synced += 1;
    }

    if (synced === 0) {
      await setConnector(workspaceId, {
        id: "slack",
        status: "connected",
        lastSyncAt: new Date().toISOString(),
        detail:
          channels.length === 0
            ? "Connected — no channels visible. Invite the app to a channel with messages."
            : "Connected — no messages found. Post in a channel or invite the app, then re-sync.",
        documentCount: 0,
      });
      return { synced: 0 };
    }

    await setConnector(workspaceId, {
      id: "slack",
      status: "connected",
      lastSyncAt: new Date().toISOString(),
      detail: `Synced ${synced} channels`,
      documentCount: synced,
    });
    return { synced };
  } catch (e) {
    await setConnector(workspaceId, {
      id: "slack",
      status: "error",
      lastSyncAt: new Date().toISOString(),
      detail: e instanceof Error ? e.message : "Sync failed",
      documentCount: 0,
    });
    return { synced: 0, error: "sync_failed" };
  }
}

/** Import pasted Slack export JSON (array of messages). */
export async function importSlackExport(
  workspaceId: string,
  channelName: string,
  messages: { text?: string }[]
): Promise<number> {
  const lines = messages
    .map((m) => m.text)
    .filter(Boolean)
    .join("\n");
  if (!lines.trim()) return 0;

  await upsertDocument({
    id: `slack_export_${channelName.replace(/\W/g, "_")}`,
    workspaceId,
    title: `Slack #${channelName}`,
    source: "Slack export",
    connector: "slack",
    content: lines.slice(0, 12000),
    tags: ["slack"],
    team: "Engineering",
  });
  await setConnector(workspaceId, {
    id: "slack",
    status: "connected",
    lastSyncAt: new Date().toISOString(),
    detail: "Imported export",
    documentCount: 1,
  });
  return 1;
}
