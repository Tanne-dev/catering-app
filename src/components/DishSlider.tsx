"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { DISH_SLIDER_IMAGES } from "@/data/dish-slider-images";

/** Auto-scrolling slider med bilder på rätter. Klick på bild öppnar lightbox; klick igen stänger. */
export default function DishSlider() {
  const t = useTranslations("dishSlider");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    if (lightboxSrc) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxSrc]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxSrc(null);
    }
    if (lightboxSrc) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [lightboxSrc]);

  if (DISH_SLIDER_IMAGES.length === 0) return null;

  const images = [...DISH_SLIDER_IMAGES, ...DISH_SLIDER_IMAGES];

  return (
    <section
      className="border-t border-[#707164]/25 bg-[#12110D] py-12 md:min-h-screen md:snap-start md:py-14"
      aria-labelledby="dish-slider-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] text-[#C49B38] sm:text-sm"
            aria-hidden
          >
            {t("portfolio")}
          </p>
          <h2
            id="dish-slider-heading"
            className="mt-2 font-serif text-2xl font-medium tracking-tight text-[#EAC84E] sm:text-3xl lg:text-[2rem]"
            style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
          >
            {t("heading")}
          </h2>
          <div className="mx-auto mt-4 h-px w-12 bg-[#C49B38]/60" aria-hidden />
          <p className="mx-auto mt-5 max-w-md text-center text-[15px] leading-relaxed text-[#E5E7E3]/90 sm:text-base">
            {t("intro")}
          </p>
        </header>
      </div>
      <div className="relative mt-6 overflow-hidden sm:mt-8">
        <div className="dish-slider-track flex gap-3 py-2 sm:gap-4">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setLightboxSrc(src)}
              className="dish-slider-item shrink-0 overflow-hidden rounded-lg border border-[#707164]/30 bg-[#1a1916] shadow-md transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#EAC84E] focus:ring-offset-2 focus:ring-offset-[#12110D]"
              aria-label={t("viewImage")}
            >
              <Image
                src={src}
                alt={t("imageAlt")}
                width={368}
                height={276}
                sizes="(max-width: 640px) 280px, (max-width: 768px) 322px, 368px"
                className="h-[200px] w-[280px] object-cover sm:h-[230px] sm:w-[322px] md:h-[276px] md:w-[368px]"
                loading="lazy"
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox: klick på overlay eller bild stänger */}
      {lightboxSrc && (
        <button
          type="button"
          onClick={() => setLightboxSrc(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 focus:outline-none"
          aria-label={t("close")}
        >
          <img
            src={lightboxSrc}
            alt={t("lightboxAlt")}
            className="max-h-[90vh] max-w-full cursor-pointer object-contain"
            loading="lazy"
            decoding="async"
          />
        </button>
      )}
    </section>
  );
}
