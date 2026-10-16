import React from "react";
import { ArchDiagram, localizeCatalog, localizeSteps, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES } from "../../series/acquiring/nodes";
import { UZ } from "../../series/acquiring/uz";
import { acts, steps } from "../ep01-gateway/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek version of Part 1: same diagram steps, Uzbek text, no TTS (self-voiced; timings from `manage_reels.py draft`).
const subtitles = subtitlesJson as SubtitleCue[];
const TITLES = ["Onlayn karta?", "Qonun", "Ekvayer", "To'lov", "Pul tushishi", "Tekshiruv?"];
const catalog = localizeCatalog(ACQUIRING_NODES, UZ);
const uzSteps = localizeSteps(steps, UZ);

const Ep01GatewayUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · 01-QISM"
    stepLabel="QADAM"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Qonun", value: "O'RQ-578" }}
  >
    <ArchDiagram catalog={catalog} steps={uzSteps} />
  </ReelScaffold>
);

export const Ep01GatewayUzComposition = createReelComposition({
  id: "ep01-gateway-uz",
  component: Ep01GatewayUz,
  subtitles,
});
