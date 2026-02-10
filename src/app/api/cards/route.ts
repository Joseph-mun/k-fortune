import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase";

const CreateCardSchema = z.object({
  style: z.enum(["classic", "tarot", "neon", "ink", "photo", "seasonal"]),
  readingData: z.record(z.string(), z.unknown()),
  isPublic: z.boolean().default(false),
});

/**
 * POST /api/cards
 * Create a new destiny card. Requires authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = CreateCardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
        { status: 400 }
      );
    }

    const { style, readingData, isPublic } = parsed.data;
    const supabase = createServerClient();

    const { data: card, error } = await supabase
      .from("destiny_cards")
      .insert({
        user_id: token.sub,
        style,
        reading_data: readingData,
        is_public: isPublic,
      })
      .select("id, user_id, style, reading_data, is_public, created_at")
      .single();

    if (error) {
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ card }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cards
 * List destiny cards. With auth: own cards. Without auth or ?public=true: public cards only.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");
    const sort = searchParams.get("sort") === "popular" ? "view_count" : "created_at";
    const publicOnly = searchParams.get("public") === "true";

    const supabase = createServerClient();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    let query = supabase
      .from("destiny_cards")
      .select("id, user_id, style, reading_data, is_public, created_at, view_count", {
        count: "exact",
      });

    if (publicOnly || !token?.sub) {
      query = query.eq("is_public", true);
    } else {
      query = query.eq("user_id", token.sub);
    }

    const { data: cards, count, error } = await query
      .order(sort, { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    const total = count || 0;

    return NextResponse.json({
      cards: cards || [],
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
