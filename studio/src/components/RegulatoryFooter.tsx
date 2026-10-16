import React from "react";

export interface RegulatoryFooterProps {
  label: string; // e.g. "LAW"
  value: string; // e.g. "ZRU-578"
}

// Receipt "totals" line with a dotted leader: LAW ........ ZRU-578
export const RegulatoryFooter: React.FC<RegulatoryFooterProps> = ({ label, value }) => {
  return (
    <div className="absolute bottom-[78px] left-[84px] right-[84px] z-20 flex items-baseline gap-3 font-mono text-[24px] uppercase text-ink">
      <span>{label}</span>
      <span className="flex-1 border-b-[3px] border-dotted border-ink" />
      <span className="font-semibold">{value}</span>
    </div>
  );
};
