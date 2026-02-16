import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createServerClient } from "@/lib/supabase";

/**
 * NextAuth configuration
 *
 * Providers: Google OAuth, Email (magic link)
 * Session strategy: JWT (serverless-friendly)
 * Supabase sync: users 테이블에 자동 upsert on sign-in
 */

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/ko/auth/signin",
    signOut: "/ko/auth/signin",
    error: "/ko/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      // Supabase users 테이블에 upsert
      try {
        const supabase = createServerClient();
        await supabase.from("users").upsert(
          {
            auth_id: user.id,
            email: user.email || null,
            name: user.name || null,
            avatar_url: user.image || null,
          },
          { onConflict: "auth_id" }
        );
      } catch (e) {
        console.error("[NextAuth] Failed to sync user to Supabase:", e);
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
