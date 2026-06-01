import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const STATE_TTL_MS = 10 * 60 * 1000;

function secret(): string | null {
  return (
    process.env.APP_SESSION_SECRET?.trim() ||
    process.env.ADMIN_API_KEY?.trim() ||
    null
  );
}

export function appBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "https://app.geck0.ai"
  ).replace(/\/$/, "");
}

export function oauthCallbackUrl(provider: "slack" | "google"): string {
  return `${appBaseUrl()}/api/app/oauth/${provider}/callback`;
}

export function createOAuthState(workspaceId: string, provider: string): string | null {
  const s = secret();
  if (!s) return null;
  const nonce = randomBytes(12).toString("base64url");
  const exp = Date.now() + STATE_TTL_MS;
  const payload = `${workspaceId}|${provider}|${exp}|${nonce}`;
  const sig = createHmac("sha256", s).update(payload).digest("hex");
  return Buffer.from(`${payload}|${sig}`).toString("base64url");
}

export function verifyOAuthState(
  state: string,
  provider: string
): { workspaceId: string } | null {
  const s = secret();
  if (!s) return null;
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf8");
    const parts = decoded.split("|");
    if (parts.length !== 5) return null;
    const [workspaceId, prov, expStr, nonce, sig] = parts;
    if (prov !== provider) return null;
    const payload = `${workspaceId}|${prov}|${expStr}|${nonce}`;
    const expected = createHmac("sha256", s).update(payload).digest("hex");
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }
    const exp = Number.parseInt(expStr, 10);
    if (!Number.isFinite(exp) || Date.now() > exp) return null;
    return { workspaceId };
  } catch {
    return null;
  }
}
