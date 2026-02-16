"use client";

import { cn } from "@/lib/utils";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function StepProgress({ currentStep, totalSteps, labels }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-xs mx-auto">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          {/* Dot */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-all duration-300",
                i < currentStep
                  ? "bg-purple-500 border-purple-500"
                  : i === currentStep
                    ? "bg-purple-500 border-purple-500 animate-pulse"
                    : "bg-transparent border-white/[0.15]",
              )}
            />
            {labels?.[i] && (
              <span
                className={cn(
                  "text-sm transition-colors duration-300",
                  i <= currentStep ? "text-text-secondary" : "text-text-muted",
                )}
              >
                {labels[i]}
              </span>
            )}
          </div>

          {/* Connector line */}
          {i < totalSteps - 1 && (
            <div
              className={cn(
                "w-12 h-0.5 mx-1 transition-all duration-300",
                i < currentStep ? "bg-purple-500" : "bg-white/[0.08]",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
