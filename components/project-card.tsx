import Image from "next/image";
import type { Project } from "@/content/profile";
import type { Locale } from "@/i18n/routing";
import { t } from "@/lib/i18n";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const href = project.links[0]?.href;
  const hasImage = !!project.image;

  const card = (
    <Card className={`glass relative flex h-[220px] flex-col overflow-hidden rounded-[18px] border-0 bg-transparent shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/5 sm:h-[250px] ${hasImage ? "glass-image" : ""}`}>
      {hasImage && (
        <>
          <Image
            src={project.image!}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Dark theme: dark gradient overlay */}
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black/90 via-black/70 to-black/40 dark:block" />
          {/* Light theme: frosted white glass overlay */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm dark:hidden" />
        </>
      )}

      <CardHeader className="relative z-10 gap-2 pb-4">
        <CardTitle className="text-lg leading-snug">
          {t(project.title, locale)}
        </CardTitle>
        <CardDescription className={`leading-relaxed ${hasImage ? "dark:text-white/70 text-black/60" : "opacity-65"}`}>
          {t(project.subtitle, locale)}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 mt-auto flex flex-col gap-2 pb-5">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`rounded-full border-0 bg-transparent text-xs font-normal ${hasImage ? "glass-pill dark:glass-pill-dark" : "glass-pill"}`}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className={`rounded-full px-2.5 py-0.5 text-xs ${hasImage ? "glass-pill dark:glass-pill-dark" : "glass-pill"}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-[18px]">
        {card}
      </a>
    );
  }

  return card;
}
