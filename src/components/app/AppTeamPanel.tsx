"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/translations";
import AppPageHeader from "@/components/app/AppPageHeader";

type Member = { email: string; role: string; joinedAt: string };

export default function AppTeamPanel({ locale }: { locale: Locale }) {
  const ko = locale === "ko";
  const [members, setMembers] = useState<Member[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [invite, setInvite] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/app/team");
    if (res.ok) {
      const data = (await res.json()) as { members: Member[]; role: string };
      setMembers(data.members);
      setRole(data.role);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sendInvite = async () => {
    setMessage("");
    const res = await fetch("/api/app/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "invite", email: invite }),
    });
    const data = await res.json();
    if (res.ok) {
      setInvite("");
      setMessage(ko ? "팀원이 초대되었습니다." : "Member invited.");
      void load();
    } else {
      setMessage(data.error ?? "Failed");
    }
  };

  const canManage = role === "owner" || role === "admin";

  return (
    <div className="space-y-6">
      <AppPageHeader
        title={ko ? "팀" : "Team"}
        description={
          ko
            ? "워크스페이스 멤버를 초대하면 베타 목록 없이도 로그인할 수 있습니다."
            : "Invite members to your workspace — they can sign in without the global beta list."
        }
      />

      {canManage && (
        <section className="rounded-2xl border border-navy-600/40 bg-navy-800/30 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white">{ko ? "멤버 초대" : "Invite member"}</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={invite}
              onChange={(e) => setInvite(e.target.value)}
              placeholder="teammate@company.com"
              className="flex-1 min-h-[44px] bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 text-sm text-white"
            />
            <button
              type="button"
              disabled={!invite}
              onClick={() => void sendInvite()}
              className="px-5 py-2 rounded-lg bg-purple-400 hover:bg-purple-600 text-white text-sm font-medium disabled:opacity-50"
            >
              {ko ? "초대" : "Invite"}
            </button>
          </div>
        </section>
      )}

      <ul className="space-y-2">
        {members.map((m) => (
          <li
            key={m.email}
            className="flex items-center justify-between rounded-xl border border-navy-600/40 bg-navy-800/20 px-4 py-3"
          >
            <span className="text-sm text-white">{m.email}</span>
            <span className="text-[10px] uppercase text-white/40">{m.role}</span>
          </li>
        ))}
      </ul>

      {message && <p className="text-sm text-teal-300">{message}</p>}
    </div>
  );
}
