import React from "react";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { fonts, ThemeName } from "../themes";
import { ReelBackground } from "./ReelBackground";
import { ReelHeader } from "./ReelHeader";
import { SubtitleCard, SubtitleCue } from "./SubtitleCard";
import { RegulatoryFooter } from "./RegulatoryFooter";
import { SeriesMap } from "./SeriesMap";
import { deepDive, pad2, SeriesPosition } from "../series/acquiring/map";
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
  position?: SeriesPosition; // where this video sits in the series: drives the route strip and header line
  series?: string; // header line override (e.g. the Studio playground)
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
  position,
  series,
  title,
  footer,
  audioPremountFor,
  children,
}) => {
  const { fps } = useVideoConfig();
  const subState = useSubtitles(subtitles, highlightsMap, acts);
  const danger = subState.act === "break";
  const seriesLine =
    series ??
    (position && "part" in position
      ? `HEEYPAY ACQ · PART ${pad2(position.part)} OF 07`
      : position
        ? `HEEYPAY ACQ · DEEP DIVE ${pad2(position.deepDive)} · FROM PART ${pad2(deepDive(position.deepDive).parent)}`
        : "");
  const resolvedTitle = typeof title === "function" ? title(subState.cueIndex) : title;

  return (
    <SubtitlesContext.Provider value={subState}>
      <AbsoluteFill data-theme={theme} className="overflow-hidden" style={{ fontFamily: fonts.mono }}>
        {reelId ? (
          <Audio src={staticFile(`reels/${reelId}/voiceover.mp3`)} premountFor={audioPremountFor ?? fps} />
        ) : null}

        <ReelBackground />
        {position ? <SeriesMap position={position} /> : null}
        <ReelHeader
          series={seriesLine}
          step={`STEP ${pad(subState.cueIndex + 1)}/${pad(Math.max(subtitles.length, 1))}`}
          title={resolvedTitle}
        />

        {typeof children === "function" ? children(subState) : children}

        <SubtitleCard currentSubtitle={subState.currentSubtitle} danger={danger} />
        <RegulatoryFooter label={footer.label} value={footer.value} />
      </AbsoluteFill>
    </SubtitlesContext.Provider>
  );
};
