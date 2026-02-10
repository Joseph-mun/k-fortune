import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K-Destiny | Discover Your Korean Destiny",
  description:
    "Unlock the ancient secrets of Korean Four Pillars of Destiny (Saju). Discover your cosmic blueprint with K-Destiny.",
  openGraph: {
    title: "K-Destiny | Discover Your Korean Destiny",
    description:
      "Ancient Korean wisdom meets modern insight. Get your personalized Four Pillars reading.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
