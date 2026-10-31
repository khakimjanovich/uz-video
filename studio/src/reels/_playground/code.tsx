import React from "react";
import { CodeCard, CodeStep, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";

// Studio-only sandbox for the code card (16:9): real line numbers, beats that reveal and re-mark lines,
// blurred names, a terminal session and the table variant. Fake 3s cues, no voiceover.
const subtitles: SubtitleCue[] = ["Code lines", "More lines", "Marker moves", "Terminal", "Table"].map((text, i) => ({
  index: i + 1,
  startFrame: i * 90,
  endFrame: (i + 1) * 90,
  text,
}));

const STEPS: CodeStep[] = [
  {
    cue: 0,
    file: "cards-infra/docker-compose.yml",
    at: [157, 166, 182, 188, null, 32, 42],
    lines: [
      "cards-ingress:",
      "  ports: [\"${CARDS_INGRESS_PUBLISH:?…}:8443\"]",
      "cards-partner:",
      "  ports: [\"${CARDS_PARTNER_PUBLISH:?…}:8443\"]",
      "…",
      "postgres:  # Uzcard, Humo blurred here",
      "  # No published port: card data is read through card-vault only.",
    ],
    small: true,
    upTo: 4,
    highlight: [2],
    blur: ["Uzcard", "Humo"],
    beats: [{ cue: 1, upTo: 7, highlight: [2, 4] }, { cue: 2, highlight: [7] }],
  },
  { cue: 3, file: "terminal · cards-infra", lines: ["$ scripts/install.sh check", "…"] },
  {
    cue: 4,
    file: "Who does what",
    table: { columns: ["Product", "The bank", "Shared"], rows: [["Sealed card data", "Physical security", "Key custody"]] },
  },
];

const PlaygroundCode: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold theme={theme} subtitles={subtitles} series="PLAYGROUND" title="Code card" footer={{ label: "Mode", value: "Studio only" }}
    captionStyle={{ left: 1150, right: 84, bottom: 140 }}>
    {({ cueIndex }) => {
      const step = [...STEPS].reverse().find((s) => s.cue <= cueIndex)!;
      return <CodeCard step={step} x={60} y={250} w={1050} h={700} />;
    }}
  </ReelScaffold>
);

export const PlaygroundCodeComposition = createReelComposition({
  id: "PlaygroundCode",
  component: PlaygroundCode,
  subtitles,
  width: 1920,
  height: 1080,
});
