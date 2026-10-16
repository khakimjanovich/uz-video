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
  "Really once?",
  "Just the key",
  "Replay attack",
  "HMAC",
  "Verify",
  "Nonce + time",
  "Idempotency",
  "Same → same",
  "Different → no",
];

const T203SafeRequests: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="t2-03-safe-requests"
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · DEEP DIVE 03"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Signature", value: "HMAC-SHA256" }}
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const T203SafeRequestsComposition = createReelComposition({
  id: "t2-03-safe-requests",
  component: T203SafeRequests,
  subtitles,
});
