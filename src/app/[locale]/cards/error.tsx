"use client";

import { useEffect } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function CardsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Cards error:", error);
  }, [error]);

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 max-w-sm">
        <h2 className="text-xl font-bold text-text-primary font-[family-name:var(--font-heading)]">
          Card Error
        </h2>
        <p className="text-sm text-text-secondary">
          We couldn&apos;t load the card. Please try again.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={reset}>
            Try Again
          </Button>
          <Link href="/gallery">
            <Button>Gallery</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
