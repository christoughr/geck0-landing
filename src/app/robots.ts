import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const isPreview =
  process.env.VERCEL_ENV === "preview" ||
  process.env.VERCEL_URL?.includes("vercel.app");

export default function robots(): MetadataRoute.Robots {
  if (isPreview) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: getSiteUrl("/sitemap.xml"),
  };
}
