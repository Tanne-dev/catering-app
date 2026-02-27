"use client";

import Image from "next/image";
import LazyBackground from "@/components/LazyBackground";
import { useSelectedService } from "@/contexts/SelectedServiceContext";
import { SERVICES } from "@/data/services";
import type { ServiceId } from "@/data/services";
import {
  VARATJANSTER_HERO,
  LEVERANS_OMRADE,
  LEVERANS_TILLVAL,
  VILLKOR,
} from "@/data/vara-tjanster-content";

const SECTION_STYLES = {
  heading: "text-lg font-semibold tracking-tight text-[#EAC84E] sm:text-xl",
  subheading: "text-base font-semibold text-[#E5E7E3] mt-8 sm:mt-10",
  body: "text-[15px] leading-relaxed text-[#E5E7E3]/92 sm:text-base",
  listItem: "flex gap-2.5 text-[15px] leading-relaxed text-[#E5E7E3]/92 sm:text-base",
  bullet: "text-[#C49B38] shrink-0 mt-0.5",
} as const;

/** Section "Våra tjänster". Innehåll från @/data/services och @/data/vara-tjanster-content. */
export default function ServicesSection() {
  const { setSelectedServiceId } = useSelectedService();

  return (
    <section
      id="services"
      className="relative border-t border-[#707164]/25 overflow-hidden py-16 md:min-h-screen md:snap-start md:py-20 lg:py-24"
      aria-labelledby="services-heading"
    >
      <LazyBackground
        src="/vara-tjanster-bg.png"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        aria-hidden
      >
        {null}
      </LazyBackground>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(18,17,13,0.92) 0%, rgba(18,17,13,0.85) 50%, rgba(18,17,13,0.92) 100%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-12 max-w-2xl border-b border-[#707164]/20 pb-10 text-center md:mb-14 md:pb-12">
          <h2
            id="services-heading"
            className="text-2xl font-semibold tracking-tight text-[#EAC84E] sm:text-3xl"
          >
            Våra tjänster
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#E5E7E3]/95">
            Vi erbjuder catering anpassad efter era behov. Välj nedan för mer information och bilder.
          </p>
        </header>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-14">
          <div className="min-w-0 flex-1 lg:max-w-[36rem]">
            {/* Beställ Catering */}
            <div>
              <h3 className={SECTION_STYLES.heading}>
                {VARATJANSTER_HERO.headline}
              </h3>
              <p className={`mt-3 ${SECTION_STYLES.body}`}>
                {VARATJANSTER_HERO.intro}
              </p>
              <p className={`mt-6 ${SECTION_STYLES.subheading}`}>
                Gratis leverans inom
              </p>
              <p className={SECTION_STYLES.body}>{LEVERANS_OMRADE}</p>
            </div>

            {/* Tjänst(er) */}
            {SERVICES.map((service) => (
              <div key={service.id} className="mt-10 pt-8 border-t border-[#707164]/20 first:mt-10 first:pt-8">
                <h3 className="text-lg font-semibold text-[#E5E7E3]">
                  {service.title}
                </h3>
                <p className={`mt-2 ${SECTION_STYLES.body}`}>
                  {service.shortDescription}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedServiceId(service.id as ServiceId)}
                  className="btn-outline mt-4"
                  aria-label={`Läs mer om ${service.title}`}
                >
                  Läs mer
                </button>
              </div>
            ))}

            {/* Leverans & Tillval */}
            <div className="mt-10 pt-8 border-t border-[#707164]/20">
              <h3 className={SECTION_STYLES.subheading}>Leverans & Tillval</h3>
              <ul className="mt-3 space-y-2">
                {LEVERANS_TILLVAL.map((item, i) => (
                  <li key={i} className={SECTION_STYLES.listItem}>
                    <span className={SECTION_STYLES.bullet}>·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Villkor */}
            <div className="mt-10 pt-8 border-t border-[#707164]/20">
              <h3 className={SECTION_STYLES.subheading}>Villkor</h3>
              <ul className="mt-3 space-y-2">
                {VILLKOR.map((item, i) => (
                  <li key={i} className={SECTION_STYLES.listItem}>
                    <span className={SECTION_STYLES.bullet}>·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bildkolumn */}
          <aside
            className="hidden shrink-0 md:block lg:sticky lg:top-24 lg:w-[340px] xl:w-[380px]"
            aria-hidden
          >
            <div className="overflow-hidden rounded-lg border border-[#707164]/25 bg-[#1a1916]/50 shadow-lg">
              <Image
                src="/vara-tjanster-sushi.png"
                alt="Catering och leverans"
                width={380}
                height={507}
                sizes="(max-width: 1024px) 100vw, 380px"
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
