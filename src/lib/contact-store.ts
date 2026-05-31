export interface ContactEntry {
  name: string;
  email: string;
  message: string;
  at: string;
}

async function persistToBlob(entry: ContactEntry): Promise<boolean> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return false;

  try {
    const line = JSON.stringify(entry) + "\n";
    const pathname = `contacts/${new Date().toISOString().slice(0, 7)}.jsonl`;

    const listRes = await fetch(
      `https://blob.vercel-storage.com/?prefix=${encodeURIComponent(pathname)}`,
      { headers: { authorization: `Bearer ${token}` } }
    );

    let existing = "";
    if (listRes.ok) {
      const list = (await listRes.json()) as { blobs?: { url: string; pathname: string }[] };
      const blob = list.blobs?.find((b) => b.pathname === pathname);
      if (blob) {
        const getRes = await fetch(blob.url);
        if (getRes.ok) existing = await getRes.text();
      }
    }

    await fetch(`https://blob.vercel-storage.com/${pathname}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "text/plain",
        "x-add-random-suffix": "0",
      },
      body: existing + line,
    });

    return true;
  } catch (err) {
    console.error("[contact-store:blob]", err);
    return false;
  }
}

async function notifySlack(entry: ContactEntry): Promise<boolean> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return false;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `📩 New contact from geck0.ai\n*${entry.name}* (${entry.email})\n${entry.message}`,
      }),
    });
    return true;
  } catch (err) {
    console.error("[contact-store:slack]", err);
    return false;
  }
}

export async function saveContact(entry: ContactEntry): Promise<{ persisted: boolean }> {
  const blobOk = await persistToBlob(entry);
  const slackOk = await notifySlack(entry);

  if (!blobOk && !slackOk) {
    console.log("[contact:fallback-log]", JSON.stringify(entry));
  }

  return { persisted: blobOk || slackOk };
}
