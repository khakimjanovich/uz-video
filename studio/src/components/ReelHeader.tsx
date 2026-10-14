import React from "react";
import { interpolate } from "remotion";

export interface ReelHeaderProps {
  badgeText: string;
  badgeDotColor?: string;
  title: React.ReactNode;
  springProgress: number;
}

export const ReelHeader: React.FC<ReelHeaderProps> = ({
  badgeText,
  badgeDotColor = "#10B981",
  title,
  springProgress,
}) => {
  const translateY = interpolate(springProgress, [0, 1], [-50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute top-[86px] left-[60px] right-[60px] flex flex-col items-center z-10"
      style={{
        translate: `0px ${translateY}px`,
        opacity: springProgress,
      }}
    >
      {/* Category / Topic Pill Badge */}
      <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full mb-4.5 shadow-sm bg-card border border-border">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: badgeDotColor,
            boxShadow: `0 0 10px ${badgeDotColor}`,
          }}
        />
        <span className="text-[22px] font-bold tracking-wider uppercase text-primary">
          {badgeText}
        </span>
      </div>

      {/* Main Reel Title */}
      <h1 className="text-[52px] font-extrabold text-center m-0 leading-[1.15] tracking-tight text-primary">
        {title}
      </h1>
    </div>
  );
};
