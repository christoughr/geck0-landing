import StaticPageView from "@/components/StaticPageView";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({ path: "/integrations", slug: "integrations" });
}

export default function IntegrationsPage() {
  return <StaticPageView slug="integrations" />;
}
