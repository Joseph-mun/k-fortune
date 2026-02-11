"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

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
  const offsetRef = useRef(0);
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
        const nextOffset = newOffset + LIMIT;
        setOffset(nextOffset);
        offsetRef.current = nextOffset;
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
    offsetRef.current = 0;
    setCards([]);
    fetchCards(0, false);
  }, [fetchCards]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchCards(offsetRef.current, true);
        }
      },
      { threshold: 0.1 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, loadingMore, fetchCards]);

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full px-4">
        <NavBar />
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-8 py-12 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)] text-text-primary">
              {t("title")}
            </h1>
            <p className="text-sm text-text-muted mt-1">{t("subtitle")}</p>
          </div>
          <div className="flex gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.06]" role="tablist" aria-label="Sort order">
            <button
              role="tab"
              aria-selected={sort === "latest"}
              onClick={() => setSort("latest")}
              className={`relative px-3 py-1.5 text-xs rounded-md transition-all ${
                sort === "latest"
                  ? "bg-white/[0.08] text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {t("sortLatest")}
              {sort === "latest" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-purple-500" />}
            </button>
            <button
              role="tab"
              aria-selected={sort === "popular"}
              onClick={() => setSort("popular")}
              className={`relative px-3 py-1.5 text-xs rounded-md transition-all ${
                sort === "popular"
                  ? "bg-white/[0.08] text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {t("sortPopular")}
              {sort === "popular" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-purple-500" />}
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-skeleton">
                <div className="w-full aspect-[2/3] rounded-lg bg-bg-card border border-white/[0.06]" />
              </div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted mb-4">{t("empty")}</p>
            <Button onClick={() => router.push("/cards/create")} variant="secondary">
              {t("createCard")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {cards.map((card, index) => {
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
                  aria-label={`${reading.dayMaster.metaphorInfo.displayName} card`}
                  className="group hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/[0.1] transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
                >
                  <div className="transform scale-[0.65] origin-top-left pointer-events-none" style={{ width: "208px", height: "312px" }}>
                    <DestinyCard reading={reading} style={card.style} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={observerRef} className="flex items-center justify-center py-4">
            {loadingMore && (
              <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            )}
          </div>
        )}
      </div>

      <div className="w-full px-4 flex justify-center">
        <Footer />
      </div>
    </main>
  );
}
