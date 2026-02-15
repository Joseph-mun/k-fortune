"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════════
   놀이 (Play) Layer Components
   Gen-Z social-native playful aesthetic
   Used for: Card Creator, Gallery, Quiz, Compatibility, Star Match
   ══════════════════════════════════════════════════════ */

/**
 * PlaySection — Section with gradient mesh background
 */
export function PlaySection({
  children,
  className,
  gradient = true,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "relative",
        gradient ? "play-gradient-mesh" : "play-bg",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

/**
 * PlayHeading — Rounded geometric heading with Outfit
 */
export function PlayHeading({
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
    1: "play-display",
    2: "play-h1",
    3: "play-h2",
  };

  return (
    <Tag className={cn(levelClasses[level], className)} {...props}>
      {children}
    </Tag>
  );
}

/**
 * PlayCard — Rounded card with soft shadow
 */
export function PlayCard({
  children,
  className,
  accentColor,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("play-card", className)}
      style={accentColor ? { borderTopColor: accentColor, borderTopWidth: 3 } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * PlayTag — Sticker-like tag with slight rotation
 */
export function PlayTag({
  children,
  className,
  color,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={cn("play-tag", className)}
      style={color ? { backgroundColor: color, color: "inherit" } : undefined}
    >
      {children}
    </span>
  );
}

/**
 * PlayButton — Rounded pill button
 */
export const PlayButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost";
  }
>(({ children, className, variant = "primary", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "touch-target",
        variant === "primary" ? "play-btn" : "play-btn-ghost",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
PlayButton.displayName = "PlayButton";

/**
 * StoryDots — Instagram-style progress dots
 */
export function StoryDots({
  total,
  current,
  className,
}: {
  total: number;
  current: number;
  className?: string;
}) {
  return (
    <div className={cn("play-story-dots", className)} role="tablist">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "play-story-dot",
            i === current && "play-story-dot-active",
          )}
          role="tab"
          aria-selected={i === current}
          aria-label={`Section ${i + 1} of ${total}`}
        />
      ))}
    </div>
  );
}

/**
 * PlayInput — Rounded input with purple focus
 */
export const PlayInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn("play-input w-full touch-target", className)}
      {...props}
    />
  );
});
PlayInput.displayName = "PlayInput";

/**
 * PlayHandwriting — Handwritten text accent (Gaegu font)
 */
export function PlayHandwriting({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("play-handwriting", className)} {...props}>
      {children}
    </span>
  );
}

/**
 * BlobShape — Organic blob background
 */
export function BlobShape({
  className,
  color = "var(--play-accent)",
  size = 200,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div
      className={cn("play-blob absolute opacity-10 pointer-events-none", className)}
      style={{
        backgroundColor: color,
        width: size,
        height: size,
      }}
      aria-hidden="true"
    />
  );
}
