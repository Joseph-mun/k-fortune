import { NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { calculateDetailedReading } from "@/lib/saju";
import type { BirthInput } from "@/lib/saju/types";
import { STEM_METAPHORS, BRANCH_ANIMALS } from "@/lib/saju/metaphors";
import type { HeavenlyStem, EarthlyBranch, Pillar } from "@/lib/saju/types";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rateLimit";
import { calculateTenGods } from "@/lib/saju/tenGods";
import { createServerClient } from "@/lib/supabase";

/**
 * POST /api/fortune/detailed
 *
 * Design spec: Section 4.1 - Detailed fortune reading (paid)
 * Requires authentication and payment verification
 *
 * For MVP: accepts readingId and birthInput, returns detailed reading
 * In production: verify payment status via Polar before returning results
 */

const DetailedInputSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid birth date format"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid birth time format").nullable().optional(),
  timezone: z.string().optional().default("UTC"),
  gender: z.enum(["male", "female", "other"]),
  locale: z.enum(["ko", "en", "es"]).optional().default("ko"),
  readingId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication first
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Please sign in to access detailed readings." } },
        { status: 401 },
      );
    }

    // Rate limiting: 5 requests per minute per user
    const clientId = getClientIdentifier(request, token.sub);
    const rateLimit = checkRateLimit(
      `detailed:${clientId}`,
      RATE_LIMITS.DETAILED_FORTUNE
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please try again later.",
            retryAfter: Math.ceil(rateLimit.resetIn / 1000),
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();

    const validation = DetailedInputSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];

      if (firstError.path.includes("birthDate")) {
        return NextResponse.json(
          { error: { code: "INVALID_BIRTH_DATE", message: "Please enter a valid birth date." } },
          { status: 400 },
        );
      }

      if (firstError.path.includes("birthTime")) {
        return NextResponse.json(
          { error: { code: "INVALID_BIRTH_TIME", message: "Please enter a valid birth time." } },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: firstError.message } },
        { status: 400 },
      );
    }

    // Verify payment status
    const supabase = createServerClient();
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", token.sub)
      .eq("product_type", "detailed_reading")
      .eq("status", "completed")
      .limit(1)
      .maybeSingle();

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", token.sub)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (!purchase && !subscription) {
      return NextResponse.json(
        { error: { code: "PAYMENT_REQUIRED", message: "Please purchase a detailed reading to continue." } },
        { status: 402 },
      );
    }

    const input: BirthInput = {
      birthDate: validation.data.birthDate,
      birthTime: validation.data.birthTime || null,
      timezone: validation.data.timezone,
      gender: validation.data.gender,
      locale: validation.data.locale,
    };

    const reading = calculateDetailedReading(input);

    // Ten Gods analysis (Phase 2)
    const tenGods = calculateTenGods(reading.fourPillars);

    const response = {
      id: reading.id,
      fourPillars: {
        year: formatPillar(reading.fourPillars.year),
        month: formatPillar(reading.fourPillars.month),
        day: formatPillar(reading.fourPillars.day),
        hour: formatPillar(reading.fourPillars.hour),
      },
      elementAnalysis: reading.elementAnalysis,
      dayMaster: {
        element: reading.dayMaster.element,
        yinYang: reading.dayMaster.yinYang,
        metaphor: reading.dayMaster.metaphor,
        metaphorInfo: {
          id: reading.dayMaster.metaphorInfo.id,
          stem: reading.dayMaster.metaphorInfo.stem,
          element: reading.dayMaster.metaphorInfo.element,
          yinYang: reading.dayMaster.metaphorInfo.yinYang,
          displayName: reading.dayMaster.metaphorInfo.displayName,
          icon: reading.dayMaster.metaphorInfo.icon,
          nature: reading.dayMaster.metaphorInfo.nature,
          keywords: reading.dayMaster.metaphorInfo.keywords,
        },
        personality: reading.dayMaster.personality,
        strengths: reading.dayMaster.strengths,
        weaknesses: reading.dayMaster.weaknesses,
      },
      luckyInfo: reading.luckyInfo,
      // Detailed reading fields
      career: reading.career,
      relationship: reading.relationship,
      health: reading.health,
      wealth: reading.wealth,
      yearlyFortune: reading.yearlyFortune,
      advice: reading.advice,
      majorCycles: reading.majorCycles.map((cycle) => ({
        startAge: cycle.startAge,
        endAge: cycle.endAge,
        pillar: formatPillar(cycle.pillar),
        description: cycle.description,
        rating: cycle.rating,
      })),
      tenGods: {
        dayMaster: tenGods.dayMaster,
        entries: tenGods.entries,
        dominant: tenGods.dominant,
        summary: tenGods.summary,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Detailed fortune calculation error:", error);
    return NextResponse.json(
      { error: { code: "CALCULATION_ERROR", message: "Failed to calculate detailed fortune." } },
      { status: 500 },
    );
  }
}

function formatPillar(pillar: Pillar) {
  const metaphor = STEM_METAPHORS[pillar.stem as HeavenlyStem];
  const animal = BRANCH_ANIMALS[pillar.branch as EarthlyBranch];

  return {
    metaphor: pillar.metaphor,
    animal: pillar.animal,
    element: pillar.stemElement,
    yinYang: pillar.yinYang,
    display: {
      stemName: metaphor.displayName,
      stemIcon: metaphor.icon,
      animalName: animal.displayName,
      animalIcon: animal.icon,
    },
  };
}
