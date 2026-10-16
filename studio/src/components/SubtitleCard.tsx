import React from "react";

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
  danger?: boolean;
}

// Caption printed on black tape; the highlight is marker yellow (stamp red during the break act).
export const SubtitleCard: React.FC<SubtitleCardProps> = ({ currentSubtitle, danger = false }) => {
  const prefix = currentSubtitle.prefix ?? currentSubtitle.text ?? "";
  const highlight = currentSubtitle.highlight ?? "";
  const suffix = currentSubtitle.suffix ?? "";

  return (
    <div className="absolute bottom-[150px] left-[84px] right-[84px] z-20 bg-ink px-9 py-7">
      <div className="font-mono text-[32px] font-semibold leading-[1.35] text-paper">
        {prefix}
        {highlight ? (
          <span
            className={danger ? "text-stamp-red" : "text-marker"}
            style={{ color: currentSubtitle.highlightColor, backgroundColor: currentSubtitle.highlightBg }}
          >
            {highlight}
          </span>
        ) : null}
        {suffix}
      </div>
    </div>
  );
};
