"use client";

import { createContext, useContext } from "react";
import type { Element } from "@/lib/saju/types";

interface ElementTheme {
  element: Element;
  primary: string;
  primaryLight: string;
  glow: string;
  bgTint: string;
}

const ELEMENT_THEMES: Record<Element, ElementTheme> = {
  wood:  { element: "wood",  primary: "#22C55E", primaryLight: "#4ADE80", glow: "rgba(34,197,94,0.15)",  bgTint: "rgba(34,197,94,0.04)" },
  fire:  { element: "fire",  primary: "#F43F5E", primaryLight: "#FB7185", glow: "rgba(244,63,94,0.15)",  bgTint: "rgba(244,63,94,0.04)" },
  earth: { element: "earth", primary: "#F59E0B", primaryLight: "#FBBF24", glow: "rgba(245,158,11,0.15)", bgTint: "rgba(245,158,11,0.04)" },
  metal: { element: "metal", primary: "#A1A1AA", primaryLight: "#D4D4D8", glow: "rgba(161,161,170,0.15)", bgTint: "rgba(161,161,170,0.04)" },
  water: { element: "water", primary: "#6366F1", primaryLight: "#818CF8", glow: "rgba(99,102,241,0.15)",  bgTint: "rgba(99,102,241,0.04)" },
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
    "--accent-primary": theme.primary,
    "--accent-light": theme.primaryLight,
    "--accent-glow": theme.glow,
    "--accent-bg-tint": theme.bgTint,
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
