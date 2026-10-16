import React from "react";
import { ArchDiagram, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import subtitlesJson from "./subtitles.json";
import { acts, steps } from "./steps";

const subtitles = subtitlesJson as SubtitleCue[];

const Ep01Gateway: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="ep01-gateway"
    subtitles={subtitles}
    acts={acts}
    badgeText="heeyPay · Part 1"
    title="How does an online store accept cards?"
    lawCitation="Law ZRU-578 «On Payments and Payment Systems»"
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const Ep01GatewayComposition = createReelComposition({
  id: "ep01-gateway",
  component: Ep01Gateway,
  subtitles,
});
