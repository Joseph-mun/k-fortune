"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Download, Share2, Trash2 } from "lucide-react";

import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DestinyCard } from "@/components/fortune/DestinyCard";
import { reconstructReading } from "@/lib/saju";

interface CardData {
  id: string;
  user_id: string;
  style: "classic" | "tarot" | "neon" | "ink" | "photo" | "seasonal";
  reading_data: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
  view_count: number;
}

export default function CardViewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations("cards.view");
  const tElements = useTranslations("elements");

  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await fetch(`/api/cards/${id}`);
        if (!res.ok) throw new Error("Card not found");
        const data = await res.json();
        setCard(data.card);
      } catch {
        setError("Card not found");
      } finally {
        setLoading(false);
      }
    }
    fetchCard();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete"))) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/gallery");
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    const cardEl = document.getElementById(`destiny-card-${id}`);
    if (!cardEl) return;
    try {
      const { toPng } = await import("html-to-image");
      const innerCard = cardEl.firstElementChild as HTMLElement | null;
      const saved = {
        outerPerspective: cardEl.style.perspective,
        innerTransform: innerCard?.style.transform,
        innerTransformStyle: innerCard?.style.transformStyle,
      };
      cardEl.style.perspective = "none";
      if (innerCard) {
        innerCard.style.transform = "none";
        innerCard.style.transformStyle = "flat";
      }

      const dataUrl = await toPng(cardEl, { pixelRatio: 2, cacheBust: true });

      cardEl.style.perspective = saved.outerPerspective;
      if (innerCard) {
        innerCard.style.transform = saved.innerTransform ?? "";
        innerCard.style.transformStyle = saved.innerTransformStyle ?? "";
      }

      const link = document.createElement("a");
      link.download = `saju-card-${id}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/cards/${id}`;
    if (navigator.share) {
      await navigator.share({ title: "SAJU Card", url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-text-secondary">Loading...</p>
      </main>
    );
  }

  if (error || !card) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-text-secondary">{error || "Card not found"}</p>
        <Button variant="secondary" onClick={() => router.back()} className="mt-4">
          ← {t("back")}
        </Button>
      </main>
    );
  }

  const reading = reconstructReading(card.reading_data);
  const createdDate = new Date(card.created_at).toLocaleDateString();

  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <NavBar />

      <div className="w-full max-w-lg flex flex-col items-center gap-6 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="self-start flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </button>

        {/* Card */}
        <div id={`destiny-card-${id}`}>
          <DestinyCard reading={reading} style={card.style} />
        </div>

        {/* Info */}
        <Card className="w-full p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">{t("dayMaster")}</span>
            <span className="text-text-primary">
              {reading.dayMaster.metaphorInfo.displayName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">{t("element")}</span>
            <span className="text-text-primary">
              {reading.dayMaster.yinYang === "yang" ? "Yang" : "Yin"}{" "}
              {tElements(reading.dayMaster.element)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">{t("createdAt", { date: createdDate })}</span>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            {t("download")}
          </Button>
          <Button variant="secondary" onClick={handleShare} className="flex-1 flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            {t("share")}
          </Button>
          <Button
            variant="secondary"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
