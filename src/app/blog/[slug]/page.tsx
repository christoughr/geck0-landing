import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import PageShell from "@/components/PageShell";
import MarkdownContent from "@/components/MarkdownContent";
import BlogPostBack from "@/components/BlogPostBack";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Not found" };
  return { title: `${post.title} — geck0 Blog`, description: post.excerpt };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <PageShell>
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

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {post.title}
        </h1>

        <p className="text-white/40 text-sm mb-10">
          {post.author} · {post.date}
        </p>

        <MarkdownContent content={post.content} />
      </article>
    </PageShell>
  );
}
