import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://k-fortune.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "K-Destiny — Your Korean Fortune in 30 Seconds",
    template: "%s | K-Destiny",
  },
  description:
    "Discover your cosmic identity with Saju, Korea's ancient Four Pillars of Destiny. Get your free reading, collect Destiny Cards, and check your K-Pop star compatibility.",
  keywords: [
    "saju", "korean fortune", "four pillars of destiny", "korean astrology",
    "k-fortune", "destiny card", "k-pop compatibility", "saju reading",
    "korean zodiac", "birth chart", "cosmic blueprint",
  ],
  openGraph: {
    title: "K-Destiny — Your Korean Fortune in 30 Seconds",
    description:
      "Ancient Korean wisdom meets modern design. Free Four Pillars reading, collectible Destiny Cards, and K-Pop star compatibility.",
    type: "website",
    siteName: "K-Destiny",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Destiny — Your Korean Fortune in 30 Seconds",
    description:
      "Discover your cosmic identity with Saju. Free reading, Destiny Cards, and K-Pop star compatibility.",
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
