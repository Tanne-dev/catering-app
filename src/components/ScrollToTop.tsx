"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scrolla till toppen"
      className="fixed bottom-4 right-4 z-50 overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#EAC84E] focus:ring-offset-2 focus:ring-offset-[#12110D] sm:bottom-6 sm:right-6"
    >
      <Image
        src="/scroll-to-top-card.png"
        alt="Scrolla till toppen"
        width={140}
        height={88}
        sizes="100px"
        className="h-auto w-[100px] sm:w-[120px] md:w-[140px]"
      />
    </button>
  );
}
