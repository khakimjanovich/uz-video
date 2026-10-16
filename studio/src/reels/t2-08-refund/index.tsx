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
  "Money back?",
  "One button?",
  "Cleared?",
  "Reversal",
  "Refund",
  "Partial",
  "Same card",
  "Refund window",
  "Portal · API",
];

const T208Refund: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="t2-08-refund"
    subtitles={subtitles}
    acts={acts}
    position={{ deepDive: 8 }}
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Money back", value: "Reversal ≠ refund" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const T208RefundComposition = createReelComposition({
  id: "t2-08-refund",
  component: T208Refund,
  subtitles,
});
