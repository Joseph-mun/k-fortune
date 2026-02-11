import { Skeleton } from "@/components/ui/Skeleton";

export function SkeletonReading() {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl px-4 sm:px-8 py-8 animate-fade-in">
      {/* Hero skeleton */}
      <div className="flex flex-col items-center gap-3 pt-6">
        <Skeleton variant="circle" className="w-24 h-24" />
        <Skeleton className="w-20 h-2.5" />
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-28 h-4" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>

      {/* Summary skeleton */}
      <div className="w-full inline-card">
        <div className="inline-card-content flex flex-col gap-3">
          <Skeleton className="w-32 h-3" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-4" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-14 h-6 rounded-full" />
          </div>
        </div>
      </div>

      {/* Accordion skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full inline-card">
          <div className="inline-card-header">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-36 h-4" />
            </div>
            <Skeleton className="w-5 h-5" />
          </div>
        </div>
      ))}

      {/* Lucky info skeleton */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="inline-card">
            <div className="inline-card-content flex flex-col items-center gap-2 py-5">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-12 h-2" />
              <Skeleton className="w-16 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
