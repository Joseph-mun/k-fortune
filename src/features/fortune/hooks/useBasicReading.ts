"use client";

import { useState } from "react";
import { fetchBasicReading } from "../api/fortuneApi";
import type { BirthInput, BasicReading } from "@/lib/saju/types";

/**
 * Custom hook for basic fortune reading
 * Application layer - manages API call state and error handling
 */
export function useBasicReading() {
  const [reading, setReading] = useState<BasicReading | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReading = async (input: BirthInput): Promise<BasicReading | null> => {
    setLoading(true);
    setError(null);
    setReading(null);

    try {
      const result = await fetchBasicReading(input);
      setReading(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get reading";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setReading(null);
    setError(null);
    setLoading(false);
  };

  return {
    reading,
    loading,
    error,
    getReading,
    reset,
  };
}
