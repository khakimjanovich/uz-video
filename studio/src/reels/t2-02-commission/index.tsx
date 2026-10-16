import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = [
  "Who earns?",
  "One fee",
  "Stores differ",
  "Rules",
  "Scope",
  "Four-eyes",
  "At card entry",
  "Locked",
  "Settlement",
];

const T202Commission: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="t2-02-commission"
    subtitles={subtitles}
    acts={acts}
    position={{ deepDive: 2 }}
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Fee", value: "% + fixed" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const T202CommissionComposition = createReelComposition({
  id: "t2-02-commission",
  component: T202Commission,
  subtitles,
});
