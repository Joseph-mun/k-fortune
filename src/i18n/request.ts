import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messageImports = {
  ko: () => import("../messages/ko.json"),
  en: () => import("../messages/en.json"),
  es: () => import("../messages/es.json"),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "ko" | "en" | "es")) {
    locale = routing.defaultLocale;
  }

  const importFn = messageImports[locale as keyof typeof messageImports];
  const messages = (await importFn()).default;

  return {
    locale,
    messages,
  };
});
