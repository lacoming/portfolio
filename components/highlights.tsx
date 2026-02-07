import { profile } from "@/content/profile";
import { t } from "@/lib/i18n";
import type { Locale } from "@/i18n/routing";

export function Highlights({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {profile.highlights.map((h, i) => (
        <div
          key={i}
          className="glass rounded-[16px] border-0 px-6 py-5"
        >
          <h3 className="text-sm font-semibold tracking-tight">
            {t(h.title, locale)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed opacity-60">
            {t(h.description, locale)}
          </p>
        </div>
      ))}
    </div>
  );
}
