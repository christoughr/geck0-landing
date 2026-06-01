import { getServerLocale } from "@/lib/locale-server";

const connectors = [
  { id: "notion", name: "Notion", status: "demo" as const },
  { id: "slack", name: "Slack", status: "demo" as const },
  { id: "drive", name: "Google Drive", status: "demo" as const },
  { id: "jira", name: "Jira", status: "soon" as const },
];

export default async function AppIntegrationsPage() {
  const locale = await getServerLocale();
  const ko = locale === "ko";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">{ko ? "연동" : "Integrations"}</h1>
        <p className="text-white/45 text-sm">
          {ko
            ? "OAuth 연동은 다음 스프린트에 추가됩니다. 지금은 데모 소스로 Q&A가 동작합니다."
            : "OAuth connectors ship next sprint. Q&A uses demo sources for now."}
        </p>
      </div>

      <ul className="space-y-2">
        {connectors.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-navy-600/40 bg-navy-800/20 px-4 py-3"
          >
            <span className="text-sm text-white font-medium">{c.name}</span>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                c.status === "demo"
                  ? "border-teal-500/30 text-teal-300/90 bg-teal-900/20"
                  : "border-white/10 text-white/35 bg-navy-800/50"
              }`}
            >
              {c.status === "demo"
                ? ko
                  ? "데모 연결됨"
                  : "Demo linked"
                : ko
                  ? "준비 중"
                  : "Coming soon"}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-white/30">
        {ko
          ? "연동 요청: hello@geck0.ai"
          : "Request a connector: hello@geck0.ai"}
      </p>
    </div>
  );
}
