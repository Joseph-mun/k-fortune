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

// Polar product configuration (from design spec Section 5.2)
export const POLAR_PRODUCTS = {
  DETAILED_READING: process.env.NEXT_PUBLIC_POLAR_PRODUCT_DETAILED_READING || '50ad1cfe-da26-41cd-80c7-862258baaa39',
  PREMIUM_SUBSCRIPTION: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PREMIUM_SUBSCRIPTION || 'e6efae19-0081-4df3-8c17-2f9fd76fd89c',
  DESTINY_CARD_PREMIUM: process.env.NEXT_PUBLIC_POLAR_PRODUCT_DESTINY_CARD_PREMIUM || 'destiny_card_premium',
  DESTINY_CARD_PHOTO: process.env.NEXT_PUBLIC_POLAR_PRODUCT_DESTINY_CARD_PHOTO || 'destiny_card_photo',
  PRINT_READY_PDF: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRINT_READY_PDF || 'print_ready_pdf',
} as const;

export const POLAR_PRICES = {
  DETAILED_READING: 199,           // $1.99
  PREMIUM_SUBSCRIPTION: 299,       // $2.99/mo
  DESTINY_CARD_PREMIUM: 49,        // $0.49
  DESTINY_CARD_PHOTO: 99,          // $0.99
  PRINT_READY_PDF: 149,            // $1.49
} as const;

/** Display-friendly price strings (single source of truth) */
export const PRICE_DISPLAY = {
  DETAILED_READING: '$1.99',
  PREMIUM_SUBSCRIPTION: '$2.99',
  DESTINY_CARD_PREMIUM: '$0.49',
  DESTINY_CARD_PHOTO: '$0.99',
  PRINT_READY_PDF: '$1.49',
} as const;

export type PolarProductType = keyof typeof POLAR_PRODUCTS;
