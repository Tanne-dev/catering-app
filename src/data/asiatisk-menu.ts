export type AsiatiskMenuItem = {
  name: string;
  price: string;
  description: string;
  allergens?: string;
  image?: string;
};

export const ASIATISK_MENU_TITLE = "ASIATISK MENY";

export const ASIATISK_MENU_ITEMS: AsiatiskMenuItem[] = [
  { name: "TRADITIONELL BEEF PHO", price: "159,00 kr", description: "Vietnamesisk risnudelsoppa med långkokt nötbuljong.", allergens: "gluten" },
  { name: "KYCKLING PHO", price: "149,00 kr", description: "Lätt vietnamesisk nudelsoppa med kyckling.", allergens: "gluten" },
  { name: "BUN BO HUE", price: "165,00 kr", description: "Vietnamesisk kryddstark nudelsoppa.", allergens: "gluten", image: "/dishes/dish-bun-cha.png" },
  { name: "PAD THAI", price: "155,00 kr", description: "Klassiska thailändska wokade nudlar med ägg, grönsaker och sötsur sås.", allergens: "jordnötter, ägg, gluten", image: "/dishes/dish-pad-thai.png" },
  { name: "VEGETARISK WOK", price: "139,00 kr", description: "Wokade grönsaker med asiatisk kryddning.", allergens: "soja", image: "/dishes/dish-poke-bowl.png" },
  { name: "SÖT & SUR RÄK", price: "169,00 kr", description: "Räkor wokade i sötsur sås, serveras med ris.", allergens: "skaldjur", image: "/dishes/dish-shrimp-avocado-rolls.png" },
  { name: "TERIYAKI LAX", price: "175,00 kr", description: "Stekt lax med teriyakisås, serveras med grönsaker och ris.", allergens: "fisk, soja", image: "/dishes/dish-salmon-platter.png" },
];

export const ASIATISK_MENU_FOOTER = "Meddela gärna vår personal om ni har allergier eller särskilda kostbehov.";
