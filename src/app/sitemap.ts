import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site";

const staticPages = [
  "/",
  "/pricing",
  "/enterprise",
  "/blog",
  "/about",
  "/careers",
  "/press",
  "/support",
  "/status",
  "/integrations",
  "/docs",
  "/docs/api",
  "/privacy",
  "/terms",
  "/cookies",
];

/** Evaluated once per build — avoids shifting lastModified on every sitemap request */
const STATIC_LAST_MODIFIED = new Date(
  process.env.VERCEL_GIT_COMMIT_DATE ?? "2026-05-31T00:00:00.000Z"
);

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    ...staticPages.map((path) => ({
      url: getSiteUrl(path === "/" ? "" : path),
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: path === "/" || path === "/blog" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/pricing" || path === "/enterprise" ? 0.8 : 0.6,
    })),
    ...posts.map((post) => ({
      url: getSiteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
