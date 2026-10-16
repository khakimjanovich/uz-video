import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = ["Declined", "Just fail?", "Buyer leaves", "Decline code", "Out of tries", "Hold stuck", "Void", "Confirm"];

const T207Declines: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="t2-07-declines"
    subtitles={subtitles}
    acts={acts}
    position={{ deepDive: 7 }}
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Hold", value: "Always released" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const T207DeclinesComposition = createReelComposition({
  id: "t2-07-declines",
  component: T207Declines,
  subtitles,
});
