import { Checkout } from "@polar-sh/nextjs";
import { NextResponse } from "next/server";

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

const polarAccessToken = process.env.POLAR_ACCESS_TOKEN;

export const GET = polarAccessToken
  ? Checkout({
      accessToken: polarAccessToken,
      successUrl:
        (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") +
        "/checkout/success?checkout_id={CHECKOUT_ID}",
      server:
        (process.env.POLAR_ENVIRONMENT as "production" | "sandbox") || "production",
    })
  : () =>
      NextResponse.json(
        { error: { code: "CONFIG_ERROR", message: "Payment service is not configured" } },
        { status: 503 }
      );
