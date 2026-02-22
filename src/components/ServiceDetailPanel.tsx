"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useSelectedService } from "@/contexts/SelectedServiceContext";
import { SERVICES } from "@/data/services";

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function ServiceDetailPanel() {
  const { selectedServiceId, setSelectedServiceId } = useSelectedService();
  const panelContentRef = useRef<HTMLDivElement>(null);
  const service = selectedServiceId
    ? SERVICES.find((s) => s.id === selectedServiceId)
    : null;

  const isOpen = !!service;

  // Stäng panel vid scroll (när användaren scrollar sidan, inte innehållet i panelen)
  useEffect(() => {
    if (!isOpen) return;
    function handleScroll(e: Event) {
      const target = e.target as Node;
      if (panelContentRef.current?.contains(target)) return;
      setSelectedServiceId(null);
    }
    window.addEventListener("scroll", handleScroll, { capture: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, [isOpen, setSelectedServiceId]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        aria-hidden
        onClick={() => setSelectedServiceId(null)}
      />

      {/* Panel: slide in from right */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-full flex-col bg-[#12110D] shadow-2xl transition-transform duration-300 ease-out sm:max-w-lg sm:w-[480px]"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
        aria-label={service ? `${service.title} – detaljer` : "Stäng"}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        {service && (
          <>
            <div className="flex items-center justify-between border-b border-[#707164]/50 px-4 py-3 sm:px-5 sm:py-4">
              <h2 className="pr-2 text-lg font-semibold text-[#EAC84E] sm:text-xl">
                {service.title}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedServiceId(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#D5D7D3] transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#EAC84E]"
                aria-label="Stäng"
              >
                <CloseIcon />
              </button>
            </div>

            <div ref={panelContentRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-5 sm:py-6">
              <p className="mb-6 text-[#D5D7D3]/90">
                {service.shortDescription}
              </p>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-[#707164]/40">
                  <Image
                    src={service.image1}
                    alt={`${service.title} – bild 1`}
                    width={600}
                    height={360}
                    sizes="(max-width: 640px) 100vw, 480px"
                    className="h-48 w-full object-cover sm:h-56"
                    loading="lazy"
                  />
                </div>
                <div className="overflow-hidden rounded-lg border border-[#707164]/40">
                  <Image
                    src={service.image2}
                    alt={`${service.title} – bild 2`}
                    width={600}
                    height={360}
                    sizes="(max-width: 640px) 100vw, 480px"
                    className="h-48 w-full object-cover sm:h-56"
                    loading="lazy"
                  />
                </div>
              </div>

              <p className="mt-6 leading-relaxed text-[#D5D7D3]">
                {service.longDescription}
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
