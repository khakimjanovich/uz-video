import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 8: one plug for every socket. The travel plug (0–8), the centres (9–14), one adapter per centre (15–24),
// three outcomes (25–33), the lost yes and our own payment id (34–40), the product (41–54), what it protects (55–60),
// the plug again (61–64), next (65).
const PLUGS = { m2Laptop: [0, 1], m2PlugA: [1.5, 0], m2PlugB: [1.5, 1], m2PlugC: [1.5, 2], m2SocketA: [3, 0], m2SocketB: [3, 1], m2SocketC: [3, 2] } as const;
const PLUG_EDGES = [
  { from: "m2Laptop", to: "m2PlugA" },
  { from: "m2Laptop", to: "m2PlugB" },
  { from: "m2Laptop", to: "m2PlugC" },
  { from: "m2PlugA", to: "m2SocketA" },
  { from: "m2PlugB", to: "m2SocketB" },
  { from: "m2PlugC", to: "m2SocketC" },
] as const;
const FOUR = { m2Laptop: [0, 1.1], m2PlugA: [1.5, 0], m2PlugB: [1.5, 0.73], m2PlugC: [1.5, 1.47], m2PlugD: [1.5, 2.2], m2SocketA: [3, 0], m2SocketB: [3, 0.73], m2SocketC: [3, 1.47], m2SocketD: [3, 2.2] } as const;
const FOUR_EDGES = [...PLUG_EDGES, { from: "m2Laptop", to: "m2PlugD" }, { from: "m2PlugD", to: "m2SocketD" }] as const;

const CENTRES = { m2CentreA: [0.5, 0.2], m2CentreB: [0.5, 1.8], m2CentreC: [2.6, 1] } as const;
const ADAPTERS = { card: [0, 1], m2AdapterA: [1.5, 0.2], m2AdapterB: [1.5, 1.8], m2CentreA: [3, 0.2], m2CentreB: [3, 1.8] } as const;
const ADAPTER_EDGES = [
  { from: "card", to: "m2AdapterA", label: "plain" },
  { from: "card", to: "m2AdapterB", label: "plain" },
  { from: "m2AdapterA", to: "m2CentreA", label: "A's language" },
  { from: "m2AdapterB", to: "m2CentreB", label: "B's language" },
] as const;
const ZONE = { label: "Card zone", from: [0, 0.2], to: [1.5, 1.8], tone: "wall" } as const;
const A = { layout: ADAPTERS, edges: [...ADAPTER_EDGES] };
const AZ = { ...A, frames: [ZONE] };

const OUTCOMES = { m2AdapterA: [0, 1], m2Approved: [2.4, 0], m2Declined: [2.4, 1], m2Unknown: [2.4, 2] } as const;
const OUTCOME_EDGES = [
  { from: "m2AdapterA", to: "m2Approved" },
  { from: "m2AdapterA", to: "m2Declined" },
  { from: "m2AdapterA", to: "m2Unknown" },
] as const;
const O = { layout: OUTCOMES, edges: [...OUTCOME_EDGES] };

const ONE = { card: [0, 1], m2AdapterA: [1.5, 1], m2CentreA: [3, 1] } as const;
const ONE_EDGES = [{ from: "card", to: "m2AdapterA" }, { from: "m2AdapterA", to: "m2CentreA" }] as const;
const LOST = { m2AdapterA: [0, 1], m2CentreA: [1.5, 1], issuer: [3, 1], buyer: [0, 2.2] } as const;
const LOST_EDGES = [{ from: "m2AdapterA", to: "m2CentreA" }, { from: "m2CentreA", to: "issuer" }] as const;
const ALERT = { m2AdapterA: [0, 0.4], m2CentreA: [2.4, 0.4], m2Alert: [0, 1.9], m2Team: [2.4, 1.9] } as const;

const THREE = { card: [0, 1], m2AdapterA: [1.5, 0], m2AdapterB: [1.5, 1], m2AdapterC: [1.5, 2], m2CentreA: [3, 0], m2CentreB: [3, 1], m2CentreC: [3, 2] } as const;
const THREE_EDGES = [
  { from: "card", to: "m2AdapterA" },
  { from: "card", to: "m2AdapterB" },
  { from: "card", to: "m2AdapterC" },
  { from: "m2AdapterA", to: "m2CentreA" },
  { from: "m2AdapterB", to: "m2CentreB" },
  { from: "m2AdapterC", to: "m2CentreC" },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Each centre speaks its own language.
  {
    cue: 0,
    layout: { card: [0, 1], m2CentreA: [3, 0.2], m2CentreB: [3, 1.8] },
    edges: [{ from: "card", to: "m2CentreA", label: "language A" }, { from: "card", to: "m2CentreB", label: "language B" }],
  },
  // The travel adapter.
  { cue: 4, layout: { m2Laptop: [0, 1], m2PlugA: [1.5, 1], m2SocketA: [3, 1] }, edges: [{ from: "m2Laptop", to: "m2PlugA" }, { from: "m2PlugA", to: "m2SocketA" }] },
  { cue: 5, layout: PLUGS, edges: [...PLUG_EDGES], accent: ["m2SocketA", "m2SocketB", "m2SocketC"] },
  { cue: 6, layout: PLUGS, edges: [...PLUG_EDGES], accent: ["m2Laptop"], badges: { m2Laptop: "never changes" } },
  { cue: 7, layout: PLUGS, edges: [...PLUG_EDGES], badges: { m2Laptop: "never rewired" } },
  { cue: 8, layout: PLUGS, edges: [...PLUG_EDGES], accent: ["m2PlugA", "m2PlugB", "m2PlugC"], badges: { m2PlugB: "the right one" } },
  // The centres, each its own language.
  { cue: 11, layout: CENTRES, badges: { m2CentreA: "own protocol" } },
  { cue: 12, layout: CENTRES, badges: { m2CentreA: "own field names", m2CentreB: "own error codes", m2CentreC: "own 'yes'" } },
  {
    cue: 13,
    layout: { card: [0, 1], m2CentreA: [3, 0], m2CentreB: [3, 1], m2CentreC: [3, 2] },
    edges: [{ from: "card", to: "m2CentreA" }, { from: "card", to: "m2CentreB" }, { from: "card", to: "m2CentreC" }],
    danger: ["card"],
    badges: { card: "changes every time" },
  },
  {
    cue: 14,
    layout: { card: [0, 1], m2CentreA: [3, 0], m2CentreB: [3, 1], m2CentreC: [3, 2] },
    edges: [{ from: "card", to: "m2CentreA" }, { from: "card", to: "m2CentreB" }, { from: "card", to: "m2CentreC" }],
    badges: { card: "change rarely" },
  },
  // One adapter per centre.
  { cue: 15, ...A, accent: ["m2AdapterA", "m2AdapterB"] },
  { cue: 16, ...A, badges: { m2AdapterA: "small, separate" } },
  { cue: 17, ...A, packets: [{ from: "m2AdapterA", to: "m2CentreA", label: "A's words" }, { from: "m2AdapterB", to: "m2CentreB", label: "B's words", delay: 30 }] },
  { cue: 18, ...A, packets: [{ from: "card", to: "m2AdapterA", label: "plain" }, { from: "card", to: "m2AdapterB", label: "plain", delay: 30 }] },
  { cue: 19, ...AZ, badges: { card: "one plug shape" } },
  { cue: 20, ...AZ, packets: [{ from: "card", to: "m2AdapterA", label: "charge" }] },
  { cue: 21, ...AZ, packets: [{ from: "card", to: "m2AdapterB", label: "refund" }] },
  { cue: 22, ...AZ, packets: [{ from: "card", to: "m2AdapterA", label: "what happened?" }] },
  { cue: 23, ...AZ, badges: { card: "same questions" } },
  { cue: 24, ...AZ, badges: { card: "which centre? never" } },
  // Three outcomes.
  {
    cue: 25,
    layout: { m2AdapterA: [0, 1], m2CentreA: [3, 1] },
    edges: [{ from: "m2AdapterA", to: "m2CentreA" }],
    packets: [{ from: "m2CentreA", to: "m2AdapterA", label: "an answer" }],
  },
  {
    cue: 26,
    layout: { m2AdapterA: [0, 1], m2CentreA: [3, 1] },
    edges: [{ from: "m2AdapterA", to: "m2CentreA" }],
    packets: ["00", "OK", "yes", "05", "no", "E-17"].map((label, i) => ({ from: "m2CentreA" as const, to: "m2AdapterA" as const, label, delay: i * 15 })),
    badges: { m2CentreA: "hundreds of ways" },
  },
  { cue: 27, ...O, accent: ["m2Approved", "m2Declined", "m2Unknown"] },
  { cue: 28, ...O, accent: ["m2Approved"], badges: { m2Approved: "money moved" } },
  { cue: 29, ...O, accent: ["m2Declined"], badges: { m2Declined: "no money moved" } },
  { cue: 30, ...O, accent: ["m2Unknown"], badges: { m2Unknown: "the honest one" } },
  { cue: 31, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "m2AdapterA", to: "m2CentreA", label: "charge", stopAt: 0.6 }], badges: { m2AdapterA: "timeout = unknown" } },
  { cue: 32, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "m2CentreA", to: "m2AdapterA", label: "#%&?" }], badges: { m2AdapterA: "unreadable = unknown" } },
  { cue: 33, ...O, crossed: ["m2Declined"], badges: { m2Unknown: "never declined" } },
  // The lost yes.
  {
    cue: 34,
    layout: LOST,
    edges: [...LOST_EDGES],
    packets: [{ from: "issuer", to: "m2CentreA", label: "yes" }, { from: "m2CentreA", to: "m2AdapterA", label: "yes", delay: 50, stopAt: 0.5 }],
  },
  { cue: 35, layout: LOST, edges: [...LOST_EDGES], danger: ["buyer"], badges: { buyer: "pays twice" } },
  {
    cue: 36,
    layout: ONE,
    edges: [...ONE_EDGES],
    packets: [{ from: "card", to: "m2AdapterA", label: "charge · our id" }, { from: "m2AdapterA", to: "m2CentreA", label: "charge · our id", delay: 45 }],
  },
  { cue: 37, layout: ONE, edges: [...ONE_EDGES], badges: { m2CentreA: "keeps our id" } },
  { cue: 38, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "card", to: "m2CentreA", label: "what happened to id?" }] },
  { cue: 39, layout: ONE, edges: [...ONE_EDGES], badges: { card: "moves no money" } },
  { cue: 40, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "m2CentreA", to: "card", label: "it happened" }], badges: { card: "reads only" } },
  // Behind "Taking the payment".
  { cue: 45, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "card", to: "m2AdapterA", label: "charge" }, { from: "m2AdapterA", to: "m2CentreA", label: "charge", delay: 45 }] },
  // The result follows, asked by the payment id.
  { cue: 51, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "card", to: "m2CentreA", label: "this id?" }, { from: "m2CentreA", to: "card", label: "approved", delay: 60 }] },
  // The team's alert.
  {
    cue: 52,
    layout: ALERT,
    edges: [{ from: "m2AdapterA", to: "m2CentreA", broken: true }, { from: "m2Alert", to: "m2Team" }],
    packets: [{ from: "m2Alert", to: "m2Team", label: "alert" }],
  },
  { cue: 53, layout: ALERT, edges: [{ from: "m2AdapterA", to: "m2CentreA", broken: true }, { from: "m2Alert", to: "m2Team" }], danger: ["m2AdapterA"], badges: { m2AdapterA: "can't reach" } },
  { cue: 54, layout: ALERT, edges: [{ from: "m2AdapterA", to: "m2CentreA", broken: true }, { from: "m2Alert", to: "m2Team" }], badges: { m2Alert: "fail or unknown" } },
  // What it protects.
  { cue: 55, ...AZ, accent: ["m2AdapterA", "m2AdapterB"] },
  {
    cue: 56,
    layout: { card: [0.4, 1], m2CentreA: [2.6, 1] },
    edges: [{ from: "m2CentreA", to: "card" }],
    packets: [{ from: "m2CentreA", to: "card", label: "odd error code" }],
    danger: ["card"],
    badges: { card: "without adapters" },
  },
  { cue: 57, layout: LOST, edges: [...LOST_EDGES], danger: ["buyer"], badges: { buyer: "pays twice" } },
  { cue: 58, ...AZ, badges: { card: "no quirks inside" } },
  { cue: 59, ...O, accent: ["m2Unknown"], badges: { m2Unknown: "protects money" } },
  { cue: 60, layout: THREE, edges: [...THREE_EDGES], accent: ["m2AdapterC"], badges: { card: "unchanged" } },
  // The plug again.
  { cue: 61, layout: PLUGS, edges: [...PLUG_EDGES] },
  { cue: 62, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m2PlugD", "m2SocketD"] },
  { cue: 63, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m2Laptop"], badges: { m2Laptop: "exactly the same" } },
  { cue: 64, ...O, accent: ["m2Unknown"], badges: { m2Unknown: "silence is never no" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 3, current: ["payment", "card"] },
  { cue: 2, part: 3, current: ["procsvc"] },
  { cue: 3, part: 3, current: ["adapters", "procsvc"] },
  { cue: 9, part: 3, current: ["card"], units: { cards: "card zone" } },
  { cue: 10, part: 3, current: ["card", "adapters", "procsvc"], units: { cards: "adapters" } },
  { cue: 65, part: 3, current: ["card", "cardsinfra"], units: { cards: "keep it safe" } },
];

// The pay page while the adapter talks to its centre, and the three outcomes as the buyer reads them.
const STATUS = [480, 260, 480, 300] as const;
const TITLE = [560, 398, 320, 34] as const;
const TEXT = [500, 440, 440, 26] as const;
export const screens: ScreenStep[] = [
  {
    cue: 41,
    src: "screens/c-08-adapters/debiting.png",
    title: "Payment page · taking the payment",
    region: [...STATUS],
    beats: [
      { cue: 43, region: [...STATUS], focus: [[...TITLE]] },
      { cue: 44, region: [...STATUS], focus: [[...TEXT]] },
    ],
  },
  { cue: 46, src: "screens/c-08-adapters/paid.png", title: "Payment page · paid", region: [...STATUS], beats: [{ cue: 47, region: [...STATUS], focus: [[500, 446, 440, 48]] }] },
  { cue: 48, src: "screens/c-08-adapters/declined.png", title: "Payment page · declined", region: [...STATUS], focus: [[...TITLE], [...TEXT]] },
  {
    cue: 49,
    src: "screens/c-08-adapters/unknown.png",
    title: "Payment page · confirming",
    region: [...STATUS],
    beats: [{ cue: 50, region: [...STATUS], focus: [[...TITLE], [...TEXT]] }],
  },
];
