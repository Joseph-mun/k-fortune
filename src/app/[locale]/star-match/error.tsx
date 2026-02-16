"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-xl font-semibold text-text-primary mb-3">
        문제가 발생했습니다
      </h2>
      <p className="text-text-secondary mb-6 max-w-md">
        일시적인 오류가 발생했습니다. 다시 시도해 주세요.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-[#C5372E] to-[#A47764] text-white font-medium hover:opacity-90 transition-opacity"
      >
        다시 시도
      </button>
    </div>
  );
}
