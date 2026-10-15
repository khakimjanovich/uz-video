import { createContext, useContext } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SubtitleCue } from "../components/SubtitleCard";

export interface HighlightConfig {
  highlight?: string;
  prefix?: string;
  suffix?: string;
  color?: string;
  bg?: string;
}

export type HighlightsMap = Record<number, HighlightConfig>;

// Series teaching structure; each value is the cue index where the act starts.
export type Act = "hook" | "v1" | "break" | "v2" | "handoff";
export type ActsMap = Partial<Record<Act, number>>;

export interface UseSubtitlesReturn {
  cueIndex: number;
  cueStartFrame: number;
  cueEndFrame: number;
  cueDuration: number;
  cueProgress: number; // 0.0 to 1.0 progress within the currently active cue
  act?: Act;
  currentSubtitle: SubtitleCue;
  isPhase: (index: number) => boolean;
  phaseProgress: (index: number) => number;
  subtitles: SubtitleCue[];
}

export const SubtitlesContext = createContext<UseSubtitlesReturn | null>(null);

export function useSubtitles(
  subtitles: SubtitleCue[],
  highlightsMap?: HighlightsMap,
  acts?: ActsMap
): UseSubtitlesReturn {
  const frame = useCurrentFrame();

  if (!subtitles || subtitles.length === 0) {
    const emptyCue: SubtitleCue = {
      startFrame: 0,
      endFrame: 300,
      text: "",
      prefix: "",
      highlight: "",
      suffix: "",
    };
    return {
      cueIndex: 0,
      cueStartFrame: 0,
      cueEndFrame: 300,
      cueDuration: 300,
      cueProgress: 0,
      currentSubtitle: emptyCue,
      isPhase: () => false,
      phaseProgress: () => 0,
      subtitles: [],
    };
  }

  // Determine active cue index based on current frame:
  // If frame is before the first cue, index is 0
  // If frame is after the last cue, index is subtitles.length - 1
  let activeIndex = 0;
  if (frame >= subtitles[subtitles.length - 1].endFrame) {
    activeIndex = subtitles.length - 1;
  } else {
    for (let i = 0; i < subtitles.length; i++) {
      const nextCue = subtitles[i + 1];
      const start = subtitles[i].startFrame;
      const end = nextCue ? nextCue.startFrame : subtitles[i].endFrame;
      if (frame >= start && frame < end) {
        activeIndex = i;
        break;
      }
    }
  }

  const rawCue = subtitles[activeIndex] || subtitles[0];
  const override = highlightsMap ? highlightsMap[activeIndex] : undefined;

  const highlight = override?.highlight ?? rawCue.highlight ?? "";
  let prefix = override?.prefix ?? rawCue.prefix ?? rawCue.text ?? "";
  let suffix = override?.suffix ?? rawCue.suffix ?? "";

  // If text exists and override highlight specified without prefix/suffix, split dynamically
  if (override?.highlight && rawCue.text && (!override.prefix || !override.suffix)) {
    const idx = rawCue.text.indexOf(override.highlight);
    if (idx !== -1) {
      prefix = rawCue.text.slice(0, idx);
      suffix = rawCue.text.slice(idx + override.highlight.length);
    }
  }

  const currentSubtitle: SubtitleCue = {
    ...rawCue,
    highlight,
    prefix,
    suffix,
    highlightColor: override?.color ?? rawCue.highlightColor,
    highlightBg: override?.bg ?? rawCue.highlightBg,
  };

  const cueStartFrame = rawCue.startFrame;
  const cueEndFrame = rawCue.endFrame;
  const cueDuration = Math.max(1, cueEndFrame - cueStartFrame);

  const cueProgress = interpolate(frame, [cueStartFrame, cueEndFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let act: Act | undefined;
  let actStart = -1;
  for (const [name, start] of Object.entries(acts ?? {}) as [Act, number][]) {
    if (start <= activeIndex && start > actStart) {
      act = name;
      actStart = start;
    }
  }

  const isPhase = (index: number) => activeIndex === index;

  const phaseProgress = (index: number) => {
    const cue = subtitles[index];
    if (!cue) return 0;
    return interpolate(frame, [cue.startFrame, cue.endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  return {
    cueIndex: activeIndex,
    cueStartFrame,
    cueEndFrame,
    cueDuration,
    cueProgress,
    act,
    currentSubtitle,
    isPhase,
    phaseProgress,
    subtitles,
  };
}

export function useSubtitlesContext(): UseSubtitlesReturn {
  const ctx = useContext(SubtitlesContext);
  if (!ctx) {
    throw new Error(
      "useSubtitlesContext must be used within a ReelScaffold or SubtitlesContext.Provider"
    );
  }
  return ctx;
}
