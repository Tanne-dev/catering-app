"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import LazyBackground from "@/components/LazyBackground";
import { useCart } from "@/contexts/CartContext";
import { CONTACT } from "@/data/contact";
import { useSelectedService } from "@/contexts/SelectedServiceContext";

const SCROLL_TO_QUOTE_KEY = "scrollToQuote";

export default function ContactSection() {
  const t = useTranslations("contact");
  const SERVICE_OPTIONS = [
    { value: "", label: t("selectCatering") },
    { value: "cateringleverans", label: t("cateringDelivery") },
    { value: "ovrigt", label: t("other") },
  ];
  const quoteRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { items: cartItems, totalQuantity } = useCart();
  const { setSelectedServiceId } = useSelectedService();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !quoteRef.current) return;
    if (sessionStorage.getItem(SCROLL_TO_QUOTE_KEY) !== "1") return;
    sessionStorage.removeItem(SCROLL_TO_QUOTE_KEY);
    // Đóng mọi panel meny đang mở trước khi cuộn
    setSelectedServiceId(null);
    const el = quoteRef.current;
    // Dùng scrollIntoView + scroll-mt-24 để tương thích iOS
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.history.replaceState) {
      window.history.replaceState(null, "", "/#quote");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    let savedOrderId: string | null = null;

    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value ?? "";
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? "";
    const phone = (form.querySelector('[name="phone"]') as HTMLInputElement)?.value ?? "";
    const address = (form.querySelector('[name="address"]') as HTMLInputElement)?.value ?? "";
    const date = (form.querySelector('[name="date"]') as HTMLInputElement)?.value ?? "";
    const guests = (form.querySelector('[name="guests"]') as HTMLInputElement)?.value ?? "";
    const service = (form.querySelector('[name="service"]') as HTMLSelectElement)?.selectedOptions?.[0]?.text ?? "";
    const message = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value ?? "";

    const cartText = cartItems.length > 0
      ? `Beställning:\n${cartItems.map((i) => `• ${i.itemName}: ${i.quantity} ${i.unit ?? "portion"}`).join("\n")}\n\nTotalt: ${totalQuantity} st`
      : null;

    setSending(true);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0cdeab99-f7cb-4cee-9943-94270784127d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ContactSection.tsx:handleSubmit',message:'order submit start',data:{name:name?.slice(0,3),email:email?.slice(0,5)},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          event_date: date,
          guests,
          service,
          message,
          cart_summary: cartText,
        }),
      });
      if (!orderRes.ok) {
        let errMessage = t("errorSave");
        try {
          const errData = await orderRes.json();
          if (typeof (errData as { error?: string }).error === "string") {
            errMessage = (errData as { error: string }).error;
          }
        } catch {
          const text = await orderRes.text();
          if (text.length > 0 && text.length < 500) errMessage = text;
        }
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/0cdeab99-f7cb-4cee-9943-94270784127d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ContactSection.tsx:handleSubmit',message:'order submit fail',data:{ok:false,status:orderRes.status,errMessage:errMessage.slice(0,80)},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
        // #endregion
        setError(errMessage);
        setSending(false);
        return;
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0cdeab99-f7cb-4cee-9943-94270784127d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ContactSection.tsx:handleSubmit',message:'order submit ok',data:{ok:true,status:orderRes.status},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
      // #endregion
      const orderData = (await orderRes.json()) as { id?: string };
      savedOrderId = orderData?.id ?? null;
      setOrderId(savedOrderId);
    } catch {
        setError(t("errorSave"));
      setSending(false);
      return;
    }

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote",
          name,
          email,
          phone,
          address,
          event_date: date,
          guests,
          service,
          message,
          cart_summary: cartText,
          order_id: savedOrderId,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as { error?: string }).error ?? "Något gick fel.");
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errorSend"));
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative border-t border-[#707164]/25 py-16 md:min-h-screen md:snap-start md:py-20"
      aria-labelledby="contact-heading"
    >
      {/* Background image */}
      <LazyBackground
        src="/contact-bg.png"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        aria-hidden
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#12110D]/90" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Kontaktinfo */}
          <div className="mx-auto w-full max-w-xl text-center md:max-w-none md:text-left">
            <h2
              id="contact-heading"
              className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E] sm:text-3xl"
              style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
            >
              {t("heading")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#E5E7E3]/90">
              {t("intro")}
            </p>
            <dl className="mt-8 space-y-4">
              <div>
                <dt className="text-sm font-medium uppercase tracking-wider text-[#C49B38]">
                  {t("email")}
                </dt>
                <dd>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="mt-1 text-lg text-[#E5E7E3] hover:text-[#EAC84E]"
                  >
                    {CONTACT.email}
                  </a>
                </dd>
              </div>
              {CONTACT.hoursNote && (
                <div>
                  <dt className="text-sm font-medium uppercase tracking-wider text-[#C49B38]">
                    {t("responseTime")}
                  </dt>
                  <dd className="mt-1 text-[#E5E7E3]/80">{CONTACT.hoursNote}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Form Skicka förfrågan */}
          <div
            id="quote"
            ref={quoteRef}
            className="scroll-mt-24 mx-auto w-full max-w-xl md:max-w-none"
          >
            <h3 className="font-serif text-xl font-semibold text-[#EAC84E] sm:text-2xl" style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}>
              {t("requestQuote")}
            </h3>
            <p className="mt-2 text-sm text-[#E5E7E3]/80">
              {t("formIntro")}
            </p>
            {cartItems.length > 0 && !submitted && (
              <div className="mt-4 rounded-lg border border-[#C49B38]/40 bg-[#1a1916]/80 p-4">
                <p className="text-sm font-semibold text-[#EAC84E]">{t("yourOrder")}</p>
                <ul className="mt-2 space-y-1 text-sm text-[#E5E7E3]/95">
                  {cartItems.map((i) => (
                    <li key={`${i.menuSlug}-${i.itemName}`}>
                      {i.itemName}: {i.quantity} {i.unit ?? "portion"}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm font-medium text-[#C49B38]">
                  {t("total")}: {totalQuantity} st
                </p>
              </div>
            )}

            {submitted ? (
              <div
                className="form-success-enter mt-8 rounded-2xl border border-[#C49B38]/40 bg-[#1a1916]/95 px-6 py-10 text-center shadow-lg backdrop-blur-sm sm:px-8 sm:py-12"
                role="status"
                aria-live="polite"
              >
                <div className="form-success-checkmark mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#EAC84E] bg-[#C49B38]/20 sm:h-20 sm:w-20">
                  <svg
                    className="h-8 w-8 text-[#EAC84E] sm:h-10 sm:w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="form-success-line mt-6 inline-block h-px w-16 bg-[#EAC84E]/60" />
                <h4 className="mt-5 font-serif text-xl font-semibold text-[#E5E7E3] sm:text-2xl" style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}>
                  {t("successTitle")}
                </h4>
                <p className="mt-3 text-[#E5E7E3]/90">
                  {t("successMessage")}
                </p>
                {orderId && (
                  <p className="mt-2 text-sm font-medium text-[#EAC84E]">
                    {t("orderNumber")}: {orderId}
                  </p>
                )}
                <p className="mt-4 text-sm text-[#C49B38]">
                  {t("checkEmail")}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
                aria-invalid={!!error}
                aria-describedby={error ? "quote-error" : undefined}
              >
                {error && (
                  <p id="quote-error" className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-200" role="alert">
                    {error}
                  </p>
                )}
                <div>
                  <label htmlFor="quote-name" className="block text-sm font-medium text-[#E5E7E3]">
                    {t("name")} *
                  </label>
                  <input
                    id="quote-name"
                    type="text"
                    name="name"
                    required
                    aria-required="true"
                    defaultValue={session?.user?.name ?? ""}
                    className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                    placeholder={t("namePlaceholder")}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="quote-email" className="block text-sm font-medium text-[#E5E7E3]">
                      {t("emailLabel")} *
                    </label>
                    <input
                      id="quote-email"
                      type="email"
                      name="email"
                      required
                      aria-required="true"
                      defaultValue={session?.user?.email ?? ""}
                      className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                      placeholder={t("emailPlaceholder")}
                    />
                  </div>
                  <div>
                    <label htmlFor="quote-phone" className="block text-sm font-medium text-[#E5E7E3]">
                      {t("phone")}
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      name="phone"
                      className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                      placeholder={t("phonePlaceholder")}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="quote-address" className="block text-sm font-medium text-[#E5E7E3]">
                    {t("address")}
                  </label>
                  <input
                    id="quote-address"
                    type="text"
                    name="address"
                    className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                    placeholder={t("addressPlaceholder")}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="quote-date" className="block text-sm font-medium text-[#E5E7E3]">
                      {t("eventDate")} *
                    </label>
                    <input
                      id="quote-date"
                      type="date"
                      name="date"
                      required
                      aria-required="true"
                      className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                    />
                  </div>
                  <div>
                    <label htmlFor="quote-guests" className="block text-sm font-medium text-[#E5E7E3]">
                      {t("guestCount")} *
                    </label>
                    <input
                      id="quote-guests"
                      type="number"
                      name="guests"
                      required
                      aria-required="true"
                      min={1}
                      className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                      placeholder={t("guestsPlaceholder")}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="quote-service" className="block text-sm font-medium text-[#E5E7E3]">
                    {t("cateringType")}
                  </label>
                  <select
                    id="quote-service"
                    name="service"
                    className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt.value || "empty"} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="quote-message" className="block text-sm font-medium text-[#E5E7E3]">
                    {t("message")}
                  </label>
                  <textarea
                    id="quote-message"
                    name="message"
                    rows={4}
                    className="mt-1 w-full resize-y rounded-lg border border-[#707164]/50 bg-[#1a1916] px-4 py-2.5 text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                    placeholder={t("messagePlaceholder")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-outline w-full py-3 text-base"
                >
                  {sending ? t("sending") : t("sendRequest")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
