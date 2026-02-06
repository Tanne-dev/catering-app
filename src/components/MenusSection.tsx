"use client";

import dynamic from "next/dynamic";
import { useSelectedMenu, type MenuId } from "@/contexts/SelectedMenuContext";

function MenuLoadingPlaceholder() {
  return (
    <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-4 py-12">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[#707164]/40 border-t-[#EAC84E]"
        aria-hidden
      />
      <p className="animate-menu-loading text-base text-[#E5E7E3]">Laddar meny…</p>
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

const MENU_CONTENT: Record<"dessert", { title: string; description: string }> = {
  dessert: {
    title: "Dessertmeny",
    description:
      "Söta avslut: tårtor, fruktfat och asiatiskt inspirerade desserter. Anpassade alternativ på förfrågan.",
  },
};

export default function MenusSection() {
  const { selectedMenu } = useSelectedMenu();
  const simpleContent = selectedMenu && selectedMenu !== "sushi" && selectedMenu !== "asiatisk" ? MENU_CONTENT[selectedMenu] : null;

  return (
    <section
      id="menus"
      className="relative min-h-[50vh] overflow-hidden py-16"
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
          Våra cateringmenyer
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-[#E5E7E3]">
          Bläddra i vårt utbud nedan och välj en meny för att se hela innehållet. Varje alternativ kan anpassas efter ert evenemang.
        </p>
        {selectedMenu === "sushi" ? (
          <div className="animate-menu-enter">
            <SushiMenuContent />
          </div>
        ) : selectedMenu === "asiatisk" ? (
          <div className="animate-menu-enter">
            <AsiatiskMenuContent />
          </div>
        ) : simpleContent ? (
          <div className="animate-menu-enter">
            <div
              className="mx-auto mt-10 max-w-2xl rounded-xl border border-[#707164]/50 bg-[#12110D] p-6 text-center"
              style={{ borderColor: "rgba(112, 113, 100, 0.5)" }}
            >
              <h3 className="text-2xl font-semibold text-[#EAC84E]">{simpleContent.title}</h3>
              <p className="mt-3 text-lg text-[#E5E7E3]">{simpleContent.description}</p>
              <p className="mt-4 text-base text-[#E5E7E3]/90">
                Fullständig meny och priser på förfrågan. Kontakta oss för en offert.
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-base text-[#E5E7E3]/90">
            Välj en meny i headern för att se dess innehåll här.
          </p>
        )}
      </div>
    </section>
  );
}
