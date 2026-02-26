"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

interface MobileCTAProps {
  label: string;
}

export function MobileCTA({ label }: MobileCTAProps) {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const heroCTA = document.querySelector("[data-hero-cta]");
    if (!heroCTA) {
      setVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observerRef.current.observe(heroCTA);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden pb-safe">
      <div className="px-4 py-3 bg-bg-dark/90 backdrop-blur-lg border-t border-white/[0.06]">
        <Link
          href="/start"
          className="flex items-center justify-center gap-2 w-full py-3 btn-cta text-white rounded-full font-semibold text-sm"
        >
          {label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
