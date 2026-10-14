import React from "react";
import { ThemeTokens } from "../themes";
import { useThemeTokens } from "../context";

export type CardVariant = "default" | "middle" | "danger" | "accent" | "success";

export interface UiCardProps {
  tokens?: ThemeTokens;
  variant?: CardVariant;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const UiCard: React.FC<UiCardProps> = ({
  tokens: propTokens,
  variant = "default",
  className = "",
  style = {},
  children,
}) => {
  const contextTokens = useThemeTokens();
  const tokens = propTokens || contextTokens;

  let bg = tokens.cardBg;
  let border = tokens.cardBorder;
  let shadow = tokens.cardShadow;

  if (variant === "middle") {
    bg = tokens.middleCardBg;
    border = tokens.middleCardBorder;
    shadow = tokens.middleCardShadow;
  } else if (variant === "danger") {
    bg = tokens.middleCardBg;
    border = "2px solid #EF4444";
    shadow = tokens.isDark
      ? "0 25px 50px -12px rgba(239,68,68,0.25), 0 0 25px rgba(239,68,68,0.1)"
      : "0 25px 50px -12px rgba(239,68,68,0.18)";
  } else if (variant === "accent") {
    bg = tokens.middleCardBg;
    border = "2px solid #0284C7";
    shadow = tokens.isDark
      ? "0 25px 50px -12px rgba(14,165,233,0.3), 0 0 30px rgba(14,165,233,0.12)"
      : "0 25px 50px -12px rgba(14,165,233,0.18)";
  }

  return (
    <div
      className={`rounded-[36px] ${className}`}
      style={{
        backgroundColor: bg,
        border,
        boxShadow: shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
