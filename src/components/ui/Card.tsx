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
        "rounded-lg bg-white/[0.03] border border-white/[0.06] p-6",
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
