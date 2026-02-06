import { profile } from "@/content/profile";
import { t } from "@/lib/i18n";
import type { Locale } from "@/i18n/routing";

export function Skills({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {profile.skills.map((group, i) => (
        <div key={i}>
          <h3 className="mb-3 text-sm font-semibold tracking-tight">
            {t(group.title, locale)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
