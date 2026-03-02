"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/CartContext";

const SCROLL_TO_QUOTE_KEY = "scrollToQuote";

export default function OrderSidebar() {
  const tVarukorg = useTranslations("varukorg");
  const router = useRouter();
  const { items, totalQuantity, removeItem } = useCart();
  const [quoteInView, setQuoteInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("quote");
    if (!el) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => setQuoteInView(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "-60px 0px 0px 0px" }
    );
    observerRef.current.observe(el);
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  function handleSkickaForfragan() {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(SCROLL_TO_QUOTE_KEY, "1");
    window.location.hash = "#quote";
    const scrollToQuote = () => {
      const el = document.getElementById("quote");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };
    if (!scrollToQuote()) {
      router.push("/#quote", { scroll: false });
      setTimeout(scrollToQuote, 300);
    }
  }

  if (items.length === 0) return null;

  return (
    <aside
      className={`fixed right-4 top-28 z-30 flex w-72 shrink-0 flex-col rounded-2xl border border-[#707164]/25 bg-[#1a1916]/95 p-5 shadow-xl shadow-black/25 backdrop-blur-md transition-all duration-300 xl:right-6 xl:w-80 ${
        quoteInView ? "pointer-events-none translate-x-4 opacity-0" : "translate-x-0 opacity-100"
      }`}
      aria-label="Din beställning"
    >
      <h3 className="mb-4 text-base font-semibold tracking-wide text-[#EAC84E]/95">
        Din beställning
      </h3>
        <div className="flex flex-1 flex-col overflow-hidden">
          <ul className="max-h-[min(50vh,400px)] space-y-2 overflow-y-auto overscroll-contain pr-1 scroll-smooth">
            {items.map((item, idx) => (
              <li
                key={`${item.menuSlug}-${item.itemName}`}
                className="animate-fly-in flex items-center justify-between gap-3 rounded-xl border border-[#707164]/20 bg-[#12110D]/60 px-3 py-2.5"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#E5E7E3]">{item.itemName}</p>
                  <p className="text-xs text-[#E5E7E3]/75">
                    {item.quantity} {item.unit ?? "portion"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.menuSlug, item.itemName)}
                  className="shrink-0 text-xs text-[#E5E7E3]/50 transition-colors hover:text-red-400/90"
                  aria-label={`Ta bort ${item.itemName}`}
                >
                  Ta bort
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 shrink-0 border-t border-[#707164]/20 pt-3 text-sm font-semibold text-[#C49B38]/95">
            Totalt: {totalQuantity} st
          </p>
        </div>
      <button
        type="button"
        onClick={handleSkickaForfragan}
        className="mt-5 w-full rounded-xl bg-[#C49B38] px-4 py-3 text-sm font-semibold text-[#12110D] transition-all hover:bg-[#D4A83E] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#EAC84E]/50 focus:ring-offset-2 focus:ring-offset-[#1a1916]"
      >
        {tVarukorg("sidebarCta")}
      </button>
    </aside>
  );
}
