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
  "No website?",
  "Create link",
  "Share it",
  "Open it",
  "Same payment",
  "One use",
];

const Ep06Links: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="ep06-links"
    subtitles={subtitles}
    acts={acts}
    position={{ part: 6 }}
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Link", value: "Single-use" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const Ep06LinksComposition = createReelComposition({
  id: "ep06-links",
  component: Ep06Links,
  subtitles,
});
