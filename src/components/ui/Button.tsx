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
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark",
        {
          "bg-gradient-to-r from-[#C5372E] to-[#A47764] hover:from-[#D4584F] hover:to-[#B8886F] text-white rounded-full focus-visible:ring-[#C5372E]/30": variant === "primary",
          "bg-[#F5F0E8] text-[#1A1611] border border-[#E8DFD3] hover:bg-[#EDE7DB] rounded-lg focus-visible:ring-[#C5372E]/30": variant === "secondary",
          "bg-transparent text-[#6B6358] hover:text-[#1A1611] hover:bg-[#F5F0E8] rounded-lg focus-visible:ring-[#C5372E]/30": variant === "ghost",
          "bg-gold-500 text-bg-dark hover:bg-gold-400 active:bg-gold-600 font-semibold rounded-lg focus-visible:ring-[#C5372E]/30": variant === "gold",
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
