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

const MONTHS: Record<string, number> = {
  januari: 1, jan: 1, februari: 2, febr: 2, mars: 3, april: 4, maj: 5, juni: 6,
  juli: 7, augusti: 8, september: 9, oktober: 10, november: 11, december: 12,
};

function parseDate(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  const parts = dateStr.trim().toLowerCase().split(/\s+/);
  if (parts.length < 2) return 0;
  const year = parseInt(parts[1], 10) || 0;
  const month = MONTHS[parts[0].replace(".", "")] ?? 0;
  return year * 12 + month;
}

const TESTIMONIALS_RAW: Testimonial[] = [
  {
    name: "Emma och Filip",
    rating: 5,
    text: "Catering Tanne levererade till vår fest i mars – både sushi och vietnamesiska rätter. Allt var fräscht, snyggt upplagt och gästerna var helt enkelt imponerade. Vi beställer gärna igen!",
    date: "Mars 2026",
  },
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
  {
    name: "Carolina N.",
    rating: 5,
    text: "Vi hade Catering Tanne till vår sommarfest i juni. Vietnamesiska vårrullar och bao buns var succé – alla frågade var vi hade beställt. Professionell service från start till mål.",
    date: "Juni 2025",
  },
  {
    name: "Thomas och Ingrid",
    rating: 5,
    text: "Beställde kombinerad meny till 50-årsfesten. Både kvaliteten och presentationen över förväntan. Personalen var hjälpsam och leveransen smidig. Fem plus!",
    date: "Maj 2025",
  },
  {
    name: "Jenny B.",
    rating: 5,
    text: "Företagsevent med sushi och wok – perfekt mix. Alla kollegor nöjda och vi fick många komplimanger. Tanne levererar verkligen.",
    date: "April 2025",
  },
];

/** Sorterat med nyaste först. */
export const TESTIMONIALS = [...TESTIMONIALS_RAW].sort(
  (a, b) => parseDate(b.date) - parseDate(a.date)
);
