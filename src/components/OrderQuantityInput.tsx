"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItemUnit } from "@/contexts/CartContext";

type OrderQuantityInputProps = {
  menuSlug: string;
  itemName: string;
  price: string;
  /** "bitar" för sushi, "portion" för asiatisk/sallader (default) */
  unit?: CartItemUnit;
};

export default function OrderQuantityInput({
  menuSlug,
  itemName,
  price,
  unit = "portion",
}: OrderQuantityInputProps) {
  const router = useRouter();
  const { addOrUpdateItem, getItemQuantity } = useCart();
  const [inputVal, setInputVal] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const currentQty = getItemQuantity(menuSlug, itemName);

  function handleConfirm() {
    const num = parseInt(inputVal, 10);
    if (isNaN(num) || num < 0) return;
    addOrUpdateItem(menuSlug, itemName, price, num, unit);
    setInputVal("");
    setConfirmed(false);
    router.push("/varukorg");
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
      <label className="flex cursor-pointer items-center gap-1.5 text-sm text-[#E5E7E3]/90">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="h-4 w-4 rounded border-[#707164]/50 text-[#C49B38] focus:ring-[#C49B38]"
        />
        Bekräfta
      </label>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!confirmed || !inputVal || parseInt(inputVal, 10) <= 0}
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
