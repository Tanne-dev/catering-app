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
  },
  {
    name: "KYCKLING PHO",
    price: "149,00 kr",
    description:
      "Lätt och aromatisk vietnamesisk nudelsoppa med kyckling och färska örter.",
    allergens: "gluten",
  },
  {
    name: "BUN BO HUE",
    price: "165,00 kr",
    description:
      "Vietnamesisk kryddstark nudelsoppa med rik och aromatisk buljong.",
    allergens: "gluten",
    image: "/dishes/dish-bun-cha.png",
  },
  {
    name: "PAD THAI",
    price: "155,00 kr",
    description:
      "Klassiska thailändska wokade nudlar med ägg, grönsaker och sötsur sås.",
    allergens: "jordnötter, ägg, gluten",
    image: "/dishes/dish-extra.png",
  },
  {
    name: "STEKTA RIS MED KYCKLING",
    price: "145,00 kr",
    description:
      "Asiatiskt wokat ris med kyckling och blandade grönsaker.",
    allergens: "ägg, soja",
  },
  {
    name: "VEGETARISK WOK",
    price: "139,00 kr",
    description:
      "Wokade grönsaker med asiatisk kryddning, lämplig för vegetarianer.",
    allergens: "soja",
    image: "/dishes/dish-poke-bowl.png",
  },
  {
    name: "ASIATISK GRYTA",
    price: "159,00 kr",
    description:
      "Långkokt gryta i asiatisk stil serverad med ris.",
    allergens: "soja, kan innehålla skaldjur",
  },
  {
    name: "SÖT & SUR RÄK",
    price: "169,00 kr",
    description:
      "Räkor wokade i sötsur sås, serveras med ris.",
    allergens: "skaldjur",
    image: "/dishes/dish-shrimp-avocado-rolls.png",
  },
  {
    name: "TERIYAKI LAX",
    price: "175,00 kr",
    description:
      "Stekt lax med teriyakisås, serveras med grönsaker och ris.",
    allergens: "fisk, soja",
    image: "/dishes/dish-salmon-platter.png",
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
