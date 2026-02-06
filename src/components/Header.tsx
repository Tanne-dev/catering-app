"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSelectedMenu, type MenuId } from "@/contexts/SelectedMenuContext";
import { useSelectedService } from "@/contexts/SelectedServiceContext";
import { CONTACT } from "@/data/contact";
import { SERVICES as SERVICES_DATA } from "@/data/services";

const MENUS: { label: string; id: MenuId }[] = [
  { label: "Sushimeny", id: "sushi" },
  { label: "Asiatisk meny", id: "asiatisk" },
  { label: "Dessertmeny", id: "dessert" },
];

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
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
  const { setSelectedMenu } = useSelectedMenu();
  const [menusDropdownOpen, setMenusDropdownOpen] = useState(false);
  const menusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (menusDropdownRef.current && !menusDropdownRef.current.contains(target)) {
        setMenusDropdownOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMenusDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const { setSelectedServiceId } = useSelectedService();

  function openServicesPanel() {
    const firstService = SERVICES_DATA[0];
    if (firstService) setSelectedServiceId(firstService.id);
  }

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

          <div
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 md:flex"
            style={{ color: "#D5D7D3" }}
          >
            <PhoneIcon />
            <span className="text-[13px] opacity-90">
              Ring oss: {CONTACT.phone}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1 text-xs text-[#D5D7D3] opacity-90 md:hidden"
              aria-label={`Ring oss ${CONTACT.phone}`}
            >
              <PhoneIcon />
              <span className="whitespace-nowrap">{CONTACT.phone}</span>
            </a>
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
                    {MENUS.map(({ label, id }) => (
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

            <button
              type="button"
              onClick={openServicesPanel}
              className="flex h-9 items-center gap-1 rounded-[13px] border px-2.5 text-xs font-semibold text-white transition-colors sm:h-10 sm:gap-1.5 sm:px-3 sm:text-sm md:px-4"
              style={{
                backgroundColor: "#3C4454",
                borderColor: "#707164",
              }}
              aria-haspopup="dialog"
              aria-label="Öppna Våra tjänster"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#8a8d7a";
                e.currentTarget.style.backgroundColor = "#4a5264";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#707164";
                e.currentTarget.style.backgroundColor = "#3C4454";
              }}
            >
              <span className="hidden sm:inline">Våra tjänster</span>
              <span className="sm:hidden">Tjänster</span>
              <ChevronDownIcon />
            </button>
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
