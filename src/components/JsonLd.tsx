import { CONTACT } from "@/data/contact";
import { SITE } from "@/data/site";

/**
 * JSON-LD för LocalBusiness (SEO). Renderas som script i head.
 */
export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    description: SITE.defaultDescription,
    url: SITE.url,
    telephone: CONTACT.phone.replace(/\s/g, ""),
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Skåne",
      addressCountry: "SE",
    },
    areaServed: ["Malmö", "Lund", "Skanör", "Höllviken", "Falsterbo"],
    priceRange: "$$",
    servingCuisine: ["Vietnamese", "Swedish", "Sushi", "Asian"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
