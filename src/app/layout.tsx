import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://k-fortune.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "K-Destiny | Discover Your Korean Destiny",
    template: "%s | K-Destiny",
  },
  description:
    "Unlock the ancient secrets of Korean Four Pillars of Destiny (Saju). Discover your cosmic blueprint with K-Destiny.",
  keywords: ["saju", "korean fortune", "four pillars", "destiny", "korean astrology"],
  openGraph: {
    title: "K-Destiny | Discover Your Korean Destiny",
    description:
      "Ancient Korean wisdom meets modern insight. Get your personalized Four Pillars reading.",
    type: "website",
    siteName: "K-Destiny",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Destiny | Discover Your Korean Destiny",
    description: "Ancient Korean wisdom meets modern insight.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
