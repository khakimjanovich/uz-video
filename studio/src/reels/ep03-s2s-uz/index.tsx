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
import { acts, steps } from "../ep03-s2s/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek Part 3: same steps as English, Uzbek text, self-voiced (timings from `manage_reels.py draft`).
const subtitles = subtitlesJson as SubtitleCue[];
const TITLES = [
  "Yangi to'lov?",
  "Imzoli so'rov",
  "Tekshirildi",
  "To'lov havolasi",
];
const catalog = localizeCatalog(ACQUIRING_NODES, UZ);
const uzSteps = localizeSteps(steps, UZ);

const Ep03S2sUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · 03-QISM"
    stepLabel="QADAM"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Imzo", value: "HMAC-SHA256" }}
  >
    <ArchDiagram catalog={catalog} steps={uzSteps} />
  </ReelScaffold>
);

export const Ep03S2sUzComposition = createReelComposition({
  id: "ep03-s2s-uz",
  component: Ep03S2sUz,
  subtitles,
});
