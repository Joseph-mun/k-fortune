"use client";

import { cn } from "@/lib/utils";

interface CardFlipProps {
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
  onFlip?: () => void;
  className?: string;
}

export function CardFlip({ front, back, isFlipped, onFlip, className }: CardFlipProps) {
  return (
    <div
      className={cn("card-flip-container w-full", className)}
      onClick={!isFlipped ? onFlip : undefined}
      role={onFlip && !isFlipped ? "button" : undefined}
      tabIndex={onFlip && !isFlipped ? 0 : undefined}
      onKeyDown={onFlip && !isFlipped ? (e) => { if (e.key === "Enter" || e.key === " ") onFlip(); } : undefined}
    >
      {!isFlipped ? (
        <div className="card-flip-inner">
          <div className="card-flip-front">{front}</div>
          <div className="card-flip-back absolute inset-0">{back}</div>
        </div>
      ) : (
        <div className="card-flip-inner flipped">
          <div className="card-flip-front absolute inset-0">{front}</div>
          <div className="card-flip-back">{back}</div>
        </div>
      )}
    </div>
  );
}
