import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/cards/[id]
 * Get a single card. Accessible if: owner OR card is public.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const { data: card, error } = await supabase
      .from("destiny_cards")
      .select("id, user_id, style, reading_data, is_public, created_at, updated_at, view_count")
      .eq("id", id)
      .single();

    if (error || !card) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Card not found" } },
        { status: 404 }
      );
    }

    // Access control: owner or public
    if (!card.is_public && card.user_id !== token?.sub) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Access denied" } },
        { status: 403 }
      );
    }

    // Increment view count for public cards (non-blocking)
    if (card.is_public && card.user_id !== token?.sub) {
      supabase
        .from("destiny_cards")
        .update({ view_count: (card.view_count || 0) + 1 })
        .eq("id", id)
        .then(() => {});
    }

    return NextResponse.json({ card });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cards/[id]
 * Delete a card. Only the owner can delete.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.sub) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const supabase = createServerClient();

    // Verify ownership before deleting
    const { data: card } = await supabase
      .from("destiny_cards")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!card) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Card not found" } },
        { status: 404 }
      );
    }

    if (card.user_id !== token.sub) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "You can only delete your own cards" } },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("destiny_cards")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
