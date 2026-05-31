const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://geck0.ai";

export function getSiteUrl(path = "") {
  return `${SITE_URL.replace(/\/$/, "")}${path}`;
}
