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
  "When paid?",
  "Clearing",
  "Into the bank",
  "Fee + payout",
  "Daily report",
];

const Ep07Settlement: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="ep07-settlement"
    subtitles={subtitles}
    acts={acts}
    position={{ part: 7 }}
    deepDives={{ 3: [2, 8] }}
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Payout", value: "T+1" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const Ep07SettlementComposition = createReelComposition({
  id: "ep07-settlement",
  component: Ep07Settlement,
  subtitles,
});
