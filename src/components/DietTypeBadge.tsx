"use client";

import { useTranslations } from "next-intl";

export type DietType = "meat" | "fish" | "skaldjur" | "vegetarian";

const DIET_CONFIG: Record<DietType, { icon: string; labelKey: string; bgClass: string }> = {
  meat: {
    icon: "🥩",
    labelKey: "meat",
    bgClass: "bg-amber-900/40 text-amber-200 border-amber-600/50",
  },
  fish: {
    icon: "🐟",
    labelKey: "fish",
    bgClass: "bg-cyan-900/40 text-cyan-200 border-cyan-600/50",
  },
  skaldjur: {
    icon: "🦐",
    labelKey: "skaldjur",
    bgClass: "bg-rose-900/40 text-rose-200 border-rose-600/50",
  },
  vegetarian: {
    icon: "🌱",
    labelKey: "vegetarian",
    bgClass: "bg-emerald-900/40 text-emerald-200 border-emerald-600/50",
  },
};

const VALID_TYPES: DietType[] = ["meat", "fish", "skaldjur", "vegetarian"];

/** Parse diet_type: "meat" | "meat,fish" | "fish,vegetarian" etc. */
export function parseDietTypes(dietType: string | null | undefined): DietType[] {
  if (!dietType || typeof dietType !== "string") return [];
  return dietType
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is DietType => VALID_TYPES.includes(s as DietType));
}

type DietTypeBadgeProps = {
  /** Comma-separated: "meat", "meat,fish", "fish,vegetarian" – hoặc array */
  dietType: string | DietType[] | null | undefined;
  className?: string;
};

export default function DietTypeBadge({ dietType, className = "" }: DietTypeBadgeProps) {
  const t = useTranslations("dietType");
  const types = Array.isArray(dietType) ? dietType.filter((t): t is DietType => VALID_TYPES.includes(t)) : parseDietTypes(dietType);
  if (types.length === 0) return null;
  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {types.map((key) => {
        const config = DIET_CONFIG[key];
        const label = t(config.labelKey as "meat" | "fish" | "skaldjur" | "vegetarian");
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${config.bgClass}`}
            title={label}
            aria-label={label}
          >
            <span aria-hidden>{config.icon}</span>
            <span>{label}</span>
          </span>
        );
      })}
    </span>
  );
}
