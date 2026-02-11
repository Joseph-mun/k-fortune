"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkoutId = searchParams.get("checkout_id") || "";

    const cookieLocale = document.cookie
      .split("; ")
      .find((c) => c.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];
    const browserLocale = navigator.language?.startsWith("es")
      ? "es"
      : navigator.language?.startsWith("en")
        ? "en"
        : "ko";
    const locale = cookieLocale || browserLocale;

    window.location.href = `/${locale}/dashboard?paid=true&checkout_id=${checkoutId}`;
  }, [searchParams]);

  return null;
}

export default function CheckoutSuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#09090B]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-purple-500/[0.3] border-t-purple-500 rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Redirecting...</p>
      </div>
      <Suspense>
        <CheckoutRedirect />
      </Suspense>
    </main>
  );
}
