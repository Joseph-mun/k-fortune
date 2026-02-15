import localFont from "next/font/local";
import {
  Nanum_Myeongjo,
  Cormorant_Garamond,
  Outfit,
  Gaegu,
} from "next/font/google";

// ── Body + Korean: Pretendard Variable (self-hosted) ──
export const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "300 900",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "Roboto",
    "Helvetica Neue",
    "Segoe UI",
    "Apple SD Gothic Neo",
    "Noto Sans KR",
    "Malgun Gothic",
    "sans-serif",
  ],
});

// ── 묵(Ink) Layer: Korean Serif for headings ──
export const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

// ── 묵(Ink) Layer: English Serif for headings ──
export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// ── 놀이(Play) Layer: Rounded geometric for headings ──
export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

// ── 놀이(Play) Layer: Handwriting accent ──
export const gaegu = Gaegu({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-gaegu",
  display: "swap",
  fallback: ["cursive"],
});
