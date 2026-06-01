import Link from "next/link";
import { getServerLocale } from "@/lib/locale-server";
import AppPageFrame from "@/components/app/AppPageFrame";
import AppPageHeader from "@/components/app/AppPageHeader";

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
    <AppPageFrame>
      <AppPageHeader
        title={ko ? "연동" : "Integrations"}
        description={
          ko
            ? "OAuth 연동은 다음 스프린트에 추가됩니다. 지금은 데모 소스로 Q&A가 동작합니다."
            : "OAuth connectors ship next sprint. Q&A uses demo sources for now."
        }
      />

      <ul className="grid sm:grid-cols-2 gap-3">
        {connectors.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-navy-600/40 bg-navy-800/30 px-4 py-4"
          >
            <span className="text-sm text-white font-medium">{c.name}</span>
            <span
              className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
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

      <p className="text-sm text-white/40 mt-8">
        {ko ? "연동 요청 · 피드백: " : "Connector requests · feedback: "}
        <Link href="mailto:hello@geck0.ai" className="text-purple-400 hover:text-purple-300">
          hello@geck0.ai
        </Link>
        {" · "}
        <Link href="https://geck0.ai/support" className="text-purple-400 hover:text-purple-300">
          {ko ? "지원 페이지" : "Support"}
        </Link>
      </p>
    </AppPageFrame>
  );
}
