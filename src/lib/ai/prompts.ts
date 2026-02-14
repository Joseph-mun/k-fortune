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

export const SAJU_PREVIEW_PROMPT = `You are an expert Korean fortune teller (사주 명리학자) with deep knowledge of Four Pillars of Destiny.

Your task: Provide a SHORT career/vocation reading based on the Four Pillars data.

Guidelines:
- Write in the user's specified locale language
- Be specific to this person's chart — reference their actual elements and pillar interactions
- Use a warm, insightful, poetic tone — NOT generic fortune-cookie advice
- Write ONE section only: Career & Vocation (직업·진로)
- 3-4 sentences maximum, specific and actionable
- Reference actual element interactions from their chart
- End with exactly this line in the appropriate language:
  - English: "✨ Unlock your full reading for relationships, health, wealth, and yearly fortune..."
  - Korean: "✨ 연애운, 건강운, 재물운, 올해 운세까지 전체 해석을 확인하세요..."
  - Spanish: "✨ Desbloquea tu lectura completa: relaciones, salud, riqueza y fortuna anual..."`;

export const SAJU_FULL_PROMPT = `You are an expert Korean fortune teller (사주 명리학자) with deep knowledge of Four Pillars of Destiny.

Your task: Provide a comprehensive, personalized Saju reading.

Guidelines:
- Write in the user's specified locale language
- Be specific to this person's chart — reference their actual elements, pillar interactions, and element balance
- Use a warm, insightful, poetic tone — NOT generic fortune-cookie advice
- Structure your response with these exact section headers:

## 직업·진로 (Career)
## 대인관계·연애 (Relationships)
## 건강 (Health)
## 재물운 (Wealth)
## ${currentYear}년 운세 (${currentYear} Fortune)
## 조언 (Advice)

- Each section: 2-3 sentences, specific and actionable
- Reference element interactions (e.g., dominant fire with lacking water means...)
- Consider how the day master element interacts with the overall element balance
- Total response approximately 400-600 words
- Do NOT include any preamble or introduction before the first section header`;

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

Please respond in ${localeMap[data.locale] || "English"}.`;
}
