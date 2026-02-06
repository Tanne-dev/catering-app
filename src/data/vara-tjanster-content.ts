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
  tiers: [
    {
      name: "Standard Sushi",
      price: "11 kr / bit",
      description: "50 % maki, 50 % nigiri. Du kan välja själv eller låta kocken komponera.",
      nigiri: ["Lax", "Räkor", "Avokado", "Omelett", "Friterad tofu"],
      uramaki: [
        "California (krabbröra, lax, gurka, avokado, sesam)",
        "Lax, gurka & avokado med sesam",
        "Vegan (friterad tofu, avokado, gurka, sesam)",
      ],
    },
    {
      name: "Lyx Sushi",
      price: "14 kr / bit",
      description: "Maki säljs i paket om 8 bitar. Du kan välja själv eller låta kocken blanda.",
      nigiri: [
        "Grillad lax (teriyaki, picklad & rostad lök)",
        "Lax med kimcheemajonnäs & vårlök",
        "Lax med aioli & chilisås",
        "Tonfisk",
        "Grillad tonfisk (teriyaki, picklad & rostad lök)",
      ],
      maki: [
        "Dragon Fire",
        "Crunchy Chicken",
        "Salmon Avocado Roll",
        "Grillad Lax Maki",
        "Super Crunch",
        "Cream Cheese Maki",
        "Tempura Maki",
        "Dragon Roll",
        "Salmon Dragon Roll",
      ],
    },
    {
      name: "Lyx Vegan / Vegetarisk Sushi",
      price: "13 kr / bit",
      description: "Maki säljs i paket om 8 bitar. Du kan välja själv eller låta kocken blanda.",
      nigiri: ["Crispy mushroom nigiri", "Tofu deluxe nigiri"],
      maki: [
        "Vegan Super Crunch",
        "Vegetarisk Deluxe (kan fås helt vegansk)",
      ],
    },
  ],
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
