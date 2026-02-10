import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/user/readings
 *
 * Returns the authenticated user's reading history.
 * Protected by middleware (requires valid JWT).
 *
 * Query params:
 *   - limit: number (default 20, max 100)
 *   - offset: number (default 0)
 *   - type: "basic" | "detailed" | "compatibility" (optional filter)
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

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const type = searchParams.get("type");

    const supabase = createServerClient();

    let query = supabase
      .from("readings")
      .select("id, type, birth_date, birth_time, gender, day_master_metaphor, overall_score, created_at", { count: "exact" })
      .eq("user_id", token.sub)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (type && ["basic", "detailed", "compatibility"].includes(type)) {
      query = query.eq("type", type);
    }

    const { data: readings, error, count } = await query;

    if (error) {
      console.error("Readings fetch error:", error);
      return NextResponse.json(
        { error: { code: "FETCH_FAILED", message: "Failed to fetch readings" } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      readings: (readings || []).map((r) => ({
        id: r.id,
        type: r.type,
        birthDate: r.birth_date,
        birthTime: r.birth_time,
        gender: r.gender,
        dayMasterMetaphor: r.day_master_metaphor,
        overallScore: r.overall_score,
        createdAt: r.created_at,
      })),
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error("Readings fetch error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch readings" } },
      { status: 500 }
    );
  }
}
