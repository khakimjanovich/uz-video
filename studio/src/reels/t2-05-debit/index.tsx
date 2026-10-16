import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = ["Inside?", "One request", "Charged twice", "Atomic claim", "Journal", "MID + TID", "Auth + capture", "Captured"];

const T205Debit: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="t2-05-debit"
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · DEEP DIVE 05"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Debit", value: "Exactly once" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const T205DebitComposition = createReelComposition({
  id: "t2-05-debit",
  component: T205Debit,
  subtitles,
});
