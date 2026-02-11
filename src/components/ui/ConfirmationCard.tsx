"use client";

import { cn } from "@/lib/utils";
import { Button } from "./Button";
import type { ReactNode } from "react";

interface ConfirmationCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  primaryAction: { label: string; onClick: () => void; loading?: boolean };
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}

export function ConfirmationCard({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: ConfirmationCardProps) {
  return (
    <div className={cn("inline-card", className)}>
      <div className="inline-card-content flex flex-col items-center text-center gap-4">
        {icon && (
          <div className="w-12 h-12 rounded-full bg-purple-500/[0.08] border border-purple-500/[0.12] flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h3 className="typo-h3 text-text-primary mb-1">{title}</h3>
          <p className="typo-body text-text-secondary">{description}</p>
        </div>
      </div>
      <div className="inline-card-footer">
        {secondaryAction && (
          <Button
            variant="ghost"
            size="sm"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={primaryAction.onClick}
          loading={primaryAction.loading}
        >
          {primaryAction.label}
        </Button>
      </div>
    </div>
  );
}
