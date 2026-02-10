"use client";

import { useSession, signIn, signOut } from "next-auth/react";

/**
 * useAuth hook - Authentication state management
 *
 * Design spec: Section 9.3 - Application layer hook
 * Wraps NextAuth session hooks for consistent auth state across the app
 */
export function useAuth() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user ?? null;

  const login = async (provider: "google" | "email" = "google") => {
    await signIn(provider);
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    session,
  };
}
