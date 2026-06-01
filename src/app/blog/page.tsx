import PageShell from "@/components/PageShell";
import BlogList from "@/components/BlogList";
import { getAllPosts } from "@/lib/blog";
import { getServerLocale } from "@/lib/locale-server";

export default async function BlogPage() {
  const locale = await getServerLocale();
  const posts = getAllPosts(locale);

  return (
    <PageShell>
      <BlogList posts={posts} />
    </PageShell>
  );
}
