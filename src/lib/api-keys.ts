import { createHash, randomBytes } from "crypto";
import { Redis } from "@upstash/redis";

export type ApiKeyRecord = {
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
  createdBy: string;
};

function redis(): Redis | null {
  try {
    if (!process.env.KV_REST_API_URL?.trim() && !process.env.UPSTASH_REDIS_REST_URL?.trim()) {
      return null;
    }
    return Redis.fromEnv();
  } catch {
    return null;
  }
}

function indexKey(workspaceId: string) {
  return `apikeys:${workspaceId}:index`;
}

function hashKey(hash: string) {
  return `apikey:hash:${hash}`;
}

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const raw = randomBytes(24).toString("base64url");
  const key = `gk_${raw}`;
  const prefix = key.slice(0, 12);
  const hash = createHash("sha256").update(key).digest("hex");
  return { key, prefix, hash };
}

export async function createWorkspaceApiKey(
  workspaceId: string,
  createdBy: string,
  label: string
): Promise<{ key: string; record: ApiKeyRecord } | null> {
  const r = redis();
  if (!r) return null;

  const { key, prefix, hash } = generateApiKey();
  const id = `key_${Date.now()}`;
  const record: ApiKeyRecord = {
    id,
    label: label.trim() || "API key",
    prefix,
    createdAt: new Date().toISOString(),
    createdBy: createdBy.trim().toLowerCase(),
  };

  await r.set(hashKey(hash), { workspaceId, id, label: record.label });
  const list = (await r.get<ApiKeyRecord[]>(indexKey(workspaceId))) ?? [];
  await r.set(indexKey(workspaceId), [...list, record]);
  return { key, record };
}

export async function listWorkspaceApiKeys(workspaceId: string): Promise<ApiKeyRecord[]> {
  const r = redis();
  if (!r) return [];
  return (await r.get<ApiKeyRecord[]>(indexKey(workspaceId))) ?? [];
}

export async function revokeWorkspaceApiKey(
  workspaceId: string,
  keyId: string
): Promise<boolean> {
  const r = redis();
  if (!r) return false;
  const list = (await r.get<ApiKeyRecord[]>(indexKey(workspaceId))) ?? [];
  const target = list.find((k) => k.id === keyId);
  if (!target) return false;
  await r.set(indexKey(workspaceId), list.filter((k) => k.id !== keyId));
  return true;
}

export async function resolveApiKey(
  bearer: string
): Promise<{ workspaceId: string; keyId: string } | null> {
  const r = redis();
  if (!r) return null;
  const key = bearer.trim();
  if (!key.startsWith("gk_")) return null;
  const hash = createHash("sha256").update(key).digest("hex");
  const data = await r.get<{ workspaceId: string; id: string }>(hashKey(hash));
  if (!data?.workspaceId) return null;
  return { workspaceId: data.workspaceId, keyId: data.id };
}
