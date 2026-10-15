import React from "react";
import { ThemeTokens } from "../themes";

export interface ReelBackgroundProps {
  tokens: ThemeTokens;
  isPhase2?: boolean;
}

export const ReelBackground: React.FC<ReelBackgroundProps> = ({
  tokens,
  isPhase2 = false,
}) => {
  return (
    <>
      {/* Decorative Radial Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${tokens.gridColor} 1.4px, transparent 1.4px)`,
          backgroundSize: "36px 36px",
          opacity: tokens.gridOpacity,
        }}
      />

      {/* Ambient Glow Spotlight */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[980px] h-[520px] pointer-events-none filter blur-[60px]"
        style={{
          background: isPhase2
            ? "radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(245,158,11,0.08) 50%, transparent 75%)"
            : `radial-gradient(circle, ${tokens.glowColor1} 0%, ${tokens.glowColor2} 50%, transparent 75%)`,
        }}
      />
    </>
  );
};
