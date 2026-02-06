import { profile } from "@/content/profile";
import { t } from "@/lib/i18n";
import type { Locale } from "@/i18n/routing";

export function Workflow({ locale }: { locale: Locale }) {
  return (
    <ul className="space-y-3">
      {profile.workflow.bullets.map((bullet, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
        >
          <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/20" />
          {t(bullet, locale)}
        </li>
      ))}
    </ul>
  );
}
