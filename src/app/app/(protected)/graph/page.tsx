import { getAppSession } from "@/lib/app-session";
import { getServerLocale } from "@/lib/locale-server";
import { buildKnowledgeGraph } from "@/lib/knowledge/graph";
import { listDocuments } from "@/lib/knowledge/store";
import AppPageFrame from "@/components/app/AppPageFrame";
import AppPageHeader from "@/components/app/AppPageHeader";

export default async function AppGraphPage() {
  const session = await getAppSession();
  if (!session) return null;

  const locale = await getServerLocale();
  const ko = locale === "ko";
  const { nodes, edges } = await buildKnowledgeGraph(session.workspaceId);
  const docs = await listDocuments(session.workspaceId);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <AppPageFrame wide>
      <AppPageHeader
        title="Knowledge Graph"
        description={
          ko
            ? `워크스페이스 문서 ${docs.length}개 기준으로 팀·태그 관계를 표시합니다.`
            : `Team and tag relationships from ${docs.length} indexed documents.`
        }
      />

      <div className="relative rounded-2xl border border-navy-600/40 bg-navy-950/60 w-full min-h-[min(55vh,520px)] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {edges.map((e) => {
            const from = byId[e.from];
            const to = byId[e.to];
            if (!from || !to) return null;
            return (
              <line
                key={`${e.from}-${e.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgba(167,139,250,0.35)"
                strokeWidth="0.35"
              />
            );
          })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={n.type === "team" ? 2.8 : 2.2}
                fill={n.type === "team" ? "rgba(45,212,191,0.7)" : "rgba(139,92,246,0.65)"}
              />
              <text
                x={n.x}
                y={n.y + (n.type === "team" ? 5.5 : 4.5)}
                textAnchor="middle"
                fill="rgba(255,255,255,0.55)"
                fontSize="2.4"
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-6 text-xs sm:text-sm text-white/45">
        {docs.map((d) => (
          <li key={d.id} className="rounded-lg border border-navy-700/40 bg-navy-800/30 px-3 py-2">
            <span className="text-purple-300/90 font-medium block truncate">{d.title}</span>
            <span className="text-white/30 text-[11px]">{d.source}</span>
          </li>
        ))}
      </ul>
    </AppPageFrame>
  );
}
