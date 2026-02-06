export type AsiatiskMenuItem = {
  name: string;
  price: string;
  description: string;
  allergens?: string;
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
  },
  {
    name: "PAD THAI",
    price: "155,00 kr",
    description:
      "Klassiska thailändska wokade nudlar med ägg, grönsaker och sötsur sås.",
    allergens: "jordnötter, ägg, gluten",
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
  },
  {
    name: "TERIYAKI LAX",
    price: "175,00 kr",
    description:
      "Stekt lax med teriyakisås, serveras med grönsaker och ris.",
    allergens: "fisk, soja",
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
