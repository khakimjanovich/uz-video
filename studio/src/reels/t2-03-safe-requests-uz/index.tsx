import React from "react";
import {
  ArchDiagram,
  localizeCatalog,
  localizeSteps,
  ReelScaffold,
  SubtitleCue,
} from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import { UZ } from "../../series/acquiring/uz";
import { acts, steps } from "../t2-03-safe-requests/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek T2-3: same steps as English, Uzbek text, self-voiced (timings from `manage_reels.py draft`).
const subtitles = subtitlesJson as SubtitleCue[];
const TITLES = [
  "Bir martami?",
  "Faqat kalit",
  "Replay attack",
  "HMAC",
  "Tekshiruv",
  "Nonce + vaqt",
  "Idempotency",
  "Takror → o'sha",
  "Boshqa → rad",
];
const catalog = localizeCatalog(ACQUIRING_NODES, UZ);
const uzSteps = localizeSteps(steps, UZ);

const T203SafeRequestsUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · CHUQUR 03"
    stepLabel="QADAM"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Imzo", value: "HMAC-SHA256" }}
  >
    <ArchDiagram catalog={catalog} steps={uzSteps} />
  </ReelScaffold>
);

export const T203SafeRequestsUzComposition = createReelComposition({
  id: "t2-03-safe-requests-uz",
  component: T203SafeRequestsUz,
  subtitles,
});
