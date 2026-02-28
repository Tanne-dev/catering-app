"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelectedMenu, type MenuId } from "@/contexts/SelectedMenuContext";

const VALID_MENU_IDS: MenuId[] = ["sushi", "asiatisk"];

export default function ScrollToMenuOnQuery() {
  const searchParams = useSearchParams();
  const { setSelectedMenu } = useSelectedMenu();

  useEffect(() => {
    const menu = searchParams.get("menu");
    const menuId = VALID_MENU_IDS.includes(menu as MenuId) ? (menu as MenuId) : null;
    if (menuId) setSelectedMenu(menuId);

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash === "#menus") {
      const scroll = () => document.getElementById("menus")?.scrollIntoView({ behavior: "smooth" });
      const t = setTimeout(scroll, 100);
      return () => clearTimeout(t);
    }
  }, [searchParams, setSelectedMenu]);

  return null;
}
