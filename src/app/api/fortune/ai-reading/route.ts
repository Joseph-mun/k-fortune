import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rateLimit";
import { createServerClient } from "@/lib/supabase";
import { SAJU_PREVIEW_PROMPT, SAJU_FULL_PROMPT, buildUserPrompt } from "@/lib/ai/prompts";

const AiReadingSchema = z.object({
  mode: z.enum(["preview", "full"]),
  readingId: z.string(),
  fourPillars: z.object({
    year: z.any(),
    month: z.any(),
    day: z.any(),
    hour: z.any(),
  }),
  elementAnalysis: z.object({
    wood: z.number(),
    fire: z.number(),
    earth: z.number(),
    metal: z.number(),
    water: z.number(),
    dominant: z.string(),
    lacking: z.string().nullable(),
  }),
  dayMaster: z.object({
    element: z.string(),
    yinYang: z.string(),
    metaphor: z.string(),
    metaphorInfo: z.object({
      displayName: z.string(),
      icon: z.string(),
    }),
  }),
  locale: z.enum(["ko", "en", "es"]).default("en"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const clientId = getClientIdentifier(request, token?.sub as string | undefined);
    const rateLimit = await checkRateLimit(
      `ai-reading:${clientId}`,
      RATE_LIMITS.AI_READING
    );

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." },
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    const validation = AiReadingSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: { code: "INVALID_INPUT", message: "Invalid reading data." } }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { mode, readingId, locale, ...readingData } = validation.data;

    // Full mode requires authentication + payment
    if (mode === "full") {
      if (!token?.sub) {
        return new Response(
          JSON.stringify({ error: { code: "UNAUTHORIZED", message: "Please sign in." } }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

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
        return new Response(
          JSON.stringify({ error: { code: "PAYMENT_REQUIRED", message: "Please purchase a detailed reading." } }),
          { status: 402, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Check for cached AI interpretation
    const supabase = createServerClient();
    const cacheField = mode === "preview" ? "aiPreview" : "aiInterpretation";
    const { data: cached } = await supabase
      .from("readings")
      .select("result")
      .eq("session_id", readingId)
      .maybeSingle();

    const cachedResult = cached?.result as Record<string, string> | null;
    if (cachedResult?.[cacheField]) {
      return new Response(
        JSON.stringify({ cached: true, text: cachedResult[cacheField] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build prompt and stream
    const systemPrompt = mode === "preview" ? SAJU_PREVIEW_PROMPT : SAJU_FULL_PROMPT;
    const userPrompt = buildUserPrompt({ ...readingData, locale });

    const result = streamText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      maxOutputTokens: mode === "preview" ? 400 : 1500,
      temperature: 0.7,
      onFinish: async ({ text }) => {
        // Cache the AI interpretation in Supabase
        try {
          const existingResult = (cachedResult || {}) as Record<string, unknown>;
          await supabase
            .from("readings")
            .update({
              result: {
                ...existingResult,
                [cacheField]: text,
                [`${cacheField}At`]: new Date().toISOString(),
              },
            })
            .eq("session_id", readingId);
        } catch {
          // Non-critical: caching failed
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI reading error:", error);
    return new Response(
      JSON.stringify({ error: { code: "AI_ERROR", message: "Failed to generate AI interpretation." } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
