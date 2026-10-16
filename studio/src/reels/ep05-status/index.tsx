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
  "Paid?",
  "Back to store",
  "Ask the bank",
  "Final state",
  "Order paid",
];

const Ep05Status: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="ep05-status"
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · EP 05"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Truth", value: "Bank status" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const Ep05StatusComposition = createReelComposition({
  id: "ep05-status",
  component: Ep05Status,
  subtitles,
});
