"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Reveal from "./Reveal";
import WaitlistForm from "./WaitlistForm";

interface BlogPostPreview {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
}

export default function BlogList({ posts }: { posts: BlogPostPreview[] }) {
  const { t } = useI18n();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Reveal className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          {t.blog.title}
        </h1>
        <p className="text-white/50 text-lg">{t.blog.subtitle}</p>
      </Reveal>

      <div className="space-y-6">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.1}>
            <Link
              href={`/blog/${post.slug}`}
              className="block bg-navy-800/60 border border-navy-600/30 rounded-2xl p-6 hover:border-purple-400/40 transition-colors group"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-purple-900/30 text-purple-300 px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-white/55 text-sm leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white/30 text-xs">
                  {post.author} · {post.date}
                </span>
                <span className="text-purple-400 text-sm font-medium">
                  {t.blog.readMore}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-16 pt-12 border-t border-navy-600/30 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{t.blog.waitlistTitle}</h2>
        <p className="text-white/50 text-sm mb-6">{t.blog.waitlistSub}</p>
        <WaitlistForm source="blog" variant="inline" className="max-w-md mx-auto" />
      </Reveal>
    </div>
  );
}
