"use client";

import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";
import { cn } from "@/lib/utils";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div";
}

export function RevealSection({ children, className, as: Tag = "div" }: RevealSectionProps) {
  const { ref, isRevealed } = useIntersectionReveal({ threshold: 0.1 });

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement> & React.Ref<HTMLElement>}
      className={cn(
        "transition-all duration-700 ease-out",
        isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
