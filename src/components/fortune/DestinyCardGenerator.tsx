"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Share2, Loader2 } from "lucide-react";

import { DestinyCard } from "@/components/fortune/DestinyCard";
import { Button } from "@/components/ui/Button";
import type { BasicReading } from "@/lib/saju/types";

interface DestinyCardGeneratorProps {
  reading: BasicReading;
  defaultStyle?: "classic" | "tarot" | "neon" | "ink" | "photo" | "seasonal";
}

const CARD_STYLES = ["classic", "tarot", "neon", "ink", "photo", "seasonal"] as const;

export function DestinyCardGenerator({
  reading,
  defaultStyle = "classic",
}: DestinyCardGeneratorProps) {
  const t = useTranslations("cardGenerator");
  const [selectedStyle, setSelectedStyle] = useState<typeof CARD_STYLES[number]>(defaultStyle);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    const cardElement = cardRef.current?.querySelector("[id^='destiny-card-']") as HTMLElement | null;
    if (!cardElement) return null;

    try {
      const { toPng } = await import("html-to-image");

      // Temporarily disable all 3D CSS for clean capture
      const innerCard = cardElement.firstElementChild as HTMLElement | null;
      const saved = {
        outerPerspective: cardElement.style.perspective,
        innerTransform: innerCard?.style.transform,
        innerTransformStyle: innerCard?.style.transformStyle,
      };
      cardElement.style.perspective = "none";
      if (innerCard) {
        innerCard.style.transform = "none";
        innerCard.style.transformStyle = "flat";
      }

      // Add timeout wrapper
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Generation timeout")), 30000);
      });

      const dataUrl = await Promise.race([
        toPng(cardElement, {
          pixelRatio: 2,
          cacheBust: true,
        }),
        timeoutPromise,
      ]);

      // Restore 3D CSS
      cardElement.style.perspective = saved.outerPerspective;
      if (innerCard) {
        innerCard.style.transform = saved.innerTransform ?? "";
        innerCard.style.transformStyle = saved.innerTransformStyle ?? "";
      }

      const res = await fetch(dataUrl);
      return await res.blob();
    } catch (error) {
      console.error("Failed to generate card image:", error);
      return null;
    }
  }, []);

  const handleDownload = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const blob = await generateImage();
      if (!blob) {
        setError("카드 생성에 실패했습니다. 다시 시도해주세요. / Failed to generate card. Please try again.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `saju-${reading.dayMaster.metaphor}-${reading.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }, [generateImage, reading.dayMaster.metaphor, reading.id]);

  const handleShare = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const blob = await generateImage();

      if (!blob) {
        setError("카드 생성에 실패했습니다. 다시 시도해주세요. / Failed to generate card. Please try again.");
        return;
      }

      // Try Web Share API with file
      if (navigator.share && navigator.canShare) {
        const file = new File(
          [blob],
          `saju-${reading.dayMaster.metaphor}.png`,
          { type: "image/png" }
        );

        const shareData = {
          title: `SAJU - ${reading.dayMaster.metaphorInfo.displayName}`,
          text: t("shareText", { metaphor: reading.dayMaster.metaphorInfo.displayName }),
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Fallback: Share URL only
      if (navigator.share) {
        await navigator.share({
          title: `SAJU - ${reading.dayMaster.metaphorInfo.displayName}`,
          text: t("shareText", { metaphor: reading.dayMaster.metaphorInfo.displayName }),
          url: `${window.location.origin}/reading/${reading.id}`,
        });
        return;
      }

      // Final fallback: Copy to clipboard
      await navigator.clipboard.writeText(
        `${window.location.origin}/reading/${reading.id}`
      );
      alert(t("linkCopied"));
    } catch (error) {
      // User cancelled share or error occurred
      if ((error as Error).name !== "AbortError") {
        console.error("Share failed:", error);
      }
    } finally {
      setGenerating(false);
    }
  }, [generateImage, reading, t]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Style Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {CARD_STYLES.map((style) => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
              ${
                selectedStyle === style
                  ? "bg-purple-500 text-white"
                  : "bg-bg-card text-text-secondary border border-purple-500/20 hover:border-purple-500/40"
              }
            `}
          >
            {t(`styles.${style}`)}
          </button>
        ))}
      </div>

      {/* Card Preview */}
      <div ref={cardRef}>
        <DestinyCard reading={reading} style={selectedStyle} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-md p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400 text-center mb-3">{error}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setError(null)}
            className="w-full"
          >
            확인 / OK
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownload}
          disabled={generating}
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {t("download")}
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={handleShare}
          disabled={generating}
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          {t("share")}
        </Button>
      </div>
    </div>
  );
}
