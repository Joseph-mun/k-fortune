import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

/**
 * Middleware: i18n routing + Auth protection
 *
 * Protected page routes (require authentication):
 *   - /[locale]/dashboard
 *   - /[locale]/cards/create
 *
 * Protected API routes:
 *   - /api/fortune/detailed
 *   - /api/user/*
 *
 * Public routes (no auth required):
 *   - /[locale] (landing)
 *   - /[locale]/reading/[id]
 *   - /[locale]/pricing
 *   - /[locale]/auth/*
 *   - /api/fortune/basic
 *   - /api/checkout
 *   - /api/webhook/*
 *   - /api/auth/*
 */

const intlMiddleware = createIntlMiddleware(routing);

// Page routes that require authentication (without locale prefix)
const protectedPagePatterns = ["/dashboard", "/cards/create"];

// API routes that require authentication
const protectedApiPatterns = [
  "/api/fortune/detailed",
  "/api/user/",
];

function isProtectedPage(pathname: string): boolean {
  // Strip locale prefix (e.g., /en/dashboard -> /dashboard)
  const withoutLocale = pathname.replace(/^\/(ko|en|es)/, "");
  return protectedPagePatterns.some((pattern) =>
    withoutLocale.startsWith(pattern)
  );
}

function isProtectedApi(pathname: string): boolean {
  return protectedApiPatterns.some((pattern) =>
    pathname.startsWith(pattern)
  );
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // API routes: check auth for protected endpoints, skip i18n
  if (isApiRoute(pathname)) {
    if (isProtectedApi(pathname)) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        return NextResponse.json(
          { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
          { status: 401 }
        );
      }
    }
    // Let API routes pass through without i18n processing
    const apiResponse = NextResponse.next();
    addSecurityHeaders(apiResponse);
    return apiResponse;
  }

  // Page routes: check auth for protected pages
  if (isProtectedPage(pathname)) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // Redirect to sign-in page with callback URL
      const locale = pathname.match(/^\/(ko|en|es)/)?.[1] || "ko";
      const signInUrl = new URL(`/${locale}/auth/signin`, req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Apply i18n middleware for all page routes
  const response = intlMiddleware(req);
  addSecurityHeaders(response);
  return response;
}

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.vercel-insights.com https://vercel.live https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.ingest.sentry.io https://*.vercel-insights.com wss://*.supabase.co",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
}

export const config = {
  matcher: [
    "/",
    "/(ko|en|es)/:path*",
    "/((?!api|_next|.*\\..*).*)",
    "/api/fortune/detailed",
    "/api/user/:path*",
  ],
};
