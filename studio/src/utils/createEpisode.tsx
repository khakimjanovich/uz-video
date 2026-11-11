import React from "react";
import { Episode, ReelScaffold, SubtitleCue, BuildMapStep, MapDef, NodeDef, DiagramStep, CodeStep, ScreenStep, BuyerStep, buyerViewShown } from "../components";
import { ReelProps } from "../themes";
import { BUILD_CATALOG, BuildId } from "../series/build/nodes";
import { BuildNodeId, SERIES_B_MAP } from "../series/build/map";
import { createReelComposition } from "./createReelComposition";

// A course: its name on screen, its diagram boxes and its build map.
export type Course<Id extends string, MapId extends string> = {
  name: string; // "Build an acquiring system"
  footerLabel: string; // left side of the totals line
  catalog: Record<Id, NodeDef>;
  map: MapDef<MapId>;
};

export const SERIES_B: Course<BuildId, BuildNodeId> = { name: "Build an acquiring system", footerLabel: "Series B", catalog: BUILD_CATALOG, map: SERIES_B_MAP };

// One course lesson: 16:9, the build map, an evolving diagram and code cards.
export function createEpisode<Id extends string = BuildId, MapId extends string = BuildNodeId>({
  course = SERIES_B as unknown as Course<Id, MapId>,
  id,
  number,
  part,
  titles,
  footer,
  subtitles,
  map,
  diagram,
  code,
  screens,
  focus = false,
  hidePanelBefore = 0,
  buyer = [],
  keepLabels = false,
}: {
  course?: Course<Id, MapId>; // Series B when left out
  id: string;
  number: number; // course order, 1–41
  part: number; // the course module (1–7), lit in the panel
  titles: string[];
  footer: string; // right side of the totals line
  subtitles: SubtitleCue[];
  map: BuildMapStep<MapId>[];
  diagram: DiagramStep<Id>[];
  code?: CodeStep[];
  screens?: ScreenStep[]; // real product screens (generated into public/screens by screens/)
  focus?: boolean; // dim every map node the current sentence is not about
  hidePanelBefore?: number; // hide the course-modules panel until this cue (0 = always shown)
  buyer?: BuyerStep[]; // the buyer's own screen beside the map
  keepLabels?: boolean; // diagram boxes keep their names on every step
}) {
  const Component: React.FC<ReelProps> = ({ theme }) => (
    <ReelScaffold
      theme={theme}
      reelId={id}
      subtitles={subtitles}
      series={`${course.name} · Lesson ${String(number).padStart(2, "0")}`}
      title={(cue) => titles[cue] ?? titles[titles.length - 1]}
      footer={{ label: course.footerLabel, value: footer }}
      // Captions follow the voice a short phrase at a time, in written form (subtitles.json phrases).
      // With the course panel hidden, the caption moves up beside the map so the right side is not empty.
      captionStyle={(cue) => {
        // Same rule as the panel in BuildMap: in focus mode it shows only on steps that name rows.
        const step = [...map].reverse().find((m) => m.cue <= cue);
        const panelShown = cue >= hidePanelBefore && (!focus || !!step?.rows);
        return { left: 1150, right: 84, bottom: panelShown || buyerViewShown(buyer, cue) ? 140 : 330 };
      }}
    >
      <Episode part={part} map={map} mapDef={course.map as MapDef} catalog={course.catalog} diagram={diagram} code={code} screens={screens} focus={focus} hidePanelBefore={hidePanelBefore} buyer={buyer} keepLabels={keepLabels} />
    </ReelScaffold>
  );
  return createReelComposition({ id, component: Component, subtitles, width: 1920, height: 1080 });
}
