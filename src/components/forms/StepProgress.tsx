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
                  ? "bg-[#C5372E] border-[#C5372E]"
                  : i === currentStep
                    ? "bg-[#C5372E] border-[#C5372E] animate-pulse"
                    : "bg-transparent border-[#E8DFD3]",
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
                i < currentStep ? "bg-[#C5372E]" : "bg-[#E8DFD3]/30",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
