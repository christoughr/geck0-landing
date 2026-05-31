import { getServerLocale } from "@/lib/locale-server";
import { translations } from "@/lib/i18n/translations";

export default async function FaqSchemaServer() {
  const locale = await getServerLocale();
  const items = translations[locale].faq.items;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
