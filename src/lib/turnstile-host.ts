/** Hostnames allowed in Cloudflare Turnstile widget config. */
const ALLOWED_TURNSTILE_HOSTS = [
  "geck0.ai",
  "www.geck0.ai",
  "app.geck0.ai",
  "localhost",
  "127.0.0.1",
] as const;

export function isTurnstileAllowedHost(hostname: string | null | undefined): boolean {
  if (!hostname) return false;
  const host = hostname.split(":")[0].toLowerCase();
  return ALLOWED_TURNSTILE_HOSTS.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  );
}

/** Vercel preview URLs (*.vercel.app) are not in Turnstile hostname list — skip widget. */
export function isTurnstileSkippedHost(hostname: string | null | undefined): boolean {
  if (!hostname) return true;
  const host = hostname.split(":")[0].toLowerCase();
  if (host.endsWith(".vercel.app")) return true;
  return !isTurnstileAllowedHost(host);
}
