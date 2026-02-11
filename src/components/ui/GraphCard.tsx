"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface LegendItem {
  label: string;
  color: string;
}

interface GraphCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  legend?: LegendItem[];
}

export function GraphCard({
  title,
  subtitle,
  icon,
  legend,
  children,
  className,
  ...props
}: GraphCardProps) {
  return (
    <div className={cn("inline-card", className)} {...props}>
      {/* Header */}
      <div className="inline-card-header">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <p className="text-sm font-medium text-text-primary">{title}</p>
            {subtitle && <p className="typo-caption">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="inline-card-content">{children}</div>

      {/* Legend footer */}
      {legend && legend.length > 0 && (
        <div className="inline-card-footer justify-start gap-4">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="typo-caption">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
