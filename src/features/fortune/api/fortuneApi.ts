/**
 * Fortune API client
 * Application layer - handles API communication for fortune readings
 */

import type { BirthInput, BasicReading } from "@/lib/saju/types";

interface FortuneApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

interface FortuneApiResponse {
  data?: BasicReading;
  error?: FortuneApiError;
}

/**
 * Fetch basic (free) fortune reading from API
 */
export async function fetchBasicReading(input: BirthInput): Promise<BasicReading> {
  const response = await fetch("/api/fortune/basic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error: FortuneApiResponse = await response.json();
    throw new Error(error.error?.message || "Failed to fetch basic reading");
  }

  const result: FortuneApiResponse = await response.json();

  if (!result.data) {
    throw new Error("Invalid API response: missing data");
  }

  return result.data;
}

