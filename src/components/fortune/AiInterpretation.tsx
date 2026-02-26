"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, RefreshCw, Clock, Sun, Telescope, Lightbulb } from "lucide-react";
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

/** Section metadata for PPF rendering */
const SECTION_META: Record<string, { icon: typeof Clock; color: string }> = {
  "과거": { icon: Clock, color: "#8B5CF6" },
  "Past": { icon: Clock, color: "#8B5CF6" },
  "현재": { icon: Sun, color: "#F59E0B" },
  "Present": { icon: Sun, color: "#F59E0B" },
  "미래": { icon: Telescope, color: "#6366F1" },
  "Future": { icon: Telescope, color: "#6366F1" },
  "조언": { icon: Lightbulb, color: "#22C55E" },
  "Guidance": { icon: Lightbulb, color: "#22C55E" },
};

function getSectionMeta(heading: string) {
  for (const [key, meta] of Object.entries(SECTION_META)) {
    if (heading.includes(key)) return meta;
  }
  return null;
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

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        if (json.cached && json.text) {
          setCachedText(json.text);
          setIsLoading(false);
          return;
        }
      }

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

  useEffect(() => {
    const cached = sessionStorage.getItem(`ai-${mode}-${readingId}`);
    if (cached) {
      setCachedText(cached);
    }
  }, [mode, readingId]);

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
          <FormattedPPF text={cachedText} mode={mode} />
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
          <FormattedPPF text={completion} mode={mode} />
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

/** Render PPF sections with icon cards for full mode, simple markdown for preview */
function FormattedPPF({ text, mode }: { text: string; mode: "preview" | "full" }) {
  if (!text) return null;

  if (mode === "preview") {
    return <SimpleMarkdown text={text} />;
  }

  // Parse into sections by ## headers
  const sections = parseSections(text);

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, i) => {
        const meta = getSectionMeta(section.heading);
        if (!meta) {
          // Render as plain text if no matching section
          return <SimpleMarkdown key={i} text={section.body} />;
        }

        const Icon = meta.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-lg border border-white/[0.06] bg-bg-card"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
              >
                <Icon className="w-4 h-4" style={{ color: meta.color }} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">
                {section.heading}
              </h3>
            </div>
            <SimpleMarkdown text={section.body} />
          </div>
        );
      })}
    </div>
  );
}

function parseSections(text: string): { heading: string; body: string }[] {
  const lines = text.split("\n");
  const sections: { heading: string; body: string }[] = [];
  let currentHeading = "";
  let currentBody: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentHeading || currentBody.length > 0) {
        sections.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
      }
      currentHeading = line.replace("## ", "");
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }

  if (currentHeading || currentBody.length > 0) {
    sections.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
  }

  return sections;
}

function SimpleMarkdown({ text }: { text: string }) {
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
