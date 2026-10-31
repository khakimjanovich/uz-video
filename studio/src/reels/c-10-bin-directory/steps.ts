import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 10: what the first digits tell you. Which network (0), the phone code (1), the BIN (2),
// the lists copied in and kept (3–5), longest prefix (6), checked before any code (7–8), eight digits only (9), the close (10).
const LISTS = { m2NetworkA: [0, 0.2], m2NetworkB: [0, 1.8], m2Bin: [2.6, 1] } as const;
const LIST_EDGES = [{ from: "m2NetworkA", to: "m2Bin" }, { from: "m2NetworkB", to: "m2Bin" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Which network?
  {
    cue: 0,
    layout: { m2Card: [0, 1], m2NetworkA: [3, 0.2], m2NetworkB: [3, 1.8] },
    edges: [{ from: "m2Card", to: "m2NetworkA", label: "?" }, { from: "m2Card", to: "m2NetworkB", label: "?" }],
  },
  // The phone code.
  { cue: 1, layout: { m2Phone: [0.5, 1], m2Country: [2.6, 1] }, edges: [{ from: "m2Phone", to: "m2Country", label: "first digits" }] },
  // The BIN.
  {
    cue: 2,
    layout: { m2Card: [0, 1], network: [2.8, 0.2], issuer: [2.8, 1.8] },
    edges: [{ from: "m2Card", to: "network", label: "BIN" }, { from: "m2Card", to: "issuer", label: "BIN" }],
    badges: { m2Card: "first digits" },
  },
  // The lists, copied in and kept.
  { cue: 3, layout: { m2NetworkA: [0.5, 1], m2NetworkB: [2.6, 1] }, badges: { m2NetworkA: "its BIN list", m2NetworkB: "its BIN list" } },
  {
    cue: 4,
    layout: LISTS,
    edges: [...LIST_EDGES],
    packets: [{ from: "m2NetworkA", to: "m2Bin", label: "list" }, { from: "m2NetworkB", to: "m2Bin", label: "list", delay: 40 }],
    accent: ["m2Bin"],
    badges: { m2Bin: "on a schedule" },
  },
  {
    cue: 5,
    layout: LISTS,
    edges: [{ from: "m2NetworkA", to: "m2Bin" }, { from: "m2NetworkB", to: "m2Bin", broken: true }],
    danger: ["m2NetworkB"],
    badges: { m2Bin: "keeps the old list" },
  },
  // Longest prefix wins.
  {
    cue: 6,
    layout: { m2Card: [0, 1], m2Short: [2.6, 0.2], m2Long: [2.6, 1.8] },
    edges: [{ from: "m2Card", to: "m2Short" }, { from: "m2Card", to: "m2Long" }],
    accent: ["m2Long"],
    badges: { m2Long: "longest wins" },
  },
  // Refused early, nobody bothered.
  {
    cue: 8,
    layout: { m2Card: [0, 1], m2Bin: [1.5, 1], network: [3, 1] },
    edges: [{ from: "m2Card", to: "m2Bin" }, { from: "m2Bin", to: "network", broken: true }],
    packets: [{ from: "m2Card", to: "m2Bin", label: "check" }],
    badges: { m2Bin: "not accepted", network: "not bothered" },
  },
  // Only the first eight digits.
  {
    cue: 9,
    layout: { m2First8: [0.5, 1], m2Bin: [2.6, 1] },
    edges: [{ from: "m2First8", to: "m2Bin" }],
    packets: [{ from: "m2First8", to: "m2Bin", label: "12345678" }],
    badges: { m2Bin: "never the whole" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 7, part: 2, current: ["frame", "bin"], units: { cards: "check first" } },
  { cue: 10, part: 2, current: ["frame"], units: { cards: "card form" } },
];
