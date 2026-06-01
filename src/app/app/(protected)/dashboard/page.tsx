import Link from "next/link";
import { getAppSession } from "@/lib/app-session";
import { getServerLocale } from "@/lib/locale-server";
import { displayWorkspaceName } from "@/lib/workspace";
import { listDocuments, getQaHistory, refreshConnectorCounts } from "@/lib/knowledge/store";
import AppPageFrame from "@/components/app/AppPageFrame";
import AppPageHeader from "@/components/app/AppPageHeader";

export default async function AppDashboardPage() {
  const session = await getAppSession();
  if (!session) return null;

  const locale = await getServerLocale();
  const ko = locale === "ko";

  const docs = await listDocuments(session.workspaceId);
  const history = await getQaHistory(session.workspaceId);
  const connectors = await refreshConnectorCounts(session.workspaceId);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const stats = {
    documents: docs.length,
    qaThisWeek: history.filter((h) => new Date(h.createdAt).getTime() > weekAgo).length,
    connectedSources: connectors.filter((c) => c.status === "connected").length,
  };

  const statCards = [
    {
      label: ko ? "연결된 소스" : "Connected sources",
      value: String(stats.connectedSources),
      hint: ko ? "Notion · Upload 등" : "Notion · Upload, etc.",
    },
    {
      label: ko ? "지식 문서" : "Knowledge docs",
      value: String(stats.documents),
      hint: displayWorkspaceName(session.email),
    },
    {
      label: ko ? "이번 주 Q&A" : "Q&A this week",
      value: String(stats.qaThisWeek),
      hint: ko ? "질문 기록 저장됨" : "Questions saved in history",
    },
  ];

  const quickLinks = [
    { href: "/app/qa", title: "Q&A", desc: ko ? "RAG 검색 + AI 답변" : "RAG search + AI answers", accent: true },
    { href: "/app/graph", title: "Knowledge Graph", desc: ko ? "팀·문서 관계" : "Team & doc links" },
    { href: "/app/insights", title: "Insights", desc: ko ? "자동 인사이트" : "Auto insights" },
    { href: "/app/settings/integrations", title: ko ? "연동" : "Integrations", desc: ko ? "Notion · 업로드" : "Notion · upload" },
  ];

  return (
    <AppPageFrame wide>
      <AppPageHeader
        title={ko ? "대시보드" : "Dashboard"}
        description={
          ko
            ? `${displayWorkspaceName(session.email)} 워크스페이스 — KV 지식 베이스 + 검색 + (선택) OpenAI.`
            : `${displayWorkspaceName(session.email)} workspace — live knowledge index + search + optional OpenAI.`
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-navy-600/40 bg-navy-800/40 p-5">
            <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/40 mt-2">{s.hint}</p>
          </div>
        ))}
      </div>

      <Link
        href="/app/qa"
        className="block rounded-2xl border-2 border-purple-400/50 bg-gradient-to-r from-purple-400/20 to-purple-600/10 px-6 py-5 text-center hover:from-purple-400/30 transition-colors mb-8"
      >
        <span className="text-lg font-bold text-white">{ko ? "→ Q&A 시작하기" : "→ Start Q&A"}</span>
      </Link>

      <div className="grid sm:grid-cols-2 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-xl border px-4 py-4 hover:border-purple-400/30 transition-colors ${
              link.accent
                ? "border-purple-400/30 bg-purple-400/10"
                : "border-navy-600/40 bg-navy-800/25"
            }`}
          >
            <span className="text-sm font-semibold text-white block">{link.title}</span>
            <span className="text-xs text-white/45 mt-1 block">{link.desc}</span>
          </Link>
        ))}
      </div>
    </AppPageFrame>
  );
}
