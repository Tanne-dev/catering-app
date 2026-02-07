"use client";

import Image from "next/image";
import { useEffect, useCallback, useState } from "react";

type ImageLightboxProps = {
  src: string;
  alt: string;
  caption?: string;
  /** Kích thước ảnh trong list (trước khi click) */
  width?: number;
  height?: number;
  className?: string;
  /** Kích thước ảnh khi phóng to (lightbox) */
  lightboxSizes?: { width: number; height: number };
};

export default function ImageLightbox({
  src,
  alt,
  caption,
  width = 320,
  height = 240,
  className = "",
  lightboxSizes,
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

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

  const lw = lightboxSizes?.width ?? 1200;
  const lh = lightboxSizes?.height ?? 900;

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
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
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
          <div
            className="relative max-h-[90vh] max-w-full cursor-pointer"
            onClick={toggle}
          >
            <Image
              src={src}
              alt={alt}
              width={lw}
              height={lh}
              className="max-h-[90vh] w-auto max-w-full rounded-lg object-contain"
              sizes="100vw"
              priority
            />
            {caption && (
              <p className="mt-2 text-center text-sm text-white/90">{caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
