import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://saju.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SAJU — Born to be told.",
    template: "%s | SAJU",
  },
  description:
    "Born to be told. Discover your cosmic identity with Saju, Korea's ancient Four Pillars of Destiny. Free reading in 30 seconds, collectible Destiny Cards, and K-Pop star compatibility.",
  keywords: [
    "saju", "korean fortune", "four pillars of destiny", "korean astrology",
    "saju reading", "destiny card", "k-pop compatibility", "what is saju",
    "korean zodiac", "birth chart", "cosmic blueprint", "born to be told",
  ],
  openGraph: {
    title: "SAJU — Born to be told.",
    description:
      "In Korea, your birth date tells a 5,000-year-old story. Free Four Pillars reading, collectible Destiny Cards, and K-Pop star compatibility.",
    type: "website",
    siteName: "SAJU",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "SAJU — Born to be told.",
    description:
      "In Korea, your birth date tells a 5,000-year-old story. Free reading, Destiny Cards, and K-Pop star compatibility.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      en: `${BASE_URL}/en`,
      ko: `${BASE_URL}/ko`,
      es: `${BASE_URL}/es`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
