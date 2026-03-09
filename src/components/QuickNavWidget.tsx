"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export default function QuickNavWidget() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const tGoals = useTranslations("goals");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const scrollToTop = () => {
    const main = document.getElementById("main-content");
    if (main) {
      main.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setOpen(false);
  };

  const isHome = pathname === "/";

  const itemClass =
    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium tracking-wide text-[#E5E7E3] transition-all duration-150 hover:bg-[#EAC84E]/12 hover:text-[#EAC84E] hover:pl-5";

  const links = [
    { href: isHome ? "#services" : "/#services", label: t("ourServices") },
    { href: isHome ? "#menus" : "/#menus", label: t("menu") },
    { href: isHome ? "#quote" : "/#quote", label: t("requestQuote") },
    { href: isHome ? "#contact" : "/#contact", label: t("contact") },
    { href: isHome ? "#goals" : "/#goals", label: tGoals("heading") },
    { href: isHome ? "#footer" : "/#footer", label: "Footer" },
  ] as const;

  return (
    <div className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8" ref={ref}>
      {open && (
        <div
          className="absolute bottom-full right-0 mb-3 w-64 overflow-hidden rounded-2xl border border-[#707164]/25 bg-[#1a1916]/98 shadow-2xl shadow-black/40 backdrop-blur-md"
          style={{ boxShadow: "0 20px 45px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(196,155,56,0.08)" }}
          role="menu"
        >
          <div className="border-b border-[#707164]/20 bg-[#C49B38]/10 px-4 py-3 text-[#EAC84E]">
            <div className="flex items-center gap-2">
              <CompassIcon />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Snabbnavigering
              </span>
            </div>
          </div>
          <nav className="py-2">
            {links.map(({ href, label }) =>
              isHome ? (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={itemClass}
                  role="menuitem"
                >
                  {label}
                </a>
              ) : (
                <Link key={href} href={href} onClick={() => setOpen(false)} className={itemClass} role="menuitem">
                  {label}
                </Link>
              )
            )}
          </nav>
          <div className="border-t border-[#707164]/25 bg-[#12110D]/50">
            <button
              type="button"
              onClick={scrollToTop}
              className={`${itemClass} w-full`}
              role="menuitem"
            >
              <ChevronUpIcon />
              <span>{tCommon("scrollToTop")}</span>
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-[#B8923A]/50 bg-[#C49B38] text-[#12110D] shadow-lg transition-all hover:scale-105 hover:border-[#D4A83E]/70 hover:bg-[#D4A83E] hover:text-white hover:shadow-xl hover:shadow-[#C49B38]/25 focus:outline-none focus:ring-2 focus:ring-[#EAC84E]/60 focus:ring-offset-2 focus:ring-offset-[#12110D]"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={open ? tCommon("close") : "Snabbnavigering"}
      >
        <MenuIcon />
      </button>
    </div>
  );
}
