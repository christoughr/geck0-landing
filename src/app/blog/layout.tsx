import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/blog",
    title: { ko: "블로그 — geck0", en: "Blog — geck0" },
    description: {
      ko: "지식 관리, AI, 조직 성장에 관한 인사이트",
      en: "Insights on knowledge management, AI, and organizational growth",
    },
  });
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
