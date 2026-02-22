/**
 * Innehåll för section "Våra tjänster".
 * Redigera denna fil för att uppdatera texterna på sidan.
 */
import { MENU_IMAGES_BASE_URL } from "@/lib/supabase";

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
  /** Dùng dishes/ trên Supabase vì sushi-*.png đã xóa local và chưa upload. Có thể thay bằng ảnh sushi riêng khi đã có. */
  tiers: [
    {
      name: "Lax Nigiri",
      price: "24 kr / par",
      description: "Klassisk nigiri med färsk lax på sushiris.",
      nigiri: ["Lax"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-nigiri-trays.png`,
    },
    {
      name: "Räka Nigiri",
      price: "24 kr / par",
      description: "Nigiri med kokta räkor, serveras med färsk gräslök.",
      nigiri: ["Räkor"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-nigiri-sauce.png`,
    },
    {
      name: "Avokado Nigiri",
      price: "24 kr / par",
      description: "Vegetarisk nigiri med färsk avokado, nori och sesamfrön.",
      nigiri: ["Avokado"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-avocado-rolls.png`,
    },
    {
      name: "Tonfisk Nigiri",
      price: "28 kr / par",
      description: "Nigiri med färsk röd tonfisk (maguro) på sushiris.",
      nigiri: ["Tonfisk"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-salmon-sashimi.png`,
    },
    {
      name: "Inari",
      price: "11 kr / bit",
      description: "Vegetarisk inari – friterade tofupåsar fyllda med wakamesallad, sesamfrön och sås.",
      nigiri: [],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-seaweed-salad.png`,
    },
    {
      name: "Familjetallrik 1",
      price: "från 895 kr",
      description: "Blandad sushitallrik med lax-, tonfisk- och avokadonigiri, maki-roller, inari med wakame och ingefära. Perfekt för 4–6 personer.",
      nigiri: ["Lax", "Tonfisk", "Avokado"],
      maki: ["Blandat urval"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-sushi-platter.png`,
    },
    {
      name: "Familjetallrik 2",
      price: "från 995 kr",
      description: "Lyxig tallrik med lax- och tonfisknigiri, maki med jordgubbe, avokado och krispig lök, inari med wakame och rom. Serveras för 4–6 personer.",
      nigiri: ["Lax", "Tonfisk"],
      maki: ["Jordgubbe & lax", "Avokado & krispig lök", "Tonfisk & krispig lök"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-sushi-platter-mixed.png`,
    },
    {
      name: "Lyxtallrik",
      price: "från 1 195 kr",
      description: "Imponerande tallrik med lax-tartar i centrum, tonfisksashimi, uramaki med avokado, rom och krispig lök. Serveras för 5–8 personer.",
      nigiri: ["Tonfisk"],
      uramaki: ["Avokado & krispig lök", "Lax & sås", "Rom"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-salmon-platter.png`,
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
