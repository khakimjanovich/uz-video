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
import { acts, steps } from "../t2-02-commission/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek T2-2: same steps as English, Uzbek text, self-voiced (timings from `manage_reels.py draft`).
const subtitles = subtitlesJson as SubtitleCue[];
const TITLES = [
  "Kim ishlaydi?",
  "Bitta komissiya",
  "Har xil do'kon",
  "Qoidalar",
  "Qamrov",
  "To'rt ko'z",
  "Karta paytida",
  "Qulflangan",
  "Hisob-kitob",
];
const catalog = localizeCatalog(ACQUIRING_NODES, UZ);
const uzSteps = localizeSteps(steps, UZ);

const T202CommissionUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · CHUQUR 02"
    stepLabel="QADAM"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Komissiya", value: "% + qat'iy" }}
  >
    <ArchDiagram catalog={catalog} steps={uzSteps} />
  </ReelScaffold>
);

export const T202CommissionUzComposition = createReelComposition({
  id: "t2-02-commission-uz",
  component: T202CommissionUz,
  subtitles,
});
