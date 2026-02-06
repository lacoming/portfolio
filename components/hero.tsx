import { profile } from "@/content/profile";
import { t } from "@/lib/i18n";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="flex flex-col gap-6 pb-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          {t(profile.name, locale)}
        </h1>
        <p className="text-xl font-medium text-foreground/70 sm:text-2xl">
          {t(profile.title, locale)}
        </p>
      </div>

      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t(profile.tagline, locale)}
      </p>

      <p className="text-sm text-muted-foreground/70">
        {t(profile.location, locale)}
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        {profile.links.map((link) => (
          <Button
            key={link.href}
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            asChild
          >
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {t(link.label, locale)}
            </a>
          </Button>
        ))}
      </div>
    </section>
  );
}
