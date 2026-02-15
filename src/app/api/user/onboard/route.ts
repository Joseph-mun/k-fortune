import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createServerClient } from "@/lib/supabase";

/**
 * POST /api/user/onboard
 *
 * Called after social login to:
 * 1. Save birth data to user_profiles
 * 2. Link anonymous reading to authenticated user
 */
export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authId = token.sub;

  let body: {
    readingId?: string;
    birthDate?: string;
    birthTime?: string | null;
    timezone?: string;
    gender?: string;
    locale?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createServerClient();

  // 1. Look up Supabase user by auth_id
  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", authId)
    .single();

  if (userErr || !user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const userId = user.id;

  // 2. Upsert user_profiles with birth data
  if (body.birthDate) {
    await supabase.from("user_profiles").upsert(
      {
        id: userId,
        birth_date: body.birthDate,
        birth_time: body.birthTime || null,
        birth_timezone: body.timezone || null,
        gender: body.gender || null,
        locale: body.locale || "en",
      },
      { onConflict: "id" }
    );
  }

  // 3. Link reading to user (only if user_id is null — don't overwrite)
  if (body.readingId) {
    await supabase
      .from("readings")
      .update({ user_id: authId })
      .eq("session_id", body.readingId)
      .is("user_id", null);
  }

  return NextResponse.json({ userId });
}
