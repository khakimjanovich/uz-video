import React from "react";
import { AbsoluteFill, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { getThemeTokens, ThemeName } from "../themes";
import { ThemeProvider } from "../context/ThemeContext";
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
  badgeText: string;
  badgeDotColor?: string;
  title: React.ReactNode;
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
  badgeText,
  badgeDotColor = "#10B981",
  title,
  lawCitation,
  citationIcon = "🛡️",
  isPhase2 = false,
  headerSpringProgress,
  audioPremountFor,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tokens = getThemeTokens(theme);
  const subState = useSubtitles(subtitles, highlightsMap);

  const defaultHeaderSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const activeHeaderSpring = headerSpringProgress ?? defaultHeaderSpring;

  return (
    <ThemeProvider theme={theme} tokens={tokens}>
      <SubtitlesContext.Provider value={subState}>
        <AbsoluteFill
          className="overflow-hidden relative"
          style={{
            fontFamily: tokens.fontFamily,
            backgroundColor: tokens.background,
            color: tokens.textColor,
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
            tokens={tokens}
            springProgress={activeHeaderSpring}
            badgeDotColor={badgeDotColor}
            badgeText={badgeText}
            title={title}
          />

          {/* Reel-Specific Animation Stages */}
          {typeof children === "function" ? children(subState) : children}

          {/* Bottom Subtitle Caption Card */}
          <SubtitleCard
            tokens={tokens}
            currentSubtitle={subState.currentSubtitle}
            isPhase2={isPhase2}
          />

          {/* Bottom Legal / Regulatory Footer */}
          <RegulatoryFooter tokens={tokens} text={lawCitation} icon={citationIcon} />
        </AbsoluteFill>
      </SubtitlesContext.Provider>
    </ThemeProvider>
  );
};
