import React from "react";
import { BuildMap, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import subtitlesJson from "./subtitles.json";
import { steps } from "./steps";

// Series B, episode 00 (YouTube 16:9): the build map that every later episode returns to.
const subtitles = subtitlesJson as SubtitleCue[];

const TITLES = [
  "Build it yourself",
  "The map",
  "Users + one app",
  "Partner",
  "Commission",
  "Terminal",
  "Card vault",
  "Payment",
  "Two ports",
  "Infrastructure",
  "Part 0 · Foundations",
  "Part 1 · Merchants",
  "Part 2 · Money rules",
  "Part 3 · Cards",
  "Part 4 · Payments",
  "Part 5 · Growing up",
  "Next: setup",
];

const Yt00Map: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="yt-00-map"
    subtitles={subtitles}
    series="Build an acquiring system · Episode 00"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Series B", value: "The map" }}
    captionStyle={{ left: 1150, right: 84, bottom: 140 }}
  >
    <BuildMap steps={steps} x={70} y={238} scale={1.42} panelX={1150} />
  </ReelScaffold>
);

export const Yt00MapComposition = createReelComposition({
  id: "yt-00-map",
  component: Yt00Map,
  subtitles,
  width: 1920,
  height: 1080,
});
