import React from "react";
import { AbsoluteFill, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { getThemeTokens, ThemeName } from "../themes";
import { ReelBackground } from "./ReelBackground";
import { ReelHeader } from "./ReelHeader";
import { SubtitleCard, SubtitleCue } from "./SubtitleCard";
import { RegulatoryFooter } from "./RegulatoryFooter";
import {
  HighlightsMap,
  SubtitlesContext,
  useSubtitles,
  UseSubtitlesReturn,
} from "../hooks/useSubtitles";

export interface ReelScaffoldProps {
  theme?: ThemeName;
  reelId: string;
  subtitles: SubtitleCue[];
  highlightsMap?: HighlightsMap;
  badgeText?: string | ((cueIndex: number) => string);
  badgeDotColor?: string | ((cueIndex: number) => string);
  title: React.ReactNode | ((cueIndex: number) => React.ReactNode);
  lawCitation: string;
  citationIcon?: string;
  isPhase2?: boolean;
  headerSpringProgress?: number;
  audioPremountFor?: number;
  children: React.ReactNode | ((subState: UseSubtitlesReturn) => React.ReactNode);
}

export const ReelScaffold: React.FC<ReelScaffoldProps> = ({
  theme = "dark",
  reelId,
  subtitles,
  highlightsMap,
  badgeText = "",
  badgeDotColor = "#10B981",
  title,
  lawCitation,
  citationIcon = "🛡️",
  isPhase2: propIsPhase2,
  headerSpringProgress,
  audioPremountFor,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tokens = getThemeTokens(theme);
  const subState = useSubtitles(subtitles, highlightsMap);

  const isPhase2 = propIsPhase2 !== undefined ? propIsPhase2 : subState.cueIndex === 1;

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
        <Audio
          src={staticFile(`reels/${reelId}/voiceover.mp3`)}
          premountFor={audioPremountFor ?? fps}
        />

        {/* Decorative Grid & Ambient Glows */}
        <ReelBackground tokens={tokens} isPhase2={isPhase2} />

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
          isPhase2={isPhase2}
        />

        {/* Bottom Legal / Regulatory Footer */}
        <RegulatoryFooter text={lawCitation} icon={citationIcon} />
      </AbsoluteFill>
    </SubtitlesContext.Provider>
  );
};
