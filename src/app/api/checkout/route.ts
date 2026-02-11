import { Checkout } from "@polar-sh/nextjs";

/**
 * GET /api/checkout
 *
 * Polar Checkout handler using @polar-sh/nextjs
 * Redirects user to Polar's hosted checkout page
 *
 * Usage: /api/checkout?products=prod_xxx&customerEmail=user@example.com
 *
 * Design spec: Section 4.2 - GET /api/checkout
 */
export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl:
    (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") +
    "/checkout/success?checkout_id={CHECKOUT_ID}",
  server:
    (process.env.POLAR_ENVIRONMENT as "production" | "sandbox") || "production",
});
