"use client";

import {
  ASIATISK_MENU_TITLE,
  ASIATISK_MENU_ITEMS,
  ASIATISK_MENU_FOOTER,
} from "@/data/asiatisk-menu";

export default function AsiatiskMenuContent() {
  return (
    <div
      className="mx-auto mt-10 max-w-2xl rounded-xl border border-[#707164]/50 bg-[#12110D] p-6 text-center"
      style={{ borderColor: "rgba(112, 113, 100, 0.5)" }}
    >
      <h3 className="mb-6 text-2xl font-semibold uppercase tracking-wide text-[#EAC84E]">
        {ASIATISK_MENU_TITLE}
      </h3>
      <ul className="space-y-6" role="list">
        {ASIATISK_MENU_ITEMS.map((item) => (
          <li key={item.name} className="border-b border-[#707164]/30 pb-5 last:border-0 last:pb-0">
            <div className="text-lg font-semibold text-[#E5E7E3]">{item.name}</div>
            <p className="mt-1.5 text-base text-[#E5E7E3]/95">{item.description}</p>
            {item.allergens && (
              <p className="mt-1 text-sm text-[#E5E7E3]/85">
                Allergener: {item.allergens}
              </p>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-lg border border-[#707164]/40 bg-[#12110D]/80 p-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#EAC84E]">
          Viktig information
        </p>
        <p className="mt-2 text-base text-[#E5E7E3]/95">{ASIATISK_MENU_FOOTER}</p>
      </div>
    </div>
  );
}
