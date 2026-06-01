import { Redis } from "@upstash/redis";

export interface StoredSubscription {
  customerId: string;
  subscriptionId: string;
  plan: string;
  seats: number;
  status: string;
  trialEnd: string | null;
  updatedAt: string;
}

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL?.trim() || !process.env.KV_REST_API_TOKEN?.trim()) {
    if (!process.env.UPSTASH_REDIS_REST_URL?.trim()) return null;
  }
  try {
    return Redis.fromEnv();
  } catch {
    return null;
  }
}

export async function saveSubscriptionRecord(
  record: StoredSubscription
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  await redis.set(`stripe:sub:${record.subscriptionId}`, record, {
    ex: 60 * 60 * 24 * 400,
  });

  if (record.customerId) {
    await redis.set(`stripe:customer:${record.customerId}`, record.subscriptionId, {
      ex: 60 * 60 * 24 * 400,
    });
  }

  return true;
}

export async function getSubscriptionById(
  subscriptionId: string
): Promise<StoredSubscription | null> {
  const redis = getRedis();
  if (!redis) return null;
  return redis.get<StoredSubscription>(`stripe:sub:${subscriptionId}`);
}
