"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface CarouselProps {
  items: ReactNode[];
  showDots?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export function Carousel({
  items,
  showDots = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 4000,
  className,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = items.length;

  const goto = useCallback(
    (idx: number) => {
      const next = ((idx % total) + total) % total;
      setCurrent(next);
    },
    [total],
  );

  const prev = useCallback(() => goto(current - 1), [current, goto]);
  const next = useCallback(() => goto(current + 1), [current, goto]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    const id = setInterval(() => goto(current + 1), autoPlayInterval);
    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, current, total, goto]);

  // Touch swipe
  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  if (total === 0) return null;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Track */}
      <div
        ref={trackRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item, i) => (
            <div key={i} className="w-full shrink-0 px-1">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full glass flex items-center justify-center text-text-muted hover:text-text-primary transition-colors z-10 hidden md:flex"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full glass flex items-center justify-center text-text-muted hover:text-text-primary transition-colors z-10 hidden md:flex"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && total > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goto(i)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                i === current
                  ? "bg-purple-400 w-4"
                  : "bg-white/[0.15] hover:bg-white/[0.25]",
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
