"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import LazyBackground from "@/components/LazyBackground";
import { FORMSPREE_FORM_ID } from "@/data/contact";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";

const AUTO_SLIDE_INTERVAL_MS = 3500;

function StarRating({ rating, max = 5, ariaLabel }: { rating: number; max?: number; ariaLabel: string }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={ariaLabel}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-[#EAC84E]" : "text-[#707164]/60"}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ item, starAriaLabel }: { item: Testimonial; starAriaLabel: string }) {
  return (
    <article className="flex min-h-[200px] sm:min-h-[220px] flex-col rounded-xl border border-[#707164]/30 bg-[#1a1916]/80 p-5 backdrop-blur-sm sm:p-6">
      <StarRating rating={item.rating} ariaLabel={starAriaLabel} />
      <blockquote className="mt-3 min-h-[5.5rem] flex-1 text-[#E5E7E3]/90 leading-relaxed sm:min-h-[6rem]">
        &ldquo;{item.text}&rdquo;
      </blockquote>
      <footer className="mt-4 flex shrink-0 items-center justify-between gap-2 border-t border-[#707164]/20 pt-3">
        <span className="font-medium text-[#E5E7E3]">{item.name}</span>
        {item.date && (
          <span className="text-sm text-[#707164]">{item.date}</span>
        )}
      </footer>
    </article>
  );
}

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayRating = hoverRating || rating;
  const currentFeedback = TESTIMONIALS[currentIndex];

  useEffect(() => {
    if (TESTIMONIALS.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, AUTO_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const ratingValue = rating || 0;
    if (ratingValue < 1) {
      setError(t("selectStars"));
      return;
    }

    if (FORMSPREE_FORM_ID) {
      setSending(true);
      try {
        const formData = new FormData(form);
        formData.set("rating", String(ratingValue));
        formData.set("_subject", "Nytt omdöme – Catering Tanne");
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Något gick fel.");
        setSubmitted(true);
      } catch {
        setError(t("errorSend"));
      } finally {
        setSending(false);
      }
    } else {
      const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value ?? "";
      const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? "";
      const message = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value ?? "";
      const subject = encodeURIComponent("Nytt omdöme – Catering Tanne");
      const body = encodeURIComponent(
        `Namn: ${name}\nE-post: ${email}\nBetyg: ${ratingValue}/5 stjärnor\n\nMeddelande:\n${message}`
      );
      window.location.href = `mailto:info@cateringtanne.se?subject=${subject}&body=${body}`;
      setSubmitted(true);
    }
  }

  return (
    <section
      id="testimonials"
      className="relative border-t border-[#707164]/25 py-16 md:min-h-screen md:snap-start md:py-20 overflow-hidden"
      aria-labelledby="testimonials-heading"
      suppressHydrationWarning
    >
      <LazyBackground
        src="/omdomen-bg.png"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        aria-hidden
      >
        {null}
      </LazyBackground>
      <div className="absolute inset-0 bg-[#12110D]/85" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="testimonials-heading"
            className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E] sm:text-3xl"
            style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
          >
            {t("heading")}
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-[#C49B38]/70" aria-hidden />
          <p className="mt-4 text-[#E5E7E3]/80">
            {t("intro")}
          </p>
        </div>

        {/* Omdömen: 1 feedback i taget, auto-slide var 2:a sekund, fade-effekt */}
        <div className="mt-10">
          {currentFeedback ? (
            <div key={currentIndex} className="mx-auto max-w-2xl animate-testimonial-fade" role="list">
              <TestimonialCard item={currentFeedback} starAriaLabel={t("ofStars", { count: currentFeedback.rating })} />
            </div>
          ) : null}

          {TESTIMONIALS.length > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2" role="tablist" aria-label={t("selectTestimonial")}>
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={currentIndex === idx}
                    aria-label={`${t("selectTestimonial")} ${idx + 1}: ${TESTIMONIALS[idx].name}`}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#EAC84E] focus:ring-offset-2 focus:ring-offset-[#12110D] sm:h-3 sm:w-3 ${
                      currentIndex === idx
                        ? "bg-[#EAC84E] scale-125"
                        : "bg-[#707164]/40 hover:bg-[#707164]/60"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-xs text-[#E5E7E3]/70 sm:text-sm">
                {currentIndex + 1} / {TESTIMONIALS.length}
              </span>
            </div>
          )}
        </div>

        {/* Formulär: Skicka ditt omdöme */}
        <div id="skicka-omdome" className="mt-12 scroll-mt-24 rounded-2xl border border-[#707164]/30 bg-[#1a1916]/60 p-5 backdrop-blur-sm sm:mt-16 sm:p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-[#EAC84E] sm:text-2xl" style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}>
            {t("submitTitle")}
          </h3>
          <p className="mt-2 text-sm text-[#E5E7E3]/80">
            {t("submitIntro")}
          </p>

          {submitted ? (
            <div className="mt-6 rounded-xl border border-[#C49B38]/40 bg-[#1a1916] p-5 text-center">
              <p className="font-medium text-[#E5E7E3]">{t("thanksTitle")}</p>
              <p className="mt-1 text-sm text-[#E5E7E3]/80">
                {t("thanksMessage")}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
              aria-invalid={!!error}
              aria-describedby={error ? "review-error" : undefined}
            >
              {error && (
                <p id="review-error" className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-200" role="alert">
                  {error}
                </p>
              )}

              <div>
                <span className="block text-sm font-medium text-[#E5E7E3]">{t("ratingLabel")}</span>
                <div className="mt-2 flex gap-2 sm:gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="flex h-11 w-11 items-center justify-center text-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#EAC84E] focus:ring-offset-2 focus:ring-offset-[#12110D] sm:h-auto sm:w-auto"
                      aria-label={`${value} ${t("stars")}`}
                      aria-pressed={rating === value}
                    >
                      <span className={value <= displayRating ? "text-[#EAC84E]" : "text-[#707164]/50"}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-[#707164]">
                  {displayRating ? t("ofStars", { count: displayRating }) : t("clickToSelect")}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="review-name" className="block text-sm font-medium text-[#E5E7E3]">
                    {t("nameLabel")} *
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    name="name"
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                    placeholder={t("reviewNamePlaceholder")}
                  />
                </div>
                <div>
                  <label htmlFor="review-email" className="block text-sm font-medium text-[#E5E7E3]">
                    {t("emailLabel")} *
                  </label>
                  <input
                    id="review-email"
                    type="email"
                    name="email"
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                    placeholder={t("reviewEmailPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="review-message" className="block text-sm font-medium text-[#E5E7E3]">
                  {t("yourReview")}
                </label>
                <textarea
                  id="review-message"
                  name="message"
                  required
                  aria-required="true"
                  rows={4}
                  className="mt-1 w-full resize-y rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                  placeholder={t("reviewPlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-outline w-full sm:w-auto px-6 py-2.5 text-base"
              >
                {sending ? t("sending") : t("sendReview")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
