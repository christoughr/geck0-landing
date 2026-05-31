import { put } from "@vercel/blob";

export interface ContactEntry {
  name: string;
  email: string;
  message: string;
  at: string;
  company?: string;
}

export function isContactStorageConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.RESEND_API_KEY ||
      process.env.SLACK_WEBHOOK_URL
  );
}

async function persistToBlob(entry: ContactEntry): Promise<boolean> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return false;

  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const day = entry.at.slice(0, 10);
    const pathname = `contacts/${day}/${id}.json`;

    await put(pathname, JSON.stringify(entry), {
      access: "private",
      contentType: "application/json",
      token,
    });

    return true;
  } catch (err) {
    console.error("[contact-store:blob]", err);
    return false;
  }
}

async function sendEmailNotification(entry: ContactEntry): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_INBOX_EMAIL ?? "hello@geck0.ai";
  const from = process.env.CONTACT_FROM_EMAIL ?? "geck0 Contact <onboarding@resend.dev>";

  if (!apiKey) return false;

  try {
    const companyLine = entry.company ? `\nCompany: ${entry.company}` : "";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: entry.email,
        subject: `[geck0.ai] Contact from ${entry.name}`,
        text: `New contact form submission\n\nName: ${entry.name}\nEmail: ${entry.email}${companyLine}\n\nMessage:\n${entry.message}\n\n---\nSubmitted: ${entry.at}`,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error("[contact-store:email]", err);
    return false;
  }
}

async function notifySlack(entry: ContactEntry): Promise<boolean> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return false;

  try {
    const companyLine = entry.company ? `\nCompany: ${entry.company}` : "";
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `📩 New contact from geck0.ai\n*${entry.name}* (${entry.email})${companyLine}\n${entry.message}`,
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
  const emailOk = await sendEmailNotification(entry);
  const slackOk = await notifySlack(entry);

  if (!blobOk && !emailOk && !slackOk) {
    console.error("[contact:fallback-log]", JSON.stringify(entry));
  }

  return { persisted: blobOk || emailOk || slackOk };
}
