import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = ["Card?", "Bank page", "SMS code", "Debit", "Captured"];

const Ep04Debit: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="ep04-debit"
    subtitles={subtitles}
    acts={acts}
    position={{ part: 4 }}
    deepDives={{ 1: [4], 3: [5, 6, 7] }}
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Card data", value: "Bank only" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const Ep04DebitComposition = createReelComposition({
  id: "ep04-debit",
  component: Ep04Debit,
  subtitles,
});
