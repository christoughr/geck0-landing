import { isDistributedRateLimitConfigured } from "@/lib/rate-limit";
import { isMailchimpConfigured, pingMailchimp } from "@/lib/mailchimp";
import { isContactStorageConfigured } from "@/lib/contact-store";
import { isTurnstileConfigured } from "@/lib/api-utils";
import { isStripeCheckoutConfigured, isStripeConfigured } from "@/lib/stripe";

async function pingResend(): Promise<{ ok: boolean; detail?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, detail: "Not configured" };

  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 0 },
    });
    if (res.ok) return { ok: true, detail: "API reachable" };
    return { ok: false, detail: `HTTP ${res.status}` };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : "Request failed",
    };
  }
}

export type ServiceStatus = "operational" | "degraded" | "unavailable" | "not_configured";

export interface HealthReport {
  status: "operational" | "degraded" | "unavailable";
  scope: "marketing-site";
  timestamp: string;
  deployment: string;
  services: Record<string, ServiceStatus>;
  checks: Record<string, { ok: boolean; detail?: string }>;
  _meta: {
    note: string;
    uptimeSec: number;
    rateLimitBackend: "upstash" | "memory";
  };
}

export async function buildHealthReport(uptimeSec: number): Promise<HealthReport> {
  const services: Record<string, ServiceStatus> = {
    website: "operational",
    api: "operational",
    mailchimp: "not_configured",
    contact: "not_configured",
    turnstile: "not_configured",
    stripe: "not_configured",
    rateLimit: isDistributedRateLimitConfigured() ? "operational" : "degraded",
  };

  const checks: HealthReport["checks"] = {};

  if (isMailchimpConfigured()) {
    const mailchimp = await pingMailchimp();
    checks.mailchimp = mailchimp;
    services.mailchimp = mailchimp.ok ? "operational" : "unavailable";
  }

  if (isContactStorageConfigured()) {
    const channels = [
      process.env.BLOB_READ_WRITE_TOKEN && "Blob",
      process.env.RESEND_API_KEY && "Email",
      process.env.SLACK_WEBHOOK_URL && "Slack",
    ]
      .filter(Boolean)
      .join(" + ");

    let contactOk = true;
    if (process.env.RESEND_API_KEY) {
      const resend = await pingResend();
      checks.resend = resend;
      if (!resend.ok) contactOk = false;
    }

    services.contact = contactOk ? "operational" : "degraded";
    checks.contact = {
      ok: contactOk,
      detail: contactOk
        ? `Configured: ${channels}`
        : `Partial: ${channels} (Resend check failed)`,
    };
  } else {
    services.contact = "unavailable";
    checks.contact = {
      ok: false,
      detail: "Set BLOB_READ_WRITE_TOKEN and/or RESEND_API_KEY",
    };
  }

  if (isTurnstileConfigured()) {
    services.turnstile = "operational";
    checks.turnstile = { ok: true, detail: "Site + secret keys configured" };
  } else {
    services.turnstile = "not_configured";
    checks.turnstile = { ok: false, detail: "Optional bot protection not enabled" };
  }

  if (isStripeCheckoutConfigured()) {
    services.stripe = isStripeConfigured() ? "operational" : "degraded";
    checks.stripe = {
      ok: isStripeConfigured(),
      detail: isStripeConfigured()
        ? "Checkout + webhook secrets configured"
        : "Checkout prices set; STRIPE_WEBHOOK_SECRET missing",
    };
  } else {
    services.stripe = "not_configured";
    checks.stripe = { ok: false, detail: "Optional per-seat billing not enabled" };
  }

  checks.rateLimit = {
    ok: isDistributedRateLimitConfigured(),
    detail: isDistributedRateLimitConfigured()
      ? process.env.KV_REST_API_URL
        ? "Vercel KV / Upstash active"
        : "Upstash Redis active"
      : "In-memory fallback (resets on cold start)",
  };

  const criticalDown =
    services.mailchimp === "unavailable" || services.contact === "unavailable";

  const status: HealthReport["status"] = criticalDown
    ? "degraded"
    : services.rateLimit === "degraded" || services.turnstile === "not_configured"
      ? "degraded"
      : "operational";

  return {
    status,
    scope: "marketing-site",
    timestamp: new Date().toISOString(),
    deployment: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    services,
    checks,
    _meta: {
      note: "geck0.ai marketing landing only. Product app status: app.geck0.ai",
      uptimeSec,
      rateLimitBackend: isDistributedRateLimitConfigured() ? "upstash" : "memory",
    },
  };
}
