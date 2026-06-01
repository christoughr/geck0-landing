import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n/translations";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
}

function parseFilename(filename: string): { slug: string; locale: Locale } | null {
  const localized = filename.match(/^(.+)\.(ko|en)\.mdx$/);
  if (localized) {
    return { slug: localized[1], locale: localized[2] as Locale };
  }

  const legacy = filename.match(/^(.+)\.mdx$/);
  if (legacy) {
    return { slug: legacy[1], locale: "ko" };
  }

  return null;
}

function readPostFile(slug: string, locale: Locale): BlogPost | null {
  const candidates = [
    path.join(BLOG_DIR, `${slug}.${locale}.mdx`),
    ...(locale === "ko" ? [path.join(BLOG_DIR, `${slug}.mdx`)] : []),
  ];

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      locale: (data.locale as Locale) ?? locale,
      title: data.title as string,
      excerpt: data.excerpt as string,
      date: data.date as string,
      author: data.author as string,
      tags: (data.tags as string[]) ?? [],
      content,
    };
  }

  return null;
}

export function getAllPosts(locale: Locale = "ko"): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const bySlug = new Map<string, BlogPost>();

  for (const filename of fs.readdirSync(BLOG_DIR)) {
    const parsed = parseFilename(filename);
    if (!parsed) continue;

    const post = readPostFile(parsed.slug, parsed.locale);
    if (!post) continue;

    bySlug.set(`${post.locale}:${post.slug}`, post);
  }

  return Array.from(bySlug.values())
    .filter((post) => post.locale === locale)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string, locale: Locale = "ko"): BlogPost | null {
  return readPostFile(slug, locale);
}

export function getAlternateSlug(slug: string, locale: Locale): string | null {
  const other: Locale = locale === "ko" ? "en" : "ko";
  return getPostBySlug(slug, other) ? slug : null;
}
