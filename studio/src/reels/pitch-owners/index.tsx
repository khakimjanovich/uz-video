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
  "Meet Aziza",
  "Missed money",
  "Commission",
  "Deposits",
  "Too good?",
  "Real shops",
  "Forged amount",
  "Bounced off",
  "Double charge?",
  "Charged once",
];

const PitchOwners: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="pitch-owners"
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · FOR BANK OWNERS"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Your bank", value: "Own acquiring" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const PitchOwnersComposition = createReelComposition({
  id: "pitch-owners",
  component: PitchOwners,
  subtitles,
});
