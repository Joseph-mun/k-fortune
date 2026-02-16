import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase";

const ProfileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().max(500).optional(),
}).refine((data) => data.name !== undefined || data.avatar_url !== undefined, {
  message: "At least one field (name or avatar_url) is required",
});

/**
 * GET /api/user/profile
 *
 * Returns the authenticated user's profile.
 * Protected by middleware (requires valid JWT).
 */
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const supabase = createServerClient();

    const { data: profile, error } = await supabase
      .from("users")
      .select("id, email, name, avatar_url, created_at, subscription_tier, subscription_status")
      .eq("auth_id", token.sub)
      .single();

    if (error || !profile) {
      // User may not exist in DB yet - return basic info from token
      return NextResponse.json({
        id: token.sub,
        email: token.email || null,
        name: token.name || null,
        avatarUrl: token.picture || null,
        subscriptionTier: "free",
        subscriptionStatus: null,
        createdAt: null,
      });
    }

    // Determine effective tier: check purchases if no subscription
    let effectiveTier = profile.subscription_tier || "free";
    if (effectiveTier === "free") {
      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", profile.id)
        .eq("status", "completed")
        .limit(1)
        .maybeSingle();

      if (purchase) {
        effectiveTier = "detailed";
      }
    }

    return NextResponse.json({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      subscriptionTier: effectiveTier,
      subscriptionStatus: profile.subscription_status || null,
      createdAt: profile.created_at,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch profile" } },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile
 *
 * Updates the authenticated user's profile.
 * Protected by middleware (requires valid JWT).
 */
export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = ProfileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: parsed.error.issues[0].message } },
        { status: 400 }
      );
    }

    const updates: Record<string, string> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.avatar_url !== undefined) updates.avatar_url = parsed.data.avatar_url;

    const supabase = createServerClient();

    const { data: profile, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("auth_id", token.sub)
      .select("id, email, name, avatar_url, subscription_tier, subscription_status")
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json(
        { error: { code: "UPDATE_FAILED", message: "Failed to update profile" } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      subscriptionTier: profile.subscription_tier || "free",
      subscriptionStatus: profile.subscription_status || null,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to update profile" } },
      { status: 500 }
    );
  }
}
