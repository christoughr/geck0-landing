import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import PageShell from "@/components/PageShell";
import BlogList from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Blog — geck0",
  description: "지식 관리, AI, 조직 성장에 관한 인사이트",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <PageShell>
      <BlogList posts={posts} />
    </PageShell>
  );
}
