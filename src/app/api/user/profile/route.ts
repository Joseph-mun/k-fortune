import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

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

    return NextResponse.json({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      subscriptionTier: profile.subscription_tier || "free",
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
    const allowedFields = ["name", "avatar_url"];
    const updates: Record<string, string> = {};

    for (const field of allowedFields) {
      if (field in body && typeof body[field] === "string") {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "No valid fields to update" } },
        { status: 400 }
      );
    }

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
