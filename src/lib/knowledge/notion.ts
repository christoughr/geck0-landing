import {
  listDocuments,
  setConnector,
  upsertDocument,
} from "./store";

type NotionPage = {
  id: string;
  url?: string;
  properties?: Record<string, unknown>;
};

function plainTitle(page: NotionPage): string {
  const props = page.properties ?? {};
  for (const val of Object.values(props)) {
    if (val && typeof val === "object" && "title" in (val as object)) {
      const titles = (val as { title?: { plain_text?: string }[] }).title;
      const t = titles?.map((x) => x.plain_text).join("");
      if (t) return t;
    }
  }
  return `Notion page ${page.id.slice(0, 8)}`;
}

async function fetchBlockText(token: string, blockId: string): Promise<string> {
  const parts: string[] = [];
  let cursor: string | undefined;

  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
    if (cursor) url.searchParams.set("start_cursor", cursor);
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
      },
    });
    if (!res.ok) break;
    const data = (await res.json()) as {
      results?: { id: string; type: string; [key: string]: unknown }[];
      has_more?: boolean;
      next_cursor?: string | null;
    };

    for (const block of data.results ?? []) {
      const type = block.type;
      const payload = block[type] as { rich_text?: { plain_text?: string }[] } | undefined;
      const text = payload?.rich_text?.map((t) => t.plain_text).join("") ?? "";
      if (text) parts.push(text);
      if ("has_children" in block && block.has_children) {
        const child = await fetchBlockText(token, block.id);
        if (child) parts.push(child);
      }
    }
    cursor = data.has_more ? (data.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return parts.join("\n").trim();
}

export async function syncNotionWorkspace(
  workspaceId: string,
  token: string
): Promise<{ synced: number; error?: string }> {
  await setConnector(workspaceId, {
    id: "notion",
    status: "syncing",
    lastSyncAt: null,
    detail: "Syncing Notion pages…",
    documentCount: 0,
  });

  try {
    const searchRes = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_size: 20,
        filter: { property: "object", value: "page" },
      }),
    });

    if (!searchRes.ok) {
      const err = await searchRes.text();
      await setConnector(workspaceId, {
        id: "notion",
        status: "error",
        lastSyncAt: new Date().toISOString(),
        detail: `Notion API error: ${searchRes.status}`,
        documentCount: 0,
      });
      return { synced: 0, error: err };
    }

    const data = (await searchRes.json()) as { results?: NotionPage[] };
    let synced = 0;

    for (const page of data.results ?? []) {
      const title = plainTitle(page);
      const body = await fetchBlockText(token, page.id);
      const content = body || title;
      if (!content) continue;

      await upsertDocument({
        id: `notion_${page.id.replace(/-/g, "")}`,
        workspaceId,
        title,
        source: "Notion",
        connector: "notion",
        content,
        tags: ["notion"],
        team: "Product",
      });
      synced += 1;
    }

    const total = (await listDocuments(workspaceId)).filter((d) => d.connector === "notion").length;
    await setConnector(workspaceId, {
      id: "notion",
      status: "connected",
      lastSyncAt: new Date().toISOString(),
      detail: `Synced ${synced} pages`,
      documentCount: total,
    });

    return { synced };
  } catch (e) {
    await setConnector(workspaceId, {
      id: "notion",
      status: "error",
      lastSyncAt: new Date().toISOString(),
      detail: e instanceof Error ? e.message : "Sync failed",
      documentCount: 0,
    });
    return { synced: 0, error: "sync_failed" };
  }
}
