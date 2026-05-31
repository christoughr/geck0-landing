import StatusLive from "@/components/StatusLive";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/status",
    title: { ko: "시스템 상태 — geck0", en: "System Status — geck0" },
    description: {
      ko: "geck0 서비스 상태 및 업타임",
      en: "geck0 service status and uptime",
    },
  });
}

export default function StatusPage() {
  return <StatusLive />;
}
