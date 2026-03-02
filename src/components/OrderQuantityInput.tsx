"use client";

import { useState, useRef } from "react";
import { useCart, type CartItemUnit } from "@/contexts/CartContext";
import { useFlyToCart } from "@/contexts/FlyToCartContext";

type OrderQuantityInputProps = {
  menuSlug: string;
  itemName: string;
  price: string;
  /** "bitar" för sushi, "portion" för asiatisk (default) */
  unit?: CartItemUnit;
};

export default function OrderQuantityInput({
  menuSlug,
  itemName,
  price,
  unit = "portion",
}: OrderQuantityInputProps) {
  const { addOrUpdateItem, getItemQuantity } = useCart();
  const flyToCart = useFlyToCart();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [inputVal, setInputVal] = useState("");

  const currentQty = getItemQuantity(menuSlug, itemName);

  function handleAdd() {
    const num = parseInt(inputVal, 10);
    if (isNaN(num) || num < 0) return;
    const rect = addButtonRef.current?.getBoundingClientRect();
    if (rect && flyToCart) {
      flyToCart.triggerFly(rect, itemName);
    }
    addOrUpdateItem(menuSlug, itemName, price, num, unit);
    setInputVal("");
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-lg border border-[#707164]/30 bg-[#12110D]/60 px-3 py-2">
      <label htmlFor={`qty-${menuSlug}-${itemName.replace(/\s/g, "-")}`} className="text-sm text-[#E5E7E3]/90">
        Antal {unit}:
      </label>
      <input
        id={`qty-${menuSlug}-${itemName.replace(/\s/g, "-")}`}
        type="number"
        min={0}
        max={999}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value.replace(/\D/g, "").slice(0, 3))}
        placeholder="0"
        className="h-9 w-16 rounded border border-[#707164]/50 bg-[#12110D] px-2 text-center text-sm text-[#E5E7E3] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
        aria-label={`Antal ${unit} för ${itemName}`}
      />
      <button
        ref={addButtonRef}
        type="button"
        onClick={handleAdd}
        disabled={!inputVal || parseInt(inputVal, 10) <= 0}
        className="rounded-lg bg-[#C49B38] px-3 py-1.5 text-xs font-semibold text-[#12110D] transition-colors hover:bg-[#D4A83E] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Lägg till
      </button>
      {currentQty > 0 && (
        <span className="ml-2 text-xs text-[#EAC84E]">
          I varukorg: {currentQty} {unit}
        </span>
      )}
    </div>
  );
}
