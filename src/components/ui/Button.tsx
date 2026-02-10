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
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-purple-500 text-white hover:bg-purple-600 glow-purple": variant === "primary",
          "bg-bg-card text-text-primary border border-purple-500/30 hover:border-purple-500/60": variant === "secondary",
          "bg-transparent text-text-secondary hover:text-text-primary": variant === "ghost",
          "bg-gradient-to-r from-gold-500 to-gold-600 text-bg-dark hover:from-gold-600 hover:to-gold-500 glow-gold": variant === "gold",
        },
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-5 py-2.5 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
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
