import React from "react";
import { ArchDiagram, localizeCatalog, localizeSteps, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import { UZ } from "../../series/acquiring/uz";
import { acts, steps } from "../ep06-links/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek Part 6: same steps as English, Uzbek text, self-voiced (timings from `manage_reels.py draft`).
const subtitles = subtitlesJson as SubtitleCue[];
const TITLES = ["Sayt yo'qmi?", "Havola yaratish", "Yuborish", "Ochish", "Odatiy to'lov", "Bir martalik", "Keyingi: pul"];
const catalog = localizeCatalog(ACQUIRING_NODES, UZ);
const uzSteps = localizeSteps(steps, UZ);

const Ep06LinksUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · 06-QISM"
    stepLabel="QADAM"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Havola", value: "Bir martalik" }}
  >
    <ArchDiagram catalog={catalog} steps={uzSteps} />
  </ReelScaffold>
);

export const Ep06LinksUzComposition = createReelComposition({
  id: "ep06-links-uz",
  component: Ep06LinksUz,
  subtitles,
});
