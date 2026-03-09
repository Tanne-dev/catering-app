"use client";

import { useEffect, useRef, useState } from "react";

type Side = "left" | "right";

const REVEAL_OFFSET = 48;
const REVEAL_DURATION_MS = 900;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type ScrollRevealProps = {
  children: React.ReactNode;
  side?: Side;
  className?: string;
};

/**
 * När användaren scrollar ner: innehållet glider in från vänster eller höger med mjuk övergång.
 * När användaren scrollar upp och blocket lämnar vyn: glider tillbaka.
 */
export default function ScrollReveal({ children, side = "left", className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const hasRevealed = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    const el = ref.current;
    const main = document.getElementById("main-content");
    const isMainScroller = main && getComputedStyle(main).overflowY !== "visible";
    const scrollRoot = isMainScroller ? main : null;

    const getScrollY = () => {
      if (scrollRoot) return scrollRoot.scrollTop;
      return window.scrollY ?? window.pageYOffset;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const scrollY = getScrollY();
        const scrollingDown = scrollY >= lastScrollY.current;
        lastScrollY.current = scrollY;

        if (entry.isIntersecting) {
          if (scrollingDown) {
            hasRevealed.current = true;
            setVisible(true);
          }
        } else {
          const rect = entry.boundingClientRect;
          if (rect.bottom < 0) {
            hasRevealed.current = false;
            setVisible(false);
          }
        }
      },
      {
        root: scrollRoot ?? undefined,
        rootMargin: "0px 0px -5% 0px",
        threshold: 0.1,
      }
    );

    observer.observe(el);

    const scrollTarget = scrollRoot ?? window;
    const onScroll = () => {
      lastScrollY.current = getScrollY();
    };
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });

    const timer = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const viewHeight = scrollRoot ? scrollRoot.clientHeight : window.innerHeight;
      if (rect.top < viewHeight * 0.85) {
        hasRevealed.current = true;
        setVisible(true);
      }
    }, 200);

    return () => {
      observer.disconnect();
      scrollTarget.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const translate = side === "left" ? -REVEAL_OFFSET : REVEAL_OFFSET;

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${translate}px)`,
        transition: `opacity ${REVEAL_DURATION_MS}ms ${EASE}, transform ${REVEAL_DURATION_MS}ms ${EASE}`,
        willChange: visible ? "auto" : "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
