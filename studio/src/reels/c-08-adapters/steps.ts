import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 8: one plug for every socket. Different languages (0), the travel adapter (1–2), the centres (3),
// one adapter per centre (4–6), three outcomes and the timeout (7–9), a new centre (10), the close (11).
const PLUGS = { m2Laptop: [0, 1], m2PlugA: [1.5, 0.2], m2PlugB: [1.5, 1.8], m2SocketA: [3, 0.2], m2SocketB: [3, 1.8] } as const;
const PLUG_EDGES = [
  { from: "m2Laptop", to: "m2PlugA" },
  { from: "m2Laptop", to: "m2PlugB" },
  { from: "m2PlugA", to: "m2SocketA" },
  { from: "m2PlugB", to: "m2SocketB" },
] as const;

const ADAPTERS = { card: [0, 1], m2AdapterA: [1.5, 0.2], m2AdapterB: [1.5, 1.8], m2CentreA: [3, 0.2], m2CentreB: [3, 1.8] } as const;
const ADAPTER_EDGES = [
  { from: "card", to: "m2AdapterA", label: "plain" },
  { from: "card", to: "m2AdapterB", label: "plain" },
  { from: "m2AdapterA", to: "m2CentreA", label: "A's language" },
  { from: "m2AdapterB", to: "m2CentreB", label: "B's language" },
] as const;
const ZONE = { label: "Card zone", from: [0, 0.2], to: [1.5, 1.8], tone: "wall" } as const;

const OUTCOMES = { m2AdapterA: [0, 1], m2Approved: [2.4, 0], m2Declined: [2.4, 1], m2Unknown: [2.4, 2] } as const;
const OUTCOME_EDGES = [
  { from: "m2AdapterA", to: "m2Approved" },
  { from: "m2AdapterA", to: "m2Declined" },
  { from: "m2AdapterA", to: "m2Unknown" },
] as const;

const ONE = { card: [0, 1], m2AdapterA: [1.5, 1], m2CentreA: [3, 1] } as const;
const ONE_EDGES = [{ from: "card", to: "m2AdapterA" }, { from: "m2AdapterA", to: "m2CentreA" }] as const;

const THREE = { card: [0, 1], m2AdapterA: [1.5, 0], m2AdapterB: [1.5, 1], m2AdapterC: [1.5, 2], m2CentreA: [3, 0], m2CentreB: [3, 1], m2CentreC: [3, 2] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Each centre speaks its own language.
  {
    cue: 0,
    layout: { card: [0, 1], m2CentreA: [3, 0.2], m2CentreB: [3, 1.8] },
    edges: [{ from: "card", to: "m2CentreA", label: "language A" }, { from: "card", to: "m2CentreB", label: "language B" }],
  },
  // The travel adapter.
  { cue: 1, layout: { m2Laptop: [0, 1], m2PlugA: [1.5, 1], m2SocketA: [3, 1] }, edges: [{ from: "m2Laptop", to: "m2PlugA" }, { from: "m2PlugA", to: "m2SocketA" }] },
  { cue: 2, layout: PLUGS, edges: [...PLUG_EDGES], accent: ["m2Laptop"], badges: { m2Laptop: "never changes" } },
  {
    cue: 3,
    layout: { m2CentreA: [0.5, 0.2], m2CentreB: [0.5, 1.8], m2CentreC: [2.6, 1] },
    badges: { m2CentreA: "own protocol", m2CentreB: "own error codes", m2CentreC: "own 'yes'" },
  },
  // One adapter per centre.
  { cue: 4, layout: ADAPTERS, edges: [...ADAPTER_EDGES], accent: ["m2AdapterA", "m2AdapterB"] },
  { cue: 5, layout: ADAPTERS, edges: [...ADAPTER_EDGES], frames: [ZONE], badges: { card: "one plug shape" } },
  {
    cue: 6,
    layout: ADAPTERS,
    edges: [...ADAPTER_EDGES],
    frames: [ZONE],
    packets: [
      { from: "card", to: "m2AdapterA", label: "charge" },
      { from: "card", to: "m2AdapterB", label: "refund", delay: 40 },
      { from: "card", to: "m2AdapterA", label: "status?", delay: 60 },
    ],
  },
  // Three outcomes; a timeout is unknown.
  { cue: 7, layout: OUTCOMES, edges: [...OUTCOME_EDGES], accent: ["m2Approved", "m2Declined", "m2Unknown"] },
  {
    cue: 8,
    layout: ONE,
    edges: [...ONE_EDGES],
    packets: [{ from: "m2AdapterA", to: "m2CentreA", label: "charge", stopAt: 0.6 }],
    badges: { card: "unknown, not declined" },
  },
  {
    cue: 9,
    layout: ONE,
    edges: [...ONE_EDGES],
    packets: [{ from: "m2AdapterA", to: "m2CentreA", label: "our payment id" }, { from: "m2CentreA", to: "m2AdapterA", label: "it happened", delay: 70 }],
  },
  // A new centre: a new adapter, nothing else.
  {
    cue: 10,
    layout: THREE,
    edges: [
      { from: "card", to: "m2AdapterA" },
      { from: "card", to: "m2AdapterB" },
      { from: "card", to: "m2AdapterC" },
      { from: "m2AdapterA", to: "m2CentreA" },
      { from: "m2AdapterB", to: "m2CentreB" },
      { from: "m2AdapterC", to: "m2CentreC" },
    ],
    accent: ["m2AdapterC"],
    badges: { card: "unchanged" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 11, part: 2, current: ["adapters", "procsvc"], units: { cards: "one per centre" } },
];
