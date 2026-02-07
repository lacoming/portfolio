"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  const next: Locale = locale === "ru" ? "en" : "ru";

  function handleSwitch() {
    router.replace(pathname, { locale: next });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSwitch}
      className="glass-interactive rounded-full border-0 bg-transparent text-xs font-medium hover:bg-transparent hover:text-inherit"
      aria-label={`Switch to ${next.toUpperCase()}`}
    >
      {locale === "ru" ? "EN" : "RU"}
    </Button>
  );
}
