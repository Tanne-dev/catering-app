"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SCROLL_TO_QUOTE_KEY = "scrollToQuote";

/**
 * Khi truy cập trang chủ lần đầu, refresh, hoặc quay lại trang chủ: cuộn lên đầu trang.
 * Ngoại lệ: khi đang thực hiện tác vụ (hash #quote, #menus hoặc sessionStorage scrollToQuote)
 * thì không cuộn lên, để ScrollToQuoteOnHash / ScrollToMenuOnQuery xử lý.
 */
export default function ScrollToTopOnHome() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/" || typeof window === "undefined") return;

    const hash = window.location.hash || "";
    const hasQuoteTask =
      hash === "#quote" || sessionStorage.getItem(SCROLL_TO_QUOTE_KEY) === "1";
    const hasMenuTask = hash === "#menus";

    if (hasQuoteTask || hasMenuTask) return;

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const main = document.getElementById("main-content");
      if (main) main.scrollTop = 0;
    };

    scrollToTop();
  }, [pathname]);

  return null;
}
