"use client";

import Image from "next/image";
import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";

type ImageLightboxProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function ImageLightbox({
  src,
  alt,
  caption,
  width = 320,
  height = 240,
  className = "",
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className={`block w-full overflow-hidden rounded-lg border border-[#707164]/30 focus:outline-none focus:ring-2 focus:ring-[#C49B38] ${className}`}
        aria-label={`${alt} – klicka för att förstora`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-48 w-full object-cover transition hover:opacity-95"
          sizes="(max-width: 640px) 100vw, 320px"
          loading="lazy"
          unoptimized={src.startsWith("http")}
        />
      </button>

      {mounted && typeof document !== "undefined" && open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Stäng"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative max-h-[90vh] max-w-full cursor-pointer" onClick={close}>
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={900}
                className="max-h-[90vh] w-auto max-w-full rounded-lg object-contain"
                sizes="100vw"
                loading="lazy"
                unoptimized={src.startsWith("http")}
              />
              {caption && (
                <p className="mt-2 text-center text-sm text-white/90">{caption}</p>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
