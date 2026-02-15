import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { TeaserClient } from "./TeaserClient";

export const metadata: Metadata = {
  title: "SAJU — Your Destiny is Written. Be the First to Read It.",
  description:
    "Korea's ancient Four Pillars of Destiny meets modern insight. Enter your birth year to discover your zodiac animal and element. Sign up to be notified when full readings launch.",
};

export default async function TeaserPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TeaserClient />;
}
