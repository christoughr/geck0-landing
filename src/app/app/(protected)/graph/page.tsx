import { getServerLocale } from "@/lib/locale-server";
import { demoKnowledgeDocs } from "@/lib/app-knowledge";
import AppPageFrame from "@/components/app/AppPageFrame";
import AppPageHeader from "@/components/app/AppPageHeader";

const nodes = [
  { id: "team-product", label: "Product", x: 50, y: 22 },
  { id: "team-eng", label: "Engineering", x: 78, y: 42 },
  { id: "team-hr", label: "HR", x: 22, y: 48 },
  ...demoKnowledgeDocs.map((d, i) => ({
    id: d.id,
    label: d.title.length > 28 ? `${d.title.slice(0, 26)}…` : d.title,
    x: 28 + (i * 24) % 58,
    y: 72 + (i % 2) * 6,
  })),
];

const edges: [string, string][] = [
  ["team-product", "doc-churn-q1"],
  ["team-product", "doc-prd-a"],
  ["team-eng", "doc-prd-a"],
  ["team-hr", "doc-onboard"],
];

export default async function AppGraphPage() {
  const locale = await getServerLocale();
  const ko = locale === "ko";
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <AppPageFrame wide>
      <AppPageHeader
        title="Knowledge Graph"
        description={
          ko
            ? "팀·문서 관계 미리보기(데모). 실제 연동 후 동기화됩니다."
            : "Preview of team and document links (demo). Syncs after connectors ship."
        }
      />

      <div className="relative rounded-2xl border border-navy-600/40 bg-navy-950/60 w-full min-h-[min(55vh,520px)] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {edges.map(([a, b]) => {
            const from = byId[a];
            const to = byId[b];
            if (!from || !to) return null;
            return (
              <line
                key={`${a}-${b}`}
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
                r={n.id.startsWith("team") ? 2.8 : 2.2}
                fill="rgba(139,92,246,0.65)"
              />
              <text
                x={n.x}
                y={n.y + (n.id.startsWith("team") ? 5.5 : 4.5)}
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
        {demoKnowledgeDocs.map((d) => (
          <li
            key={d.id}
            className="rounded-lg border border-navy-700/40 bg-navy-800/30 px-3 py-2"
          >
            <span className="text-purple-300/90 font-medium block truncate">{d.title}</span>
            <span className="text-white/30 text-[11px]">{d.source}</span>
          </li>
        ))}
      </ul>
    </AppPageFrame>
  );
}
