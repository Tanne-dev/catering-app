import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import ContactSection from "@/components/ContactSection";
import DishSlider from "@/components/DishSlider";
import Hero from "@/components/Hero";
import MenusSection from "@/components/MenusSection";
import ScrollToMenuOnQuery from "@/components/ScrollToMenuOnQuery";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { CONTACT } from "@/data/contact";

export default async function Home() {
  const tGoals = await getTranslations("goals");
  const tFooter = await getTranslations("footer");

  return (
    <main
      id="main-content"
      className="md:h-screen md:overflow-y-scroll md:snap-y md:snap-mandatory"
    >
      <Suspense fallback={null}>
        <ScrollToMenuOnQuery />
      </Suspense>
      <Hero />
      <ServicesSection />
      <MenusSection />
      {/* Begär offert (ContactSection) trực tiếp dưới Meny */}
      <ContactSection />
      <DishSlider />
      <TestimonialsSection />
      <section
        id="goals"
        className="border-t border-[#707164]/25 bg-gradient-to-b from-[#231a0e] via-[#2c2211] to-[#12110D] py-12 sm:py-16 md:min-h-screen md:snap-start md:py-20"
        aria-labelledby="goals-heading"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 md:flex-row md:items-center md:gap-12 md:px-6 lg:gap-16 lg:px-8">
          <div className="max-w-3xl flex-1 text-center sm:px-6 sm:text-left lg:px-0">
          <h2 id="goals-heading" className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E] sm:text-3xl" style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}>
            {tGoals("heading")}
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-[#C49B38]/70 sm:mx-0" aria-hidden />
          <p className="mt-6 text-[#E5E7E3]/90 leading-relaxed">
            {tGoals("p1")}
          </p>
          <p className="mt-4 text-[#E5E7E3]/90 leading-relaxed">
            {tGoals("p2")}
          </p>
          <p className="mt-4 text-[#E5E7E3]/90 leading-relaxed">
            {tGoals("p3")}
          </p>
          <p className="mt-6 font-medium text-[#E5E7E3]">{tGoals("strive")}</p>
          <ul className="mt-3 space-y-2 text-[#E5E7E3]/90 leading-relaxed" role="list">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EAC84E]" aria-hidden />
              <span>{tGoals("goal1")}</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EAC84E]" aria-hidden />
              <span>{tGoals("goal2")}</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EAC84E]" aria-hidden />
              <span>{tGoals("goal3")}</span>
            </li>
          </ul>
          <p className="mt-6 text-[#E5E7E3]/90 leading-relaxed">
            {tGoals("p4")}
          </p>
          </div>
          <div className="relative shrink-0 w-full max-w-md overflow-hidden rounded-xl border border-[#707164]/30 shadow-xl md:max-w-sm lg:max-w-md">
            <Image
              src="/goals-kitchen.png"
              alt={tGoals("imageAlt")}
              width={480}
              height={360}
              sizes="(max-width: 768px) 100vw, 380px"
              className="h-auto w-full object-cover"
              priority={false}
            />
          </div>
        </div>
      </section>
      <footer
        id="footer"
        className="bg-[#12110D] border-t border-[#707164]/40 py-8 sm:py-10 md:snap-start"
        role="contentinfo"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:text-left">
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:justify-start sm:gap-6" aria-label="Footer navigation">
              <a href="#services" className="text-sm text-[#E5E7E3]/90 underline-offset-4 hover:text-[#EAC84E] hover:underline">
                {tFooter("ourServices")}
              </a>
              <a href="#menus" className="text-sm text-[#E5E7E3]/90 underline-offset-4 hover:text-[#EAC84E] hover:underline">
                {tFooter("menu")}
              </a>
              <a href="#quote" className="text-sm text-[#E5E7E3]/90 underline-offset-4 hover:text-[#EAC84E] hover:underline">
                {tFooter("requestQuote")}
              </a>
              <a href="#contact" className="text-sm text-[#E5E7E3]/90 underline-offset-4 hover:text-[#EAC84E] hover:underline">
                {tFooter("contact")}
              </a>
              <a href="/admin/tables" className="text-sm text-[#E5E7E3]/70 underline-offset-4 hover:text-[#EAC84E] hover:underline">
                {tFooter("manageTables")}
              </a>
            </nav>
            <div className="flex flex-col items-center gap-1 text-sm text-[#D5D7D3]/80 sm:items-end">
              <a href={`mailto:${CONTACT.email}`} className="hover:text-[#EAC84E]">
                {CONTACT.email}
              </a>
            </div>
          </div>
          <p className="mt-8 border-t border-[#707164]/30 pt-6 text-center text-sm text-[#D5D7D3]/70" suppressHydrationWarning>
            © {new Date().getFullYear()} Catering Tanne. {tFooter("copyright")}
          </p>
          <p className="mt-2 text-center text-xs text-[#D5D7D3]/50">
            {tFooter("developedBy")}
          </p>
        </div>
      </footer>
    </main>
  );
}
