export type ServiceId = "drop-off";

export type ServiceDetail = {
  id: ServiceId;
  title: string;
  shortDescription: string;
  longDescription: string;
  image1: string;
  image2: string;
};

export const SERVICES: ServiceDetail[] = [
  {
    id: "drop-off",
    title: "Cateringleverans",
    shortDescription:
      "Vi levererar färdiga rätter till din adress. Perfekt för mindre möten och hemmafester.",
    longDescription:
      "Med vår drop-off catering levererar vi färdiga, fint tillagade rätter direkt till er. Ni får allt ni behöver—tallrikar, bestick och serveringsförslag kan ordnas. Perfekt för mindre möten, hemmafester eller när ni vill ha professionell mat utan egen kökspersonal. Vi anpassar menyn efter er budget och antal gäster.",
    image1: "/drop-catering-1.png",
    image2: "/drop-catering-2.png",
  },
];
