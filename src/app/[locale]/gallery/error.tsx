"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GalleryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Gallery error:", error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-text-primary font-[family-name:var(--font-heading)]">
          Something went wrong
        </h2>
        <p className="text-sm text-text-secondary">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </main>
  );
}
