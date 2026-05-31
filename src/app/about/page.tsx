import StaticPageView from "@/components/StaticPageView";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata({ path: "/about", slug: "about" });
}

export default function AboutPage() {
  return <StaticPageView slug="about" />;
}
