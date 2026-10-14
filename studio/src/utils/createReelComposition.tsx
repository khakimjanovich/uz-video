import React from "react";
import { Composition, CalculateMetadataFunction } from "remotion";
import { ReelProps, ThemeName } from "../themes";
import { SubtitleCue } from "../components/SubtitleCard";

export interface CreateReelOptions {
  id: string;
  component: React.ComponentType<ReelProps>;
  subtitles: SubtitleCue[];
  defaultTheme?: ThemeName;
  fps?: number;
  width?: number;
  height?: number;
  extraPaddingFrames?: number;
}

export function createReelComposition({
  id,
  component,
  subtitles,
  defaultTheme = "dark",
  fps = 30,
  width = 1080,
  height = 1920,
  extraPaddingFrames = 0,
}: CreateReelOptions): React.FC {
  const lastCue = subtitles[subtitles.length - 1];
  const durationInFrames = (lastCue ? lastCue.endFrame : 300) + extraPaddingFrames;

  const calculateMetadata: CalculateMetadataFunction<ReelProps> = async () => {
    return {
      durationInFrames,
    };
  };

  const ReelComposition: React.FC = () => {
    return (
      <Composition
        id={id}
        component={component}
        durationInFrames={durationInFrames}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          theme: defaultTheme,
        }}
        calculateMetadata={calculateMetadata}
      />
    );
  };

  return ReelComposition;
}
