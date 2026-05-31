interface MailchimpMember {
  email_address: string;
  status: "subscribed" | "pending";
  tags?: string[];
}

export async function addMailchimpSubscriber(
  email: string,
  source = "waitlist"
): Promise<void> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !listId || !serverPrefix) {
    throw new Error("Mailchimp is not configured");
  }

  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;

  const body: MailchimpMember = {
    email_address: email,
    status: "subscribed",
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

  if (res.ok) return;

  const data = (await res.json()) as { title?: string; detail?: string };

  if (data.title === "Member Exists") return;

  throw new Error(data.detail ?? data.title ?? "Mailchimp request failed");
}

export function isMailchimpConfigured(): boolean {
  return Boolean(
    process.env.MAILCHIMP_API_KEY &&
      process.env.MAILCHIMP_LIST_ID &&
      process.env.MAILCHIMP_SERVER_PREFIX
  );
}
