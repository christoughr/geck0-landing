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

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();

  return [
    ...staticPages.map((path) => ({
      url: getSiteUrl(path === "/" ? "" : path),
      lastModified: now,
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
