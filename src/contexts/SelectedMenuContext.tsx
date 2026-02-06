"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type MenuId = "sushi" | "asiatisk" | "dessert" | null;

type SelectedMenuContextValue = {
  selectedMenu: MenuId;
  setSelectedMenu: (menu: MenuId) => void;
};

const SelectedMenuContext = createContext<SelectedMenuContextValue | null>(null);

export function SelectedMenuProvider({ children }: { children: ReactNode }) {
  const [selectedMenu, setSelectedMenuState] = useState<MenuId>(null);
  const setSelectedMenu = useCallback((menu: MenuId) => {
    setSelectedMenuState(menu);
  }, []);
  return (
    <SelectedMenuContext.Provider value={{ selectedMenu, setSelectedMenu }}>
      {children}
    </SelectedMenuContext.Provider>
  );
}

export function useSelectedMenu() {
  const ctx = useContext(SelectedMenuContext);
  if (!ctx) throw new Error("useSelectedMenu must be used within SelectedMenuProvider");
  return ctx;
}
