import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/user/purchases
 * Returns the authenticated user's purchase and subscription history.
 */
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.sub) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = createServerClient();

    const { data: purchases, count, error } = await supabase
      .from("purchases")
      .select("id, type, product_name, amount, currency, status, created_at", {
        count: "exact",
      })
      .eq("user_id", token.sub)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    const total = count || 0;

    return NextResponse.json({
      purchases: (purchases || []).map((p) => ({
        id: p.id,
        type: p.type,
        productName: p.product_name,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        createdAt: p.created_at,
      })),
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
