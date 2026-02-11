import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";

// Body + Korean: Pretendard Variable (self-hosted)
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

// English heading: Instrument Serif (Google Fonts auto-optimized)
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading-serif",
  display: "swap",
});
