import React from "react";

export interface ReelHeaderProps {
  series: string; // e.g. "HEEYPAY ACQ · EP 01"
  step: string; // e.g. "STEP 02/06"
  title: React.ReactNode; // per-step headline
}

// Receipt header: series line + step counter, big headline, dotted rule.
export const ReelHeader: React.FC<ReelHeaderProps> = ({ series, step, title }) => {
  return (
    <div className="absolute top-[132px] left-[84px] right-[84px] z-10 font-mono text-ink">
      <div className="flex justify-between text-[24px] text-ink-muted tracking-wider uppercase">
        <span>{series}</span>
        <span>{step}</span>
      </div>
      <h1 className="font-display text-[88px] leading-[1.05] uppercase m-0 mt-5">{title}</h1>
      <div className="mt-6 border-t-[3px] border-dotted border-ink" />
    </div>
  );
};
