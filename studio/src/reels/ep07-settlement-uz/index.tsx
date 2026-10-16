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
import { acts, steps } from "../ep07-settlement/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek Part 7: same steps as English, Uzbek text, self-voiced (timings from `manage_reels.py draft`).
const subtitles = subtitlesJson as SubtitleCue[];
const TITLES = [
  "Pul qachon?",
  "Kliring",
  "Bankka tushish",
  "Komissiya",
  "Kunlik hisobot",
];
const catalog = localizeCatalog(ACQUIRING_NODES, UZ);
const uzSteps = localizeSteps(steps, UZ);

const Ep07SettlementUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · 07-QISM"
    stepLabel="QADAM"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Pul o'tkazmasi", value: "T+1" }}
  >
    <ArchDiagram catalog={catalog} steps={uzSteps} />
  </ReelScaffold>
);

export const Ep07SettlementUzComposition = createReelComposition({
  id: "ep07-settlement-uz",
  component: Ep07SettlementUz,
  subtitles,
});
