import React from "react";
import { ArchDiagram, localizeCatalog, localizeSteps, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import { UZ } from "../../series/acquiring/uz";
import { acts, steps } from "../t2-01-four-eyes/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek T2-1: same steps as English, Uzbek text, self-voiced (timings from `manage_reels.py draft`).
const subtitles = subtitlesJson as SubtitleCue[];
const TITLES = ["Kim hal qiladi?", "Bitta admin", "Xavfsiz emas", "So'rov", "Ikkinchi admin", "O'zingiz emas", "Ko'rganingiz", "Muddat"];
const catalog = localizeCatalog(ACQUIRING_NODES, UZ);
const uzSteps = localizeSteps(steps, UZ);

const T201FourEyesUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · CHUQUR 01"
    stepLabel="QADAM"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Nazorat", value: "To'rt ko'z" }}
  >
    <ArchDiagram catalog={catalog} steps={uzSteps} />
  </ReelScaffold>
);

export const T201FourEyesUzComposition = createReelComposition({
  id: "t2-01-four-eyes-uz",
  component: T201FourEyesUz,
  subtitles,
});
