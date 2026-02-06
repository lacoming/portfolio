import { profile } from "@/content/profile";
import { t } from "@/lib/i18n";
import type { Locale } from "@/i18n/routing";

export function Highlights({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {profile.highlights.map((h, i) => (
        <div
          key={i}
          className="rounded-[16px] border border-border/40 bg-muted/30 px-6 py-5"
        >
          <h3 className="text-sm font-semibold tracking-tight">
            {t(h.title, locale)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t(h.description, locale)}
          </p>
        </div>
      ))}
    </div>
  );
}
