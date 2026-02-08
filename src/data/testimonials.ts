/**
 * Kundomdömen som visas på sidan.
 *
 * Så här lägger du till ett nytt omdöme när du fått feedback (t.ex. via e-post från formuläret):
 *
 * 1. Öppna denna fil: src/data/testimonials.ts
 * 2. Hitta listan TESTIMONIALS nedan
 * 3. Kopiera ett befintligt objekt (från { name: ... till }, ) och klistra in det ovanför det första objektet
 * 4. Ändra name, rating (1–5), text och eventuellt date till kundens uppgifter
 * 5. Spara filen – sidan uppdateras vid nästa laddning (vid utveckling: spara och vänta på att sidan laddas om)
 *
 * Mall för nytt omdöme (klistra in och fyll i):
 *   {
 *     name: "Förnamn E.",
 *     rating: 5,
 *     text: "Kundens citat eller feedback här...",
 *     date: "Januari 2025",
 *   },
 */
export interface Testimonial {
  name: string;
  rating: number; // 1–5
  text: string;
  date?: string; // t.ex. "2024-01-15" eller "Januari 2024"
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Maria L.",
    rating: 5,
    text: "Beställde catering till min dotters födelsedag. Alla gillade sushin och presentationen var fantastisk. Snabb och vänlig kommunikation från början till slut. Rekommenderar varmt!",
    date: "December 2024",
  },
  {
    name: "Johan K.",
    rating: 5,
    text: "Vi använde Catering Tanne till ett företagsevent. Professionell leverans, god mat och flexibla lösningar. Ska definitivt beställa igen.",
    date: "November 2024",
  },
  {
    name: "Anna och Peter",
    rating: 4,
    text: "Mycket nöjda med asiatiska menyn till vår fest. Bra pris och smakrik mat. Lite sen leverans men det löste sig.",
    date: "Oktober 2024",
  },
  {
    name: "Lotta",
    rating: 5,
    text: "Jätte nöjda.",
    date: "Jan 2026",
  },
  {
    name: "Erik S.",
    rating: 5,
    text: "Sushin var fräsch och snyggt packad. Perfekt till vårt möte – alla kollegor var imponerade. Snabb leverans till Malmö.",
    date: "December 2025",
  },
  {
    name: "Sofia M.",
    rating: 4,
    text: "God mat och trevlig service. Dessertmenyn var en hit. Nästa gång beställer vi igen.",
    date: "November 2025",
  },
  {
    name: "Anders och Helena",
    rating: 5,
    text: "Beställde både sushi och asiatiskt till vår bröllopsmiddag. Allt smakade utmärkt och gästerna frågade var vi beställde från. Tack!",
    date: "Oktober 2025",
  },
  {
    name: "Kristina",
    rating: 5,
    text: "Flexibelt och professionellt. Vi fick exakt vad vi behövde till företagslunchen. Rekommenderar.",
    date: "September 2025",
  },
  {
    name: "Magnus L.",
    rating: 4,
    text: "Bra kvalitet och rimligt pris. Leverans till Lund funkade fint. Lite mer nigiri nästa gång!",
    date: "Augusti 2025",
  },
  {
    name: "Linda och David",
    rating: 5,
    text: "Första gången vi beställde catering – blev jättenöjda. Enkelt att beställa och allt kom i tid. Tack Catering Tanne!",
    date: "Juli 2025",
  },
];
