import React from "react";
import { AbsoluteFill, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { getThemeTokens, ThemeName } from "../themes";
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
  badgeText?: string | ((cueIndex: number) => string);
  badgeDotColor?: string | ((cueIndex: number) => string);
  title: React.ReactNode | ((cueIndex: number) => React.ReactNode);
  lawCitation: string;
  citationIcon?: string;
  headerSpringProgress?: number;
  audioPremountFor?: number;
  children: React.ReactNode | ((subState: UseSubtitlesReturn) => React.ReactNode);
}

export const ReelScaffold: React.FC<ReelScaffoldProps> = ({
  theme = "dark",
  reelId,
  subtitles,
  highlightsMap,
  acts,
  badgeText = "",
  badgeDotColor = "#10B981",
  title,
  lawCitation,
  citationIcon = "🛡️",
  headerSpringProgress,
  audioPremountFor,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tokens = getThemeTokens(theme);
  const subState = useSubtitles(subtitles, highlightsMap, acts);
  const danger = subState.act === "break";

  const resolvedBadgeText =
    typeof badgeText === "function" ? badgeText(subState.cueIndex) : badgeText;
  const resolvedBadgeDotColor =
    typeof badgeDotColor === "function" ? badgeDotColor(subState.cueIndex) : badgeDotColor;
  const resolvedTitle =
    typeof title === "function" ? title(subState.cueIndex) : title;

  const defaultHeaderSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const activeHeaderSpring = headerSpringProgress ?? defaultHeaderSpring;

  return (
    <SubtitlesContext.Provider value={subState}>
      <AbsoluteFill
        data-theme={theme}
        className="overflow-hidden relative bg-canvas text-primary"
        style={{
          fontFamily: tokens.fontFamily,
        }}
      >
        {/* Audio with premountFor */}
        {reelId ? (
          <Audio
            src={staticFile(`reels/${reelId}/voiceover.mp3`)}
            premountFor={audioPremountFor ?? fps}
          />
        ) : null}

        {/* Decorative Grid & Ambient Glows */}
        <ReelBackground tokens={tokens} danger={danger} />

        {/* Top Header & Title */}
        <ReelHeader
          springProgress={activeHeaderSpring}
          badgeDotColor={resolvedBadgeDotColor}
          badgeText={resolvedBadgeText}
          title={resolvedTitle}
        />

        {/* Reel-Specific Animation Stages */}
        {typeof children === "function" ? children(subState) : children}

        {/* Bottom Subtitle Caption Card */}
        <SubtitleCard
          currentSubtitle={subState.currentSubtitle}
          danger={danger}
        />

        {/* Bottom Legal / Regulatory Footer */}
        <RegulatoryFooter text={lawCitation} icon={citationIcon} />
      </AbsoluteFill>
    </SubtitlesContext.Provider>
  );
};
