"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MENU_IMAGES_BASE_URL } from "@/lib/supabase";

/** Per-person price: [min, max] in SEK. Sushi: 150–250. Asiatisk: 170–270. Kombinerat: 180–270. */
const KR_PER_PERSON: Record<string, [number, number]> = {
  sushi: [150, 250],
  asiatisk: [170, 270],
  kombinerat: [180, 270],
};

const MENU_OPTIONS = [
  { id: "sushi" as const, image: "/dishes/dish-sushi.png", alt: "Sushi" },
  { id: "asiatisk" as const, image: "/dishes/dish-asiatisk.png", alt: "Asiatiskt" },
  { id: "kombinerat" as const, image: "/dishes/dish-kombinerat.png", alt: "Kombinerat" },
];

const GUEST_COUNTS = [10, 30, 50, 100] as const;

type MenuId = "sushi" | "asiatisk" | "kombinerat";

function formatPrice(min: number, max: number): string {
  return `ca ${min.toLocaleString("sv-SE")} – ${max.toLocaleString("sv-SE")} kr`;
}

function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function FingerPointerIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center text-[#C49B38] ${className}`} aria-hidden>
      👉
    </span>
  );
}

export default function PriceCalculator({
  guests,
  menu,
  onGuestsChange,
  onMenuChange,
  onClose,
}: {
  guests: number;
  menu: MenuId;
  onGuestsChange: (v: number) => void;
  onMenuChange: (v: MenuId) => void;
  onClose: () => void;
}) {
  const t = useTranslations("priceCalculator");
  const [showExplanation, setShowExplanation] = useState(false);
  const [minKr, maxKr] = KR_PER_PERSON[menu] ?? [0, 0];
  const [minPrice, maxPrice] = [guests * minKr, guests * maxKr];

  return (
    <div className="flex w-full max-w-2xl flex-col items-center justify-center px-4 py-8">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#707164]/25 bg-[#1a1916]/95 shadow-xl backdrop-blur-sm"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#707164]/20 text-[#E5E7E3] transition-colors hover:bg-[#707164]/40"
          aria-label={t("close")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="p-6 sm:p-8 lg:p-10">
          <h2
            className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E] sm:text-3xl"
            style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
          >
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-[#D5D7D3]/80 sm:text-base">{t("subtitle")}</p>

          {/* Antal personer */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0 text-[#C49B38]"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h3 className="font-semibold text-[#E5E7E3]">{t("guestCountTitle")}</h3>
            </div>
            <p className="mt-1 text-sm text-[#D5D7D3]/70">{t("guestCountLabel")}</p>
            <div className="mt-3 flex gap-2">
              {GUEST_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onGuestsChange(n)}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    guests === n
                      ? "bg-[#C49B38] text-[#12110D]"
                      : "bg-[#2a2820] text-[#D5D7D3] hover:bg-[#35332a]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Menyalternativ */}
          <div className="mt-6">
            <h3 className="font-semibold text-[#E5E7E3]">{t("menuTitle")}</h3>
            <p className="mt-1 text-sm text-[#D5D7D3]/70">{t("menuLabel")}</p>
            <div className="mt-4 grid grid-cols-3 gap-4 sm:gap-5">
              {MENU_OPTIONS.map((opt) => {
                const selected = menu === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onMenuChange(opt.id)}
                    className={`group relative flex flex-col items-center overflow-hidden rounded-xl border-2 transition-all ${
                      selected
                        ? "border-[#C49B38] bg-[#2a2820]/80 ring-2 ring-[#C49B38]/40"
                        : "border-transparent bg-[#2a2820]/50 hover:border-[#707164]/50"
                    }`}
                  >
                    {selected && (
                      <span
                        className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#C49B38]"
                        aria-hidden
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#12110D" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={opt.image}
                        alt={t(`menu_${opt.id}`)}
                        fill
                        sizes="(max-width: 640px) 28vw, (max-width: 768px) 140px, 180px"
                        className="object-cover"
                      />
                    </div>
                    <span className="py-2 text-sm font-medium text-[#E5E7E3]">{t(`menu_${opt.id}`)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Uppskattad kostnad */}
          <div className="mt-6 rounded-lg bg-[#2a2820]/60 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-[#D5D7D3]/90">{t("estimatedLabel")}</p>
              <span className="flex shrink-0 items-center gap-1 text-[#C49B38]" aria-hidden>
                <FingerPointerIcon className="text-base sm:text-lg" />
                <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#EAC84E] transition-colors hover:bg-[#EAC84E]/20 focus:outline-none focus:ring-2 focus:ring-[#EAC84E]/50"
                aria-label={t("priceExplanationAria")}
                aria-expanded={showExplanation}
              >
                <StarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
                <span className="text-xs font-medium text-[#D5D7D3]/80 sm:text-sm">{t("priceInfoHint")}</span>
              </span>
            </div>
            <p className="mt-1 text-xl font-bold text-[#EAC84E] sm:text-2xl">
              {minPrice > 0 ? formatPrice(minPrice, maxPrice) : "—"}
            </p>
            <p className="mt-2 text-xs text-[#D5D7D3]/60">{t("disclaimer")}</p>

            {showExplanation && (
              <div className="mt-4 space-y-3 rounded-lg border border-[#C49B38]/40 bg-[#1a1916]/90 p-4">
                <h4 className="font-semibold text-[#EAC84E]">{t("priceExplanationTitle")}</h4>
                <p className="text-sm leading-relaxed text-[#D5D7D3]/90">{t("priceExplanationP1")}</p>
                <p className="text-sm leading-relaxed text-[#D5D7D3]/90">{t("priceExplanationP2")}</p>
                <p className="text-sm leading-relaxed text-[#D5D7D3]/90">{t("priceExplanationP3")}</p>
                <p className="text-sm leading-relaxed text-[#D5D7D3]/90">{t("priceExplanationP4")}</p>
                <p className="flex items-center gap-2 text-sm leading-relaxed text-[#D5D7D3]/90">
                  <span aria-hidden>⏱</span>
                  {t("priceExplanationP5")}
                </p>
                <button
                  type="button"
                  onClick={() => setShowExplanation(false)}
                  className="text-sm font-medium text-[#C49B38] hover:text-[#EAC84E]"
                >
                  {t("close")}
                </button>
              </div>
            )}
          </div>

          {/* Få exakt pris */}
          <Link
            href="#quote"
            onClick={onClose}
            className="btn-outline mt-6 block w-full py-3.5 text-center text-base font-semibold"
          >
            {t("getQuote")}
          </Link>
        </div>
      </div>
    </div>
  );
}
