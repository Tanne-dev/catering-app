"use client";

import { useState } from "react";
import { FORMSPREE_FORM_ID } from "@/data/contact";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";

const FEEDBACK_PER_COLUMN = 6;

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} av ${max} stjärnor`}>
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

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="flex flex-col rounded-xl border border-[#707164]/30 bg-[#1a1916]/80 p-5 backdrop-blur-sm sm:p-6">
      <StarRating rating={item.rating} />
      <blockquote className="mt-3 flex-1 text-[#E5E7E3]/90 leading-relaxed">
        &ldquo;{item.text}&rdquo;
      </blockquote>
      <footer className="mt-4 flex items-center justify-between gap-2 border-t border-[#707164]/20 pt-3">
        <span className="font-medium text-[#E5E7E3]">{item.name}</span>
        {item.date && (
          <span className="text-sm text-[#707164]">{item.date}</span>
        )}
      </footer>
    </article>
  );
}

export default function TestimonialsSection() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const displayRating = hoverRating || rating;
  const columns = chunk(TESTIMONIALS, FEEDBACK_PER_COLUMN);
  const currentFeedback = columns[currentPage] ?? [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const ratingValue = rating || 0;
    if (ratingValue < 1) {
      setError("Välj antal stjärnor.");
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
        setError("Kunde inte skicka. Försök igen senare.");
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
      className="relative border-t border-[#707164]/25 py-16 md:py-20 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/omdomen-bg.png)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#12110D]/85" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="testimonials-heading"
            className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E] sm:text-3xl"
            style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
          >
            Omdömen
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-[#C49B38]/70" aria-hidden />
          <p className="mt-4 text-[#E5E7E3]/80">
            Det betyder mycket för oss vad våra kunder tycker. Här är några omdömen från dem som beställt catering hos oss.
          </p>
        </div>

        {/* Lista omdömen: visa en sida (6 st) i taget */}
        <div className="mt-10">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {currentFeedback.map((item, i) => (
              <li key={currentPage * FEEDBACK_PER_COLUMN + i}>
                <TestimonialCard item={item} />
              </li>
            ))}
          </ul>

          {/* Indikatorer: klicka för att byta sida (fler / äldre omdömen) */}
          {columns.length > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
              <span className="mr-1 text-xs text-[#E5E7E3]/70 sm:mr-2 sm:text-sm">Sida:</span>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2" role="tablist" aria-label="Välj sida med omdömen">
                {columns.map((_, pageIndex) => (
                  <button
                    key={pageIndex}
                    type="button"
                    role="tab"
                    aria-selected={currentPage === pageIndex}
                    aria-label={`Sida ${pageIndex + 1}, ${columns[pageIndex].length} omdömen`}
                    onClick={() => setCurrentPage(pageIndex)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#EAC84E] focus:ring-offset-2 focus:ring-offset-[#12110D] sm:h-10 sm:w-10 sm:text-sm ${
                      currentPage === pageIndex
                        ? "bg-[#EAC84E] text-[#12110D]"
                        : "bg-[#707164]/30 text-[#E5E7E3]/80 hover:bg-[#707164]/50 hover:text-[#E5E7E3]"
                    }`}
                  >
                    {pageIndex + 1}
                  </button>
                ))}
              </div>
              <span className="ml-1 text-xs text-[#E5E7E3]/70 sm:ml-2 sm:text-sm">
                {currentPage + 1} / {columns.length}
              </span>
            </div>
          )}
        </div>

        {/* Formulär: Skicka ditt omdöme */}
        <div id="skicka-omdome" className="mt-12 scroll-mt-24 rounded-2xl border border-[#707164]/30 bg-[#1a1916]/60 p-5 backdrop-blur-sm sm:mt-16 sm:p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-[#EAC84E] sm:text-2xl" style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}>
            Skicka ditt omdöme
          </h3>
          <p className="mt-2 text-sm text-[#E5E7E3]/80">
            Har du använt vår catering? Vi uppskattar din feedback. Ditt omdöme kan publiceras på sidan (vi kontaktar dig först).
          </p>

          {submitted ? (
            <div className="mt-6 rounded-xl border border-[#C49B38]/40 bg-[#1a1916] p-5 text-center">
              <p className="font-medium text-[#E5E7E3]">Tack för ditt omdöme!</p>
              <p className="mt-1 text-sm text-[#E5E7E3]/80">
                Vi tar emot din feedback och återkommer om vi vill publicera den.
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
                <span className="block text-sm font-medium text-[#E5E7E3]">Betyg (1–5 stjärnor) *</span>
                <div className="mt-2 flex gap-2 sm:gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="flex h-11 w-11 items-center justify-center text-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#EAC84E] focus:ring-offset-2 focus:ring-offset-[#12110D] sm:h-auto sm:w-auto"
                      aria-label={`${value} stjärnor`}
                      aria-pressed={rating === value}
                    >
                      <span className={value <= displayRating ? "text-[#EAC84E]" : "text-[#707164]/50"}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-[#707164]">
                  {displayRating ? `${displayRating} av 5 stjärnor` : "Klicka för att välja"}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="review-name" className="block text-sm font-medium text-[#E5E7E3]">
                    Namn *
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    name="name"
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                    placeholder="Ditt namn"
                  />
                </div>
                <div>
                  <label htmlFor="review-email" className="block text-sm font-medium text-[#E5E7E3]">
                    E-post *
                  </label>
                  <input
                    id="review-email"
                    type="email"
                    name="email"
                    required
                    aria-required="true"
                    className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                    placeholder="din@epost.se"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="review-message" className="block text-sm font-medium text-[#E5E7E3]">
                  Ditt omdöme / feedback *
                </label>
                <textarea
                  id="review-message"
                  name="message"
                  required
                  aria-required="true"
                  rows={4}
                  className="mt-1 w-full resize-y rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                  placeholder="Berätta gärna om din upplevelse med vår catering."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="rounded-lg bg-[#C49B38] px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-[#D4A83E] focus:outline-none focus:ring-2 focus:ring-[#EAC84E] focus:ring-offset-2 focus:ring-offset-[#12110D] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {sending ? "Skickar…" : "Skicka omdöme"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
