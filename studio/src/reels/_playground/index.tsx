import React from "react";
import { ArchDiagram, DiagramStep, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES, AcquiringNodeId } from "../../series/acquiring/nodes";

// Studio-only sandbox for the diagram primitives: fake 3s cues, no voiceover.
// manage_reels.py skips folders starting with "_".
const cue = (i: number, text: string): SubtitleCue => ({
  index: i + 1,
  startFrame: i * 90,
  endFrame: (i + 1) * 90,
  text,
});

const subtitles: SubtitleCue[] = [
  cue(0, "Hook: xaridor do'kondan to'laydi."),
  cue(1, "Naive v1: do'kon to'g'ridan-to'g'ri bankka boradi."),
  cue(2, "Break: tarmoq uziladi, pul qayerda?"),
  cue(3, "Scaled v2: o'rtaga Gateway qo'yamiz."),
  cue(4, "Gateway do'konga darhol webhook yuboradi."),
  cue(5, "Handoff: lekin pul do'konga faqat T+1 da tushadi."),
];

const steps: DiagramStep<AcquiringNodeId>[] = [
  {
    cue: 0,
    layout: { buyer: [1, 0], merchant: [1, 2] },
    edges: [{ from: "buyer", to: "merchant" }],
    packets: [{ from: "buyer", to: "merchant", label: "💳 8600 ••••" }],
  },
  {
    cue: 1,
    layout: { buyer: [1, 0], merchant: [1, 2], bank: [1, 4] },
    edges: [{ from: "buyer", to: "merchant" }, { from: "merchant", to: "bank" }],
    packets: [{ from: "merchant", to: "bank", label: "💳 raw card" }],
  },
  {
    cue: 2,
    layout: { buyer: [1, 0], merchant: [1, 2], bank: [1, 4] },
    edges: [{ from: "buyer", to: "merchant" }, { from: "merchant", to: "bank", label: "timeout", broken: true }],
    packets: [{ from: "merchant", to: "bank", label: "⏳ 50 000 so'm", stopAt: 0.45 }],
    danger: ["merchant"],
    crossed: ["merchant"],
  },
  {
    cue: 3,
    layout: { buyer: [1, 0], gateway: [1, 2], merchant: [0, 4], bank: [2, 4] },
    edges: [
      { from: "buyer", to: "gateway" },
      { from: "gateway", to: "bank", label: "auth" },
    ],
    packets: [{ from: "buyer", to: "gateway", label: "💳 card" }],
    accent: ["gateway"],
  },
  {
    cue: 4,
    layout: { buyer: [1, 0], gateway: [1, 2], merchant: [0, 4], bank: [2, 4] },
    edges: [
      { from: "buyer", to: "gateway" },
      { from: "gateway", to: "bank", label: "auth" },
      { from: "gateway", to: "merchant", label: "webhook" },
    ],
    packets: [{ from: "gateway", to: "merchant", label: "✅ paid", delay: 25 }],
    accent: ["gateway"],
    badges: { merchant: "200 OK" },
  },
  {
    cue: 5,
    layout: { buyer: [1, 0], gateway: [1, 2], merchant: [0, 4], bank: [2, 4] },
    edges: [
      { from: "buyer", to: "gateway" },
      { from: "gateway", to: "bank", label: "auth" },
      { from: "gateway", to: "merchant", label: "webhook" },
    ],
    danger: ["bank"],
    badges: { bank: "T+1" },
  },
];

const Playground: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    subtitles={subtitles}
    acts={{ hook: 0, v1: 1, break: 2, v2: 3, handoff: 5 }}
    badgeText="Playground"
    title="Diagram primitives"
    lawCitation="Studio-only sandbox"
  >
    <ArchDiagram catalog={ACQUIRING_NODES} steps={steps} />
  </ReelScaffold>
);

export const PlaygroundComposition = createReelComposition({
  id: "Playground",
  component: Playground,
  subtitles,
});
