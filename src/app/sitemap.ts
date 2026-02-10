import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://k-fortune.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["ko", "en", "es"];
  const routes = [
    "",
    "/pricing",
    "/compatibility",
    "/gallery",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
