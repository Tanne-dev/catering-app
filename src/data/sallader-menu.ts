export type SalladerBuffeItem = {
  name: string;
  price: string;
  description: string;
  /** Bild på tallriken (sökväg i public) */
  image?: string;
};

export const SALLADER_BUFFE_TITLE = "SALLADER BUFFÉER";

export const SALLADER_BUFFE_ITEMS: SalladerBuffeItem[] = [
  {
    name: "Köldelar & Osttallrik",
    price: "90 kr / portion",
    description:
      "Blandad tallrik med prosciutto, ost, körsbärstomater, oliver, kapris, chorizo och druvor. Serveras på salladsblad.",
    image: "/dishes/sallad-buffe-1.png",
  },
  {
    name: "Färsk Salladsset",
    price: "120 kr / portion",
    description:
      "Tallrik med physalis, körsbärstomater, skivad kyckling-/kalkonfile, druvor, gurka, sparris och salladsblad. Perfekt till buffé.",
    image: "/dishes/sallad-buffe-2.png",
  },
  {
    name: "Rostbiff & Grönsaker",
    price: "120 kr / portion",
    description:
      "Skivad rostbiff med körsbärstomater, gurka, sallad, röd paprika, inlagda grönsaker och ost. Perfekt till buffé.",
    image: "/dishes/sallad-rostbiff.png",
  },
];

export const SALLADER_BUFFE_FOOTER =
  "Kontakta oss för hela utbud och priser. Vi anpassar gärna efter era önskemål.";
