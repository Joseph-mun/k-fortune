import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateBasicReading } from "@/lib/saju";
import type { BirthInput } from "@/lib/saju/types";
import { STEM_METAPHORS, BRANCH_ANIMALS } from "@/lib/saju/metaphors";
import type { HeavenlyStem, EarthlyBranch, Pillar } from "@/lib/saju/types";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rateLimit";

const BirthInputSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid birth date format"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid birth time format").nullable().optional(),
  timezone: z.string().optional().default("UTC"),
  gender: z.enum(["male", "female", "other"]),
  locale: z.enum(["ko", "en", "es"]).optional().default("ko"),
});

export async function POST(request: Request) {
  try {
    // Rate limiting: 10 requests per minute per IP
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(
      `basic:${clientId}`,
      RATE_LIMITS.BASIC_FORTUNE
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

    const validation = BirthInputSchema.safeParse(body);

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

    const input: BirthInput = {
      birthDate: validation.data.birthDate,
      birthTime: validation.data.birthTime || null,
      timezone: validation.data.timezone,
      gender: validation.data.gender,
      locale: validation.data.locale,
    };

    const reading = calculateBasicReading(input);

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
      preview: {
        career: reading.dayMaster.personality.split(".")[0] + "...",
        teaser: "Unlock your full career path, relationships, and personalized advice.",
      },
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://k-destiny.vercel.app'}/reading/${reading.id}`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Fortune calculation error:", error);
    return NextResponse.json(
      { error: { code: "CALCULATION_ERROR", message: "Failed to calculate fortune." } },
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
