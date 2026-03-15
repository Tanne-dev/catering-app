"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/ScrollReveal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSelectedMenu, type MenuId } from "@/contexts/SelectedMenuContext";

function MenuLoadingPlaceholder() {
  return (
    <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>
  );
}

const SushiMenuContent = dynamic(
  () => import("@/components/MenusContent/SushiMenuContent"),
  { ssr: false, loading: () => <MenuLoadingPlaceholder /> }
);

const AsiatiskMenuContent = dynamic(
  () => import("@/components/MenusContent/AsiatiskMenuContent"),
  { ssr: false, loading: () => <MenuLoadingPlaceholder /> }
);

const KombineratMenuContent = dynamic(
  () => import("@/components/MenusContent/KombineratMenuContent"),
  { ssr: false, loading: () => <MenuLoadingPlaceholder /> }
);

const SpecialRollarMenuContent = dynamic(
  () => import("@/components/MenusContent/SpecialRollarMenuContent"),
  { ssr: false, loading: () => <MenuLoadingPlaceholder /> }
);

/** Tab IDs only (no null); use for iteration so tFallback(id) gets string. */
const MENU_IDS: ("sushi" | "asiatisk" | "kombinera" | "specialrollar")[] = ["sushi", "asiatisk", "kombinera", "specialrollar"];

export default function MenusSection() {
  const t = useTranslations("menus");
  const tFallback = useTranslations("menusFallback");
  const { selectedMenu, setSelectedMenu } = useSelectedMenu();

  return (
    <section
      id="menus"
      className="relative min-h-0 overflow-x-hidden py-10 md:min-h-screen md:py-16 md:snap-start"
      aria-label="Sample menus and dishes"
    >
      <img
        src="/menus-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
        role="presentation"
      />
      <div
        className="absolute inset-0 bg-[#12110D]/55"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal side="left">
        <h2 className="text-2xl font-semibold text-[#EAC84E] sm:text-3xl lg:text-[2.15rem]">
          {t("heading")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-[#E5E7E3]">
          {t("intro")}
        </p>

        <div
          className="mx-auto mt-8 grid max-w-2xl grid-cols-2 justify-items-stretch gap-2 sm:grid-cols-4 sm:gap-3"
          role="tablist"
          aria-label={t("chooseMenuBelow")}
        >
          {MENU_IDS.map((id) => {
            const label = tFallback(id) ?? "";
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selectedMenu === id}
                aria-label={label}
                onClick={() => setSelectedMenu(id)}
                className={`min-w-0 rounded-xl border-2 px-4 py-3 text-center text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#EAC84E] focus:ring-offset-2 focus:ring-offset-[#12110D] sm:px-5 sm:py-3.5 sm:text-base ${
                  selectedMenu === id
                    ? "border-[#EAC84E] bg-[#C49B38]/25 text-[#EAC84E] shadow-md"
                    : "border-[#707164]/40 bg-[#1a1916]/80 text-[#E5E7E3] hover:border-[#C49B38]/60 hover:bg-[#C49B38]/15"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative mt-10">
          <div className="mx-auto w-full max-w-2xl">
        {selectedMenu === "sushi" ? (
          <div className="animate-menu-enter">
            <SushiMenuContent />
          </div>
        ) : selectedMenu === "asiatisk" ? (
          <div className="animate-menu-enter">
            <AsiatiskMenuContent />
          </div>
        ) : selectedMenu === "kombinera" ? (
          <div className="animate-menu-enter">
            <KombineratMenuContent />
          </div>
        ) : selectedMenu === "specialrollar" ? (
          <div className="animate-menu-enter">
            <SpecialRollarMenuContent />
          </div>
        ) : (
          <p className="mt-8 text-base text-[#E5E7E3]/90">
            {t("selectMenu")}
          </p>
        )}
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
