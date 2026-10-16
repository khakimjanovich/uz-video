import React from "react";
import { ArchDiagram, localizeCatalog, localizeSteps, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import { UZ } from "../../series/acquiring/uz";
import { acts, steps } from "../ep04-debit/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek Part 4: same steps as English, Uzbek text, self-voiced (timings from `manage_reels.py draft`).
const subtitles = subtitlesJson as SubtitleCue[];
const TITLES = ["Karta?", "Bank sahifasi", "SMS kod", "Pul yechish", "Yakunlandi", "Keyingi: status"];
const catalog = localizeCatalog(ACQUIRING_NODES, UZ);
const uzSteps = localizeSteps(steps, UZ);

const Ep04DebitUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · 04-QISM"
    stepLabel="QADAM"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Karta ma'lumoti", value: "Faqat bankda" }}
  >
    <ArchDiagram catalog={catalog} steps={uzSteps} />
  </ReelScaffold>
);

export const Ep04DebitUzComposition = createReelComposition({
  id: "ep04-debit-uz",
  component: Ep04DebitUz,
  subtitles,
});
