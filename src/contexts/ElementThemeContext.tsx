"use client";

import { createContext, useContext } from "react";
import type { Element } from "@/lib/saju/types";

interface ElementTheme {
  element: Element;
  // Original tokens (preserved for backwards compatibility)
  primary: string;
  primaryLight: string;
  glow: string;
  bgTint: string;
  // 묵(Ink) layer tokens
  inkAccent: string;
  inkAccentLight: string;
  inkBg: string;
  // 놀이(Play) layer tokens
  playAccent: string;
  playBg: string;
  playTag: string;
}

const ELEMENT_THEMES: Record<Element, ElementTheme> = {
  wood: {
    element: "wood",
    primary: "#4A7C59",
    primaryLight: "#6B9E76",
    glow: "rgba(74,124,89,0.12)",
    bgTint: "rgba(74,124,89,0.04)",
    inkAccent: "#4A7C59",
    inkAccentLight: "#6B9E76",
    inkBg: "rgba(74,124,89,0.04)",
    playAccent: "#34D399",
    playBg: "#ECFDF5",
    playTag: "#D1FAE5",
  },
  fire: {
    element: "fire",
    primary: "#C5372E",
    primaryLight: "#D95A52",
    glow: "rgba(197,55,46,0.12)",
    bgTint: "rgba(197,55,46,0.04)",
    inkAccent: "#C5372E",
    inkAccentLight: "#D95A52",
    inkBg: "rgba(197,55,46,0.04)",
    playAccent: "#FF7A7A",
    playBg: "#FFF1F2",
    playTag: "#FFE4E6",
  },
  earth: {
    element: "earth",
    primary: "#B8860B",
    primaryLight: "#D4A32C",
    glow: "rgba(184,134,11,0.12)",
    bgTint: "rgba(184,134,11,0.04)",
    inkAccent: "#B8860B",
    inkAccentLight: "#D4A32C",
    inkBg: "rgba(184,134,11,0.04)",
    playAccent: "#FFB088",
    playBg: "#FFFBEB",
    playTag: "#FEF3C7",
  },
  metal: {
    element: "metal",
    primary: "#8B8589",
    primaryLight: "#A8A3A6",
    glow: "rgba(139,133,137,0.12)",
    bgTint: "rgba(139,133,137,0.04)",
    inkAccent: "#8B8589",
    inkAccentLight: "#A8A3A6",
    inkBg: "rgba(139,133,137,0.04)",
    playAccent: "#C4B5FD",
    playBg: "#F5F3FF",
    playTag: "#EDE9FE",
  },
  water: {
    element: "water",
    primary: "#2B4162",
    primaryLight: "#4A6A8C",
    glow: "rgba(43,65,98,0.12)",
    bgTint: "rgba(43,65,98,0.04)",
    inkAccent: "#2B4162",
    inkAccentLight: "#4A6A8C",
    inkBg: "rgba(43,65,98,0.04)",
    playAccent: "#60A5FA",
    playBg: "#EFF6FF",
    playTag: "#DBEAFE",
  },
};

const ElementThemeContext = createContext<ElementTheme>(ELEMENT_THEMES.water);

export function ElementThemeProvider({
  element,
  children,
}: {
  element: Element;
  children: React.ReactNode;
}) {
  const theme = ELEMENT_THEMES[element];

  const style = {
    // Original tokens (preserved)
    "--accent-primary": theme.primary,
    "--accent-light": theme.primaryLight,
    "--accent-glow": theme.glow,
    "--accent-bg-tint": theme.bgTint,
    // 묵(Ink) layer tokens
    "--ink-element-accent": theme.inkAccent,
    "--ink-element-accent-light": theme.inkAccentLight,
    "--ink-element-bg": theme.inkBg,
    // 놀이(Play) layer tokens
    "--play-element-accent": theme.playAccent,
    "--play-element-bg": theme.playBg,
    "--play-element-tag": theme.playTag,
  } as React.CSSProperties;

  return (
    <ElementThemeContext.Provider value={theme}>
      <div style={style}>{children}</div>
    </ElementThemeContext.Provider>
  );
}

export function useElementTheme() {
  return useContext(ElementThemeContext);
}
