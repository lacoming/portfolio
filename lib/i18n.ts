import type { I18nText } from "@/content/profile";
import type { Locale } from "@/i18n/routing";

export function t(text: I18nText, locale: Locale): string {
  return text[locale];
}
