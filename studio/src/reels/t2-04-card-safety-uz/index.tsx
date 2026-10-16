import React from "react";
import { ArchDiagram, localizeCatalog, localizeSteps, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import { UZ } from "../../series/acquiring/uz";
import { acts, steps } from "../t2-04-card-safety/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek T2-4: same steps as English, Uzbek text, self-voiced (timings from `manage_reels.py draft`).
const subtitles = subtitlesJson as SubtitleCue[];
const TITLES = ["Karta xavfsizmi?", "Do'kon yig'adi", "PCI DSS", "Hosted sahifa", "Token", "Ochish", "OTP", "Cheklov"];
const catalog = localizeCatalog(ACQUIRING_NODES, UZ);
const uzSteps = localizeSteps(steps, UZ);

const T204CardSafetyUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · CHUQUR 04"
    stepLabel="QADAM"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Karta ma'lumoti", value: "PCI DSS" }}
  >
    <ArchDiagram catalog={catalog} steps={uzSteps} />
  </ReelScaffold>
);

export const T204CardSafetyUzComposition = createReelComposition({
  id: "t2-04-card-safety-uz",
  component: T204CardSafetyUz,
  subtitles,
});
