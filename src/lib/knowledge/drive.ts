import { getOAuthToken, setConnector, upsertDocument } from "./store";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
};

async function exportFileText(accessToken: string, file: DriveFile): Promise<string> {
  if (file.mimeType === "application/vnd.google-apps.document") {
    const url = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (res.ok) return (await res.text()).slice(0, 12000);
    return "";
  }

  if (
    file.mimeType.startsWith("text/") ||
    file.mimeType === "application/json" ||
    file.mimeType === "application/pdf"
  ) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (res.ok) {
      const text = await res.text();
      return text.slice(0, 12000);
    }
  }
  return "";
}

export async function syncDriveWorkspace(workspaceId: string): Promise<{
  synced: number;
  error?: string;
}> {
  const token = await getOAuthToken(workspaceId, "google");
  if (!token?.access_token) {
    return { synced: 0, error: "Google Drive not connected" };
  }

  await setConnector(workspaceId, {
    id: "drive",
    status: "syncing",
    lastSyncAt: null,
    detail: "Syncing Drive files…",
    documentCount: 0,
  });

  try {
    const q = encodeURIComponent(
      "trashed=false and (mimeType='application/vnd.google-apps.document' or mimeType contains 'text/')"
    );
    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?pageSize=15&q=${q}&fields=files(id,name,mimeType)`,
      { headers: { Authorization: `Bearer ${token.access_token}` } }
    );
    const data = (await listRes.json()) as { files?: DriveFile[] };
    let synced = 0;

    for (const file of data.files ?? []) {
      const content = await exportFileText(token.access_token, file);
      if (!content.trim()) continue;
      await upsertDocument({
        id: `drive_${file.id}`,
        workspaceId,
        title: file.name,
        source: "Google Drive",
        connector: "drive",
        content,
        tags: ["drive"],
        team: "Product",
      });
      synced += 1;
    }

    await setConnector(workspaceId, {
      id: "drive",
      status: "connected",
      lastSyncAt: new Date().toISOString(),
      detail: `Synced ${synced} files`,
      documentCount: synced,
    });
    return { synced };
  } catch (e) {
    await setConnector(workspaceId, {
      id: "drive",
      status: "error",
      lastSyncAt: new Date().toISOString(),
      detail: e instanceof Error ? e.message : "Sync failed",
      documentCount: 0,
    });
    return { synced: 0, error: "sync_failed" };
  }
}
