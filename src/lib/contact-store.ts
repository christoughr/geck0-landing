export interface ContactEntry {
  name: string;
  email: string;
  message: string;
  at: string;
}

/** Append-only: one blob per submission — no read-modify-write race */
async function persistToBlob(entry: ContactEntry): Promise<boolean> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return false;

  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const day = entry.at.slice(0, 10);
    const pathname = `contacts/${day}/${id}.json`;

    const res = await fetch(`https://blob.vercel-storage.com/${pathname}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(entry),
    });

    return res.ok;
  } catch (err) {
    console.error("[contact-store:blob]", err);
    return false;
  }
}

async function notifySlack(entry: ContactEntry): Promise<boolean> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return false;

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `📩 New contact from geck0.ai\n*${entry.name}* (${entry.email})\n${entry.message}`,
      }),
    });
    return res.ok;
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
