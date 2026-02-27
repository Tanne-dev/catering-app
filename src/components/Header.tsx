"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSelectedMenu, type MenuId } from "@/contexts/SelectedMenuContext";
import { useCart } from "@/contexts/CartContext";
import { useMenus } from "@/hooks/useMenus";
import { CONTACT } from "@/data/contact";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

type OrderNotification = {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  event_date?: string | null;
};

const FALLBACK_MENUS_IDS: MenuId[] = ["sushi", "asiatisk", "sallader"];

export default function Header() {
  const t = useTranslations("header");
  const tMenus = useTranslations("menusFallback");
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { setSelectedMenu } = useSelectedMenu();
  const { totalQuantity } = useCart();
  const { menus } = useMenus();
  const menuList =
    menus.length > 0
      ? menus.map((m) => ({
          label: m.title,
          id: m.slug as MenuId,
        }))
      : FALLBACK_MENUS_IDS.map((id) => ({ label: tMenus(id as "sushi" | "asiatisk" | "sallader"), id }));
  const [menusDropdownOpen, setMenusDropdownOpen] = useState(false);
  const menusDropdownRef = useRef<HTMLDivElement>(null);

  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  const [helpOpen, setHelpOpen] = useState(false);
  const helpDropdownRef = useRef<HTMLDivElement>(null);

  const HELP_CLICKED_KEY = "catering_help_clicked";
  const [showHelpHint, setShowHelpHint] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setShowHelpHint(!window.sessionStorage.getItem(HELP_CLICKED_KEY));
    } catch (_) {}
  }, []);

  const [notificationOrders, setNotificationOrders] = useState<OrderNotification[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const NOTIFICATION_READ_KEY = "catering_notification_read_ids";
  const [readOrderIds, setReadOrderIds] = useState<Set<string>>(() => new Set());
  const wasNotificationOpen = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(NOTIFICATION_READ_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setReadOrderIds(new Set(Array.isArray(arr) ? arr : []));
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (wasNotificationOpen.current && !notificationOpen && notificationOrders.length > 0) {
      const ids = notificationOrders.map((o) => o.id);
      setReadOrderIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.add(id));
        try {
          window.localStorage.setItem(NOTIFICATION_READ_KEY, JSON.stringify([...next]));
        } catch (_) {}
        return next;
      });
    }
    wasNotificationOpen.current = notificationOpen;
  }, [notificationOpen, notificationOrders]);

  const isAdmin = status === "authenticated" && (session?.user as { role?: string })?.role === "admin";
  const isGuest = status === "authenticated" && (session?.user as { role?: string })?.role === "guest";

  const unreadOrders = notificationOrders.filter((o) => !readOrderIds.has(o.id));
  const pendingOrderCount = notificationOrders.filter((o) => o.status === "pending" && !readOrderIds.has(o.id)).length;
  const recentOrders = unreadOrders.slice(0, 5);
  const guestConfirmedCount = notificationOrders.filter(
    (o) => (o.status === "confirmed" || o.status === "completed") && !readOrderIds.has(o.id)
  ).length;
  const notificationBadgeCount = isAdmin ? pendingOrderCount : isGuest ? guestConfirmedCount : 0;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const fullName = session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Gäst";
  const guestDisplayName = fullName.includes(" ") ? fullName.split(" ")[0] : fullName;
  const showSessionUI = mounted && status !== "loading";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (menusDropdownRef.current && !menusDropdownRef.current.contains(target)) {
        setMenusDropdownOpen(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(target)) {
        setLoginDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(target)) {
        setNotificationOpen(false);
      }
      if (helpDropdownRef.current && !helpDropdownRef.current.contains(target)) {
        setHelpOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenusDropdownOpen(false);
        setLoginDropdownOpen(false);
        setNotificationOpen(false);
        setHelpOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleMenuClick(menuId: MenuId) {
    setSelectedMenu(menuId);
    setMenusDropdownOpen(false);
    if (pathname === "/") {
      document.getElementById("menus")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/?menu=" + encodeURIComponent(menuId ?? "") + "#menus");
    }
  }

  async function fetchNotificationOrders() {
    if (!isAdmin && !isGuest) return;
    setNotificationLoading(true);
    // #region agent log
    const url = isAdmin ? "/api/orders" : "/api/orders/mine";
    fetch('http://127.0.0.1:7242/ingest/0cdeab99-f7cb-4cee-9943-94270784127d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:fetchNotificationOrders',message:'fetch start',data:{isAdmin,isGuest,url},timestamp:Date.now(),hypothesisId:'H1_H2_H5'})}).catch(()=>{});
    // #endregion
    try {
      const res = await fetch(url);
      const data = await res.json().catch(() => []);
      const list = Array.isArray(data) ? data : [];
      if (res.ok) setNotificationOrders(list);
      else setNotificationOrders([]);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0cdeab99-f7cb-4cee-9943-94270784127d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:fetchNotificationOrders',message:'fetch done',data:{ok:res.ok,status:res.status,count:list.length,hasError:(data&&typeof data==='object'&&'error' in data)},timestamp:Date.now(),hypothesisId:'H1_H2_H5'})}).catch(()=>{});
      // #endregion
    } catch (e) {
      setNotificationOrders([]);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0cdeab99-f7cb-4cee-9943-94270784127d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:fetchNotificationOrders',message:'fetch throw',data:{err:String(e)},timestamp:Date.now(),hypothesisId:'H2_H5'})}).catch(()=>{});
      // #endregion
    } finally {
      setNotificationLoading(false);
    }
  }

  useEffect(() => {
    if (!isAdmin && !isGuest) return;
    fetchNotificationOrders();
    const interval = setInterval(fetchNotificationOrders, 60 * 1000);
    return () => clearInterval(interval);
  }, [isAdmin, isGuest]);

  useEffect(() => {
    if ((isAdmin || isGuest) && notificationOpen) {
      fetchNotificationOrders();
    }
  }, [isAdmin, isGuest, notificationOpen]);

  const locale = useLocale();
  const dateLocale = locale === "sv" ? "sv-SE" : "en-GB";

  function formatOrderDate(iso: string) {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return t("now");
      if (diffMins < 60) return t("minAgo", { count: diffMins });
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return t("hoursAgo", { count: diffHours });
      return d.toLocaleDateString(dateLocale, { day: "numeric", month: "short" });
    } catch {
      return iso;
    }
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-[#2a2924] bg-[#12110D]/95 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]"
      suppressHydrationWarning
    >
      <div
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #C49B38 15%, #EAC84E 50%, #C49B38 85%, transparent 100%)",
        }}
      />
      <div className="relative mx-auto flex min-h-[60px] max-w-6xl items-center px-4 py-3 sm:px-5 md:px-6">
        <div className="relative z-10 flex w-full items-center gap-4">
          <a
            href="/"
            className="group relative flex h-11 shrink-0 items-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] sm:h-12 md:h-14"
            aria-label="Catering Tanne - startsida"
          >
            <Image
              src="/logo-catering-tanne.png"
              alt="Catering Tanne – startsida"
              width={485}
              height={67}
              sizes="(max-width: 640px) 260px, (max-width: 768px) 340px, 485px"
              className="h-11 w-auto max-w-[260px] object-contain object-left opacity-95 transition-opacity group-hover:opacity-100 sm:h-12 sm:max-w-[340px] md:h-14 md:max-w-[485px]"
              priority
            />
          </a>

          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-2.5">
            <LanguageSwitcher />
            <Link
              href="/varukorg"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#EAC84E] transition-all duration-200 hover:bg-[#EAC84E]/12 hover:text-[#f0d96a] focus:outline-none focus:ring-2 focus:ring-[#EAC84E]/60 focus:ring-offset-2 focus:ring-offset-[#12110D] sm:h-11 sm:w-11"
              aria-label={totalQuantity > 0 ? t("cartWithItems", { count: totalQuantity }) : t("cart")}
            >
              <CartIcon />
              {totalQuantity > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-[#EAC84E] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#12110D] shadow-sm"
                  aria-hidden
                >
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </Link>
            <div className="relative" ref={helpDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setHelpOpen((o) => !o);
                  if (typeof window !== "undefined") {
                    try {
                      window.sessionStorage.setItem(HELP_CLICKED_KEY, "1");
                    } catch (_) {}
                    setShowHelpHint(false);
                  }
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-[#D5D7D3] transition-all duration-200 hover:bg-white/8 hover:text-[#EAC84E] focus:outline-none focus:ring-2 focus:ring-[#EAC84E]/50 focus:ring-offset-2 focus:ring-offset-[#12110D] sm:h-11 sm:w-11 ${
                  showHelpHint ? "help-icon-first-time" : ""
                }`}
                aria-label={t("howToOrder")}
                aria-haspopup="true"
                aria-expanded={helpOpen}
              >
                <HelpIcon />
              </button>
              {helpOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)]">
                  <div
                    className="overflow-hidden rounded-xl border py-3 shadow-xl"
                    style={{
                      backgroundColor: "#161510",
                      borderColor: "#2a2924",
                    }}
                  >
                    <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#C49B38]">
                      {t("helpFlow")}
                    </p>
                    <ol className="list-decimal space-y-3 px-4 pb-2 pl-7 text-sm leading-relaxed text-[#E5E7E3]/95">
                      <li>{t.rich("helpStep1", { menuLink: (chunks) => <a href="#menus" onClick={() => setHelpOpen(false)} className="text-[#EAC84E] underline-offset-2 hover:underline">{chunks}</a> })}</li>
                      <li>{t("helpStep2")}</li>
                      <li>{t.rich("helpStep3", { cartLink: (chunks) => <Link href="/varukorg" onClick={() => setHelpOpen(false)} className="text-[#EAC84E] underline-offset-2 hover:underline">{chunks}</Link> })}</li>
                      <li>{t("helpStep4")}</li>
                      <li>{t("helpStep5")}</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
            <div className="relative hidden sm:block" ref={notificationDropdownRef}>
              <button
                type="button"
                onClick={() => setNotificationOpen((o) => !o)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#D5D7D3] transition-all duration-200 hover:bg-white/8 hover:text-[#EAC84E] focus:outline-none focus:ring-2 focus:ring-[#EAC84E]/50 focus:ring-offset-2 focus:ring-offset-[#12110D] sm:h-11 sm:w-11"
                aria-label={notificationBadgeCount > 0 ? t("notificationsNew", { count: notificationBadgeCount }) : t("notifications")}
                aria-haspopup="true"
                aria-expanded={notificationOpen}
              >
                <BellIcon />
                {notificationBadgeCount > 0 && (
                  <span
                    className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-[#EAC84E] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#12110D] shadow-sm"
                    aria-hidden
                  >
                    {notificationBadgeCount > 99 ? "99+" : notificationBadgeCount}
                  </span>
                )}
              </button>
              {notificationOpen && (
                <div className="fixed left-1/2 top-20 z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2">
                  <div
                    className="overflow-hidden rounded-xl border py-2 shadow-xl"
                    style={{
                      backgroundColor: "#161510",
                      borderColor: "#2a2924",
                    }}
                  >
                    <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#C49B38]">
                      {t("notifications")}
                    </p>
                    {!isAdmin && !isGuest ? (
                      <div className="px-4 py-4 text-center text-sm text-[#E5E7E3]/70">
                        {t("noNotifications")}
                      </div>
                    ) : notificationLoading ? (
                      <div className="px-4 py-4 text-center text-sm text-[#E5E7E3]/70">
                        {t("loading")}
                      </div>
                    ) : isAdmin ? (
                      recentOrders.length === 0 ? (
                        <div className="px-4 py-4 text-center text-sm text-[#E5E7E3]/70">
                          {t("noOrders")}
                        </div>
                      ) : (
                        <ul className="max-h-64 overflow-y-auto">
                          {recentOrders.map((order) => (
                            <li key={order.id}>
                              <a
                                href="/admin/orders"
                                onClick={() => setNotificationOpen(false)}
                                className="block border-t px-4 py-2.5 text-left text-sm transition-colors"
                                style={{ borderColor: "#707164", color: "#D5D7D3" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "#ffffff08";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                }}
                              >
                                <span className="font-medium text-[#E5E7E3]">{order.name}</span>
                                <span className="ml-1.5 text-[#707164]">
                                  {formatOrderDate(order.created_at)}
                                </span>
                                {order.status === "pending" && (
                                  <span className="ml-1.5 rounded bg-[#C49B38]/30 px-1.5 py-0.5 text-xs text-[#EAC84E]">
                                    {t("pending")}
                                  </span>
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )
                    ) : recentOrders.length === 0 ? (
                      <div className="px-4 py-4 text-center text-sm text-[#E5E7E3]/70">
                        Inga beställningar ännu
                      </div>
                    ) : (
                      <ul className="max-h-64 overflow-y-auto">
                        {recentOrders.map((order) => {
                          const statusLabel =
                            order.status === "confirmed"
                              ? t("orderConfirmed")
                              : order.status === "completed"
                                ? t("orderCompleted")
                                : t("pending");
                          return (
                            <li key={order.id}>
                              <a
                                href="/mina-bestallningar"
                                onClick={() => setNotificationOpen(false)}
                                className="block border-t px-4 py-2.5 text-left text-sm transition-colors"
                                style={{ borderColor: "#707164", color: "#D5D7D3" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "#ffffff08";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                }}
                              >
                                <span className="block font-medium text-[#E5E7E3]">{statusLabel}</span>
                                <span className="text-xs text-[#707164]">
                                  {formatOrderDate(order.created_at)}
                                  {order.event_date && ` · ${order.event_date}`}
                                </span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {isAdmin && (
                      <a
                        href="/admin/orders"
                        onClick={() => setNotificationOpen(false)}
                        className="block border-t px-4 py-2.5 text-sm transition-colors"
                        style={{ borderColor: "#707164", color: "#D5D7D3" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff08";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {t("manageOrders")}
                      </a>
                    )}
                    {isGuest && (
                      <a
                        href="/mina-bestallningar"
                        onClick={() => setNotificationOpen(false)}
                        className="block border-t px-4 py-2.5 text-sm transition-colors"
                        style={{ borderColor: "#707164", color: "#D5D7D3" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff08";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {t("myOrders")}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={menusDropdownRef}>
              <button
                type="button"
                onClick={() => setMenusDropdownOpen((o) => !o)}
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#B8923A]/40 bg-[#C49B38] px-4 text-xs font-semibold tracking-wide text-[#12110D] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-200 hover:border-[#D4A83E]/60 hover:bg-[#D4A83E] hover:shadow-[0_2px_8px_rgba(196,155,56,0.35)] focus:outline-none focus:ring-2 focus:ring-[#EAC84E]/60 focus:ring-offset-2 focus:ring-offset-[#12110D] active:scale-[0.98] sm:h-11 sm:px-5 sm:text-sm"
                aria-haspopup="menu"
                aria-expanded={menusDropdownOpen}
              >
                {t("menu")}
                <ChevronDownIcon />
              </button>
              {menusDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 flex justify-center">
                  <div
                    role="menu"
                    className="min-w-[200px] overflow-hidden rounded-xl border py-1 shadow-xl"
                    style={{
                      backgroundColor: "#161510",
                      borderColor: "#2a2924",
                    }}
                  >
                    {menuList.map(({ label, id }) => (
                      <button
                        key={id}
                        type="button"
                        role="menuitem"
                        onClick={() => handleMenuClick(id)}
                        className="w-full px-4 py-2.5 text-center text-sm transition-colors"
                        style={{ color: "#D5D7D3" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff08";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={loginDropdownRef}>
              <button
                type="button"
                onClick={() => setLoginDropdownOpen((o) => !o)}
                className={
                  "flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-xs font-semibold tracking-wide text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#EAC84E]/50 focus:ring-offset-2 focus:ring-offset-[#12110D] active:scale-[0.98] sm:h-11 sm:px-4 sm:text-sm md:px-5 " +
                  (showSessionUI && isAdmin
                    ? "border-[#3d6a3d]/60 bg-[#2d4a2d] hover:border-[#4d7a4d]/70 hover:bg-[#355a35]"
                    : showSessionUI && isGuest
                      ? "border-[#4d5a6a]/60 bg-[#3d4a5a] hover:border-[#5d6a7a]/70 hover:bg-[#455a6a]"
                      : "border-[#4a4a44]/60 bg-[#2e2d28] hover:border-[#5a5a54]/70 hover:bg-[#3a3832]")
                }
                aria-haspopup="menu"
                aria-expanded={loginDropdownOpen}
                aria-label={
                  showSessionUI && isAdmin ? t("loggedInAdmin") : showSessionUI && isGuest ? t("loggedInGuest", { name: guestDisplayName }) : t("login")
                }
              >
                {showSessionUI && isAdmin ? (
                  <>
                    Tanne Side
                    <ChevronDownIcon />
                  </>
                ) : showSessionUI && isGuest ? (
                  <>
                    {guestDisplayName}
                    <ChevronDownIcon />
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">{t("login")}</span>
                    <span className="sm:hidden">{t("loginShort")}</span>
                    <ChevronDownIcon />
                  </>
                )}
              </button>
              {loginDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 flex justify-end">
                  <div
                    role="menu"
                    className="min-w-[160px] overflow-hidden rounded-xl border py-1 shadow-xl"
                    style={{
                      backgroundColor: "#161510",
                      borderColor: "#2a2924",
                    }}
                  >
                    {isAdmin ? (
                      <>
                        <a
                          href="/admin/dashboard"
                          role="menuitem"
                          onClick={() => setLoginDropdownOpen(false)}
                          className="block w-full px-4 py-2.5 text-left text-sm transition-colors"
                          style={{ color: "#D5D7D3" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff08";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {t("dashboard")}
                        </a>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setLoginDropdownOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm transition-colors"
                          style={{ color: "#D5D7D3" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff08";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {t("signOut")}
                        </button>
                      </>
                    ) : isGuest ? (
                      <>
                        <a
                          href="/mina-bestallningar"
                          role="menuitem"
                          onClick={() => setLoginDropdownOpen(false)}
                          className="block w-full px-4 py-2.5 text-left text-sm transition-colors"
                          style={{ color: "#D5D7D3" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff08";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {t("manageOrdersShort")}
                        </a>
                        <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setLoginDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm transition-colors"
                        style={{ color: "#D5D7D3" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff08";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        >
                          {t("signOut")}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setLoginDropdownOpen(false);
                            signIn("google", { callbackUrl: "/" });
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm transition-colors"
                          style={{ color: "#D5D7D3" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff08";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {t("guestGoogle")}
                        </button>
                        <a
                          href="/admin/login"
                          role="menuitem"
                          className="block w-full px-4 py-2.5 text-left text-sm transition-colors"
                          style={{ color: "#D5D7D3" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff08";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {t("admin")}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
