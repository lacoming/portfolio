import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { profile } from "@/content/profile";
import { t } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  return {
    title: t(profile.name, locale),
    description: t(profile.tagline, locale),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
          <span className="text-sm font-medium tracking-tight">
            {t(profile.name, locale)}
          </span>
          <LocaleSwitcher locale={locale} />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
        {children}
      </main>
      <footer className="border-t border-border/30">
        <div className="mx-auto max-w-5xl px-6 py-10 text-center text-sm text-muted-foreground sm:px-8">
          {t(profile.footerNote, locale)}
        </div>
      </footer>
    </NextIntlClientProvider>
  );
}
