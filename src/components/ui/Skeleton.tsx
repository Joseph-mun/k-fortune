import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "line" | "circle" | "rect";
}

export function Skeleton({ className, variant = "line" }: SkeletonProps) {
  return (
    <div
      className={cn(
        variant === "circle" ? "skeleton-circle" : "skeleton",
        {
          "h-4 w-full": variant === "line",
          "w-12 h-12": variant === "circle",
          "h-24 w-full": variant === "rect",
        },
        className,
      )}
    />
  );
}
