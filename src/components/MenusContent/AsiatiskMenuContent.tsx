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

export default function AsiatiskMenuContent() {
  const { items, loading } = useMenuItems("asiatisk");
  const menuItems = items.length > 0
    ? items.map((i) => {
        const rawImage = (i.image ?? undefined) || getStaticImageByName(i.name);
        return {
          name: i.name,
          price: i.price,
          description: i.description ?? "",
          allergens: i.allergens ?? undefined,
          image: resolveMenuImageUrl(rawImage),
        };
      })
    : ASIATISK_MENU_ITEMS.map((item) => ({
        ...item,
        image: resolveMenuImageUrl(item.image),
      }));

  return (
    <div
      className="mx-auto mt-10 max-w-2xl rounded-xl border border-[#707164]/50 bg-[#12110D] p-6 text-center"
      style={{ borderColor: "rgba(112, 113, 100, 0.5)" }}
    >
      <h3 className="mb-6 text-2xl font-semibold uppercase tracking-wide text-[#EAC84E]">
        {ASIATISK_MENU_TITLE}
      </h3>
      {loading ? (
        <p className="text-[#E5E7E3]/80">Laddar meny…</p>
      ) : (
      <ul className="space-y-6" role="list">
        {menuItems.map((item) => (
          <li key={item.name} className="border-b border-[#707164]/30 pb-5 last:border-0 last:pb-0">
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
      <div className="mt-6 rounded-lg border border-[#707164]/40 bg-[#12110D]/80 p-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#EAC84E]">
          Viktig information
        </p>
        <p className="mt-2 text-base text-[#E5E7E3]/95">{ASIATISK_MENU_FOOTER}</p>
      </div>
    </div>
  );
}
