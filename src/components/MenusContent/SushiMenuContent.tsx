"use client";

import Image from "next/image";
import OrderQuantityInput from "@/components/OrderQuantityInput";
import { useMenuItems } from "@/hooks/useMenus";
import { CATERINGMENY_SUSHI } from "@/data/vara-tjanster-content";
import { resolveMenuImageUrl } from "@/lib/supabase";

const styles = {
  body: "text-base leading-relaxed text-[#E5E7E3]/92",
  bullet: "text-[#C49B38] shrink-0",
} as const;

function getStaticImageByName(name: string): string | undefined {
  const tier = CATERINGMENY_SUSHI.tiers.find((t) =>
    t.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
  return tier?.image;
}

function toTier(item: { name: string; price: string; description: string | null; nigiri?: string[]; uramaki?: string[]; maki?: string[]; image?: string | null }) {
  const apiImage = item.image ?? undefined;
  const fallbackImage = !apiImage ? getStaticImageByName(item.name) : undefined;
  const rawImage = apiImage || fallbackImage;
  return {
    name: item.name,
    price: item.price,
    description: item.description ?? "",
    nigiri: item.nigiri ?? [],
    uramaki: item.uramaki ?? [],
    maki: item.maki ?? [],
    image: resolveMenuImageUrl(rawImage),
  };
}

export default function SushiMenuContent() {
  const { items, loading } = useMenuItems("sushi");
  const tiers = items.length > 0 ? items.map(toTier) : CATERINGMENY_SUSHI.tiers;

  return (
    <div
      className="mx-auto mt-10 max-w-2xl rounded-xl border border-[#707164]/50 bg-[#12110D] p-6 text-center sm:p-8"
      style={{ borderColor: "rgba(112, 113, 100, 0.5)" }}
    >
      <h3 className="mb-6 text-2xl font-semibold tracking-wide text-[#EAC84E]">
        {CATERINGMENY_SUSHI.title}
      </h3>
      {loading ? (
        <p className="text-[#E5E7E3]/80">Laddar meny…</p>
      ) : tiers.length === 0 ? (
        <p className="text-[#E5E7E3]/80">
          Nya sushier kommer snart. Kontakta oss för att höra vad vi kan erbjuda.
        </p>
      ) : (
      tiers.map((tier, i) => (
        <div
          key={i}
          className="border-t border-[#707164]/30 pt-6 first:border-0 first:pt-0 first:mt-0 mt-6"
        >
          <p className="font-semibold text-[#E5E7E3]">
            <span className="text-[#EAC84E]" aria-hidden>⭐ </span>
            {tier.name} – {tier.price}
          </p>
          <p className={`mt-1.5 ${styles.body}`}>{tier.description}</p>
          {tier.image && (
            <div className="mx-auto mt-4 max-w-md overflow-hidden rounded-lg border border-[#707164]/30">
              <Image
                src={tier.image}
                alt={tier.name}
                width={448}
                height={300}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 100vw, 448px"
                loading="lazy"
                unoptimized={tier.image?.startsWith("http")}
              />
            </div>
          )}
          {tier.nigiri.length > 0 && (
            <p className={`mt-3 ${styles.body}`}>
              <strong className="text-[#E5E7E3]">Nigiri:</strong>{" "}
              {tier.nigiri.join(" · ")}
            </p>
          )}
          {tier.uramaki && tier.uramaki.length > 0 && (
            <div className="mt-2 text-left">
              <p className={`${styles.body} font-medium text-[#E5E7E3]`}>
                Uramaki:
              </p>
              {tier.uramaki.map((item, j) => (
                <p key={j} className={`mt-0.5 pl-4 ${styles.body}`}>
                  <span className={styles.bullet}>·</span> {item}
                </p>
              ))}
            </div>
          )}
          {tier.maki && tier.maki.length > 0 && (
            <p className={`mt-2 ${styles.body}`}>
              <strong className="text-[#E5E7E3]">
                Maki{tier.name.startsWith("Lyx") && !tier.name.includes("Vegan") ? " (urval):" : ":"}
              </strong>{" "}
              {tier.maki.join(" · ")}
            </p>
          )}
          <OrderQuantityInput menuSlug="sushi" itemName={tier.name} price={tier.price} unit="bitar" />
        </div>
      ))
      )}
    </div>
  );
}
