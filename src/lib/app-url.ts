/** Canonical beta app login URL (always includes /app path). */
export function getAppLoginUrl(): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "https://app.geck0.ai").replace(/\/$/, "");
  return base.endsWith("/app") ? base : `${base}/app`;
}
