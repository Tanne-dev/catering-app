/**
 * Kontaktuppgifter. Uppdatera här så ändras det överallt på sidan.
 */
export const CONTACT = {
  phone: "+46 709394679",
  email: "info@cateringtanne.se",
  /** Kort text om när man kan nå er (valfritt) */
  hoursNote: "Vi svarar vanligtvis inom 24 timmar på vardagar.",
};

/**
 * Formspree Form ID để nhận đơn "Begär offert" qua email.
 * Có thể ghi đè bằng biến môi trường NEXT_PUBLIC_FORMSPREE_FORM_ID.
 */
export const FORMSPREE_FORM_ID =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
    ? process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
    : "mbdarvlw";
