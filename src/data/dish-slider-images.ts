import { MENU_IMAGES_BASE_URL } from "@/lib/supabase";

/** Bilder till slidern "Rätter vi serverat". Lagrade i Supabase Storage. */
const DISH_PATHS = [
  "dishes/dish-sushi-takeout.png",
  "dishes/dish-bun-cha.png",
  "dishes/dish-gua-bao.png",
  "dishes/dish-sushi-roll.png",
  "dishes/dish-salmon-sashimi.png",
  "dishes/dish-sushi-platter.png",
  "dishes/dish-seaweed-salad.png",
  "dishes/dish-bao-trays.png",
  "dishes/dish-muffins.png",
  "dishes/dish-shrimp-roe.png",
  "dishes/dish-tacos.png",
  "dishes/dish-salmon-rose.png",
  "dishes/dish-chicken-skewers.png",
  "dishes/dish-salmon-platter.png",
  "dishes/dish-temaki-style.png",
  "dishes/dish-poke-bowl.png",
  "dishes/dish-nigiri-trays.png",
  "dishes/dish-rolls-platters.png",
  "dishes/dish-salmon-rolls.png",
  "dishes/dish-maki-variety.png",
  "dishes/dish-shrimp-avocado-rolls.png",
  "dishes/dish-extra.png",
  "dishes/dish-leaf-platter.png",
  "dishes/dish-sushi-platter-mixed.png",
  "dishes/dish-avocado-rolls.png",
  "dishes/dish-nigiri-sauce.png",
  "dishes/dish-salmon-tray.png",
];

export const DISH_SLIDER_IMAGES: string[] = DISH_PATHS.map((p) => `${MENU_IMAGES_BASE_URL}/${p}`);
