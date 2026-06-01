import { createHmac, randomBytes } from "crypto";
import { sitePricing, type BillingPlan } from "@/lib/pricing";

export type { BillingPlan };

const TOSS_API = "https://api.tosspayments.com";

export function isTossConfigured(): boolean {
  return Boolean(
    process.env.TOSS_SECRET_KEY?.trim() && process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim()
  );
}

export function getTossClientKey(): string | null {
  return process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim() || null;
}

function getSecretKey(): string {
  const key = process.env.TOSS_SECRET_KEY?.trim();
  if (!key) throw new Error("TOSS_SECRET_KEY is not configured");
  return key;
}

export function tossAuthHeader(): string {
  return `Basic ${Buffer.from(`${getSecretKey()}:`).toString("base64")}`;
}

export async function tossApi<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: tossAuthHeader(),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${TOSS_API}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string>) },
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });

  const data = (await res.json().catch(() => ({}))) as T & { message?: string; code?: string };
  if (!res.ok) {
    const msg =
      typeof data === "object" && data && "message" in data
        ? String((data as { message?: string }).message)
        : res.statusText;
    throw new Error(`Toss API ${path}: ${msg}`);
  }
  return data;
}

export function validateCheckoutInput(
  plan: unknown,
  seats: unknown
): { plan: BillingPlan; seats: number } | { error: string } {
  if (plan !== "starter" && plan !== "growth") {
    return { error: "Invalid plan" };
  }

  const seatCount =
    typeof seats === "number"
      ? seats
      : typeof seats === "string"
        ? Number.parseInt(seats, 10)
        : NaN;

  if (!Number.isFinite(seatCount) || seatCount < 1) {
    return { error: "Seats must be at least 1" };
  }

  const maxSeats = sitePricing.plans[plan].maxSeats;
  if (seatCount > maxSeats) {
    return { error: `Maximum ${maxSeats} seats for ${plan}` };
  }

  return { plan, seats: seatCount };
}

export function orderAmountKrw(plan: BillingPlan, seats: number): number {
  return sitePricing.plans[plan].pricePerSeatKo * seats;
}

export function orderName(plan: BillingPlan, seats: number): string {
  const label = plan === "starter" ? "Starter" : "Growth";
  return `geck0 ${label} · ${seats} seat${seats > 1 ? "s" : ""}`;
}

export function generateOrderId(): string {
  return `geck0_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

export function generateCustomerKey(): string {
  return `geck0_ck_${randomBytes(12).toString("hex")}`;
}

export function getSiteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://geck0.ai").replace(/\/$/, "");
}

/** Verify Toss webhook HMAC (when TOSS_WEBHOOK_SECRET is set). */
export function verifyTossWebhookSignature(
  payload: string,
  signature: string | null
): boolean {
  const secret = process.env.TOSS_WEBHOOK_SECRET?.trim();
  if (!secret) return true;
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("base64");
  return expected === signature;
}
