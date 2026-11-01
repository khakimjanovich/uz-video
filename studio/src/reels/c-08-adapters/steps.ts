import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 8: unknown is never declined. Thursday's silent centre (0–5), the bridge (6–7), the centres (8–12),
// one adapter per centre (13–21), three outcomes (22–28), Timur's rule and our own payment id (29–36),
// what the buyer saw (37–46), the alert (47–49), a new network (50–51), paid once (52), next (53).
const SALE = { buyer: [0.5, 1], shop: [2.5, 1] } as const;
const SALE_EDGE = [{ from: "buyer", to: "shop" }] as const;
const QUIET = { m2AdapterA: [0, 1], m2CentreA: [1.5, 1], issuer: [3, 1] } as const;
const QUIET_EDGES = [{ from: "m2AdapterA", to: "m2CentreA", broken: true }, { from: "m2CentreA", to: "issuer" }] as const;

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
const ALERT_EDGES = [{ from: "m2AdapterA", to: "m2CentreA", broken: true }, { from: "m2Alert", to: "m2Team" }] as const;

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
  // Thursday, six in the evening: the bank says yes, the centre goes silent.
  { cue: 0, layout: SALE, edges: [...SALE_EDGE], badges: { shop: "Thu 18:00" } },
  { cue: 1, layout: SALE, edges: [...SALE_EDGE], packets: [{ from: "buyer", to: "shop", label: "roses · Pay" }] },
  { cue: 2, layout: QUIET, edges: [{ from: "m2AdapterA", to: "m2CentreA" }, { from: "m2CentreA", to: "issuer" }], packets: [{ from: "issuer", to: "m2CentreA", label: "yes" }], badges: { issuer: "yes" } },
  {
    cue: 3,
    layout: QUIET,
    edges: [...QUIET_EDGES],
    packets: [{ from: "m2CentreA", to: "m2AdapterA", label: "yes", stopAt: 0.5 }],
    danger: ["m2CentreA"],
    badges: { m2CentreA: "silent 40s" },
  },
  { cue: 4, layout: QUIET, edges: [...QUIET_EDGES], badges: { m2AdapterA: "what now?" } },
  { cue: 5, layout: ONE, edges: [...ONE_EDGES], accent: ["card"], badges: { card: "Timur's rule" } },
  // The centres, each its own language.
  {
    cue: 8,
    layout: { card: [0, 1], m2CentreA: [3, 0.2], m2CentreB: [3, 1.8] },
    edges: [{ from: "card", to: "m2CentreA", label: "language A" }, { from: "card", to: "m2CentreB", label: "language B" }],
  },
  { cue: 9, layout: CENTRES, badges: { m2CentreA: "own protocol" } },
  { cue: 10, layout: CENTRES, badges: { m2CentreA: "own field names", m2CentreB: "own error codes", m2CentreC: "own 'yes'" } },
  {
    cue: 11,
    layout: { card: [0, 1], m2CentreA: [3, 0], m2CentreB: [3, 1], m2CentreC: [3, 2] },
    edges: [{ from: "card", to: "m2CentreA" }, { from: "card", to: "m2CentreB" }, { from: "card", to: "m2CentreC" }],
    danger: ["card"],
    badges: { card: "changes every time" },
  },
  {
    cue: 12,
    layout: { card: [0, 1], m2CentreA: [3, 0], m2CentreB: [3, 1], m2CentreC: [3, 2] },
    edges: [{ from: "card", to: "m2CentreA" }, { from: "card", to: "m2CentreB" }, { from: "card", to: "m2CentreC" }],
    badges: { card: "change rarely" },
  },
  // One adapter per centre.
  { cue: 13, ...A, accent: ["m2AdapterA", "m2AdapterB"] },
  { cue: 14, ...A, badges: { m2AdapterA: "small, separate" } },
  { cue: 15, ...A, packets: [{ from: "m2AdapterA", to: "m2CentreA", label: "A's words" }, { from: "m2AdapterB", to: "m2CentreB", label: "B's words", delay: 30 }] },
  { cue: 16, ...A, packets: [{ from: "card", to: "m2AdapterA", label: "plain" }, { from: "card", to: "m2AdapterB", label: "plain", delay: 30 }] },
  { cue: 17, ...AZ, badges: { card: "three requests" } },
  { cue: 18, ...AZ, packets: [{ from: "card", to: "m2AdapterA", label: "charge" }] },
  { cue: 19, ...AZ, packets: [{ from: "card", to: "m2AdapterB", label: "give back" }] },
  { cue: 20, ...AZ, packets: [{ from: "card", to: "m2AdapterA", label: "what happened?" }] },
  { cue: 21, ...AZ, badges: { card: "which centre? never" } },
  // Three outcomes.
  {
    cue: 22,
    layout: { m2AdapterA: [0, 1], m2CentreA: [3, 1] },
    edges: [{ from: "m2AdapterA", to: "m2CentreA" }],
    packets: [{ from: "m2CentreA", to: "m2AdapterA", label: "an answer" }],
  },
  {
    cue: 23,
    layout: { m2AdapterA: [0, 1], m2CentreA: [3, 1] },
    edges: [{ from: "m2AdapterA", to: "m2CentreA" }],
    packets: ["00", "OK", "yes", "05", "no", "E-17"].map((label, i) => ({ from: "m2CentreA" as const, to: "m2AdapterA" as const, label, delay: i * 15 })),
    badges: { m2CentreA: "hundreds of ways" },
  },
  { cue: 24, ...O, accent: ["m2Approved"], badges: { m2Approved: "money moved" } },
  { cue: 25, ...O, accent: ["m2Declined"], badges: { m2Declined: "no money moved" } },
  { cue: 26, ...O, accent: ["m2Unknown"], badges: { m2Unknown: "not known yet" } },
  { cue: 27, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "m2AdapterA", to: "m2CentreA", label: "charge", stopAt: 0.6 }], badges: { m2AdapterA: "timeout = unknown" } },
  { cue: 28, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "m2CentreA", to: "m2AdapterA", label: "#%&?" }], badges: { m2AdapterA: "unreadable = unknown" } },
  // Timur's rule: unknown is never declined.
  { cue: 29, ...O, crossed: ["m2Declined"], accent: ["m2Unknown"], badges: { m2Unknown: "never declined" } },
  { cue: 30, ...O, danger: ["m2Declined"], badges: { m2Declined: "simpler" } },
  {
    cue: 31,
    layout: LOST,
    edges: [...LOST_EDGES],
    packets: [{ from: "issuer", to: "m2CentreA", label: "yes" }, { from: "m2CentreA", to: "m2AdapterA", label: "yes", delay: 50, stopAt: 0.5 }],
    badges: { buyer: "told: failed" },
  },
  { cue: 32, layout: LOST, edges: [...LOST_EDGES], danger: ["buyer"], badges: { buyer: "pays twice" } },
  {
    cue: 33,
    layout: ONE,
    edges: [...ONE_EDGES],
    packets: [{ from: "card", to: "m2AdapterA", label: "charge · our id" }, { from: "m2AdapterA", to: "m2CentreA", label: "charge · our id", delay: 45 }],
    badges: { m2CentreA: "keeps our id" },
  },
  { cue: 34, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "card", to: "m2CentreA", label: "what happened to id?" }] },
  { cue: 35, layout: ONE, edges: [...ONE_EDGES], badges: { card: "moves no money" } },
  { cue: 36, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "m2CentreA", to: "card", label: "it happened" }], badges: { card: "reads only" } },
  // Behind "Taking the payment".
  { cue: 40, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "card", to: "m2AdapterA", label: "charge" }, { from: "m2AdapterA", to: "m2CentreA", label: "charge", delay: 45 }] },
  // The result follows, asked by the payment id.
  { cue: 46, layout: ONE, edges: [...ONE_EDGES], packets: [{ from: "card", to: "m2CentreA", label: "this id?" }, { from: "m2CentreA", to: "card", label: "approved", delay: 60 }] },
  // Timur's alert.
  { cue: 47, layout: ALERT, edges: [...ALERT_EDGES], packets: [{ from: "m2Alert", to: "m2Team", label: "alert" }], badges: { m2Team: "Timur" } },
  { cue: 48, layout: ALERT, edges: [...ALERT_EDGES], danger: ["m2AdapterA"], badges: { m2AdapterA: "can't reach" } },
  { cue: 49, layout: ALERT, edges: [...ALERT_EDGES], badges: { m2Alert: "fail or unknown" } },
  // A new network: one more adapter.
  { cue: 50, layout: THREE, edges: [...THREE_EDGES], accent: ["m2AdapterC", "m2CentreC"], badges: { m2CentreC: "new network" } },
  { cue: 51, layout: THREE, edges: [...THREE_EDGES], accent: ["m2AdapterC"], badges: { card: "unchanged" } },
  // Paid exactly once.
  { cue: 52, layout: SALE, edges: [...SALE_EDGE], accent: ["buyer"], badges: { buyer: "paid once" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the one before.
  { cue: 6, part: 3, current: ["payment", "card"], units: { cards: "agreed to charge" } },
  { cue: 7, part: 3, current: ["card", "adapters", "procsvc"], units: { cards: "adapters" } },
  { cue: 53, part: 3, current: ["card", "cardsinfra"], units: { cards: "keep it safe" } },
];

// The pay page while the adapter talks to its centre, and the three outcomes as the buyer reads them.
const STATUS = [480, 260, 480, 300] as const;
const TITLE = [560, 398, 320, 34] as const;
const TEXT = [500, 440, 440, 26] as const;
export const screens: ScreenStep[] = [
  {
    cue: 37,
    src: "screens/c-08-adapters/debiting.png",
    title: "Payment page · taking the payment",
    region: [...STATUS],
    beats: [
      { cue: 38, region: [...STATUS], focus: [[...TITLE]] },
      { cue: 39, region: [...STATUS], focus: [[...TEXT]] },
    ],
  },
  { cue: 41, src: "screens/c-08-adapters/paid.png", title: "Payment page · paid", region: [...STATUS], beats: [{ cue: 42, region: [...STATUS], focus: [[500, 446, 440, 48]] }] },
  { cue: 43, src: "screens/c-08-adapters/declined.png", title: "Payment page · declined", region: [...STATUS], focus: [[...TITLE], [...TEXT]] },
  {
    cue: 44,
    src: "screens/c-08-adapters/unknown.png",
    title: "Payment page · confirming",
    region: [...STATUS],
    beats: [{ cue: 45, region: [...STATUS], focus: [[...TITLE], [...TEXT]] }],
  },
];
