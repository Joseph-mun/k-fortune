"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ children, glow = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-bg-card border border-white/[0.06] p-5",
        "transition-colors duration-200",
        "hover:border-white/[0.1]",
        glow && "glow-purple border-purple-500/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
