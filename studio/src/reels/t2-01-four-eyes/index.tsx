import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = ["Who decides?", "One admin", "Not secure", "Request", "Second admin", "Not yourself", "As seen", "Expiry"];

const T201FourEyes: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="t2-01-four-eyes"
    subtitles={subtitles}
    acts={acts}
    position={{ deepDive: 1 }}
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Control", value: "Four-eyes" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const T201FourEyesComposition = createReelComposition({
  id: "t2-01-four-eyes",
  component: T201FourEyes,
  subtitles,
});
