import { getServerLocale } from "@/lib/locale-server";
import AppPageFrame from "@/components/app/AppPageFrame";
import AppPageHeader from "@/components/app/AppPageHeader";

export default async function AppInsightsPage() {
  const locale = await getServerLocale();
  const ko = locale === "ko";

  const pulses = [
    {
      title: ko ? "온보딩 지연 패턴" : "Onboarding delay pattern",
      detail: ko ? "이탈 사례의 42%에서 반복" : "Repeated in 42% of churn cases",
      severity: "high" as const,
    },
    {
      title: ko ? "API 지연 스파이크" : "API latency spikes",
      detail: ko ? "이탈 상관 31%" : "31% correlation with churn",
      severity: "medium" as const,
    },
    {
      title: ko ? "PRD 결정 미배정" : "Unassigned PRD decisions",
      detail: ko ? "프로젝트 A · 2건" : "Project A · 2 items",
      severity: "low" as const,
    },
  ];

  const severityColor = {
    high: "bg-coral-400",
    medium: "bg-amber-400",
    low: "bg-teal-400",
  };

  return (
    <AppPageFrame>
      <AppPageHeader
        title="Insight Pulse"
        description={
          ko
            ? "베타 미리보기 — 실제 인사이트는 문서 동기화 후 생성됩니다."
            : "Beta preview — real insights generate after your docs sync."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pulses.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-navy-600/40 bg-navy-800/35 px-4 py-4 flex gap-3 items-start h-full"
          >
            <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${severityColor[p.severity]}`} />
            <div>
              <p className="text-sm font-semibold text-white">{p.title}</p>
              <p className="text-xs text-white/45 mt-1 leading-relaxed">{p.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </AppPageFrame>
  );
}
