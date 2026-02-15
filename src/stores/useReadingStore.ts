import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

export interface BirthInput {
  birthDate: string;
  birthTime: string | null;
  timezone: string;
  gender: string;
  locale: string;
}

interface ReadingStore {
  readings: Record<string, ReadingData>;
  birthInputs: Record<string, BirthInput>;
  setReading: (id: string, data: ReadingData) => void;
  getReading: (id: string) => ReadingData | undefined;
  setBirthInput: (id: string, input: BirthInput) => void;
  getBirthInput: (id: string) => BirthInput | undefined;
}

export const useReadingStore = create<ReadingStore>()(
  persist(
    (set, get) => ({
      readings: {},
      birthInputs: {},
      setReading: (id, data) =>
        set((state) => ({
          readings: { ...state.readings, [id]: data },
        })),
      getReading: (id) => get().readings[id],
      setBirthInput: (id, input) =>
        set((state) => ({
          birthInputs: { ...state.birthInputs, [id]: input },
        })),
      getBirthInput: (id) => get().birthInputs[id],
    }),
    {
      name: "saju-readings",
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, version) => {
        // v0 → v1: sessionStorage data already copied by one-time migration below
        return persisted as ReadingStore;
      },
      version: 1,
    }
  )
);

// One-time migration: copy sessionStorage → localStorage if present
if (typeof window !== "undefined") {
  try {
    const session = sessionStorage.getItem("saju-readings");
    if (session) {
      const existing = localStorage.getItem("saju-readings");
      if (!existing) {
        localStorage.setItem("saju-readings", session);
      }
      sessionStorage.removeItem("saju-readings");
    }
  } catch {
    // ignore storage access errors
  }
}
