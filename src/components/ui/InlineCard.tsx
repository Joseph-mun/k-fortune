"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface InlineCardProps extends HTMLAttributes<HTMLDivElement> {
  header?: {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    action?: ReactNode;
  };
  footer?: ReactNode;
  compact?: boolean;
}

export function InlineCard({
  header,
  footer,
  compact = false,
  children,
  className,
  ...props
}: InlineCardProps) {
  return (
    <div className={cn("inline-card", className)} {...props}>
      {header && (
        <div className="inline-card-header">
          <div className="flex items-center gap-2 min-w-0">
            {header.icon}
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {header.title}
              </p>
              {header.subtitle && (
                <p className="typo-caption truncate">{header.subtitle}</p>
              )}
            </div>
          </div>
          {header.action}
        </div>
      )}

      <div className={compact ? "inline-card-content-compact" : "inline-card-content"}>
        {children}
      </div>

      {footer && <div className="inline-card-footer">{footer}</div>}
    </div>
  );
}
