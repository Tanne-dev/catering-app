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
    name: "GYOZA – STEKTA DUMPLINGS",
    price: "135,00 kr",
    description:
      "Stekta japanska dumplings med krispig botten, fyllda med köttfärs och grönsaker. Serveras med dipsås.",
    allergens: "gluten, soja",
    image: "/dishes/dish-gyoza.png",
  },
  {
    name: "VÅRRULLAR – STEKTA",
    price: "125,00 kr",
    description:
      "Krispiga stekta vårrullar med färska grönsaker. Serveras med sötsur dipsås och färska örter.",
    allergens: "gluten, ägg",
    image: "/dishes/dish-spring-rolls.png",
  },
  {
    name: "FÄRSKA VÅRRULLAR – GỎI CUỐN",
    price: "130,00 kr",
    description:
      "Vietnamesiska färska vårrullar i rispapper med räkor, sallad och risnudlar. Serveras med kryddig nuoc cham-dipsås.",
    allergens: "skaldjur",
    image: "/dishes/dish-fresh-spring-rolls.png",
  },
  {
    name: "BAO BUNS – FLÄSKMAGE",
    price: "145,00 kr",
    description:
      "Mjuka ångade bao-bullar fyllda med glaserad fläskmage, inlagda morötter, grönlök och sesamfrön.",
    allergens: "gluten, soja",
    image: "/dishes/dish-bao-pork.png",
  },
  {
    name: "BÁNH MÌ – VIETNAMESISK SANDWICH",
    price: "140,00 kr",
    description:
      "Krispig baguette med fläsk, inlagda morötter och rättika, färsk koriander, gurka och jalapeño.",
    allergens: "gluten, jordnötter (kan tillagas utan)",
    image: "/dishes/dish-banh-mi.png",
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
    name: "WOK MED RYGGBIFF OCH HARICOTS VERTS",
    price: "165,00 kr",
    description:
      "Wokade nudlar med möra ryggbiffstrimlor, krispiga haricots verts och kryddig sås.",
    allergens: "gluten, soja",
    image: "/dishes/dish-wok-ryggbiff-haricots.png",
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
