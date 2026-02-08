"use client";

import Link from "next/link";

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

const BULLETS = [
  "15+ års erfarenhet från restaurangbranschen",
  "Professionellt organiserat och noggrant genomfört vid varje evenemang",
];

export default function Hero() {
  return (
    <section
      className="relative min-h-[85vh] w-full overflow-hidden py-16 md:py-20 lg:min-h-[90vh] lg:py-24"
      aria-labelledby="hero-heading"
    >
      <img
        src="/img-hero.png"
        alt="Catering och matservering – vietnamesisk och svensk mat"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(18,17,13,0.78) 0%, rgba(18,17,13,0.5) 40%, rgba(18,17,13,0.15) 70%, transparent 100%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[85vh] items-center lg:min-h-[90vh]">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-0 sm:pl-8 sm:text-left md:pl-12 lg:pl-16">
            <h1
              id="hero-heading"
              className="font-serif text-2xl font-medium tracking-tight text-[#EAC84E] sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl"
              style={{
                fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
              }}
            >
              Vietnamesisk & svensk catering
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[#D5D7D3] sm:mt-4 sm:text-lg md:text-xl">
              Autentisk vietnamesisk och svensk mat för dina evenemang
            </p>
            <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3" role="list">
              {BULLETS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[#D5D7D3] sm:gap-3">
                  <span className="mt-0.5 shrink-0 text-[#C49B38]" aria-hidden>
                    <CheckIcon />
                  </span>
                  <span className="text-sm leading-relaxed sm:text-base md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:gap-4">
              <Link
                href="#quote"
                className="inline-flex h-11 w-full items-center justify-center rounded-[13px] bg-[#C49B38] px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D4A83E] hover:shadow-md sm:w-auto sm:min-w-[140px] sm:text-base"
              >
                Begär offert
              </Link>
              <Link
                href="#services"
                className="inline-flex h-11 w-full items-center justify-center rounded-[13px] border border-[#707164] bg-black/30 px-5 text-sm font-semibold text-[#D5D7D3] backdrop-blur-sm transition-colors hover:border-[#C49B38] hover:bg-black/40 sm:w-auto sm:min-w-[140px] sm:text-base"
              >
                Våra tjänster
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
