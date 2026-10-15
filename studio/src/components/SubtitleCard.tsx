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
  accentColor?: string;
  accentBg?: string;
}

export const SubtitleCard: React.FC<SubtitleCardProps> = ({
  currentSubtitle,
  danger = false,
  accentColor,
  accentBg,
}) => {
  const prefix = currentSubtitle.prefix ?? currentSubtitle.text ?? "";
  const highlight = currentSubtitle.highlight ?? "";
  const suffix = currentSubtitle.suffix ?? "";

  const customStyle: React.CSSProperties = {};
  if (currentSubtitle.highlightColor || accentColor) {
    customStyle.color = currentSubtitle.highlightColor || accentColor;
  }
  if (currentSubtitle.highlightBg || accentBg) {
    customStyle.backgroundColor = currentSubtitle.highlightBg || accentBg;
  }

  return (
    <div className="absolute bottom-[120px] left-[60px] right-[60px] z-20">
      <div className="rounded-[28px] p-[28px_36px] flex items-center gap-5 bg-card border border-border shadow-2xl">
        <div
          className={`w-[50px] h-[50px] rounded-2xl flex items-center justify-center text-[26px] shrink-0 ${
            danger ? "bg-danger-subtle text-danger" : "bg-accent-subtle text-accent"
          }`}
        >
          {danger ? "📢" : "🎙️"}
        </div>

        <div className="flex-1">
          <div className="text-[28px] font-bold leading-[1.35] text-primary">
            {prefix}
            {highlight ? (
              <span
                className={`font-black px-2 py-0.5 rounded-md ${
                  danger ? "text-danger bg-danger-subtle" : "text-accent bg-accent-subtle"
                }`}
                style={customStyle}
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
