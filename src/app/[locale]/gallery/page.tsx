"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { DestinyCard } from "@/components/fortune/DestinyCard";
import { reconstructReading } from "@/lib/saju";

interface CardItem {
  id: string;
  style: "classic" | "tarot" | "neon" | "ink" | "photo" | "seasonal";
  reading_data: Record<string, unknown>;
  created_at: string;
  view_count: number;
}

type SortType = "latest" | "popular";

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const router = useRouter();

  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState<SortType>("latest");
  const [offset, setOffset] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null);

  const LIMIT = 12;

  const fetchCards = useCallback(
    async (newOffset: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const res = await fetch(
          `/api/cards?public=true&limit=${LIMIT}&offset=${newOffset}&sort=${sort}`
        );
        if (!res.ok) return;
        const data = await res.json();

        setCards((prev) => (append ? [...prev, ...data.cards] : data.cards));
        setHasMore(data.pagination.hasMore);
        setOffset(newOffset + LIMIT);
      } catch {
        // ignore
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sort]
  );

  // Initial load & sort change
  useEffect(() => {
    setOffset(0);
    setCards([]);
    fetchCards(0, false);
  }, [fetchCards]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchCards(offset, true);
        }
      },
      { threshold: 0.1 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, loadingMore, offset, fetchCards]);

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <NavBar />

      <div className="w-full max-w-4xl flex flex-col gap-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary">
              {t("title")}
            </h1>
            <p className="text-sm text-text-secondary mt-1">{t("subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSort("latest")}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                sort === "latest"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500"
                  : "bg-surface text-text-muted border border-border hover:border-purple-500/50"
              }`}
            >
              {t("sortLatest")}
            </button>
            <button
              onClick={() => setSort("popular")}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                sort === "popular"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500"
                  : "bg-surface text-text-muted border border-border hover:border-purple-500/50"
              }`}
            >
              {t("sortPopular")}
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12 text-text-muted">Loading...</div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">{t("empty")}</p>
            <Button onClick={() => router.push("/cards/create")}>
              {t("createCard")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
              let reading;
              try {
                reading = reconstructReading(card.reading_data);
              } catch {
                return null;
              }
              return (
                <button
                  key={card.id}
                  onClick={() => router.push(`/cards/${card.id}`)}
                  className="hover:scale-[1.02] transition-transform"
                >
                  <div className="transform scale-50 origin-top-left w-[180px]">
                    <DestinyCard reading={reading} style={card.style} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={observerRef} className="text-center py-4 text-text-muted text-sm">
            {loadingMore && t("loadMore")}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
