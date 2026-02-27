"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import LazyBackground from "@/components/LazyBackground";
import { useCart } from "@/contexts/CartContext";

const SCROLL_TO_QUOTE_KEY = "scrollToQuote";

export default function VarukorgPage() {
  const t = useTranslations("varukorg");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, removeItem, totalQuantity } = useCart();
  const isGuest = status === "authenticated" && (session?.user as { role?: string })?.role === "guest";
  const isAdmin = status === "authenticated" && (session?.user as { role?: string })?.role === "admin";
  const canRequestQuote = status === "authenticated" && (isGuest || isAdmin);

  function handleBegarOffert() {
    if (!canRequestQuote) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(SCROLL_TO_QUOTE_KEY, "1");
      }
      signIn("google", { callbackUrl: "/#quote" });
      return;
    }
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SCROLL_TO_QUOTE_KEY, "1");
    }
    router.push("/#quote", { scroll: false });
  }

  return (
    <main id="main-content" className="relative min-h-[60vh] pb-16">
      <LazyBackground
        src="/varukorg-bg.png"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#12110D]/88" aria-hidden />
      <section className="relative z-10 mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E] sm:text-3xl" style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}>
          {t("heading")}
        </h1>
        <p className="mt-2 text-sm text-[#E5E7E3]/80">
          {t("intro")}
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-[#707164]/50 bg-[#12110D] p-8 text-center">
            <p className="text-[#E5E7E3]/90">{t("empty")}</p>
            <Link
              href="/#menus"
              className="mt-4 inline-block rounded-lg bg-[#C49B38] px-5 py-2.5 text-sm font-semibold text-[#12110D] transition-colors hover:bg-[#D4A83E]"
            >
              {t("seeMenus")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={`${item.menuSlug}-${item.itemName}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-[#707164]/30 bg-[#12110D]/80 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-[#E5E7E3]">{item.itemName}</p>
                    <p className="text-sm text-[#E5E7E3]/80">
                      {item.quantity} {item.unit ?? tCommon("portion")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.menuSlug, item.itemName)}
                    className="rounded px-2 py-1 text-xs text-[#E5E7E3]/70 underline-offset-2 hover:text-red-400 hover:underline"
                    aria-label={`${tCommon("remove")} ${item.itemName}`}
                  >
                    {tCommon("remove")}
                  </button>
                </li>
              ))}
            </ul>
            <p className="border-t border-[#707164]/30 pt-4 text-sm font-medium text-[#C49B38]">
              {t("total")}: {totalQuantity} st
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={handleBegarOffert}
                className="flex-1 rounded-lg bg-[#C49B38] px-5 py-3 text-center text-sm font-semibold text-[#12110D] transition-colors hover:bg-[#D4A83E]"
              >
                {t("requestQuote")}
              </button>
              <Link
                href="/#menus"
                className="flex-1 rounded-lg border border-[#707164]/50 px-5 py-3 text-center text-sm font-medium text-[#E5E7E3] transition-colors hover:bg-[#E5E7E3]/10"
              >
                {t("addMore")}
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
