"use client";

import { useState, useCallback } from "react";
import { track } from "@vercel/analytics";

/**
 * useCheckout hook - Polar Checkout integration
 *
 * Design spec: Section 9.3 - Application layer hook
 * Handles redirecting to Polar checkout and managing checkout state
 */

interface CheckoutOptions {
  productId: string;
  customerEmail?: string;
  readingId?: string;
  successUrl?: string;
}

interface UseCheckoutReturn {
  checkout: (options: CheckoutOptions) => void;
  loading: boolean;
  error: string | null;
}

export function useCheckout(): UseCheckoutReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = useCallback((options: CheckoutOptions) => {
    setLoading(true);
    setError(null);

    try {
      // Build the checkout URL with query parameters
      const params = new URLSearchParams();
      params.set("products", options.productId);

      if (options.customerEmail) {
        params.set("customerEmail", options.customerEmail);
      }

      if (options.readingId) {
        params.set("metadata[readingId]", options.readingId);
      }

      // Redirect to the Polar checkout endpoint
      track("checkout_initiated", { source: "hook", productId: options.productId });
      const checkoutUrl = `/api/checkout?${params.toString()}`;
      window.location.href = checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed";
      setError(message);
      setLoading(false);
    }
  }, []);

  return { checkout, loading, error };
}
