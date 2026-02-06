/**
 * Site-wide config: namn, URL, SEO. Ändra här för enkel underhåll.
 */
export const SITE = {
  name: "Catering Tanne",
  shortName: "Catering Tanne",
  /** Canonical webbadress (utan avslutande /) */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cateringtanne.se",
  defaultTitle: "Catering Tanne – Vietnamesisk & svensk catering",
  defaultDescription:
    "Autentisk vietnamesisk och svensk catering för dina evenemang. Cateringleverans, menyer och professionell service. Beställ offert idag.",
  locale: "sv_SE",
  keywords: [
    "catering",
    "vietnamesisk catering",
    "svensk catering",
    "sushi catering",
    "cateringleverans",
    "Malmö",
    "Lund",
    "Skanör",
    "Höllviken",
    "Falsterbo",
  ],
} as const;
