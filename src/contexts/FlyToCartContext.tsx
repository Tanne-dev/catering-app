"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type FlyToCartContextValue = {
  triggerFly: (sourceRect: DOMRect, itemName: string) => void;
};

const FlyToCartContext = createContext<FlyToCartContextValue | null>(null);

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const [flying, setFlying] = useState<{
    sourceRect: DOMRect;
    itemName: string;
  } | null>(null);

  const triggerFly = useCallback((sourceRect: DOMRect, itemName: string) => {
    setFlying({ sourceRect, itemName });
    const timer = setTimeout(() => setFlying(null), 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <FlyToCartContext.Provider value={{ triggerFly }}>
      {children}
      {typeof document !== "undefined" &&
        flying &&
        createPortal(
          <div
            className="fly-to-cart-orb"
            style={{
              position: "fixed",
              left: flying.sourceRect.left + flying.sourceRect.width / 2,
              top: flying.sourceRect.top + flying.sourceRect.height / 2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#C49B38",
              pointerEvents: "none",
              zIndex: 9999,
              transform: "translate(-50%, -50%)",
              animation: "flyToCart 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
              boxShadow: "0 0 16px rgba(196,155,56,0.7)",
            }}
          />,
          document.body
        )}
    </FlyToCartContext.Provider>
  );
}

export function useFlyToCart() {
  return useContext(FlyToCartContext);
}
