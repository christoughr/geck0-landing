import { getServerLocale } from "@/lib/locale-server";
import { demoKnowledgeDocs } from "@/lib/app-knowledge";

const nodes = [
  { id: "team-product", label: "Product", x: 50, y: 28 },
  { id: "team-eng", label: "Engineering", x: 78, y: 45 },
  { id: "team-hr", label: "HR", x: 22, y: 55 },
  ...demoKnowledgeDocs.map((d, i) => ({
    id: d.id,
    label: d.title.length > 22 ? `${d.title.slice(0, 20)}…` : d.title,
    x: 30 + (i * 22) % 55,
    y: 68 + (i % 2) * 8,
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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Knowledge Graph</h1>
        <p className="text-white/45 text-sm">
          {ko
            ? "팀·문서 관계 미리보기(데모). 실제 연동 후 동기화됩니다."
            : "Preview of team and document links (demo). Syncs after connectors ship."}
        </p>
      </div>

      <div className="relative rounded-xl border border-navy-600/40 bg-navy-950/50 aspect-[16/10] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
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
                stroke="rgba(167,139,250,0.25)"
                strokeWidth="0.4"
              />
            );
          })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={n.id.startsWith("team") ? 3.2 : 2.4} fill="rgba(139,92,246,0.5)" />
              <text
                x={n.x}
                y={n.y + (n.id.startsWith("team") ? 6 : 5)}
                textAnchor="middle"
                fill="rgba(255,255,255,0.45)"
                fontSize="2.8"
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <ul className="text-xs text-white/40 space-y-1">
        {demoKnowledgeDocs.map((d) => (
          <li key={d.id}>
            <span className="text-purple-300/80">{d.title}</span> — {d.source}
          </li>
        ))}
      </ul>
    </div>
  );
}
