import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

// One headline per sentence/step.
const TITLES = ["Cards online?", "The law", "The acquirer", "The payment", "The payout", "Next: checks"];

const Ep01Gateway: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="ep01-gateway"
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · EP 01"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Law", value: "ZRU-578" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const Ep01GatewayComposition = createReelComposition({
  id: "ep01-gateway",
  component: Ep01Gateway,
  subtitles,
});
