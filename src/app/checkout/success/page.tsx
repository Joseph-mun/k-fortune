"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import { Sparkles, ArrowRight, LayoutDashboard } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((c) => c.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];
    const browserLocale = navigator.language?.startsWith("es")
      ? "es"
      : navigator.language?.startsWith("ko")
        ? "ko"
        : "en";
    setLocale(cookieLocale || browserLocale);

    track("purchase_success_viewed", {
      checkoutId: searchParams.get("checkout_id") || "",
    });
  }, [searchParams]);

  const texts = {
    en: {
      title: "Payment Successful!",
      subtitle: "Your destiny awaits. Here's what you can do next:",
      cta1: "View Full AI Reading",
      cta1Desc: "Get your personalized career, love & life insights",
      cta2: "Go to Dashboard",
      cta2Desc: "See all your readings and manage your account",
      badge: "Thank you",
    },
    ko: {
      title: "결제 완료!",
      subtitle: "당신의 운명이 기다리고 있습니다. 다음 단계를 선택하세요:",
      cta1: "AI 전체 감정 보기",
      cta1Desc: "맞춤형 직업, 연애 & 인생 통찰 받기",
      cta2: "대시보드로 이동",
      cta2Desc: "모든 감정 결과 확인 및 계정 관리",
      badge: "감사합니다",
    },
    es: {
      title: "Pago Exitoso!",
      subtitle: "Tu destino te espera. Esto es lo que puedes hacer:",
      cta1: "Ver Lectura AI Completa",
      cta1Desc: "Obtén tus insights personalizados de carrera, amor y vida",
      cta2: "Ir al Panel",
      cta2Desc: "Ve todas tus lecturas y administra tu cuenta",
      badge: "Gracias",
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;

  return (
    <div className="flex flex-col items-center gap-8 max-w-md mx-auto text-center px-4">
      {/* Success animation */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
          style={{ background: "rgba(139,92,246,0.15)", border: "2px solid rgba(139,92,246,0.3)" }}
        >
          <Sparkles className="w-10 h-10 text-purple-400" />
        </div>
        <div
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold"
        >
          ✓
        </div>
      </div>

      {/* Badge */}
      <span className="px-3 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-medium">
        {t.badge}
      </span>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          {t.title}
        </h1>
        <p className="text-zinc-400 text-sm">
          {t.subtitle}
        </p>
      </div>

      {/* Action cards */}
      <div className="flex flex-col gap-3 w-full">
        <a
          href={`/${locale}/dashboard?paid=true&checkout_id=${searchParams.get("checkout_id") || ""}`}
          className="flex items-center gap-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/15 transition-colors text-left group"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/20 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{t.cta1}</p>
            <p className="text-xs text-zinc-500">{t.cta1Desc}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors flex-shrink-0" />
        </a>

        <a
          href={`/${locale}/dashboard`}
          className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 transition-colors text-left group"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-700/50 flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{t.cta2}</p>
            <p className="text-xs text-zinc-500">{t.cta2Desc}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0" />
        </a>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#09090B]">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-purple-500/[0.3] border-t-purple-500 rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">Loading...</p>
          </div>
        }
      >
        <CheckoutSuccessContent />
      </Suspense>
    </main>
  );
}
