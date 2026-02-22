"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useSelectedMenu, type MenuId } from "@/contexts/SelectedMenuContext";
import { useCart } from "@/contexts/CartContext";
import { useMenus } from "@/hooks/useMenus";
import { CONTACT } from "@/data/contact";

const FALLBACK_MENUS: { label: string; id: MenuId }[] = [
  { label: "Sushimeny", id: "sushi" },
  { label: "Asiatisk meny", id: "asiatisk" },
  { label: "Sallader Bufféer", id: "sallader" },
];

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

export default function Header() {
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
      : FALLBACK_MENUS;
  const [menusDropdownOpen, setMenusDropdownOpen] = useState(false);
  const menusDropdownRef = useRef<HTMLDivElement>(null);

  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = status === "authenticated" && (session?.user as { role?: string })?.role === "admin";
  const isGuest = status === "authenticated" && (session?.user as { role?: string })?.role === "guest";
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
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenusDropdownOpen(false);
        setLoginDropdownOpen(false);
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
    document.getElementById("menus")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="sticky top-0 z-50 bg-[#12110D] backdrop-blur-sm shadow-lg">
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #C49B38 8%, #C49B38 92%, transparent)",
        }}
      />
      <div className="relative mx-auto flex min-h-[56px] max-w-6xl items-center px-4 py-2 sm:px-5 md:px-6">
        <div className="relative z-10 flex w-full items-center">
          <a
            href="/"
            className="relative flex h-12 shrink-0 items-center sm:h-14 md:h-16"
            aria-label="Catering Tanne - startsida"
          >
            <Image
              src="/logo-catering-tanne.png"
              alt="Catering Tanne – startsida"
              width={485}
              height={67}
              sizes="(max-width: 640px) 280px, (max-width: 768px) 360px, 485px"
              className="h-12 w-auto max-w-[280px] object-contain object-left sm:h-14 sm:max-w-[360px] md:h-[67px] md:max-w-[485px]"
              priority
            />
          </a>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="flex items-center text-[#D5D7D3] opacity-90"
              aria-label={`Ring oss ${CONTACT.phone}`}
            >
              <PhoneIcon />
            </a>
            <Link
              href="/varukorg"
              className="relative flex items-center justify-center rounded-lg p-2 text-[#EAC84E] transition-colors hover:bg-[#EAC84E]/15 hover:text-[#EAC84E] focus:outline-none focus:ring-2 focus:ring-[#EAC84E] focus:ring-offset-2 focus:ring-offset-[#12110D]"
              aria-label={totalQuantity > 0 ? `Varukorg – ${totalQuantity} st totalt` : "Varukorg"}
            >
              <CartIcon />
              {totalQuantity > 0 && (
                <span
                  className="absolute -right-1 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-[#EAC84E] px-1 py-0.5 text-[10px] font-bold text-[#12110D]"
                  aria-hidden
                >
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </Link>
            <div className="relative" ref={menusDropdownRef}>
              <button
                type="button"
                onClick={() => setMenusDropdownOpen((o) => !o)}
                className="flex h-9 items-center gap-1 rounded-[13px] px-3 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:h-10 sm:gap-1.5 sm:px-4 sm:text-sm"
                style={{
                  backgroundColor: "#C49B38",
                  boxShadow:
                    "0 0 0 1px rgba(168, 128, 45, 0.3), 0 2px 8px rgba(168, 128, 45, 0.15)",
                }}
                aria-haspopup="menu"
                aria-expanded={menusDropdownOpen}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#D4A83E";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 1px rgba(168, 128, 45, 0.4), 0 4px 12px rgba(168, 128, 45, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#C49B38";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 1px rgba(168, 128, 45, 0.3), 0 2px 8px rgba(168, 128, 45, 0.15)";
                }}
              >
                Våra menyer
                <ChevronDownIcon />
              </button>
              {menusDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 flex justify-center">
                  <div
                    role="menu"
                    className="min-w-[200px] rounded-[14px] border py-1 shadow-xl"
                    style={{
                      backgroundColor: "#12110D",
                      borderColor: "#707164",
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
                className="flex h-9 items-center gap-1 rounded-[13px] border px-2.5 text-xs font-semibold text-white transition-colors sm:h-10 sm:gap-1.5 sm:px-3 sm:text-sm md:px-4"
                style={{
                  backgroundColor: showSessionUI && isAdmin ? "#2d4a2d" : showSessionUI && isGuest ? "#3d4a5a" : "#3C4454",
                  borderColor: "#707164",
                }}
                aria-haspopup="menu"
                aria-expanded={loginDropdownOpen}
                aria-label={
                  showSessionUI && isAdmin ? "Inloggad som admin" : showSessionUI && isGuest ? `Inloggad som ${guestDisplayName}` : "Logga in som gäst eller admin"
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#8a8d7a";
                  e.currentTarget.style.backgroundColor =
                    showSessionUI && isAdmin ? "#3d5a3d" : showSessionUI && isGuest ? "#4d5a6a" : "#4a5264";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#707164";
                  e.currentTarget.style.backgroundColor =
                    showSessionUI && isAdmin ? "#2d4a2d" : showSessionUI && isGuest ? "#3d4a5a" : "#3C4454";
                }}
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
                    <span className="hidden sm:inline">Logga in</span>
                    <span className="sm:hidden">Inloggning</span>
                    <ChevronDownIcon />
                  </>
                )}
              </button>
              {loginDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 flex justify-end">
                  <div
                    role="menu"
                    className="min-w-[160px] rounded-[14px] border py-1 shadow-xl"
                    style={{
                      backgroundColor: "#12110D",
                      borderColor: "#707164",
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
                          Dashboard
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
                          Logga ut
                        </button>
                      </>
                    ) : isGuest ? (
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
                        Logga ut
                      </button>
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
                          Gäst (Google)
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
                          Admin
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
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #C49B38 8%, #C49B38 92%, transparent)",
        }}
      />
    </header>
  );
}
