export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="shrink-0 text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        <div className="h-px flex-1 bg-border/60" />
      </div>
      {children}
    </section>
  );
}
