import { getAppSession } from "@/lib/app-session";
import { getServerLocale } from "@/lib/locale-server";
import { buildInsights } from "@/lib/knowledge/insights";
import AppPageFrame from "@/components/app/AppPageFrame";
import AppPageHeader from "@/components/app/AppPageHeader";

export default async function AppInsightsPage() {
  const session = await getAppSession();
  if (!session) return null;

  const locale = await getServerLocale();
  const ko = locale === "ko";
  const pulses = await buildInsights(session.workspaceId, locale);

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
            ? "인덱싱된 문서 내용에서 규칙 기반으로 패턴을 감지합니다."
            : "Rule-based patterns detected from your indexed documents."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pulses.map((p) => (
          <div
            key={p.id}
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
