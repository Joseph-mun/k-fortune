import localFont from "next/font/local";
import { Gaegu, Noto_Serif_KR } from "next/font/google";

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

// ── 묵(Ink) Layer: Serif heading for traditional aesthetic ──
export const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-serif-kr",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// ── 놀이(Play) Layer: Handwriting accent ──
export const gaegu = Gaegu({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-gaegu",
  display: "swap",
  fallback: ["cursive"],
});
