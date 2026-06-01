import Link from "next/link";
import { getServerLocale } from "@/lib/locale-server";
import { demoKnowledgeDocs } from "@/lib/app-knowledge";
import AppPageFrame from "@/components/app/AppPageFrame";
import AppPageHeader from "@/components/app/AppPageHeader";

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
      hint: ko ? "Q&A에서 첫 질문을 남겨 보세요" : "Ask your first question in Q&A",
    },
  ];

  const quickLinks = [
    {
      href: "/app/qa",
      title: ko ? "Q&A" : "Q&A",
      desc: ko ? "자연어로 회사 지식 검색" : "Search company knowledge",
      accent: true,
    },
    {
      href: "/app/graph",
      title: "Knowledge Graph",
      desc: ko ? "문서·팀 관계 보기" : "See doc and team links",
    },
    {
      href: "/app/insights",
      title: "Insights",
      desc: ko ? "Insight Pulse 미리보기" : "Insight Pulse preview",
    },
    {
      href: "/app/settings/integrations",
      title: ko ? "연동" : "Integrations",
      desc: ko ? "Notion, Slack, Drive" : "Notion, Slack, Drive",
    },
  ];

  return (
    <AppPageFrame wide>
      <AppPageHeader
        title={ko ? "대시보드" : "Dashboard"}
        description={
          ko
            ? "베타 워크스페이스입니다. Q&A와 그래프는 데모 데이터로 동작합니다."
            : "Your beta workspace. Q&A and graph run on demo data for now."
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-navy-600/40 bg-navy-800/40 p-5"
          >
            <p className="text-[10px] uppercase tracking-wider text-white/35 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/40 mt-2">{s.hint}</p>
          </div>
        ))}
      </div>

      <Link
        href="/app/qa"
        className="block rounded-2xl border-2 border-purple-400/50 bg-gradient-to-r from-purple-400/20 to-purple-600/10 px-6 py-5 text-center hover:from-purple-400/30 hover:to-purple-600/20 transition-colors mb-8"
      >
        <span className="text-lg font-bold text-white">
          {ko ? "→ Q&A 시작하기" : "→ Start Q&A"}
        </span>
        <span className="block text-sm text-white/50 mt-2">
          {ko ? "예: Q1 고객 이탈 원인은?" : 'Try: "What drove Q1 churn?"'}
        </span>
      </Link>

      <h2 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">
        {ko ? "워크스페이스" : "Workspace"}
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-xl border px-4 py-4 transition-colors ${
              link.accent
                ? "border-purple-400/30 bg-purple-400/10 hover:bg-purple-400/15"
                : "border-navy-600/40 bg-navy-800/25 hover:border-purple-400/25"
            }`}
          >
            <span className="text-sm font-semibold text-white block">{link.title}</span>
            <span className="text-xs text-white/45 mt-1 block">{link.desc}</span>
          </Link>
        ))}
      </div>

      <p className="text-xs text-white/30 border border-dashed border-navy-600/40 rounded-xl p-4 mt-8">
        {ko
          ? "결제(토스)는 사업자 준비 후 연동 예정입니다. 문의: hello@geck0.ai"
          : "Toss billing ships after business registration. Questions: hello@geck0.ai"}
      </p>
    </AppPageFrame>
  );
}
