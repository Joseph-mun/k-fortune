import { Polar } from '@polar-sh/sdk';

/**
 * Polar client configuration
 *
 * Server-side: Polar SDK with access token
 * Uses @polar-sh/nextjs for Checkout and Webhook handlers
 *
 * @see https://polar.sh/docs/integrate/sdk/adapters/nextjs
 */

// Server-side Polar client
let polarClient: Polar | null = null;

export function getPolarClient(): Polar {
  if (!polarClient) {
    const accessToken = process.env.POLAR_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error(
        'Missing POLAR_ACCESS_TOKEN environment variable. Please check .env.local'
      );
    }

    polarClient = new Polar({
      accessToken,
      server: (process.env.POLAR_ENVIRONMENT as 'production' | 'sandbox') || 'production',
    });
  }

  return polarClient;
}

// MVP: Single product — Pay-Per-View reading ($0.99)
export const POLAR_PRODUCTS = {
  SINGLE_READING: (process.env.NEXT_PUBLIC_POLAR_PRODUCT_SINGLE_READING || 'TODO_CREATE_IN_POLAR_DASHBOARD').trim(),
} as const;

export const POLAR_PRICES = {
  SINGLE_READING: 99, // $0.99
} as const;

/** Display-friendly price strings (single source of truth) */
export const PRICE_DISPLAY = {
  SINGLE_READING: '$0.99',
} as const;

export type PolarProductType = keyof typeof POLAR_PRODUCTS;
