import type { Project } from "@/content/profile";
import type { Locale } from "@/i18n/routing";
import { t } from "@/lib/i18n";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  return (
    <Card className="flex flex-col rounded-[18px] border-border/40 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="gap-2 pb-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-snug">
            {t(project.title, locale)}
          </CardTitle>
          {project.period && (
            <span className="shrink-0 text-xs text-muted-foreground/60">
              {project.period}
            </span>
          )}
        </div>
        <CardDescription className="leading-relaxed">
          {t(project.subtitle, locale)}
        </CardDescription>
        <p className="text-xs font-medium text-foreground/50">
          {t(project.role, locale)}
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </CardContent>

      {project.links.length > 0 && (
        <CardFooter className="gap-2 pt-2">
          {project.links.map((link) => (
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
        </CardFooter>
      )}
    </Card>
  );
}
