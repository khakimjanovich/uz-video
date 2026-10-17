import React from "react";
import { Episode, ReelScaffold, SubtitleCue, BuildMapStep, DiagramStep } from "../components";
import { ReelProps } from "../themes";
import { BUILD_CATALOG, BuildId } from "../series/build/nodes";
import { createReelComposition } from "./createReelComposition";

// One Series B episode: 16:9, opens on the build map, tells its story on a diagram.
export function createEpisode({
  id,
  number,
  part,
  titles,
  footer,
  subtitles,
  map,
  diagram,
}: {
  id: string;
  number: number;
  part: number;
  titles: string[];
  footer: string; // right side of the totals line
  subtitles: SubtitleCue[];
  map: BuildMapStep[];
  diagram: DiagramStep<BuildId>[];
}) {
  const Component: React.FC<ReelProps> = ({ theme }) => (
    <ReelScaffold
      theme={theme}
      reelId={id}
      subtitles={subtitles}
      series={`Build an acquiring system · Episode ${String(number).padStart(2, "0")}`}
      title={(cue) => titles[cue] ?? titles[titles.length - 1]}
      footer={{ label: "Series B", value: footer }}
      captionStyle={{ left: 1150, right: 84, bottom: 140 }}
    >
      <Episode part={part} map={map} catalog={BUILD_CATALOG} diagram={diagram} />
    </ReelScaffold>
  );
  return createReelComposition({ id, component: Component, subtitles, width: 1920, height: 1080 });
}
