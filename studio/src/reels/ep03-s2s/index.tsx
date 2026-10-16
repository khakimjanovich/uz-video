import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = ["New payment?", "Signed request", "Verified", "Payment link"];

const Ep03S2s: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="ep03-s2s"
    subtitles={subtitles}
    acts={acts}
    position={{ part: 3 }}
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Signature", value: "HMAC-SHA256" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const Ep03S2sComposition = createReelComposition({
  id: "ep03-s2s",
  component: Ep03S2s,
  subtitles,
});
