"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body className="flex min-h-screen items-center justify-center bg-white font-sans text-black antialiased">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Error</h1>
          <p className="mt-4 text-gray-500">Something went wrong</p>
          <button
            onClick={reset}
            className="mt-6 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
