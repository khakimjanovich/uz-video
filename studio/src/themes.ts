export type ThemeName = "light" | "dark" | "xray";

export interface ReelProps {
  theme?: ThemeName;
}

export interface ThemeTokens {
  background: string;
  gridColor: string;
  gridOpacity: number;
  textColor: string;
  subtextColor: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  middleCardBg: string;
  middleCardBorder: string;
  middleCardShadow: string;
  footerColor: string;
  subtitleBg: string;
  subtitleBorder: string;
  subtitleTextColor: string;
  subtitleShadow: string;
  showSubtitleHeader: boolean;
  glowColor1: string;
  glowColor2: string;
}

export const LIGHT_THEME: ThemeTokens = {
  background: "#F8F9FA",
  gridColor: "#CBD5E1",
  gridOpacity: 0.45,
  textColor: "#0F172A",
  subtextColor: "#64748B",
  cardBg: "#FFFFFF",
  cardBorder: "1.5px solid #E2E8F0",
  cardShadow: "0 20px 45px -12px rgba(15, 23, 42, 0.08), 0 2px 5px rgba(0,0,0,0.04)",
  badgeBg: "#FFFFFF",
  badgeBorder: "1px solid #E2E8F0",
  badgeText: "#475569",
  middleCardBg: "#FFFFFF",
  middleCardBorder: "1.5px solid #E2E8F0",
  middleCardShadow: "0 20px 45px -10px rgba(15,23,42,0.06)",
  footerColor: "#94A3B8",
  subtitleBg: "#FFFFFF",
  subtitleBorder: "1.5px solid #E2E8F0",
  subtitleTextColor: "#0F172A",
  subtitleShadow: "0 25px 45px -10px rgba(15, 23, 42, 0.1), 0 2px 6px rgba(0,0,0,0.04)",
  showSubtitleHeader: true,
  glowColor1: "rgba(0,191,165,0.14)",
  glowColor2: "rgba(0,119,255,0.08)",
};

export const DARK_THEME: ThemeTokens = {
  background: "#090D16",
  gridColor: "rgba(56, 189, 248, 0.35)",
  gridOpacity: 0.22,
  textColor: "#F8FAFC",
  subtextColor: "#94A3B8",
  cardBg: "rgba(15, 23, 42, 0.85)",
  cardBorder: "1.5px solid rgba(56, 189, 248, 0.22)",
  cardShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.55), 0 0 24px rgba(56, 189, 248, 0.06)",
  badgeBg: "rgba(15, 23, 42, 0.9)",
  badgeBorder: "1px solid rgba(56, 189, 248, 0.35)",
  badgeText: "#38BDF8",
  middleCardBg: "rgba(15, 23, 42, 0.92)",
  middleCardBorder: "1.5px solid rgba(56, 189, 248, 0.3)",
  middleCardShadow: "0 25px 50px -10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.08)",
  footerColor: "#64748B",
  subtitleBg: "rgba(15, 23, 42, 0.92)",
  subtitleBorder: "1.5px solid rgba(56, 189, 248, 0.35)",
  subtitleTextColor: "#F8FAFC",
  subtitleShadow: "0 25px 45px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.1)",
  showSubtitleHeader: false,
  glowColor1: "rgba(56, 189, 248, 0.18)",
  glowColor2: "rgba(99, 102, 241, 0.12)",
};

export const getThemeTokens = (theme: ThemeName = "xray", isBackendPhase: boolean = false): ThemeTokens => {
  if (theme === "dark") {
    return DARK_THEME;
  }
  if (theme === "light") {
    return LIGHT_THEME;
  }
  // "xray" mode: Light on user hook (Phase 1), switches to high-tech dark blueprint on backend reveal (Phases 2 & 3)
  if (isBackendPhase) {
    return {
      ...DARK_THEME,
      showSubtitleHeader: false,
    };
  }
  return {
    ...LIGHT_THEME,
    showSubtitleHeader: false, // X-Ray removes the debug header
  };
};
