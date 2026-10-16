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
import { acts, steps } from "../ep05-status/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek Part 5: same steps as English, Uzbek text, self-voiced (timings from `manage_reels.py draft`).
const subtitles = subtitlesJson as SubtitleCue[];
const TITLES = [
  "To'landimi?",
  "Do'konga qaytish",
  "Bankdan so'rash",
  "Yakuniy holat",
  "To'landi",
];
const catalog = localizeCatalog(ACQUIRING_NODES, UZ);
const uzSteps = localizeSteps(steps, UZ);

const Ep05StatusUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · 05-QISM"
    stepLabel="QADAM"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Haqiqat", value: "Bank holati" }}
  >
    <ArchDiagram catalog={catalog} steps={uzSteps} />
  </ReelScaffold>
);

export const Ep05StatusUzComposition = createReelComposition({
  id: "ep05-status-uz",
  component: Ep05StatusUz,
  subtitles,
});
