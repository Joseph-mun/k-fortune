import type { Metadata } from "next";
import CardViewClient from "./CardViewClient";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const ogImageUrl = `/api/cards/${id}/og`;
  const cardUrl = `/cards/${id}`;

  return {
    title: `K-Destiny Card`,
    description: "Discover your destiny through the ancient art of Saju",
    openGraph: {
      title: "K-Destiny Card",
      description: "Discover your destiny through the ancient art of Saju",
      url: cardUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "K-Destiny Card" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "K-Destiny Card",
      description: "Discover your destiny through the ancient art of Saju",
      images: [ogImageUrl],
    },
  };
}

export default function CardViewPage() {
  return <CardViewClient />;
}
