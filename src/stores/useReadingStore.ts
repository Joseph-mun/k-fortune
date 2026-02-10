import { create } from "zustand";

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

export interface ReadingData {
  id: string;
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
    personality: string;
    strengths: string[];
    weaknesses: string[];
  };
  luckyInfo: {
    color: string;
    number: number;
    direction: string;
  };
}

interface ReadingStore {
  readings: Record<string, ReadingData>;
  setReading: (id: string, data: ReadingData) => void;
  getReading: (id: string) => ReadingData | undefined;
}

export const useReadingStore = create<ReadingStore>((set, get) => ({
  readings: {},
  setReading: (id, data) =>
    set((state) => ({
      readings: { ...state.readings, [id]: data },
    })),
  getReading: (id) => get().readings[id],
}));
