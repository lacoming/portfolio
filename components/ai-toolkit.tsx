import { profile } from "@/content/profile";
import { t } from "@/lib/i18n";
import type { Locale } from "@/i18n/routing";

export function AIToolkit({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {t(profile.ai.intro, locale)}
      </p>

      <ul className="space-y-2">
        {profile.ai.bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
          >
            <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/20" />
            {t(bullet, locale)}
          </li>
        ))}
      </ul>

      <div className="grid gap-3 sm:grid-cols-2">
        {profile.ai.tools.map((tool) => (
          <div
            key={tool.name}
            className="glass rounded-[14px] border-0 px-5 py-4"
          >
            <p className="text-sm font-medium">{tool.name}</p>
            <p className="mt-1 text-xs opacity-60">
              {t(tool.note, locale)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
