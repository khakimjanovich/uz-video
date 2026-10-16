import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = ["Checks?", "Sign up", "Review", "Sales point", "Switched on"];

const Ep02Onboarding: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="ep02-onboarding"
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · EP 02"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Check", value: "KYB" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const Ep02OnboardingComposition = createReelComposition({
  id: "ep02-onboarding",
  component: Ep02Onboarding,
  subtitles,
});
