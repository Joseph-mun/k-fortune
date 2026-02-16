import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/user/readings/[id]
 *
 * Fetch a reading by session_id for an authenticated user.
 * Used as server-side fallback when localStorage doesn't have the reading.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req });
  if (!token?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const authId = token.sub;
  const supabase = createServerClient();

  const { data: reading, error } = await supabase
    .from("readings")
    .select("result, is_paid")
    .eq("session_id", id)
    .eq("user_id", authId)
    .maybeSingle();

  if (error || !reading?.result) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json({ ...reading.result, _is_paid: reading.is_paid ?? false });
}
