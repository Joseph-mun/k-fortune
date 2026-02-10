/**
 * Fortune API client
 * Application layer - handles API communication for fortune readings
 */

import type { BirthInput, BasicReading } from "@/lib/saju/types";

interface FortuneApiResponse {
  data?: BasicReading;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
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

/**
 * Fetch detailed (paid) fortune reading from API
 */
export async function fetchDetailedReading(input: BirthInput & { readingId?: string }): Promise<any> {
  const response = await fetch("/api/fortune/detailed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to fetch detailed reading");
  }

  return response.json();
}
