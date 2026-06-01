const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://geck0.ai";

export function getSiteUrl(path = "") {
  const base = SITE_URL.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getOgImageUrl() {
  return getSiteUrl("/opengraph-image");
}

export function getLogoUrl() {
  return getSiteUrl("/favicon.svg");
}
