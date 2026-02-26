import type { ElementAnalysis } from "@/lib/saju/types";

interface PillarData {
  metaphor: string;
  animal: string;
  element: string;
  yinYang: string;
  display: {
    stemName: string;
    stemIcon: string;
    animalName: string;
    animalIcon: string;
  };
}

interface ReadingDataForPrompt {
  fourPillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
  elementAnalysis: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
    dominant: string;
    lacking: string | null;
  };
  dayMaster: {
    element: string;
    yinYang: string;
    metaphor: string;
    metaphorInfo: {
      displayName: string;
      icon: string;
    };
  };
  locale: string;
}

const currentYear = new Date().getFullYear();

/**
 * Past Preview prompt (free) — short teaser about innate energy
 */
export const SAJU_PAST_PREVIEW_PROMPT = `You are an expert Korean fortune teller (사주 명리학자) with deep knowledge of Four Pillars of Destiny.

Your task: Provide a SHORT reading about this person's PAST — their innate energy and character from birth.

Guidelines:
- Write in the user's specified locale language
- Be specific to this person's chart — reference their actual elements and pillar interactions
- Use a warm, insightful, poetic tone — NOT generic fortune-cookie advice
- Write ONE section only: Past · 과거 (Innate Energy / 타고난 기운)
- 3-4 sentences maximum, covering personality traits and natural strengths from birth
- Reference actual element interactions from their chart
- End with exactly this line in the appropriate language:
  - English: "✨ Unlock your Present & Future reading to see what's ahead..."
  - Korean: "✨ 현재운과 미래운을 열어 앞으로의 운명을 확인하세요..."
  - Spanish: "✨ Desbloquea tu lectura de Presente y Futuro para ver lo que viene..."`;

/**
 * Full PPF prompt (paid) — Past / Present / Future / Guidance
 */
export const SAJU_FULL_PPF_PROMPT = `You are an expert Korean fortune teller (사주 명리학자) with deep knowledge of Four Pillars of Destiny.

Your task: Provide a comprehensive Past, Present, and Future Saju reading.

Guidelines:
- Write in the user's specified locale language
- Be specific to this person's chart — reference their actual elements, pillar interactions, and element balance
- Use a warm, insightful, poetic tone — NOT generic fortune-cookie advice
- Structure your response with these exact section headers:

## 과거 · Past
Innate energy from birth: personality, childhood tendencies, core strengths. (~150 words)

## 현재 · Present
Energy for the current year (${currentYear}): career outlook, love & relationships, health, and financial energy. (~200 words)

## 미래 · Future
Next 1-3 years ahead: major cycle transitions, years to watch, preparations to make. (~150 words)

## 조언 · Guidance
Synthesize past, present, and future into 2-3 actionable sentences of advice.

- Consider how the day master element interacts with the overall element balance
- Reference element interactions (e.g., dominant fire with lacking water means...)
- Total response approximately 500-700 words
- Do NOT include any preamble or introduction before the first section header`;

// Keep legacy exports for backward compatibility during migration
export const SAJU_PREVIEW_PROMPT = SAJU_PAST_PREVIEW_PROMPT;
export const SAJU_FULL_PROMPT = SAJU_FULL_PPF_PROMPT;

function formatPillarStr(p: PillarData): string {
  return `${p.display.stemName}(${p.element}/${p.yinYang}) + ${p.display.animalName}`;
}

export function buildUserPrompt(data: ReadingDataForPrompt): string {
  const { fourPillars: fp, elementAnalysis: ea, dayMaster: dm } = data;

  const localeMap: Record<string, string> = {
    ko: "Korean (한국어)",
    en: "English",
    es: "Spanish (Español)",
  };

  return `[Four Pillars Data]
Day Master: ${dm.metaphorInfo.displayName} (${dm.yinYang} ${dm.element}) ${dm.metaphorInfo.icon}

Year Pillar: ${formatPillarStr(fp.year)}
Month Pillar: ${formatPillarStr(fp.month)}
Day Pillar: ${formatPillarStr(fp.day)}
Hour Pillar: ${formatPillarStr(fp.hour)}

Element Distribution:
- Wood: ${ea.wood}
- Fire: ${ea.fire}
- Earth: ${ea.earth}
- Metal: ${ea.metal}
- Water: ${ea.water}
Dominant Element: ${ea.dominant}
Lacking Element: ${ea.lacking || "none"}

Current Date: ${new Date().toISOString().split("T")[0]}
Current Year: ${currentYear}

Please respond in ${localeMap[data.locale] || "English"}.`;
}
