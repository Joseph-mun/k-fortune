"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ElementIcon } from "@/components/icons/ElementIcon";

const STORAGE_KEY = "saju-onboarding-done";
const TOTAL_SLIDES = 3;

export function OnboardingOverlay() {
  const t = useTranslations("onboarding");
  const [show, setShow] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  }

  function next() {
    if (slide < TOTAL_SLIDES - 1) {
      setSlide((s) => s + 1);
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-[min(420px,calc(100vw-2rem))] glass rounded-2xl p-8 ring-glow-purple">
        {/* Skip button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/[0.08] transition-colors cursor-pointer text-text-muted hover:text-text-primary"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Slide content */}
        <div className="flex flex-col items-center text-center min-h-[280px] justify-center">
          {slide === 0 && (
            <div className="animate-fade-in flex flex-col items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3 font-[family-name:var(--font-heading)]">
                {t("slide1Title")}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                {t("slide1Desc")}
              </p>
            </div>
          )}

          {slide === 1 && (
            <div className="animate-fade-in flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6">
                {(["wood", "fire", "earth", "metal", "water"] as const).map((el) => (
                  <div key={el} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <ElementIcon element={el} size={22} />
                  </div>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3 font-[family-name:var(--font-heading)]">
                {t("slide2Title")}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                {t("slide2Desc")}
              </p>
            </div>
          )}

          {slide === 2 && (
            <div className="animate-fade-in flex flex-col items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 animate-glow-breathe" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
                <span className="text-3xl">&#10024;</span>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3 font-[family-name:var(--font-heading)]">
                {t("slide3Title")}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs mb-6">
                {t("slide3Desc")}
              </p>
              <Link href="/start" onClick={dismiss}>
                <Button variant="primary" size="lg" className="btn-cta animate-cta-pulse gap-2">
                  {t("getStarted")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Dot indicators + navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            {t("skip")}
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === slide ? "bg-purple-400 w-4" : "bg-white/[0.15]"
                }`}
              />
            ))}
          </div>

          {slide < TOTAL_SLIDES - 1 ? (
            <button
              type="button"
              onClick={next}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              {t("next")}
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <div className="w-12" /> /* Spacer for alignment */
          )}
        </div>
      </div>
    </div>
  );
}
