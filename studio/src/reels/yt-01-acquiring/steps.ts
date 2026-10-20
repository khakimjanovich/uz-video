import { BuildMapStep, DiagramStep } from "../../components";
import { BUILD_PARTS } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 01: the acquiring vocabulary, traced on one payment.
export const map: BuildMapStep[] = [
  { cue: 0, part: 0, current: BUILD_PARTS[0].nodes },
  { cue: 10, part: 0, current: BUILD_PARTS[0].nodes },
];

const ROW = { shop: [0, 1], acquirer: [1, 1], processing: [2, 1], issuer: [3, 1] } as const;
const PLAYERS = { buyer: [0, 0], ...ROW } as const;
const CHAIN = [
  { from: "shop", to: "acquirer" },
  { from: "acquirer", to: "processing" },
  { from: "processing", to: "issuer" },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { ...PLAYERS }, edges: [{ from: "buyer", to: "shop", label: "pays" }, ...CHAIN] },
  {
    cue: 2,
    layout: { ...PLAYERS },
    edges: [{ from: "buyer", to: "shop" }, ...CHAIN],
    accent: ["acquirer"],
    badges: { acquirer: "we build this", issuer: "card's bank" },
  },
  {
    cue: 3,
    layout: { ...PLAYERS, tid: [1, 0] },
    edges: [{ from: "buyer", to: "shop" }, ...CHAIN, { from: "tid", to: "acquirer" }],
    accent: ["tid"],
    badges: { tid: "per website + scheme" },
  },
  {
    cue: 4,
    layout: { ...PLAYERS, tid: [1, 0] },
    edges: [{ from: "buyer", to: "shop" }, ...CHAIN, { from: "tid", to: "acquirer" }],
    packets: [
      { from: "acquirer", to: "processing", label: "authorize", delay: 10, duration: 25 },
      { from: "processing", to: "issuer", label: "authorize", delay: 38, duration: 25 },
    ],
  },
  {
    cue: 5,
    layout: { ...PLAYERS, tid: [1, 0] },
    edges: [{ from: "buyer", to: "shop" }, ...CHAIN, { from: "tid", to: "acquirer" }],
    accent: ["issuer"],
    badges: { issuer: "debit, or hold" },
  },
  {
    cue: 6,
    layout: { ...PLAYERS, tid: [1, 0] },
    edges: [{ from: "buyer", to: "shop" }, ...CHAIN, { from: "tid", to: "acquirer" }],
    packets: [
      { from: "acquirer", to: "processing", label: "capture the hold", delay: 10, duration: 25 },
      { from: "processing", to: "issuer", label: "capture", delay: 38, duration: 25 },
    ],
    badges: { issuer: "final" },
  },
  {
    cue: 7,
    layout: { ...PLAYERS, tid: [1, 0] },
    edges: [{ from: "buyer", to: "shop" }, ...CHAIN, { from: "tid", to: "acquirer" }],
    packets: [
      { from: "acquirer", to: "processing", label: "reversal", delay: 10, duration: 25 },
      { from: "acquirer", to: "processing", label: "refund", delay: 55, duration: 25 },
    ],
    badges: { acquirer: "before · after settlement" },
  },
  {
    cue: 8,
    layout: { ...ROW },
    edges: [...CHAIN],
    packets: [
      { from: "issuer", to: "processing", label: "settlement", delay: 10, duration: 25 },
      { from: "processing", to: "acquirer", label: "settlement", delay: 38, duration: 25 },
    ],
    accent: ["acquirer"],
  },
  {
    cue: 9,
    layout: { acquirer: [1, 0], feeacc: [0, 2], wallet: [2, 2] },
    edges: [
      { from: "acquirer", to: "feeacc", label: "commission" },
      { from: "acquirer", to: "wallet", label: "rest" },
    ],
    packets: [
      { from: "acquirer", to: "feeacc", label: "1 500", delay: 15 },
      { from: "acquirer", to: "wallet", label: "98 500", delay: 40 },
    ],
    badges: { wallet: "next banking day" },
  },
];
