"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════
   묵 (Ink) Layer Components
   Traditional Korean calligraphic aesthetic
   Used for: Landing Hero, Reading Results, Pricing, Dashboard
   ══════════════════════════════════════════════════════ */

/**
 * InkSection — Full-width section with hanji paper background
 */
export function InkSection({
  children,
  className,
  dark = false,
  textured = true,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  textured?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "relative",
        dark ? "ink-bg-dark" : "ink-bg-hanji",
        textured && "ink-texture-hanji",
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </section>
  );
}

/**
 * InkHeading — Serif heading with 나눔명조
 */
export function InkHeading({
  children,
  as: Tag = "h2",
  level = 2,
  className,
  ...props
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  level?: 1 | 2 | 3;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const levelClasses = {
    1: "ink-display",
    2: "ink-h1",
    3: "ink-h2",
  };

  return (
    <Tag className={cn(levelClasses[level], className)} {...props}>
      {children}
    </Tag>
  );
}

/**
 * BrushDivider — Ink brush stroke section divider
 */
export function BrushDivider({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "my-8 mx-auto max-w-md",
        dark ? "ink-divider-dark" : "ink-divider",
        className,
      )}
      role="separator"
      aria-hidden="true"
    />
  );
}

/**
 * SealButton — Cinnabar red stamp-style CTA
 */
export const SealButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
  }
>(({ children, className, variant = "primary", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "touch-target",
        variant === "primary" ? "ink-btn-seal" : "ink-btn-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
SealButton.displayName = "SealButton";

/**
 * InkCard — Paper-like card with subtle shadow
 */
export function InkCard({
  children,
  className,
  dark = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(dark ? "ink-card-dark" : "ink-card", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * InkPillar — Traditional vertical saju pillar display
 */
export function InkPillar({
  stem,
  branch,
  className,
}: {
  stem: string;
  branch: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-4",
        className,
      )}
    >
      <span className="ink-pillar-vertical text-3xl ink-text-cinnabar">
        {stem}
      </span>
      <div className="w-8 ink-divider" />
      <span className="ink-pillar-vertical text-3xl ink-text-indigo">
        {branch}
      </span>
    </div>
  );
}

/**
 * InkInput — Minimal input with brush-stroke underline
 */
export const InkInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn("ink-input w-full touch-target", className)}
      {...props}
    />
  );
});
InkInput.displayName = "InkInput";
