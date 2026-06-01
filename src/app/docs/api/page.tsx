import StaticPageView from "@/components/StaticPageView";
import OpenApiBanner from "@/components/OpenApiBanner";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({ path: "/docs/api", slug: "api" });
}

export default function ApiDocsPage() {
  return (
    <>
      <OpenApiBanner />
      <StaticPageView slug="api" />
    </>
  );
}
