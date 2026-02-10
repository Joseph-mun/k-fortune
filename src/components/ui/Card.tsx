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
        "rounded-2xl bg-bg-card border border-purple-500/10 p-6",
        "card-shine",
        glow && "glow-purple",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
