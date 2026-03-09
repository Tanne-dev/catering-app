"use client";

import Image from "next/image";
import OrderQuantityInput from "@/components/OrderQuantityInput";
import { useMenuItems } from "@/hooks/useMenus";
import { CATERINGMENY_SUSHI } from "@/data/vara-tjanster-content";
import { ASIATISK_MENU_ITEMS } from "@/data/asiatisk-menu";
import { resolveMenuImageUrl } from "@/lib/supabase";

function getStaticSushiImageByName(name: string): string | undefined {
  const tier = CATERINGMENY_SUSHI.tiers.find(
    (t) => t.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
  return tier?.image;
}

function getStaticAsiatiskImageByName(name: string): string | undefined {
  const item = ASIATISK_MENU_ITEMS.find(
    (t) => t.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
  return item?.image;
}

export default function KombineratMenuContent() {
  const { items: sushiItems, loading: sushiLoading } = useMenuItems("sushi");
  const { items: asiatiskItems, loading: asiatiskLoading } = useMenuItems("asiatisk");

  const sushiTiers =
    sushiItems.length > 0
      ? sushiItems.map((i) => ({
          name: i.name,
          price: i.price,
          description: i.description ?? "",
          image: resolveMenuImageUrl(i.image ?? getStaticSushiImageByName(i.name)),
        }))
      : CATERINGMENY_SUSHI.tiers.map((t) => ({
          name: t.name,
          price: t.price,
          description: t.description,
          image: resolveMenuImageUrl(t.image),
        }));

  const asiatiskList =
    asiatiskItems.length > 0
      ? asiatiskItems.map((i) => ({
          name: i.name,
          price: i.price,
          description: i.description ?? "",
          image: resolveMenuImageUrl(i.image ?? getStaticAsiatiskImageByName(i.name)),
        }))
      : ASIATISK_MENU_ITEMS.map((item) => ({
          ...item,
          image: resolveMenuImageUrl(item.image),
        }));

  const loading = sushiLoading || asiatiskLoading;

  return (
    <div
      className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#707164]/30 bg-[#1a1916]/95 p-6 text-center shadow-lg shadow-black/10 sm:p-8"
    >
      <h3 className="mb-6 text-2xl font-semibold tracking-wide text-[#EAC84E]">
        Kombinera meny
      </h3>
      <p className="mb-6 text-base text-[#E5E7E3]/92">
        Välj rätter från sushimeny och asiatisk meny för att skapa din egen kombinerade beställning.
      </p>

      {/* Välj rätter – options från sushi och asiatisk */}
      {loading ? (
        <p className="text-[#E5E7E3]/80">Laddar meny…</p>
      ) : (
        <div className="space-y-10">
          {/* Sushi */}
          <div>
            <h4 className="mb-4 text-xl font-semibold text-[#EAC84E]">
              {CATERINGMENY_SUSHI.title}
            </h4>
            <div className="space-y-4">
              {sushiTiers.map((tier, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-lg border border-[#707164]/30 bg-[#12110D]/80 p-4 text-left sm:flex-row sm:items-center"
                >
                  {tier.image && (
                    <div className="w-full shrink-0 overflow-hidden rounded-lg sm:w-24">
                      <Image
                        src={tier.image}
                        alt={tier.name}
                        width={400}
                        height={225}
                        className="h-40 w-full object-cover sm:h-24 sm:w-24"
                        sizes="(max-width: 640px) 100vw, 96px"
                        loading="lazy"
                        unoptimized={tier.image?.startsWith("http")}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-[#E5E7E3]">{tier.name}</p>
                    <p className="text-sm text-[#E5E7E3]/85">{tier.description}</p>
                  </div>
                  <div className="shrink-0">
                    <OrderQuantityInput
                      menuSlug="sushi"
                      itemName={tier.name}
                      price={tier.price}
                      unit="bitar"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asiatisk */}
          <div>
            <h4 className="mb-4 text-xl font-semibold text-[#EAC84E]">Asiatisk meny</h4>
            <div className="space-y-4">
              {asiatiskList.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-lg border border-[#707164]/30 bg-[#12110D]/80 p-4 text-left sm:flex-row sm:items-center"
                >
                  {item.image && (
                    <div className="w-full shrink-0 overflow-hidden rounded-lg sm:w-24">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={400}
                        height={225}
                        className="h-40 w-full object-cover sm:h-24 sm:w-24"
                        sizes="(max-width: 640px) 100vw, 96px"
                        loading="lazy"
                        unoptimized={item.image?.startsWith("http")}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-[#E5E7E3]">{item.name}</p>
                    <p className="text-sm text-[#E5E7E3]/85">{item.description}</p>
                  </div>
                  <div className="shrink-0">
                    <OrderQuantityInput
                      menuSlug="asiatisk"
                      itemName={item.name}
                      price={item.price}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
