"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import PriceCalculator from "@/components/PriceCalculator";

type MenuId = "sushi" | "asiatisk" | "kombinerat";

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Hero() {
  const t = useTranslations("hero");
  const { data: session, status } = useSession();
  const isAdmin = status === "authenticated" && (session?.user as { role?: string })?.role === "admin";
  const [showCalculator, setShowCalculator] = useState(false);
  const [guests, setGuests] = useState(30);
  const [menu, setMenu] = useState<MenuId>("kombinerat");

  return (
    <section
      className="relative min-h-[85vh] w-full overflow-hidden py-16 md:min-h-screen md:snap-start md:py-20 lg:min-h-[90vh] lg:py-24"
      aria-labelledby="hero-heading"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ filter: "brightness(1.35)" }}
        aria-hidden
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(18,17,13,0.78) 0%, rgba(18,17,13,0.5) 40%, rgba(18,17,13,0.15) 70%, transparent 100%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 min-h-[85vh] w-full overflow-hidden lg:min-h-[90vh]">
        <div
          className="flex h-full min-h-[85vh] w-[200vw] transition-transform duration-500 ease-out lg:min-h-[90vh]"
          style={{ transform: showCalculator ? "translateX(-50%)" : "translateX(0)" }}
        >
          {/* Hero content panel */}
          <div className="flex h-full w-[100vw] shrink-0 items-center justify-center">
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl px-4 text-center sm:max-w-3xl">
                <h1
                  id="hero-heading"
                  className="font-serif text-3xl font-medium tracking-tight text-[#EAC84E] sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl"
                  style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
                >
                  <Image
                    src="/logo-catering-tanne.png"
                    alt={t("alt")}
                    width={485}
                    height={67}
                    sizes="(max-width: 640px) 320px, (max-width: 768px) 400px, 520px"
                    className="mx-auto h-auto w-full max-w-[320px] object-contain object-center sm:max-w-[400px] md:max-w-[480px] lg:max-w-[520px]"
                    priority
                  />
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-[#D5D7D3] sm:mt-5 sm:text-xl md:text-2xl">
                  {t("intro")}
                </p>
                <ul className="mx-auto mt-6 max-w-xl space-y-3 text-left sm:mt-8 sm:max-w-2xl sm:space-y-4" role="list">
              {(["bullet1", "bullet2"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3 text-[#D5D7D3] sm:gap-4">
                  <span className="mt-0.5 shrink-0 text-[#C49B38]" aria-hidden>
                    <CheckIcon />
                  </span>
                  <span className="text-base leading-relaxed sm:text-lg md:text-xl">{t(key)}</span>
                </li>
              ))}
                </ul>
                <div className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-4 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-5">
              <Link href="#quote" className="btn-outline w-full py-3 text-base sm:w-auto sm:min-w-[180px] sm:py-3.5">
                {t("requestQuote")}
              </Link>
              <button
                type="button"
                onClick={() => setShowCalculator(true)}
                className="btn-outline w-full py-3 text-base sm:w-auto sm:min-w-[180px] sm:py-3.5"
              >
                {t("priceCalculator")}
              </button>
              {isAdmin && (
                <Link href="/admin/tables" className="btn-outline w-full py-3 text-base sm:w-auto sm:min-w-[180px] sm:py-3.5">
                  {t("manageTables")}
                </Link>
              )}
                </div>
              </div>
            </div>
          </div>

          {/* Price calculator panel – centered in viewport */}
          <div className="flex h-full w-[100vw] shrink-0 items-center justify-center">
            <PriceCalculator
            guests={guests}
            menu={menu}
            onGuestsChange={setGuests}
            onMenuChange={setMenu}
            onClose={() => setShowCalculator(false)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
