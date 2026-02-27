import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const locales = ["sv", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sv";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = (store.get("NEXT_LOCALE")?.value as Locale) ?? defaultLocale;
  const validLocale = locales.includes(locale) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
    timeZone: validLocale === "sv" ? "Europe/Stockholm" : "UTC",
  };
});
