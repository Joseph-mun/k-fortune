import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client configuration
 *
 * Client-side: Uses anon key (safe for browser)
 * Server-side: Uses service role key (for admin operations)
 *
 * Uses placeholder values at build time to prevent build failures.
 * Actual env vars are required at runtime.
 */

const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-key';

// Client-side Supabase client
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY;

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server-side Supabase client (with service role key for admin operations)
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || PLACEHOLDER_KEY;

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Default export for client-side usage
export const supabase = createBrowserClient();
