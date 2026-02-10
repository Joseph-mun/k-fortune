import { z } from 'zod';

/**
 * Environment variable validation using Zod
 *
 * Ensures all required environment variables are present and valid
 * Throws error on startup if validation fails
 */

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(), // Server-only

  // Polar (Payment)
  POLAR_ACCESS_TOKEN: z.string().min(1).optional(), // Server-only
  POLAR_WEBHOOK_SECRET: z.string().min(1).optional(), // Server-only

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Email Provider (NextAuth magic link)
  EMAIL_SERVER: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Call this in app initialization to fail fast if config is invalid
 */
export function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error(
      'Invalid environment variables. Please check .env.local against .env.example'
    );
  }

  return parsed.data;
}

/**
 * Get validated environment variables
 * Returns undefined for missing optional variables
 */
export function getEnv(): Env {
  return validateEnv();
}
