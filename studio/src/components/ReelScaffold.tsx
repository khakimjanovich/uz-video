import React from "react";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { fonts, ThemeName } from "../themes";
import { ReelBackground } from "./ReelBackground";
import { ReelHeader } from "./ReelHeader";
import { SubtitleCard, SubtitleCue } from "./SubtitleCard";
import { RegulatoryFooter } from "./RegulatoryFooter";
import {
  ActsMap,
  HighlightsMap,
  SubtitlesContext,
  useSubtitles,
  UseSubtitlesReturn,
} from "../hooks/useSubtitles";

export interface ReelScaffoldProps {
  theme?: ThemeName;
  reelId?: string; // omit for silent Studio-only compositions
  subtitles: SubtitleCue[];
  highlightsMap?: HighlightsMap;
  acts?: ActsMap;
  captionStyle?: React.CSSProperties; // move the caption tape (16:9 layouts)
  captions?: boolean; // false: voice only, no caption tape (the picture carries the idea)
  series?: string; // small line above the title (e.g. the Studio playground)
  title: React.ReactNode | ((cueIndex: number) => React.ReactNode);
  footer: { label: string; value: string }; // receipt totals line, e.g. LAW .... ZRU-578
  audioPremountFor?: number;
  children: React.ReactNode | ((subState: UseSubtitlesReturn) => React.ReactNode);
}

const pad = (n: number) => String(n).padStart(2, "0");

export const ReelScaffold: React.FC<ReelScaffoldProps> = ({
  theme = "dark",
  reelId,
  subtitles,
  highlightsMap,
  acts,
  captions = true,
  captionStyle,
  series = "",
  title,
  footer,
  audioPremountFor,
  children,
}) => {
  const { fps } = useVideoConfig();
  const subState = useSubtitles(subtitles, highlightsMap, acts);
  const danger = subState.act === "break";
  const resolvedTitle = typeof title === "function" ? title(subState.cueIndex) : title;

  return (
    <SubtitlesContext.Provider value={subState}>
      <AbsoluteFill data-theme={theme} className="overflow-hidden" style={{ fontFamily: fonts.mono }}>
        {reelId ? (
          <Audio src={staticFile(`reels/${reelId}/voiceover.mp3`)} premountFor={audioPremountFor ?? fps} />
        ) : null}

        <ReelBackground />
        <ReelHeader
          series={series}
          step={`STEP ${pad(subState.cueIndex + 1)}/${pad(Math.max(subtitles.length, 1))}`}
          title={resolvedTitle}
        />

        {typeof children === "function" ? children(subState) : children}

        {captions ? <SubtitleCard currentSubtitle={subState.currentSubtitle} danger={danger} style={captionStyle} /> : null}
        <RegulatoryFooter label={footer.label} value={footer.value} />
      </AbsoluteFill>
    </SubtitlesContext.Provider>
  );
};
