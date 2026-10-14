import React from "react";
import { interpolate } from "remotion";
import { ThemeTokens } from "../themes";

interface ReelHeaderProps {
  badgeText: string;
  badgeDotColor?: string;
  title: React.ReactNode;
  springProgress: number;
  tokens: ThemeTokens;
}

export const ReelHeader: React.FC<ReelHeaderProps> = ({
  badgeText,
  badgeDotColor = "#10B981",
  title,
  springProgress,
  tokens,
}) => {
  const translateY = interpolate(springProgress, [0, 1], [-50, 0]);

  return (
    <div
      className="absolute top-[86px] left-[60px] right-[60px] flex flex-col items-center z-10"
      style={{
        transform: `translateY(${translateY}px)`,
        opacity: springProgress,
      }}
    >
      {/* Category / Topic Pill Badge */}
      <div
        className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full mb-4.5 shadow-sm"
        style={{
          backgroundColor: tokens.badgeBg,
          border: tokens.badgeBorder,
        }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: badgeDotColor,
            boxShadow: `0 0 10px ${badgeDotColor}`,
          }}
        />
        <span
          className="text-[22px] font-bold tracking-wider uppercase"
          style={{ color: tokens.badgeText }}
        >
          {badgeText}
        </span>
      </div>

      {/* Main Reel Title */}
      <h1
        className="text-[52px] font-extrabold text-center m-0 leading-[1.15] tracking-tight"
        style={{ color: tokens.textColor }}
      >
        {title}
      </h1>
    </div>
  );
};
