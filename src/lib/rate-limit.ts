import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const buckets = new Map<string, { count: number; resetAt: number }>();

type LimiterCache = Map<string, Ratelimit>;

let upstashLimiters: LimiterCache | null = null;

function getUpstashLimiter(limit: number, windowMs: number, prefix: string): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  if (!upstashLimiters) upstashLimiters = new Map();

  const key = `${prefix}:${limit}:${windowMs}`;
  const cached = upstashLimiters.get(key);
  if (cached) return cached;

  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    prefix: `geck0:${prefix}`,
    analytics: true,
  });

  upstashLimiters.set(key, limiter);
  return limiter;
}

function rateLimitMemory(
  key: string,
  limit = 10,
  windowMs = 60_000
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count };
}

export async function rateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): Promise<{ ok: boolean; remaining: number; backend: "upstash" | "memory" }> {
  const prefix = key.split(":")[0] ?? "api";
  const upstash = getUpstashLimiter(limit, windowMs, prefix);

  if (upstash) {
    try {
      const result = await upstash.limit(key);
      return {
        ok: result.success,
        remaining: result.remaining,
        backend: "upstash",
      };
    } catch (err) {
      console.error("[rate-limit:upstash]", err);
    }
  }

  const memory = rateLimitMemory(key, limit, windowMs);
  return { ...memory, backend: "memory" };
}

export function isDistributedRateLimitConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
