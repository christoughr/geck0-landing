import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/enterprise",
    title: {
      ko: "Enterprise — geck0",
      en: "Enterprise — geck0",
    },
    description: {
      ko: "대규모 조직을 위한 geck0 Enterprise. SSO, VPC, 커스텀 AI.",
      en: "geck0 Enterprise for large organizations. SSO, VPC, custom AI.",
    },
  });
}

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
