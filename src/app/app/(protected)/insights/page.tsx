import { getServerLocale } from "@/lib/locale-server";

export default async function AppInsightsPage() {
  const locale = await getServerLocale();
  const ko = locale === "ko";

  const pulses = [
    {
      title: ko ? "온보딩 지연 패턴" : "Onboarding delay pattern",
      detail: ko ? "이탈 사례의 42%에서 반복" : "Repeated in 42% of churn cases",
      severity: "high",
    },
    {
      title: ko ? "API 지연 스파이크" : "API latency spikes",
      detail: ko ? "이탈 상관 31%" : "31% correlation with churn",
      severity: "medium",
    },
    {
      title: ko ? "PRD 결정 미배정" : "Unassigned PRD decisions",
      detail: ko ? "프로젝트 A · 2건" : "Project A · 2 items",
      severity: "low",
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Insight Pulse</h1>
        <p className="text-white/45 text-sm">
          {ko
            ? "베타 미리보기 — 실제 인사이트는 문서 동기화 후 생성됩니다."
            : "Beta preview — real insights generate after your docs sync."}
        </p>
      </div>

      <div className="space-y-3">
        {pulses.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-navy-600/40 bg-navy-800/30 px-4 py-3 flex gap-3 items-start"
          >
            <span
              className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                p.severity === "high"
                  ? "bg-coral-400"
                  : p.severity === "medium"
                    ? "bg-amber-400"
                    : "bg-teal-400"
              }`}
            />
            <div>
              <p className="text-sm font-medium text-white">{p.title}</p>
              <p className="text-xs text-white/40 mt-0.5">{p.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
