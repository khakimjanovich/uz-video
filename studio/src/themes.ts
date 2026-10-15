import { loadFont } from "@remotion/google-fonts/Inter";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export type ThemeName = "dark" | "light";

export interface ReelProps extends Record<string, unknown> {
  theme?: ThemeName;
}

// Colours used by Tailwind classes live in index.css; these are only the
// values the background needs inline (gradients can't use Tailwind classes).
export interface ThemeTokens {
  fontFamily: string;
  gridColor: string;
  gridOpacity: number;
  glowColor1: string;
  glowColor2: string;
}

export const LIGHT_THEME: ThemeTokens = {
  fontFamily,
  gridColor: "#CBD5E1",
  gridOpacity: 0.45,
  glowColor1: "rgba(0,191,165,0.14)",
  glowColor2: "rgba(0,119,255,0.08)",
};

export const DARK_THEME: ThemeTokens = {
  fontFamily,
  gridColor: "rgba(56, 189, 248, 0.35)",
  gridOpacity: 0.2,
  glowColor1: "rgba(56, 189, 248, 0.16)",
  glowColor2: "rgba(99, 102, 241, 0.12)",
};

export const getThemeTokens = (theme: ThemeName = "dark"): ThemeTokens =>
  theme === "light" ? LIGHT_THEME : DARK_THEME;
