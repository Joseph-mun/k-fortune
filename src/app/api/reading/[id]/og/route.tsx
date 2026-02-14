import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const runtime = "edge";

const ELEMENT_COLORS: Record<string, { bg1: string; bg2: string; accent: string }> = {
  wood: { bg1: "#0A1A10", bg2: "#061208", accent: "#22C55E" },
  fire: { bg1: "#1A0A10", bg2: "#120608", accent: "#F43F5E" },
  earth: { bg1: "#1A1408", bg2: "#120E04", accent: "#F59E0B" },
  metal: { bg1: "#1A1A1E", bg2: "#101014", accent: "#E4E4E7" },
  water: { bg1: "#0A0A1E", bg2: "#060614", accent: "#6366F1" },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    const { data: reading } = await supabase
      .from("readings")
      .select("day_master_metaphor, result")
      .eq("session_id", id)
      .single();

    // Fallback values
    const metaphorName = reading?.day_master_metaphor || "SAJU";
    const result = (reading?.result || {}) as Record<string, string>;
    const element = result.dayMasterElement || "water";
    const yinYang = result.dayMasterYinYang || "yin";
    const icon = result.metaphorIcon || "\u2728";
    const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS.water;

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
            {icon}
          </div>

          {/* Metaphor name */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: colors.accent,
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            {metaphorName.toUpperCase()}
          </div>

          {/* Element + Yin/Yang */}
          <div
            style={{
              fontSize: 24,
              color: "#E8E0F0",
              opacity: 0.8,
              marginBottom: 32,
            }}
          >
            {yinYang === "yang" ? "Yang" : "Yin"} {element.charAt(0).toUpperCase() + element.slice(1)}
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
              color: "#E8E0F0",
              opacity: 0.6,
              letterSpacing: "0.15em",
            }}
          >
            K-DESTINY
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=604800",
        },
      }
    );
  } catch {
    return new Response("Error generating image", { status: 500 });
  }
}
