import { Redis } from "@upstash/redis";
import { workspaceIdFromEmail } from "@/lib/workspace";

export type TeamRole = "owner" | "admin" | "member";

export type TeamMember = {
  email: string;
  role: TeamRole;
  joinedAt: string;
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

function membersKey(workspaceId: string) {
  return `team:${workspaceId}:members`;
}

export async function listTeamMembers(workspaceId: string): Promise<TeamMember[]> {
  const r = redis();
  if (!r) return [];
  return (await r.get<TeamMember[]>(membersKey(workspaceId))) ?? [];
}

export async function ensureTeamOwner(workspaceId: string, email: string): Promise<void> {
  const r = redis();
  if (!r) return;
  const normalized = email.trim().toLowerCase();
  const key = membersKey(workspaceId);
  const existing = (await r.get<TeamMember[]>(key)) ?? [];
  if (existing.some((m) => m.email === normalized)) return;
  const member: TeamMember = {
    email: normalized,
    role: existing.length === 0 ? "owner" : "member",
    joinedAt: new Date().toISOString(),
  };
  await r.set(key, [...existing, member]);
}

export async function isTeamMember(workspaceId: string, email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const members = await listTeamMembers(workspaceId);
  return members.some((m) => m.email === normalized);
}

export async function isWorkspaceInvited(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const ws = workspaceIdFromEmail(normalized);
  return isTeamMember(ws, normalized);
}

export async function inviteTeamMember(
  workspaceId: string,
  inviterEmail: string,
  inviteEmail: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const r = redis();
  if (!r) return { ok: false, error: "Store unavailable" };

  const inviter = inviterEmail.trim().toLowerCase();
  const target = inviteEmail.trim().toLowerCase();
  if (!target.includes("@")) return { ok: false, error: "Invalid email" };

  const members = await listTeamMembers(workspaceId);
  const role = members.find((m) => m.email === inviter)?.role;
  if (role !== "owner" && role !== "admin") {
    return { ok: false, error: "Forbidden" };
  }
  if (members.some((m) => m.email === target)) {
    return { ok: false, error: "Already a member" };
  }

  await r.set(membersKey(workspaceId), [
    ...members,
    { email: target, role: "member", joinedAt: new Date().toISOString() },
  ]);
  return { ok: true };
}

export async function removeTeamMember(
  workspaceId: string,
  actorEmail: string,
  targetEmail: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const r = redis();
  if (!r) return { ok: false, error: "Store unavailable" };

  const actor = actorEmail.trim().toLowerCase();
  const target = targetEmail.trim().toLowerCase();
  const members = await listTeamMembers(workspaceId);
  const actorRole = members.find((m) => m.email === actor)?.role;
  if (actorRole !== "owner" && actorRole !== "admin") {
    return { ok: false, error: "Forbidden" };
  }
  const targetMember = members.find((m) => m.email === target);
  if (!targetMember) return { ok: false, error: "Not found" };
  if (targetMember.role === "owner") return { ok: false, error: "Cannot remove owner" };

  await r.set(
    membersKey(workspaceId),
    members.filter((m) => m.email !== target)
  );
  return { ok: true };
}

export async function getActorRole(
  workspaceId: string,
  email: string
): Promise<TeamRole | null> {
  const normalized = email.trim().toLowerCase();
  return listTeamMembers(workspaceId).then(
    (m) => m.find((x) => x.email === normalized)?.role ?? null
  );
}
