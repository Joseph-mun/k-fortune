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
        "rounded-lg bg-white border border-[#E8DFD3] p-6",
        "transition-colors duration-200",
        "hover:border-[#E8DFD3]",
        glow ? "shadow-[0_0_20px_rgba(197,55,46,0.06)]" : "shadow-[0_2px_8px_rgba(26,22,17,0.06)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
