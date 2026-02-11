import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CardViewClient from "./CardViewClient";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const ogImageUrl = `/api/cards/${id}/og`;
  const cardUrl = `/cards/${id}`;

  return {
    title: `SAJU Card`,
    description: "Born to be told. Discover your Saju destiny.",
    openGraph: {
      title: "SAJU Card",
      description: "Born to be told. Discover your Saju destiny.",
      url: cardUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "SAJU Card" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "SAJU Card",
      description: "Born to be told. Discover your Saju destiny.",
      images: [ogImageUrl],
    },
  };
}

export default async function CardViewPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CardViewClient />;
}
