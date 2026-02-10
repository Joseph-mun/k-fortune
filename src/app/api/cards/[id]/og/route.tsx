import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const runtime = "edge";

const STYLE_COLORS: Record<string, { bg1: string; bg2: string; text: string; accent: string }> = {
  classic: { bg1: "#1A1A2E", bg2: "#0A0A1A", text: "#E8E0F0", accent: "#D4AF37" },
  tarot: { bg1: "#1A1020", bg2: "#0D0A1A", text: "#E8E0F0", accent: "#D4AF37" },
  neon: { bg1: "#0A0020", bg2: "#150030", text: "#E8D0FF", accent: "#A855F7" },
  ink: { bg1: "#F5F0E8", bg2: "#E8E0D0", text: "#1A1A2E", accent: "#4A4A6A" },
  photo: { bg1: "#4A1060", bg2: "#2A0840", text: "#FFFFFF", accent: "#D4AF37" },
  seasonal: { bg1: "#1A0A1A", bg2: "#2A1030", text: "#FFD0E0", accent: "#F472B6" },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    const { data: card } = await supabase
      .from("destiny_cards")
      .select("style, reading_data, is_public")
      .eq("id", id)
      .single();

    if (!card || !card.is_public) {
      return new Response("Not found", { status: 404 });
    }

    const readingData = card.reading_data as Record<string, unknown>;
    const dayMaster = readingData.dayMaster as Record<string, unknown>;
    const metaphorInfo = dayMaster?.metaphorInfo as Record<string, string>;
    const colors = STYLE_COLORS[card.style] || STYLE_COLORS.classic;

    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(180deg, ${colors.bg1}, ${colors.bg2})`,
            fontFamily: "sans-serif",
          }}
        >
          {/* Icon */}
          <div style={{ fontSize: 96, marginBottom: 16 }}>
            {metaphorInfo?.icon || "\u2728"}
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: colors.accent,
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            {(metaphorInfo?.displayName || "K-Destiny").toUpperCase()}
          </div>

          {/* Element */}
          <div
            style={{
              fontSize: 24,
              color: colors.text,
              opacity: 0.8,
              marginBottom: 32,
            }}
          >
            {(dayMaster?.yinYang as string) === "yang" ? "Yang" : "Yin"}{" "}
            {(dayMaster?.element as string) || ""}
          </div>

          {/* Divider */}
          <div
            style={{
              width: 200,
              height: 1,
              background: colors.accent,
              opacity: 0.5,
              marginBottom: 24,
            }}
          />

          {/* Branding */}
          <div
            style={{
              fontSize: 18,
              color: colors.text,
              opacity: 0.6,
              letterSpacing: "0.15em",
            }}
          >
            K-DESTINY
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    return new Response("Error generating image", { status: 500 });
  }
}
