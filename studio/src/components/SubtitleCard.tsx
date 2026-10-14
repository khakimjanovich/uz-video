import React from "react";
import { ThemeTokens } from "../themes";
import { useThemeTokens } from "../context";

export interface SubtitleCue {
  index?: number;
  id?: number | string;
  startFrame: number;
  endFrame: number;
  text?: string;
  prefix?: string;
  highlight?: string;
  suffix?: string;
  highlightColor?: string;
  highlightBg?: string;
}

export interface SubtitleCardProps {
  currentSubtitle: SubtitleCue;
  isPhase2?: boolean;
  tokens?: ThemeTokens;
  accentColor?: string;
  accentBg?: string;
}

export const SubtitleCard: React.FC<SubtitleCardProps> = ({
  currentSubtitle,
  isPhase2 = false,
  tokens: propTokens,
  accentColor,
  accentBg,
}) => {
  const contextTokens = useThemeTokens();
  const tokens = propTokens || contextTokens;

  const iconBg = isPhase2
    ? tokens.isDark
      ? "rgba(239, 68, 68, 0.2)"
      : "#FEF2F2"
    : tokens.isDark
    ? "rgba(56, 189, 248, 0.15)"
    : "#F0F9FF";

  const iconColor = isPhase2
    ? tokens.isDark
      ? "#F87171"
      : "#DC2626"
    : tokens.isDark
    ? "#38BDF8"
    : "#0284C7";

  const defaultHighlightColor = isPhase2
    ? tokens.isDark
      ? "#F87171"
      : "#DC2626"
    : tokens.isDark
    ? "#38BDF8"
    : accentColor || "#0284C7";

  const defaultHighlightBg = isPhase2
    ? tokens.isDark
      ? "rgba(239, 68, 68, 0.2)"
      : "rgba(239, 68, 68, 0.15)"
    : tokens.isDark
    ? "rgba(56, 189, 248, 0.2)"
    : accentBg || "rgba(2, 132, 199, 0.15)";

  const highlightColor = currentSubtitle.highlightColor || defaultHighlightColor;
  const highlightBg = currentSubtitle.highlightBg || defaultHighlightBg;

  const prefix = currentSubtitle.prefix ?? currentSubtitle.text ?? "";
  const highlight = currentSubtitle.highlight ?? "";
  const suffix = currentSubtitle.suffix ?? "";

  return (
    <div className="absolute bottom-[120px] left-[60px] right-[60px] z-20">
      <div
        className="rounded-[28px] p-[28px_36px] flex items-center gap-5"
        style={{
          backgroundColor: tokens.subtitleBg,
          border: tokens.subtitleBorder,
          boxShadow: tokens.subtitleShadow,
        }}
      >
        <div
          className="w-[50px] h-[50px] rounded-2xl flex items-center justify-center text-[26px] shrink-0"
          style={{
            backgroundColor: iconBg,
            color: iconColor,
          }}
        >
          {isPhase2 ? "📢" : "🎙️"}
        </div>

        <div className="flex-1">
          <div
            className="text-[28px] font-bold leading-[1.35]"
            style={{ color: tokens.subtitleTextColor }}
          >
            {prefix}
            {highlight ? (
              <span
                className="font-black px-2 py-0.5 rounded-md"
                style={{
                  color: highlightColor,
                  backgroundColor: highlightBg,
                }}
              >
                {highlight}
              </span>
            ) : null}
            {suffix}
          </div>
        </div>
      </div>
    </div>
  );
};
