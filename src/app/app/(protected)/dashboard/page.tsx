import Link from "next/link";
import { getServerLocale } from "@/lib/locale-server";
import { demoKnowledgeDocs } from "@/lib/app-knowledge";

export default async function AppDashboardPage() {
  const locale = await getServerLocale();
  const ko = locale === "ko";

  const stats = [
    {
      label: ko ? "연결된 소스" : "Connected sources",
      value: "3",
      hint: ko ? "데모: Notion, Drive, Slack" : "Demo: Notion, Drive, Slack",
    },
    {
      label: ko ? "지식 문서" : "Knowledge docs",
      value: String(demoKnowledgeDocs.length),
      hint: ko ? "베타 샘플 데이터" : "Beta sample data",
    },
    {
      label: ko ? "이번 주 Q&A" : "Q&A this week",
      value: "—",
      hint: ko ? "첫 질문을 남겨 보세요" : "Ask your first question",
    },
  ];

  const quickLinks = [
    { href: "/app/qa", title: ko ? "Q&A 시작" : "Start Q&A", desc: ko ? "자연어로 회사 지식 검색" : "Search company knowledge" },
    { href: "/app/graph", title: ko ? "Knowledge Graph" : "Knowledge Graph", desc: ko ? "문서·팀 관계 보기" : "See doc and team links" },
    { href: "/app/settings/integrations", title: ko ? "연동 설정" : "Integrations", desc: ko ? "Notion, Slack, Drive" : "Notion, Slack, Drive" },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">
          {ko ? "대시보드" : "Dashboard"}
        </h1>
        <p className="text-white/45 text-sm">
          {ko
            ? "베타 워크스페이스입니다. Q&A와 그래프는 데모 데이터로 동작합니다."
            : "Your beta workspace. Q&A and graph run on demo data for now."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-navy-600/40 bg-navy-800/30 p-4"
          >
            <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/35 mt-1">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white/70">{ko ? "빠른 이동" : "Quick links"}</h2>
        <div className="grid gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl border border-navy-600/40 bg-navy-800/20 px-4 py-3 hover:border-purple-400/30 transition-colors"
            >
              <span className="text-sm font-medium text-white">{link.title}</span>
              <span className="text-xs text-white/40">{link.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/30 border border-dashed border-navy-600/40 rounded-lg p-3">
        {ko
          ? "결제(토스)는 제품 베타 안정화 후 연동 예정입니다."
          : "Toss Payments billing will ship after this beta stabilizes."}
      </p>
    </div>
  );
}
