import StaticPageView from "@/components/StaticPageView";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({ path: "/cookies", slug: "cookies" });
}

export default function CookiesPage() {
  return <StaticPageView slug="cookies" />;
}
