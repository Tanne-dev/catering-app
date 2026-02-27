"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelectedService } from "@/contexts/SelectedServiceContext";

const SCROLL_TO_QUOTE_KEY = "scrollToQuote";

/**
 * Sau khi điều hướng từ varukorg (hoặc link /#quote), cuộn tới phần Begär offert.
 * Dùng sessionStorage khi bấm từ varukorg vì hash có thể chưa áp dụng kịp khi trang load.
 */
export default function ScrollToQuoteOnHash() {
  const pathname = usePathname();
  const { setSelectedServiceId } = useSelectedService();

  useEffect(() => {
    if (pathname !== "/" || typeof window === "undefined") return;

    const shouldScroll =
      window.location.hash === "#quote" ||
      sessionStorage.getItem(SCROLL_TO_QUOTE_KEY) === "1";
    if (!shouldScroll) return;

    const scrollToQuote = () => {
      const el = document.getElementById("quote");
      if (!el) return false;

      sessionStorage.removeItem(SCROLL_TO_QUOTE_KEY);

      // Đóng mọi meny / panel dịch vụ đang mở (ví dụ Family meny Tarik)
      setSelectedServiceId(null);

      // Dùng scrollIntoView + scroll-mt-24 (CSS) để tương thích tốt với iPhone
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      if (window.history.replaceState) {
        window.history.replaceState(null, "", "/#quote");
      }
      return true;
    };

    const ids: ReturnType<typeof setTimeout>[] = [];
    const maxAttempts = 30;
    let attempts = 0;

    const tryScroll = () => {
      attempts += 1;
      if (scrollToQuote()) return;
      if (attempts < maxAttempts) {
        ids.push(setTimeout(tryScroll, 120));
      }
    };

    // Đợi trang con (ContactSection) mount xong rồi mới scroll
    ids.push(setTimeout(tryScroll, 400));

    return () => ids.forEach(clearTimeout);
  }, [pathname]);

  return null;
}
