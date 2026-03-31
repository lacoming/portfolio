import Image from "next/image";
import { profile } from "@/content/profile";
import { t } from "@/lib/i18n";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="flex flex-col items-center gap-10 pb-4 lg:flex-row lg:items-start lg:gap-16">
      {/* Text column */}
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4">
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

        {/* Stats */}
        <div className="flex flex-wrap gap-6 sm:gap-10">
          {profile.stats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {t(stat.label, locale)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {profile.links.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                className="glass-interactive rounded-full border-0 bg-transparent text-xs hover:bg-transparent hover:text-inherit"
                asChild
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {t(link.label, locale)}
                </a>
              </Button>
            ))}
          </div>

          <span className="hidden text-muted-foreground/40 sm:inline">|</span>

          <p className="text-sm text-muted-foreground/70">
            {t(profile.location, locale)}
          </p>
        </div>
      </div>

      {/* Photo */}
      <div className="relative shrink-0 self-center lg:self-auto">
        <div
          className="relative h-[380px] w-[300px] overflow-hidden rounded-2xl sm:h-[460px] sm:w-[360px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 85%, transparent 100%)",
          }}
        >
          <Image
            src="/photo.png"
            alt={t(profile.name, locale)}
            fill
            priority
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
