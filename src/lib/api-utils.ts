const ALLOWED_SOURCES = new Set([
  "waitlist",
  "login",
  "hero",
  "footer",
  "enterprise",
  "blog",
]);

export function sanitizeSource(source: unknown): string {
  if (typeof source !== "string") return "waitlist";
  const normalized = source.trim().toLowerCase().slice(0, 32);
  return ALLOWED_SOURCES.has(normalized) ? normalized : "waitlist";
}

/** Honeypot field — bots fill hidden inputs */
export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const trap = body._gotcha ?? body.website ?? body.url;
  return typeof trap === "string" && trap.trim().length > 0;
}

export function isTurnstileConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() &&
      process.env.TURNSTILE_SECRET_KEY?.trim()
  );
}

export function isTurnstileRequired(): boolean {
  return isTurnstileConfigured();
}

export async function verifyTurnstile(token: unknown): Promise<boolean> {
  if (!isTurnstileConfigured()) return true;

  if (typeof token !== "string" || !token.trim()) return false;

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    }),
  });

  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}
