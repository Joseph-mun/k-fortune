import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateCompatibility } from "@/lib/saju/compatibility";
import { STEM_METAPHORS, BRANCH_ANIMALS } from "@/lib/saju/metaphors";
import type { BirthInput, HeavenlyStem, EarthlyBranch, Pillar } from "@/lib/saju/types";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rateLimit";

/**
 * POST /api/fortune/compatibility
 *
 * Design spec: Section 4.1 - Compatibility analysis
 * Accepts two persons' birth data and returns compatibility scores.
 *
 * Rate limited: 5 requests per minute per IP
 */

const PersonSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid birth date format"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid birth time format").nullable().optional(),
  timezone: z.string().optional().default("UTC"),
  gender: z.enum(["male", "female", "other"]),
});

const CompatibilityInputSchema = z.object({
  person1: PersonSchema,
  person2: PersonSchema,
  locale: z.enum(["ko", "en", "es"]).optional().default("ko"),
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(
      `compatibility:${clientId}`,
      RATE_LIMITS.COMPATIBILITY
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
    const validation = CompatibilityInputSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: firstError.message } },
        { status: 400 }
      );
    }

    const { person1, person2, locale } = validation.data;

    const input1: BirthInput = {
      birthDate: person1.birthDate,
      birthTime: person1.birthTime || null,
      timezone: person1.timezone,
      gender: person1.gender,
      locale,
    };

    const input2: BirthInput = {
      birthDate: person2.birthDate,
      birthTime: person2.birthTime || null,
      timezone: person2.timezone,
      gender: person2.gender,
      locale,
    };

    const result = calculateCompatibility(input1, input2);

    const response = {
      overallScore: result.overallScore,
      categories: result.categories,
      analysis: result.analysis,
      advice: result.advice,
      person1: {
        dayMaster: {
          element: result.person1.dayMaster.element,
          yinYang: result.person1.dayMaster.yinYang,
          metaphor: result.person1.dayMaster.metaphor,
          displayName: result.person1.dayMaster.metaphorInfo.displayName,
          icon: result.person1.dayMaster.metaphorInfo.icon,
        },
        fourPillars: {
          year: formatPillar(result.person1.fourPillars.year),
          month: formatPillar(result.person1.fourPillars.month),
          day: formatPillar(result.person1.fourPillars.day),
          hour: formatPillar(result.person1.fourPillars.hour),
        },
      },
      person2: {
        dayMaster: {
          element: result.person2.dayMaster.element,
          yinYang: result.person2.dayMaster.yinYang,
          metaphor: result.person2.dayMaster.metaphor,
          displayName: result.person2.dayMaster.metaphorInfo.displayName,
          icon: result.person2.dayMaster.metaphorInfo.icon,
        },
        fourPillars: {
          year: formatPillar(result.person2.fourPillars.year),
          month: formatPillar(result.person2.fourPillars.month),
          day: formatPillar(result.person2.fourPillars.day),
          hour: formatPillar(result.person2.fourPillars.hour),
        },
      },
    };

    return NextResponse.json(response, {
      headers: {
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    });
  } catch (error) {
    console.error("Compatibility calculation error:", error);
    return NextResponse.json(
      { error: { code: "CALCULATION_ERROR", message: "Failed to calculate compatibility." } },
      { status: 500 }
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
