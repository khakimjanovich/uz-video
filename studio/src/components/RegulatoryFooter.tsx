import React from "react";
import { ThemeTokens } from "../themes";

interface RegulatoryFooterProps {
  text: string;
  icon?: string;
  tokens: ThemeTokens;
}

export const RegulatoryFooter: React.FC<RegulatoryFooterProps> = ({
  text,
  icon = "🛡️",
  tokens,
}) => {
  return (
    <div
      className="absolute bottom-[42px] left-[60px] right-[60px] flex items-center justify-center gap-2.5 text-[17px] font-semibold tracking-wide z-20"
      style={{ color: tokens.footerColor }}
    >
      <span className="text-xl">{icon}</span>
      <span>{text}</span>
    </div>
  );
};
