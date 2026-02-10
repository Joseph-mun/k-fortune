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
      server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    });
  }

  return polarClient;
}

// Polar product configuration (from design spec Section 5.2)
export const POLAR_PRODUCTS = {
  DETAILED_READING: 'detailed_reading',
  PREMIUM_SUBSCRIPTION: 'premium_subscription',
  DESTINY_CARD_PREMIUM: 'destiny_card_premium',
  DESTINY_CARD_PHOTO: 'destiny_card_photo',
  PRINT_READY_PDF: 'print_ready_pdf',
} as const;

export const POLAR_PRICES = {
  DETAILED_READING: 299,           // $2.99
  PREMIUM_SUBSCRIPTION: 999,       // $9.99/mo
  DESTINY_CARD_PREMIUM: 99,        // $0.99
  DESTINY_CARD_PHOTO: 199,         // $1.99
  PRINT_READY_PDF: 299,            // $2.99
} as const;

export type PolarProductType = keyof typeof POLAR_PRODUCTS;
