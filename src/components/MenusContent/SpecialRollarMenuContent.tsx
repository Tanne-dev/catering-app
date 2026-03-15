"use client";

import DietTypeBadge from "@/components/DietTypeBadge";
import ImageLightbox from "@/components/ImageLightbox";
import { useMenuItems } from "@/hooks/useMenus";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  SPECIAL_ROLLAR_TITLE,
  SPECIAL_ROLLAR_ITEMS,
} from "@/data/special-rollar-menu";
import { resolveMenuImageUrl } from "@/lib/supabase";

export default function SpecialRollarMenuContent() {
  const { items, loading } = useMenuItems("specialrollar");
  const menuItems = items.length > 0
    ? items.map((i) => ({
        name: i.name,
        description: i.description ?? "",
        image: i.image ? resolveMenuImageUrl(i.image) : undefined,
        diet_type: i.diet_type,
      }))
    : SPECIAL_ROLLAR_ITEMS.map((item) => ({
        name: item.name,
        description: item.description,
        image: item.image ? resolveMenuImageUrl(item.image) : undefined,
        diet_type: item.diet_type,
      }));

  return (
    <div
      className="mx-auto mt-10 max-w-2xl rounded-2xl border border-[#707164]/30 bg-[#1a1916]/95 p-6 text-center shadow-lg shadow-black/10 sm:p-8"
    >
      <h3 className="mb-6 text-2xl font-semibold uppercase tracking-wide text-[#EAC84E]">
        {SPECIAL_ROLLAR_TITLE}
      </h3>
      <p className="mb-6 text-base text-[#E5E7E3]/90">
        Referenslista över våra specialroller. Kontakta oss för pris och beställning.
      </p>
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <ul className="space-y-6" role="list">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className="border-b border-[#707164]/20 pb-6 last:border-0 last:pb-0"
            >
              {item.image && (
                <div className="mx-auto mb-3 w-full max-w-none sm:max-w-xs">
                  <ImageLightbox
                    src={item.image}
                    alt={item.name}
                    caption={item.name}
                    width={320}
                    height={240}
                  />
                </div>
              )}
              <div className="text-lg font-semibold text-[#E5E7E3]">
                {item.name}
                {item.diet_type && (
                  <span className="ml-2 align-middle">
                    <DietTypeBadge dietType={item.diet_type} />
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-base text-[#E5E7E3]/95">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
