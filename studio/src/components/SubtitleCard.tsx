import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

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
  phrases?: CaptionPhrase[]; // from the voice's word boundaries: the caption follows the voice a phrase at a time
}

// A few words of what is being said, in written form, each with the frame it is spoken.
export interface CaptionPhrase {
  startFrame: number;
  words: { text: string; startFrame: number }[];
}

export interface SubtitleCardProps {
  currentSubtitle: SubtitleCue;
  danger?: boolean;
  style?: React.CSSProperties; // position override, e.g. a side column in 16:9
}

// IBM Plex Mono advance is 0.6em, so line wrapping is predictable from the text alone.
const SIZES = [32, 30, 28, 26];
const LINE_HEIGHT = 1.35;
const MAX_HEIGHT = 5 * 32 * LINE_HEIGHT; // the tape never grows past five 32px lines
const PAD_X = 36;

const countLines = (text: string, perLine: number) => {
  let lines = 1;
  let used = 0;
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (used === 0) used = word.length;
    else if (used + 1 + word.length <= perLine) used += 1 + word.length;
    else {
      lines += 1;
      used = word.length;
    }
  }
  return lines;
};

// Largest step that keeps the caption inside its slot; long cues shrink instead of covering the panel above.
const fitFontSize = (text: string, width: number) =>
  SIZES.find((size) => countLines(text, Math.floor(width / (size * 0.6))) * size * LINE_HEIGHT <= MAX_HEIGHT) ??
  SIZES[SIZES.length - 1];

// Caption printed on black tape; the highlight is marker yellow (stamp red during the break act).
export const SubtitleCard: React.FC<SubtitleCardProps> = ({ currentSubtitle, danger = false, style }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const phrases = currentSubtitle.phrases;
  const phrase = phrases?.filter((p) => p.startFrame <= frame).pop() ?? phrases?.[0];
  const spoken = phrase?.words.filter((w) => w.startFrame <= frame).length ?? 0;
  const prefix = phrase ? phrase.words.slice(0, Math.max(0, spoken - 1)).map((w) => w.text + " ").join("") : currentSubtitle.prefix ?? currentSubtitle.text ?? "";
  const highlight = phrase ? phrase.words[spoken - 1]?.text ?? "" : currentSubtitle.highlight ?? "";
  const suffix = phrase ? phrase.words.slice(spoken).map((w) => " " + w.text).join("") : currentSubtitle.suffix ?? "";
  const left = typeof style?.left === "number" ? style.left : 84;
  const right = typeof style?.right === "number" ? style.right : 84;
  const fontSize = fitFontSize(prefix + highlight + suffix, width - left - right - 2 * PAD_X);

  return (
    <div className="absolute bottom-[150px] left-[84px] right-[84px] z-20 bg-ink px-9 py-7" style={style}>
      <div className="font-mono font-semibold leading-[1.35] text-paper break-words" style={{ fontSize }}>
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
