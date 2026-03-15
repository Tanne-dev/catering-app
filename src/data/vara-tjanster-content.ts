/**
 * Innehåll för section "Våra tjänster".
 * Redigera denna fil för att uppdatera texterna på sidan.
 */
import { MENU_IMAGES_BASE_URL } from "@/lib/supabase";

export type DietType = "meat" | "fish" | "skaldjur" | "vegetarian";

export type SushiTier = {
  name: string;
  price: string;
  description: string;
  nigiri: string[];
  uramaki?: string[];
  maki?: string[];
  /** Bild på sushitallrik (sökväg i public) */
  image?: string;
  diet_type?: DietType;
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
      name: "Familjetallrik 1",
      price: "från 895 kr",
      diet_type: "fish" as const,
      description: "Blandad sushitallrik med lax-, tonfisk- och avokadonigiri, maki-roller, inari med wakame och ingefära. Perfekt för 4–6 personer.",
      nigiri: ["Lax", "Tonfisk", "Avokado"],
      maki: ["Blandat urval"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-sushi-platter.png`,
    },
    {
      name: "Familjetallrik 2",
      price: "från 995 kr",
      diet_type: "fish" as const,
      description: "Lyxig tallrik med lax- och tonfisknigiri, maki med jordgubbe, avokado och krispig lök, inari med wakame och rom. Serveras för 4–6 personer.",
      nigiri: ["Lax", "Tonfisk"],
      maki: ["Jordgubbe & lax", "Avokado & krispig lök", "Tonfisk & krispig lök"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-sushi-platter-mixed.png`,
    },
    {
      name: "Lyxtallrik",
      price: "från 1 195 kr",
      diet_type: "fish" as const,
      description: "Imponerande tallrik med lax-tartar i centrum, tonfisksashimi, uramaki med avokado, rom och krispig lök. Serveras för 5–8 personer.",
      nigiri: ["Tonfisk"],
      uramaki: ["Avokado & krispig lök", "Lax & sås", "Rom"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/dish-salmon-platter.png`,
    },
    {
      name: "Sushitallrik 3",
      price: "från 1 095 kr",
      diet_type: "fish" as const,
      description: "Stor rund sushitallrik med blandade maki och uramaki – lax, avokado, krispiga toppingar och rom. Perfekt för 5–8 personer.",
      nigiri: ["Lax", "Tonfisk"],
      uramaki: ["Avokado & krispig", "Lax & sås", "Rom"],
      maki: ["Blandat urval"],
      image: `${MENU_IMAGES_BASE_URL}/dishes/sushi-talrik-3.png`,
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
