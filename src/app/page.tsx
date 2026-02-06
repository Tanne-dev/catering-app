import ContactSection from "@/components/ContactSection";
import DishSlider from "@/components/DishSlider";
import Hero from "@/components/Hero";
import MenusSection from "@/components/MenusSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { CONTACT } from "@/data/contact";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <ServicesSection />
      <MenusSection />
      <DishSlider />
      <TestimonialsSection />
      <section id="goals" className="border-t border-[#707164]/25 bg-[#12110D] py-12 sm:py-16 md:py-20" aria-labelledby="goals-heading">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 sm:text-left lg:px-8">
          <h2 id="goals-heading" className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E] sm:text-3xl" style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}>
            Mål & Vårt uppdrag
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-[#C49B38]/70 sm:mx-0" aria-hidden />
          <p className="mt-6 text-[#E5E7E3]/90 leading-relaxed">
            Vårt mål är att skapa pålitlig och personlig catering med fokus på kvalitet, smak och service.
          </p>
          <p className="mt-4 text-[#E5E7E3]/90 leading-relaxed">
            Bakom Catering Tanne finns en genuin passion för matlagning och många års erfarenhet från arbete i olika restauranger, där vi har haft förmånen att servera tusentals nöjda gäster.
          </p>
          <p className="mt-4 text-[#E5E7E3]/90 leading-relaxed">
            Vår resa började med kärleken till mat och mötet med människor. Genom åren har vi lärt oss hur viktigt det är att varje måltid inte bara smakar bra, utan också känns rätt för tillfället – oavsett om det handlar om en privat fest, ett företagsevent eller en mindre sammankomst.
          </p>
          <p className="mt-6 font-medium text-[#E5E7E3]">Vi strävar efter att:</p>
          <ul className="mt-3 space-y-2 text-[#E5E7E3]/90 leading-relaxed" role="list">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EAC84E]" aria-hidden />
              <span>leverera mat av hög kvalitet, tillagad med omsorg</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EAC84E]" aria-hidden />
              <span>erbjuda flexibel catering anpassad efter kundens önskemål</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EAC84E]" aria-hidden />
              <span>skapa en trygg och smidig upplevelse från första kontakt till leverans</span>
            </li>
          </ul>
          <p className="mt-6 text-[#E5E7E3]/90 leading-relaxed">
            För oss handlar catering inte bara om mat, utan om förtroende, engagemang och stolthet i hantverket. Vårt mål är att varje kund ska känna sig väl omhändertagen och trygg med att maten är i professionella händer.
          </p>
        </div>
      </section>
      <ContactSection />
      <footer id="footer" className="bg-[#12110D] border-t border-[#707164]/40 py-8 sm:py-10" role="contentinfo">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:text-left">
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:justify-start sm:gap-6" aria-label="Sidfotnavigation">
              <a href="#services" className="text-sm text-[#E5E7E3]/90 underline-offset-4 hover:text-[#EAC84E] hover:underline">
                Våra tjänster
              </a>
              <a href="#menus" className="text-sm text-[#E5E7E3]/90 underline-offset-4 hover:text-[#EAC84E] hover:underline">
                Våra menyer
              </a>
              <a href="#quote" className="text-sm text-[#E5E7E3]/90 underline-offset-4 hover:text-[#EAC84E] hover:underline">
                Begär offert
              </a>
              <a href="#contact" className="text-sm text-[#E5E7E3]/90 underline-offset-4 hover:text-[#EAC84E] hover:underline">
                Kontakt
              </a>
            </nav>
            <div className="flex flex-col items-center gap-1 text-sm text-[#D5D7D3]/80 sm:items-end">
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-[#EAC84E]">
                {CONTACT.phone}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-[#EAC84E]">
                {CONTACT.email}
              </a>
            </div>
          </div>
          <p className="mt-8 border-t border-[#707164]/30 pt-6 text-center text-sm text-[#D5D7D3]/70">
            © {new Date().getFullYear()} Catering Tanne. Alla rättigheter förbehållna.
          </p>
          <p className="mt-2 text-center text-xs text-[#D5D7D3]/50">
            Webbplatsen är utvecklad av Tanne Dev.
          </p>
        </div>
      </footer>
    </main>
  );
}
