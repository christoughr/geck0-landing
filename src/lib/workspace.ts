import { createHash } from "crypto";

export function workspaceIdFromEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  const [local, domain] = normalized.split("@");
  if (!domain) return "ws_unknown";

  if (domain === "gmail.com" || domain === "googlemail.com" || domain === "yahoo.com") {
    const h = createHash("sha256").update(normalized).digest("hex").slice(0, 12);
    return `ws_u_${h}`;
  }

  return `ws_${domain.replace(/[^a-z0-9]/g, "_")}`;
}

export function displayWorkspaceName(email: string): string {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return "Workspace";
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return email.split("@")[0] ?? "Personal";
  }
  return domain;
}
