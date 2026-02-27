"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/request";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  function setLocale(newLocale: Locale) {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="hidden items-center gap-1 rounded-lg border border-[#707164]/40 bg-[#1a1916]/80 px-1.5 py-1 sm:flex">
      <button
        type="button"
        onClick={() => setLocale("sv")}
        className={`rounded px-2.5 py-1 text-xs font-medium transition-colors sm:text-sm ${
          locale === "sv"
            ? "bg-[#EAC84E] text-[#12110D]"
            : "text-[#E5E7E3]/80 hover:bg-[#707164]/30 hover:text-[#E5E7E3]"
        }`}
        aria-pressed={locale === "sv"}
        aria-label="Svenska"
      >
        SV
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded px-2.5 py-1 text-xs font-medium transition-colors sm:text-sm ${
          locale === "en"
            ? "bg-[#EAC84E] text-[#12110D]"
            : "text-[#E5E7E3]/80 hover:bg-[#707164]/30 hover:text-[#E5E7E3]"
        }`}
        aria-pressed={locale === "en"}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
