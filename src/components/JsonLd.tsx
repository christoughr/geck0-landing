import { getSiteUrl } from "@/lib/site";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "geck0",
        url: getSiteUrl(),
        logo: getSiteUrl("/og-image.png"),
        email: "hello@geck0.ai",
        description: "B2B AI knowledge management platform",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        name: "geck0",
        url: getSiteUrl(),
        potentialAction: {
          "@type": "SearchAction",
          target: `${getSiteUrl("/blog")}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "geck0",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "99000",
          priceCurrency: "KRW",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
