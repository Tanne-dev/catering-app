export type DietType = "meat" | "fish" | "skaldjur" | "vegetarian";

/** Special rollar – referenslista. Lägg till fler roller här. */
export type SpecialRollarItem = {
  name: string;
  description: string;
  /** Bild (valfri) */
  image?: string;
  diet_type?: DietType;
};

export const SPECIAL_ROLLAR_TITLE = "SPECIAL ROLLAR";

/** Lägg till fler roller nedan. Möjliggör att gästerna ser och väljer specialroller. */
export const SPECIAL_ROLLAR_ITEMS: SpecialRollarItem[] = [
  {
    name: "Dragon roll",
    description: "Friterad räkmaki toppad med lax och avokado.",
    diet_type: "fish",
  },
  {
    name: "Spider roll",
    description: "Friterad mjukskal skaldjur, krispig sallad, avokado och japansk majonnäs.",
    diet_type: "fish",
  },
  {
    name: "Rainbow roll",
    description: "Krabba och avokado, toppad med lax, tonfisk, laxrom och avokado.",
    diet_type: "fish",
  },
];
