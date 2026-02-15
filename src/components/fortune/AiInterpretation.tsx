"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, RefreshCw } from "lucide-react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/Button";

interface AiInterpretationProps {
  readingId: string;
  readingData: {
    fourPillars: Record<string, unknown>;
    elementAnalysis: Record<string, unknown>;
    dayMaster: Record<string, unknown>;
  };
  mode: "preview" | "full";
  locale: string;
}

export function AiInterpretation({
  readingId,
  readingData,
  mode,
  locale,
}: AiInterpretationProps) {
  const t = useTranslations("reading");
  const [cachedText, setCachedText] = useState<string | null>(null);
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasRequested, setHasRequested] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const streamAi = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCompletion("");

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/fortune/ai-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, readingId, ...readingData, locale }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`AI request failed: ${res.status}`);
      }

      // Check if the response is cached JSON
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        if (json.cached && json.text) {
          setCachedText(json.text);
          setIsLoading(false);
          return;
        }
      }

      // Stream text response
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setCompletion(fullText);
      }

      setCachedText(fullText);
      track(mode === "preview" ? "ai_preview_viewed" : "ai_full_generated", { readingId });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [mode, readingId, readingData, locale]);

  // Check for cached response on mount
  useEffect(() => {
    const cached = sessionStorage.getItem(`ai-${mode}-${readingId}`);
    if (cached) {
      setCachedText(cached);
    }
  }, [mode, readingId]);

  // Save to sessionStorage when complete
  useEffect(() => {
    if (cachedText) {
      sessionStorage.setItem(`ai-${mode}-${readingId}`, cachedText);
    }
  }, [cachedText, mode, readingId]);

  const handleGenerate = useCallback(() => {
    setHasRequested(true);
    streamAi();
  }, [streamAi]);

  const handleRegenerate = useCallback(() => {
    setCachedText(null);
    sessionStorage.removeItem(`ai-${mode}-${readingId}`);
    setHasRequested(true);
    streamAi();
  }, [streamAi, mode, readingId]);

  // Auto-generate preview on mount
  useEffect(() => {
    if (mode === "preview" && !cachedText && !hasRequested) {
      handleGenerate();
    }
  }, [mode, cachedText, hasRequested, handleGenerate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Display cached text
  if (cachedText && !isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="prose prose-invert prose-sm max-w-none">
          <FormattedMarkdown text={cachedText} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-text-muted">{t("aiGenerated")}</p>
          <button
            type="button"
            onClick={handleRegenerate}
            className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            {t("aiRegenerate")}
          </button>
        </div>
      </div>
    );
  }

  // Streaming in progress
  if (isLoading || (hasRequested && completion)) {
    return (
      <div className="flex flex-col gap-3">
        <div className="prose prose-invert prose-sm max-w-none">
          <FormattedMarkdown text={completion} />
          <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5" />
        </div>
        <p className="text-[10px] text-text-muted animate-pulse">{t("aiGenerating")}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <p className="text-sm text-text-muted">{t("aiError")}</p>
        <Button variant="secondary" size="sm" onClick={handleGenerate} className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          {t("aiRetry")}
        </Button>
      </div>
    );
  }

  // Initial CTA (for full mode — preview auto-generates)
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center animate-glow-breathe"
        style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
      >
        <Sparkles className="w-7 h-7 text-purple-400" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-1">{t("aiSection")}</h3>
        <p className="text-sm text-text-secondary max-w-xs">{t("aiDescription")}</p>
      </div>
      <Button
        variant="primary"
        className="gap-2 btn-cta animate-cta-pulse"
        onClick={handleGenerate}
      >
        <Sparkles className="w-4 h-4" />
        {t("aiGenerate")}
      </Button>
    </div>
  );
}

function FormattedMarkdown({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h3
              key={i}
              className="text-sm font-semibold text-text-primary mt-4 mb-2 first:mt-0"
            >
              {line.replace("## ", "")}
            </h3>
          );
        }
        if (line.trim() === "") {
          return <br key={i} />;
        }
        return (
          <p key={i} className="text-sm text-text-secondary leading-relaxed mb-2">
            {line}
          </p>
        );
      })}
    </>
  );
}
