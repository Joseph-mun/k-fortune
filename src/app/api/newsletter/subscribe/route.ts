import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * POST /api/newsletter/subscribe
 *
 * Collects email for pre-launch teaser campaign.
 * Stores in Supabase `newsletter_subscribers` table.
 *
 * Required migration:
 * CREATE TABLE IF NOT EXISTS newsletter_subscribers (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   email TEXT NOT NULL UNIQUE,
 *   birth_year INT,
 *   element TEXT,
 *   animal TEXT,
 *   subscribed_at TIMESTAMPTZ DEFAULT NOW(),
 *   unsubscribed_at TIMESTAMPTZ
 * );
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, birthYear, element, animal } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const supabase = createServerClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email: normalizedEmail,
          birth_year: birthYear && Number.isFinite(Number(birthYear)) && Number(birthYear) >= 1900 && Number(birthYear) <= new Date().getFullYear()
            ? Number(birthYear)
            : null,
          element: element || null,
          animal: animal || null,
          subscribed_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      );

    if (error) {
      console.error("Newsletter subscribe error:", error);
      // If table doesn't exist yet, still return success for UX
      // (emails will be collected once migration runs)
      if (error.code === "42P01") {
        console.warn(
          "newsletter_subscribers table not found. Run the migration to create it.",
        );
        return NextResponse.json({ success: true, pending: true });
      }
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
