export type AsiatiskMenuItem = {
  name: string;
  price: string;
  description: string;
  allergens?: string;
  /** Bild på rätten (sökväg i public), t.ex. /dishes/dish-bun-cha.png */
  image?: string;
};

export const ASIATISK_MENU_TITLE = "ASIATISK MENY";

export const ASIATISK_MENU_ITEMS: AsiatiskMenuItem[] = [
  {
    name: "TRADITIONELL BEEF PHO",
    price: "159,00 kr",
    description:
      "Vietnamesisk risnudelsoppa med långkokt nötbuljong, möra nötstrimlor och färska örter.",
    allergens: "gluten (kan tillagas utan nudlar på begäran)",
    image: "/dishes/dish-pho-beef.png",
  },
  {
    name: "KYCKLING PHO",
    price: "149,00 kr",
    description:
      "Lätt och aromatisk vietnamesisk nudelsoppa med kyckling och färska örter.",
    allergens: "gluten",
    image: "/dishes/dish-pho-ga.png",
  },
  {
    name: "PAD THAI",
    price: "155,00 kr",
    description:
      "Klassiska thailändska wokade nudlar med ägg, grönsaker och sötsur sås.",
    allergens: "jordnötter, ägg, gluten",
    image: "/dishes/dish-pad-thai.png",
  },
  {
    name: "STEKTA RIS MED KYCKLING",
    price: "145,00 kr",
    description:
      "Asiatiskt wokat ris med kyckling och blandade grönsaker.",
    allergens: "ägg, soja",
    image: "/dishes/dish-stekta-ris-kyckling.png",
  },
  {
    name: "OXGRYTA I RÖDVIN",
    price: "159,00 kr",
    description:
      "Långkokt oxgryta i rödvinssås, serveras med ris eller potatis.",
    allergens: "gluten, alkohol (rödvin)",
    image: "/dishes/dish-oxgryta-rodvin.png",
  },
  {
    name: "TERIYAKI LAX",
    price: "175,00 kr",
    description:
      "Stekt lax med teriyakisås, serveras med grönsaker och ris.",
    allergens: "fisk, soja",
    image: "/dishes/dish-teriyaki-lax.png",
  },
  {
    name: "BARNMENY – STEKT RIS",
    price: "95,00 kr",
    description:
      "Enkelt stekt ris med mild smak, lämplig för barn.",
    allergens: "ägg",
  },
];

export const ASIATISK_MENU_FOOTER =
  "Meddela gärna vår personal om ni har allergier eller särskilda kostbehov. Vi hjälper er gärna.";
