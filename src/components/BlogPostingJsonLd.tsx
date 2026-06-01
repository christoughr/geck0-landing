import { getSiteUrl } from "@/lib/site";

interface BlogPostingJsonLdProps {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
}

export default function BlogPostingJsonLd({
  title,
  description,
  slug,
  date,
  author,
}: BlogPostingJsonLdProps) {
  const url = getSiteUrl(`/blog/${slug}`);
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: "geck0",
      url: getSiteUrl(),
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
