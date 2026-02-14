import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ReadingClient from "./ReadingClient";
import { createServerClient } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  let title = "Your Saju Reading";
  let description = "Discover your destiny through the ancient Korean art of Saju.";

  try {
    const supabase = createServerClient();
    const { data: reading } = await supabase
      .from("readings")
      .select("day_master_metaphor, result")
      .eq("session_id", id)
      .single();

    if (reading?.day_master_metaphor) {
      title = `${reading.day_master_metaphor} — Saju Reading`;
      const result = reading.result as Record<string, string> | null;
      const element = result?.dayMasterElement;
      const yinYang = result?.dayMasterYinYang;
      if (element && yinYang) {
        description = `${yinYang === "yang" ? "Yang" : "Yin"} ${element} · ${reading.day_master_metaphor}. Discover your Saju destiny.`;
      }
    }
  } catch {
    // Fallback to default metadata
  }

  const ogImageUrl = `/api/reading/${id}/og`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/reading/${id}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ReadingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ReadingClient />;
}
