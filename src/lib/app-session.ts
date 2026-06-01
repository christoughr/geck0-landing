import { cookies } from "next/headers";
import { verifySessionToken, APP_SESSION_COOKIE } from "@/lib/app-auth";
import { prepareWorkspace } from "@/lib/knowledge";
import { ensureTeamOwner } from "@/lib/team";
import { workspaceIdFromEmail } from "@/lib/workspace";

export async function getAppSession(): Promise<{
  email: string;
  workspaceId: string;
} | null> {
  const token = cookies().get(APP_SESSION_COOKIE)?.value;
  const email = token ? verifySessionToken(token) : null;
  if (!email) return null;
  const workspaceId = workspaceIdFromEmail(email);
  await ensureTeamOwner(workspaceId, email);
  await prepareWorkspace(email);
  return { email, workspaceId };
}

export async function getAppSessionEmail(): Promise<string | null> {
  const s = await getAppSession();
  return s?.email ?? null;
}

export function workspaceIdForEmail(email: string): string {
  return workspaceIdFromEmail(email);
}
