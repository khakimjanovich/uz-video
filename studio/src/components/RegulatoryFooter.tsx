import React from "react";

export interface RegulatoryFooterProps {
  text: string;
  icon?: string;
}

export const RegulatoryFooter: React.FC<RegulatoryFooterProps> = ({
  text,
  icon = "🛡️",
}) => {
  return (
    <div className="absolute bottom-[42px] left-[60px] right-[60px] flex items-center justify-center gap-2.5 text-[17px] font-semibold tracking-wide z-20 text-muted">
      <span className="text-xl">{icon}</span>
      <span>{text}</span>
    </div>
  );
};
