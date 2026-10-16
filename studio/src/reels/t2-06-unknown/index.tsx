import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = ["No answer", "Retry?", "Charged twice", "Unknown", "Workflow", "Resolve", "Manual review", "Sweep"];

const T206Unknown: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="t2-06-unknown"
    subtitles={subtitles}
    acts={acts}
    position={{ deepDive: 6 }}
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Rule", value: "Never blind-retry" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const T206UnknownComposition = createReelComposition({
  id: "t2-06-unknown",
  component: T206Unknown,
  subtitles,
});
