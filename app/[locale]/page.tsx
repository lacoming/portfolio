import { profile } from "@/content/profile";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { Highlights } from "@/components/highlights";
import { Skills } from "@/components/skills";
import { Workflow } from "@/components/workflow";
import { AIToolkit } from "@/components/ai-toolkit";
import { Section } from "@/components/section";
import { t } from "@/lib/i18n";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return (
    <div className="space-y-20">
      <Hero locale={locale} />

      <Highlights locale={locale} />

      <Section title={t(profile.ctaSecondary, locale)}>
        <div className="grid gap-6 sm:grid-cols-2">
          {profile.projects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
      </Section>

      <Section title={t(profile.workflow.title, locale)}>
        <Workflow locale={locale} />
      </Section>

      <Section title={t(profile.ai.title, locale)}>
        <AIToolkit locale={locale} />
      </Section>

      <Section title={t(profile.skillsTitle, locale)}>
        <Skills locale={locale} />
      </Section>
    </div>
  );
}
