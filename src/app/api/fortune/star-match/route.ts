import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateCompatibility } from "@/lib/saju/compatibility";
import { getStarById } from "@/lib/saju/celebrities";
import { STEM_METAPHORS, BRANCH_ANIMALS } from "@/lib/saju/metaphors";
import type { BirthInput, HeavenlyStem, EarthlyBranch, Pillar } from "@/lib/saju/types";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rateLimit";

const StarMatchSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid birth date format"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  timezone: z.string().optional().default("UTC"),
  gender: z.enum(["male", "female", "other"]),
  starId: z.string().min(1, "Star ID is required"),
  locale: z.enum(["ko", "en", "es"]).optional().default("ko"),
});

export async function POST(request: Request) {
  try {
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(
      `star-match:${clientId}`,
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
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = StarMatchSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: firstError.message } },
        { status: 400 }
      );
    }

    const { birthDate, birthTime, timezone, gender, starId, locale } = validation.data;

    const star = getStarById(starId);
    if (!star) {
      return NextResponse.json(
        { error: { code: "STAR_NOT_FOUND", message: "Celebrity not found." } },
        { status: 404 }
      );
    }

    const userInput: BirthInput = {
      birthDate,
      birthTime: birthTime || null,
      timezone,
      gender,
      locale,
    };

    const starInput: BirthInput = {
      birthDate: star.birthDate,
      birthTime: null, // Birth time not publicly available
      timezone: "Asia/Seoul",
      gender: star.gender,
      locale,
    };

    const result = calculateCompatibility(userInput, starInput);

    const response = {
      star: {
        id: star.id,
        stageName: star.stageName,
        group: star.group,
        emoji: star.emoji,
      },
      overallScore: result.overallScore,
      categories: result.categories,
      analysis: result.analysis,
      advice: result.advice,
      user: {
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
      starReading: {
        dayMaster: {
          element: result.person2.dayMaster.element,
          yinYang: result.person2.dayMaster.yinYang,
          metaphor: result.person2.dayMaster.metaphor,
          displayName: result.person2.dayMaster.metaphorInfo.displayName,
          icon: result.person2.dayMaster.metaphorInfo.icon,
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
    console.error("Star match calculation error:", error);
    return NextResponse.json(
      { error: { code: "CALCULATION_ERROR", message: "Failed to calculate star match." } },
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
