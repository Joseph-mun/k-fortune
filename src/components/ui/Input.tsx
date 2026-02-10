"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded-xl bg-bg-surface border border-purple-500/20 px-4 py-3",
          "text-text-primary placeholder:text-text-muted",
          "focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30",
          "transition-all duration-200",
          error && "border-red-500/50 focus:border-red-500/80",
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
