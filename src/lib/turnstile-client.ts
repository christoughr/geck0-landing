/** Client-safe Turnstile flag (hostname + site key). */
import { isTurnstileSkippedHost } from "@/lib/turnstile-host";

export function isTurnstileEnabled(): boolean {
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()) return false;
  if (typeof window === "undefined") return true;
  return !isTurnstileSkippedHost(window.location.hostname);
}
