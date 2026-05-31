import { getAllPosts } from "@/lib/blog";
import PageShell from "@/components/PageShell";
import BlogList from "@/components/BlogList";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <PageShell>
      <BlogList posts={posts} />
    </PageShell>
  );
}
