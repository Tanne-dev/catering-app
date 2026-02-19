/**
 * Innehåll för section "Våra tjänster".
 * Redigera denna fil för att uppdatera texterna på sidan.
 */

export type SushiTier = {
  name: string;
  price: string;
  description: string;
  nigiri: string[];
  uramaki?: string[];
  maki?: string[];
  /** Bild på sushitallrik (sökväg i public) */
  image?: string;
};

export const VARATJANSTER_HERO = {
  headline: "Beställ Catering från oss!",
  intro:
    "Låt oss ta hand om maten till din fest eller företagsevent – så kan du fokusera på gästerna.",
};

export const LEVERANS_OMRADE =
  "Malmö, Skanör, Höllviken, Falsterbo, Lund";

export const CATERINGMENY_SUSHI = {
  title: "Cateringmeny – Sushi",
  /** Lägg till nya sushitier här. Se typen SushiTier ovan för struktur. */
  tiers: [
    {
      name: "Lax Nigiri",
      price: "12 kr / bit",
      description: "Klassisk nigiri med färsk lax på sushiris.",
      nigiri: ["Lax"],
      image: "/sushi-lax-nigiri.png",
    },
    {
      name: "Räka Nigiri",
      price: "12 kr / bit",
      description: "Nigiri med kokta räkor, serveras med färsk gräslök.",
      nigiri: ["Räkor"],
      image: "/sushi-raka-nigiri.png",
    },
    {
      name: "Avokado Nigiri",
      price: "11 kr / bit",
      description: "Vegetarisk nigiri med färsk avokado, nori och sesamfrön.",
      nigiri: ["Avokado"],
      image: "/sushi-avokado-nigiri.png",
    },
    {
      name: "Tonfisk Nigiri",
      price: "14 kr / bit",
      description: "Nigiri med färsk röd tonfisk (maguro) på sushiris.",
      nigiri: ["Tonfisk"],
      image: "/sushi-tonfisk-nigiri.png",
    },
    {
      name: "Inari",
      price: "11 kr / bit",
      description: "Vegetarisk inari – friterade tofupåsar fyllda med wakamesallad, sesamfrön och sås.",
      nigiri: [],
      image: "/sushi-inari.png",
    },
    {
      name: "Familjetallrik 1",
      price: "från 895 kr",
      description: "Blandad sushitallrik med lax-, tonfisk- och avokadonigiri, maki-roller, inari med wakame och ingefära. Perfekt för 4–6 personer.",
      nigiri: ["Lax", "Tonfisk", "Avokado"],
      maki: ["Blandat urval"],
      image: "/sushi-platter-family-1.png",
    },
    {
      name: "Familjetallrik 2",
      price: "från 995 kr",
      description: "Lyxig tallrik med lax- och tonfisknigiri, maki med jordgubbe, avokado och krispig lök, inari med wakame och rom. Serveras för 4–6 personer.",
      nigiri: ["Lax", "Tonfisk"],
      maki: ["Jordgubbe & lax", "Avokado & krispig lök", "Tonfisk & krispig lök"],
      image: "/sushi-platter-family-2.png",
    },
    {
      name: "Lyxtallrik",
      price: "från 1 195 kr",
      description: "Imponerande tallrik med lax-tartar i centrum, tonfisksashimi, uramaki med avokado, rom och krispig lök. Serveras för 5–8 personer.",
      nigiri: ["Tonfisk"],
      uramaki: ["Avokado & krispig lök", "Lax & sås", "Rom"],
      image: "/sushi-platter-deluxe.png",
    },
  ] as SushiTier[],
};

export const LEVERANS_TILLVAL = [
  "Gratis hemkörning inom 8 km från restaurangen (avlämning vid entrén)",
  "Kock på plats: 2 500 kr (Dukar upp, sköter buffén & gör sushi i upp till 2 timmar. Förbokning minst 1 vecka i förväg.)",
];

export const VILLKOR = [
  "Alla priser inkl. moms",
  "Minsta beställning: 100 bitar",
  "10 % rabatt vid 300 bitar eller fler",
  "Förbeställ senast kl. 14:00 dagen innan",
  "Standard, lyx och lyx vegan/vegetarisk kan kombineras",
];
