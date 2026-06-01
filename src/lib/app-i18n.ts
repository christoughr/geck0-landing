import type { Locale } from "@/lib/i18n/translations";

export function getAppStrings(locale: Locale) {
  const ko = locale === "ko";
  return {
    nav: {
      dashboard: ko ? "대시보드" : "Dashboard",
      graph: ko ? "Knowledge Graph" : "Knowledge Graph",
      qa: ko ? "Q&A" : "Q&A",
      insights: ko ? "Insights" : "Insights",
      integrations: ko ? "연동" : "Integrations",
      team: ko ? "팀" : "Team",
      api: ko ? "API" : "API",
    },
    signOut: ko ? "로그아웃" : "Sign out",
    backToMarketing: ko ? "geck0.ai" : "geck0.ai",
    beta: "Beta",
  };
}

export type AppNavKey =
  | "dashboard"
  | "graph"
  | "qa"
  | "insights"
  | "integrations"
  | "team"
  | "api";

export const appNavItems: { key: AppNavKey; href: string }[] = [
  { key: "dashboard", href: "/app/dashboard" },
  { key: "graph", href: "/app/graph" },
  { key: "qa", href: "/app/qa" },
  { key: "insights", href: "/app/insights" },
  { key: "integrations", href: "/app/settings/integrations" },
  { key: "team", href: "/app/settings/team" },
  { key: "api", href: "/app/settings/api" },
];
