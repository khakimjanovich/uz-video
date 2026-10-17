import React from "react";
import { deepDive, pad2 } from "../series/acquiring/map";
import { NodeArt } from "./diagram/illustrations";

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
  deepDives?: number[]; // deep dives this sentence teases: tags ride on top of the tape
}

// Caption printed on black tape; the highlight is marker yellow (stamp red during the break act).
export const SubtitleCard: React.FC<SubtitleCardProps> = ({ currentSubtitle, danger = false, deepDives }) => {
  const prefix = currentSubtitle.prefix ?? currentSubtitle.text ?? "";
  const highlight = currentSubtitle.highlight ?? "";
  const suffix = currentSubtitle.suffix ?? "";

  return (
    <div className="absolute bottom-[150px] left-[84px] right-[84px] z-20 bg-ink px-9 py-7">
      {deepDives?.length ? (
        <div className="absolute bottom-full left-0 mb-3 flex flex-wrap gap-3 font-mono uppercase">
          {deepDives.map((n) => (
            <div key={n} className="flex items-center gap-2 px-3 py-1.5 border-[3px] border-dashed border-ink bg-paper text-ink text-[19px] font-bold whitespace-nowrap">
              <NodeArt name={deepDive(n).icon} size={32} /> Deep dive {pad2(n)} · {deepDive(n).title}
            </div>
          ))}
        </div>
      ) : null}
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
