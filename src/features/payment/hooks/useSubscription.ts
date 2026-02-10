"use client";

import { useState, useCallback } from "react";

/**
 * useSubscription hook - Manages subscription state
 *
 * Design spec: Section 9.3 - Application layer hook
 * Checks subscription status and manages subscription lifecycle
 */

interface SubscriptionStatus {
  isActive: boolean;
  plan: string | null;
  currentPeriodEnd: string | null;
}

interface UseSubscriptionReturn {
  status: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  checkStatus: () => Promise<void>;
  cancel: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payment/subscription", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to check subscription status");
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to check subscription";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payment/subscription", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      setStatus({
        isActive: false,
        plan: null,
        currentPeriodEnd: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to cancel subscription";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { status, loading, error, checkStatus, cancel };
}
