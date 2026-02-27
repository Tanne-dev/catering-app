"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useSelectedMenu, type MenuId } from "@/contexts/SelectedMenuContext";

function MenuLoadingPlaceholder() {
  const t = useTranslations("menus");
  return (
    <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-4 py-12">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[#707164]/40 border-t-[#EAC84E]"
        aria-hidden
      />
      <p className="animate-menu-loading text-base text-[#E5E7E3]">{t("loading")}</p>
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

const SalladerMenuContent = dynamic(
  () => import("@/components/MenusContent/SalladerMenuContent"),
  { ssr: false, loading: () => <MenuLoadingPlaceholder /> }
);

export default function MenusSection() {
  const t = useTranslations("menus");
  const { selectedMenu } = useSelectedMenu();
  return (
    <section
      id="menus"
      className="relative min-h-[50vh] overflow-hidden py-16 md:min-h-screen md:snap-start"
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
        <h2 className="text-2xl font-semibold text-[#EAC84E] sm:text-3xl lg:text-[2.15rem]">
          {t("heading")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-[#E5E7E3]">
          {t("intro")}
        </p>
        {selectedMenu === "sushi" ? (
          <div className="animate-menu-enter">
            <SushiMenuContent />
          </div>
        ) : selectedMenu === "asiatisk" ? (
          <div className="animate-menu-enter">
            <AsiatiskMenuContent />
          </div>
        ) : selectedMenu === "sallader" ? (
          <div className="animate-menu-enter">
            <SalladerMenuContent />
          </div>
        ) : (
          <p className="mt-8 text-base text-[#E5E7E3]/90">
            {t("selectMenu")}
          </p>
        )}
      </div>
    </section>
  );
}
