import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = ["Deep dives", "Eight stops"];

const T200DeepDives: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="t2-00-deep-dives"
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · DEEP DIVES"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Deep dives", value: "08" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const T200DeepDivesComposition = createReelComposition({
  id: "t2-00-deep-dives",
  component: T200DeepDives,
  subtitles,
});
