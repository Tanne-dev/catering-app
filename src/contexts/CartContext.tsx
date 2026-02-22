"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type CartItemUnit = "gäster" | "bitar" | "portion";

export type CartItem = {
  menuSlug: string;
  itemName: string;
  price: string;
  quantity: number;
  unit?: CartItemUnit;
};

type CartContextValue = {
  items: CartItem[];
  addOrUpdateItem: (menuSlug: string, itemName: string, price: string, quantity: number, unit?: CartItemUnit) => void;
  removeItem: (menuSlug: string, itemName: string) => void;
  getItemQuantity: (menuSlug: string, itemName: string) => number;
  totalQuantity: number;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function cartKey(menuSlug: string, itemName: string) {
  return `${menuSlug}::${itemName}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addOrUpdateItem = useCallback(
    (menuSlug: string, itemName: string, price: string, quantity: number, unit?: CartItemUnit) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((i) => cartKey(i.menuSlug, i.itemName) !== cartKey(menuSlug, itemName))
        );
        return;
      }
      setItems((prev) => {
        const key = cartKey(menuSlug, itemName);
        const idx = prev.findIndex((i) => cartKey(i.menuSlug, i.itemName) === key);
        const next = [...prev];
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity, unit: unit ?? next[idx].unit };
        } else {
          next.push({ menuSlug, itemName, price, quantity, unit });
        }
        return next;
      });
    },
    []
  );

  const removeItem = useCallback((menuSlug: string, itemName: string) => {
    setItems((prev) =>
      prev.filter((i) => cartKey(i.menuSlug, i.itemName) !== cartKey(menuSlug, itemName))
    );
  }, []);

  const getItemQuantity = useCallback(
    (menuSlug: string, itemName: string) => {
      const item = items.find((i) => cartKey(i.menuSlug, i.itemName) === cartKey(menuSlug, itemName));
      return item?.quantity ?? 0;
    },
    [items]
  );

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalItems = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addOrUpdateItem,
        removeItem,
        getItemQuantity,
        totalQuantity,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
