import { Redis } from "@upstash/redis";

export type TossPendingCheckout = {
  plan: string;
  seats: number;
  email: string | null;
  orderId: string;
  amount: number;
  createdAt: string;
};

function getRedis(): Redis | null {
  try {
    if (!process.env.KV_REST_API_URL?.trim() && !process.env.UPSTASH_REDIS_REST_URL?.trim()) {
      return null;
    }
    return Redis.fromEnv();
  } catch {
    return null;
  }
}

export async function saveTossPending(
  customerKey: string,
  data: TossPendingCheckout
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  await redis.set(`toss:pending:${customerKey}`, data, { ex: 60 * 60 * 2 });
  return true;
}

export async function getTossPending(customerKey: string): Promise<TossPendingCheckout | null> {
  const redis = getRedis();
  if (!redis) return null;
  return redis.get<TossPendingCheckout>(`toss:pending:${customerKey}`);
}

export async function saveTossBillingRecord(record: {
  customerKey: string;
  billingKey: string;
  plan: string;
  seats: number;
  email: string | null;
  status: string;
  trialEnd: string | null;
}): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  await redis.set(
    `toss:billing:${record.customerKey}`,
    { ...record, updatedAt: new Date().toISOString() },
    { ex: 60 * 60 * 24 * 400 }
  );
  return true;
}
