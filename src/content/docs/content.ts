import type { AppLocale } from "@/i18n/config";

const loaders = {
  "zh-CN": () => import("./content.zh-CN"),
  en: () => import("./content.en"),
  ja: () => import("./content.ja"),
};

export function getDocsContent(locale: AppLocale) {
  return loaders[locale]();
}
