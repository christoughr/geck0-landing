import { NextRequest } from "next/server";
import { resolveApiKey } from "@/lib/api-keys";
import { prepareWorkspace } from "@/lib/knowledge";

export async function authenticatePublicApi(
  request: NextRequest
): Promise<{ workspaceId: string; keyId: string } | null> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const key = auth.slice(7).trim();
  const resolved = await resolveApiKey(key);
  if (!resolved) return null;
  return resolved;
}

export async function ensurePublicWorkspace(workspaceId: string): Promise<void> {
  await prepareWorkspace(`api@${workspaceId}.internal`);
}
