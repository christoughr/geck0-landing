import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const APP_SESSION_COOKIE = "geck0_app_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function getSecret(): string | null {
  return (
    process.env.APP_SESSION_SECRET?.trim() ||
    process.env.ADMIN_API_KEY?.trim() ||
    null
  );
}

function sign(payload: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function isBetaEmailAllowed(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return false;

  if (process.env.APP_BETA_OPEN === "true") return true;

  const list = process.env.BETA_ALLOWED_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? [];
  if (list.includes(normalized)) return true;

  const domain = process.env.BETA_ALLOWED_DOMAIN?.trim().toLowerCase();
  if (domain && normalized.endsWith(`@${domain}`)) return true;

  return false;
}

export function createSessionToken(email: string): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${normalizedEmail(email)}|${exp}`;
  const sig = sign(payload);
  if (!sig) return null;
  return Buffer.from(`${payload}|${sig}`).toString("base64url");
}

function normalizedEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function verifySessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split("|");
    if (parts.length !== 3) return null;
    const [email, expStr, sig] = parts;
    const payload = `${email}|${expStr}`;
    const expected = sign(payload);
    if (!expected || sig.length !== expected.length) return null;
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }
    const exp = Number.parseInt(expStr, 10);
    if (!Number.isFinite(exp) || Date.now() > exp) return null;
    return email;
  } catch {
    return null;
  }
}

export async function getAppSessionEmail(): Promise<string | null> {
  const token = cookies().get(APP_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieOptions(token: string) {
  return {
    name: APP_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function isAppAuthConfigured(): boolean {
  return Boolean(getSecret());
}
