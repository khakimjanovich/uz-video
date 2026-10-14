import React from "react";
import { ThemeTokens } from "../themes";
import { useThemeTokens } from "../context";

export type BadgeTone = "neutral" | "danger" | "success" | "accent" | "warning";

export interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  tokens?: ThemeTokens;
  className?: string;
  style?: React.CSSProperties;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  children,
  tone = "neutral",
  tokens: propTokens,
  className = "",
  style = {},
}) => {
  const contextTokens = useThemeTokens();
  const tokens = propTokens || contextTokens;

  let bg = tokens.badgeBg;
  let color = tokens.badgeText;
  let border = tokens.badgeBorder;

  if (tone === "danger") {
    bg = tokens.isDark ? "rgba(239, 68, 68, 0.22)" : "#FEE2E2";
    color = tokens.isDark ? "#F87171" : "#DC2626";
    border = tokens.isDark ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid #FECDD3";
  } else if (tone === "success") {
    bg = tokens.isDark ? "rgba(16, 185, 129, 0.25)" : "#DCFCE7";
    color = tokens.isDark ? "#86EFAC" : "#166534";
    border = tokens.isDark ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid #BBF7D0";
  } else if (tone === "accent") {
    bg = tokens.isDark ? "rgba(56, 189, 248, 0.22)" : "#E0F2FE";
    color = tokens.isDark ? "#7DD3FC" : "#0369A1";
    border = tokens.isDark ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid #BAE6FD";
  } else if (tone === "warning") {
    bg = tokens.isDark ? "rgba(245, 158, 11, 0.2)" : "#FEF3C7";
    color = tokens.isDark ? "#FCD34D" : "#92400E";
    border = tokens.isDark ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid #FDE68A";
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-extrabold tracking-wide ${className}`}
      style={{
        backgroundColor: bg,
        color,
        border,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
