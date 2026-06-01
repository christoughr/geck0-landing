interface MailchimpMember {
  email_address: string;
  status: "subscribed" | "pending";
  tags?: string[];
}

export type MailchimpSubscribeStatus = "subscribed" | "pending";

export async function addMailchimpSubscriber(
  email: string,
  source = "waitlist"
): Promise<MailchimpSubscribeStatus> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !listId || !serverPrefix) {
    throw new Error("Mailchimp is not configured");
  }

  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;

  const status: MailchimpSubscribeStatus =
    process.env.MAILCHIMP_DOUBLE_OPTIN === "true" ? "pending" : "subscribed";

  const body: MailchimpMember = {
    email_address: email,
    status,
    tags: [source, "geck0-landing"],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok) return status;

  const data = (await res.json()) as { title?: string; detail?: string };

  if (data.title === "Member Exists") return status;

  throw new Error(data.detail ?? data.title ?? "Mailchimp request failed");
}

export function isMailchimpConfigured(): boolean {
  return Boolean(
    process.env.MAILCHIMP_API_KEY &&
      process.env.MAILCHIMP_LIST_ID &&
      process.env.MAILCHIMP_SERVER_PREFIX
  );
}

export async function pingMailchimp(): Promise<{ ok: boolean; detail?: string }> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !listId || !serverPrefix) {
    return { ok: false, detail: "Not configured" };
  }

  try {
    const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
    const res = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`,
      {
        headers: { Authorization: `Basic ${auth}` },
        next: { revalidate: 0 },
      }
    );

    if (res.ok) return { ok: true, detail: "List reachable" };
    return { ok: false, detail: `HTTP ${res.status}` };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : "Request failed",
    };
  }
}
