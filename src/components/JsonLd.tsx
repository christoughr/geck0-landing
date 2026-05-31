import { getSiteUrl, getLogoUrl } from "@/lib/site";
import { siteConfig } from "@/config/site";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "geck0",
        url: getSiteUrl(),
        logo: {
          "@type": "ImageObject",
          url: getLogoUrl(),
          width: 32,
          height: 32,
        },
        email: siteConfig.email,
        description: "B2B AI knowledge management platform",
        sameAs: [
          `https://twitter.com/${siteConfig.twitter.replace("@", "")}`,
          siteConfig.linkedin,
        ],
      },
      {
        "@type": "WebSite",
        name: "geck0",
        url: getSiteUrl(),
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
