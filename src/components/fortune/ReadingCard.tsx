import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { MetaphorIcon } from "@/components/icons/MetaphorIcon";
import type { BasicReading } from "@/lib/saju/types";

interface ReadingCardProps {
  reading: BasicReading;
  variant?: "compact" | "detailed";
}

/**
 * ReadingCard - Expandable fortune reading result card
 * Section 5.4 design spec - displays reading summary with optional detail
 */
export function ReadingCard({ reading, variant = "compact" }: ReadingCardProps) {
  const t = useTranslations("reading");

  if (variant === "compact") {
    return (
      <Card className="w-full">
        <div className="flex items-center gap-4">
          <MetaphorIcon metaphor={reading.dayMaster.metaphorInfo.id} size={48} />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-primary mb-1">
              {reading.dayMaster.metaphorInfo.displayName}
            </h3>
            <p className="text-sm text-text-secondary">
              {reading.dayMaster.metaphorInfo.nature}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-4">
        {/* Header with icon */}
        <div className="flex items-center gap-4 pb-4 border-b border-[#1A1611]/[0.06]">
          <MetaphorIcon metaphor={reading.dayMaster.metaphorInfo.id} size={56} />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              {reading.dayMaster.metaphorInfo.displayName}
            </h3>
            <p className="text-text-secondary">
              {reading.dayMaster.metaphorInfo.nature}
            </p>
          </div>
        </div>

        {/* Keywords */}
        <div>
          <p className="text-xs text-text-muted mb-2">{t("keywords")}</p>
          <div className="flex flex-wrap gap-2">
            {reading.dayMaster.metaphorInfo.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 text-sm bg-purple-500/10 text-purple-300 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Personality */}
        <div>
          <p className="text-sm text-text-secondary">
            {reading.dayMaster.personality}
          </p>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-muted mb-2">{t("strengths")}</p>
            <ul className="space-y-1">
              {reading.dayMaster.strengths.map((strength, i) => (
                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-2">{t("weaknesses")}</p>
            <ul className="space-y-1">
              {reading.dayMaster.weaknesses.map((weakness, i) => (
                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-text-muted">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
