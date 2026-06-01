import { put } from "@vercel/blob";
import { Redis } from "@upstash/redis";

export interface ContactEntry {
  name: string;
  email: string;
  message: string;
  at: string;
  company?: string;
}

export type ContactSaveResult = {
  persisted: boolean;
  emailSent: boolean;
  channels: {
    blob: boolean;
    kv: boolean;
    email: boolean;
    slack: boolean;
  };
};

export function isContactStorageConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.RESEND_API_KEY?.trim() ||
      process.env.SLACK_WEBHOOK_URL ||
      process.env.KV_REST_API_URL ||
      process.env.UPSTASH_REDIS_REST_URL
  );
}

function stripEnvQuotes(value: string): string {
  return value.replace(/^["']+|["']+$/g, "").trim();
}

function getKv(): Redis | null {
  try {
    if (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) {
      return Redis.fromEnv();
    }
  } catch {
    return null;
  }
  return null;
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

async function persistToKv(entry: ContactEntry): Promise<boolean> {
  const redis = getKv();
  if (!redis) return false;

  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await redis.set(`contact:${id}`, entry, { ex: 60 * 60 * 24 * 365 });
    await redis.lpush("contacts:recent", id);
    await redis.ltrim("contacts:recent", 0, 499);
    return true;
  } catch (err) {
    console.error("[contact-store:kv]", err);
    return false;
  }
}

export function resolveFromAddress(): string {
  const raw = process.env.CONTACT_FROM_EMAIL?.trim();
  if (raw) {
    const cleaned = stripEnvQuotes(raw);
    if (cleaned.length > 0) return cleaned;
  }
  return "geck0 <hello@geck0.ai>";
}

export function resolveInboxAddress(): string {
  const raw = process.env.CONTACT_INBOX_EMAIL?.trim();
  if (raw) {
    const cleaned = stripEnvQuotes(raw);
    if (cleaned.length > 0) return cleaned;
  }
  return "hello@geck0.ai";
}

export async function sendEmailNotification(entry: ContactEntry): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = resolveInboxAddress();
  const from = resolveFromAddress();

  if (!apiKey) {
    console.error("[contact-store:email] RESEND_API_KEY is missing or empty");
    return false;
  }

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

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact-store:email]", res.status, "from=", from, "to=", to, detail);
      return false;
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    console.info("[contact-store:email] sent", data.id ?? "ok", "to=", to);
    return true;
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

export async function saveContact(entry: ContactEntry): Promise<ContactSaveResult> {
  const [blobOk, kvOk, emailOk, slackOk] = await Promise.all([
    persistToBlob(entry),
    persistToKv(entry),
    sendEmailNotification(entry),
    notifySlack(entry),
  ]);

  const channels = { blob: blobOk, kv: kvOk, email: emailOk, slack: slackOk };
  const persisted = blobOk || kvOk || emailOk || slackOk;

  if (!persisted) {
    console.error("[contact:fallback-log]", JSON.stringify(entry));
  } else if (!emailOk) {
    console.warn("[contact-store] saved without email", JSON.stringify(channels));
  }

  return { persisted, emailSent: emailOk, channels };
}
