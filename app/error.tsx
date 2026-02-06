"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Error</h1>
        <p className="mt-4 text-muted-foreground">Something went wrong</p>
        <button
          onClick={reset}
          className="mt-6 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
