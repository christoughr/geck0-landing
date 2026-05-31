import StaticPageView from "@/components/StaticPageView";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({ path: "/docs", slug: "docs" });
}

export default function DocsPage() {
  return <StaticPageView slug="docs" />;
}
