import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getAlternateSlug, getPostBySlug } from "@/lib/blog";
import { getSiteUrl, getOgImageUrl } from "@/lib/site";
import { getServerLocale } from "@/lib/locale-server";
import PageShell from "@/components/PageShell";
import MarkdownContent from "@/components/MarkdownContent";
import BlogPostBack from "@/components/BlogPostBack";
import BlogPostingJsonLd from "@/components/BlogPostingJsonLd";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const locale of ["ko", "en"] as const) {
    for (const post of getAllPosts(locale)) {
      slugs.add(post.slug);
    }
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getServerLocale();
  const post = getPostBySlug(params.slug, locale);
  if (!post) return { title: "Not found" };

  const url = getSiteUrl(`/blog/${params.slug}`);
  const alternate = getAlternateSlug(params.slug, locale);

  return {
    title: `${post.title} — geck0 Blog`,
    description: post.excerpt,
    alternates: {
      canonical: url,
      languages: alternate
        ? {
            ko: getSiteUrl(`/blog/${params.slug}`),
            en: getSiteUrl(`/blog/${params.slug}`),
          }
        : undefined,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      images: [{ url: getOgImageUrl(), width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const locale = await getServerLocale();
  const post = getPostBySlug(params.slug, locale);
  if (!post) notFound();

  return (
    <PageShell>
      <BlogPostingJsonLd
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        date={post.date}
        author={post.author}
      />
      <article className="max-w-2xl mx-auto px-6 py-16">
        <BlogPostBack />

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-purple-900/30 text-purple-300 px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>

        <p className="text-white/40 text-sm mb-10">
          {post.author} · {post.date}
        </p>

        <MarkdownContent content={post.content} />
      </article>
    </PageShell>
  );
}
