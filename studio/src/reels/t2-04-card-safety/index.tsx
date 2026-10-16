import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = ["Card safe?", "Store collects", "PCI DSS", "Hosted page", "Token", "Reveal", "OTP", "Limits"];

const T204CardSafety: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="t2-04-card-safety"
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · DEEP DIVE 04"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Card data", value: "PCI DSS" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const T204CardSafetyComposition = createReelComposition({
  id: "t2-04-card-safety",
  component: T204CardSafety,
  subtitles,
});
