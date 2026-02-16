"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark",
        {
          "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white": variant === "primary",
          "bg-white/[0.06] text-text-secondary border border-white/[0.08] hover:bg-white/[0.1] focus-visible:ring-purple-500/30": variant === "secondary",
          "bg-transparent text-text-muted hover:text-text-secondary hover:bg-white/[0.04] focus-visible:ring-purple-500/30": variant === "ghost",
          "bg-gold-500 text-bg-dark hover:bg-gold-400 active:bg-gold-600 font-semibold focus-visible:ring-purple-500/30": variant === "gold",
        },
        {
          "px-3 py-1.5 text-xs min-h-[44px]": size === "sm",
          "px-4 py-2 text-sm": size === "md",
          "px-6 py-3 text-base": size === "lg",
        },
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
