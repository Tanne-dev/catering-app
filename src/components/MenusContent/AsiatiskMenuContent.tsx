"use client";

import ImageLightbox from "@/components/ImageLightbox";
import OrderQuantityInput from "@/components/OrderQuantityInput";
import { useMenuItems } from "@/hooks/useMenus";
import {
  ASIATISK_MENU_TITLE,
  ASIATISK_MENU_ITEMS,
  ASIATISK_MENU_FOOTER,
} from "@/data/asiatisk-menu";
import { resolveMenuImageUrl } from "@/lib/supabase";

function getStaticImageByName(name: string): string | undefined {
  const item = ASIATISK_MENU_ITEMS.find((t) =>
    t.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
  return item?.image;
}

const DEBUG_LOG_ENDPOINT = "http://127.0.0.1:7242/ingest/0cdeab99-f7cb-4cee-9943-94270784127d";

export default function AsiatiskMenuContent() {
  const { items, loading } = useMenuItems("asiatisk");
  const menuItems = items.length > 0
    ? items.map((i) => {
        const fromApi = i.image ?? undefined;
        const fromStatic = getStaticImageByName(i.name);
        const rawImage = fromApi || fromStatic;
        const resolved = resolveMenuImageUrl(rawImage);
        // #region agent log
        fetch(DEBUG_LOG_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "AsiatiskMenuContent.tsx:map",
            message: "asiatisk item image resolution",
            data: {
              name: i.name,
              fromApi: !!fromApi,
              fromStatic: !!fromStatic,
              rawImage: rawImage ? rawImage.substring(0, 80) : null,
              resolved: !!resolved,
              resolvedUrl: resolved ? resolved.substring(0, 80) : null,
            },
            timestamp: Date.now(),
            hypothesisId: "H1",
          }),
        }).catch(() => {});
        // #endregion
        return {
          name: i.name,
          price: i.price,
          description: i.description ?? "",
          allergens: i.allergens ?? undefined,
          image: resolved,
        };
      })
    : ASIATISK_MENU_ITEMS.map((item) => ({
        ...item,
        image: resolveMenuImageUrl(item.image),
      }));

  // #region agent log
  if (menuItems.length > 0 && items.length === 0) {
    const withImage = menuItems.filter((m) => m.image).length;
    const withoutImage = menuItems.filter((m) => !m.image).map((m) => m.name);
    fetch(DEBUG_LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "AsiatiskMenuContent.tsx:static",
        message: "asiatisk using static list (no API items)",
        data: { count: menuItems.length, withImage, withoutImage },
        timestamp: Date.now(),
        hypothesisId: "H3",
      }),
    }).catch(() => {});
  }
  // #endregion

  return (
    <div
      className="mx-auto mt-10 max-w-2xl rounded-2xl border border-[#707164]/30 bg-[#1a1916]/95 p-6 text-center shadow-lg shadow-black/10 sm:p-8"
    >
      <h3 className="mb-6 text-2xl font-semibold uppercase tracking-wide text-[#EAC84E]">
        {ASIATISK_MENU_TITLE}
      </h3>
      {loading ? (
        <p className="text-[#E5E7E3]/80">Laddar meny…</p>
      ) : (
      <ul className="space-y-6" role="list">
        {menuItems.map((item) => (
          <li key={item.name} className="border-b border-[#707164]/20 pb-6 last:border-0 last:pb-0">
            {item.image && (
              <div className="mx-auto mb-3 max-w-xs">
                <ImageLightbox
                  src={item.image}
                  alt={item.name}
                  caption={item.name}
                  width={320}
                  height={240}
                />
              </div>
            )}
            <div className="text-lg font-semibold text-[#E5E7E3]">{item.name}</div>
            <p className="mt-1.5 text-base text-[#E5E7E3]/95">{item.description}</p>
            {item.allergens && (
              <p className="mt-1 text-sm text-[#E5E7E3]/85">
                Allergener: {item.allergens}
              </p>
            )}
            <OrderQuantityInput menuSlug="asiatisk" itemName={item.name} price={item.price} />
          </li>
        ))}
      </ul>
      )}
      <div className="mt-6 rounded-xl border border-[#707164]/25 bg-[#12110D]/70 p-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#EAC84E]">
          Viktig information
        </p>
        <p className="mt-2 text-base text-[#E5E7E3]/95">{ASIATISK_MENU_FOOTER}</p>
      </div>
    </div>
  );
}
