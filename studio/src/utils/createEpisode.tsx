import React from "react";
import { Episode, ReelScaffold, SubtitleCue, BuildMapStep, DiagramStep, CodeStep } from "../components";
import { ReelProps } from "../themes";
import { BUILD_CATALOG, BuildId } from "../series/build/nodes";
import { createReelComposition } from "./createReelComposition";

// One course lesson: 16:9, the build map, an evolving diagram and code cards.
export function createEpisode({
  id,
  number,
  part,
  titles,
  footer,
  subtitles,
  map,
  diagram,
  code,
}: {
  id: string;
  number: number;
  part: number; // the course module (0–8), lit in the panel
  titles: string[];
  footer: string; // right side of the totals line
  subtitles: SubtitleCue[];
  map: BuildMapStep[];
  diagram: DiagramStep<BuildId>[];
  code?: CodeStep[];
}) {
  const Component: React.FC<ReelProps> = ({ theme }) => (
    <ReelScaffold
      theme={theme}
      reelId={id}
      subtitles={subtitles}
      series={`Build an acquiring system · Lesson ${String(number).padStart(2, "0")}`}
      title={(cue) => titles[cue] ?? titles[titles.length - 1]}
      footer={{ label: "Series B", value: footer }}
      captionStyle={{ left: 1150, right: 84, bottom: 140 }}
    >
      <Episode part={part} map={map} catalog={BUILD_CATALOG} diagram={diagram} code={code} />
    </ReelScaffold>
  );
  return createReelComposition({ id, component: Component, subtitles, width: 1920, height: 1080 });
}
