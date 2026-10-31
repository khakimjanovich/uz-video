import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 34: reconciliation. The statement (cues 0–1), both sides (2–4), pairs and breaks (5–6),
// the exception and who decides (7–9), the close (10).
const SIDES = { m78Ours: [0, 1], m78Pair: [1.5, 1], m78Theirs: [3, 1] } as const;
const SIDE_EDGES = [{ from: "m78Ours", to: "m78Pair" }, { from: "m78Theirs", to: "m78Pair" }] as const;
const DECIDE = { admin: [0, 1], m78Exception: [1.5, 1], checker: [3, 1] } as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 7, current: ["reconciliation", "procsvc"] },
  { cue: 10, part: 7, current: ["payment"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The statement.
  {
    cue: 1,
    layout: { m78Statement: [0.4, 1], m78Records: [2.6, 1] },
    edges: [{ from: "m78Statement", to: "m78Records", label: "tick" }],
    badges: { m78Statement: "ticked", m78Records: "1 circled" },
  },
  // Both sides, every day, per card network.
  {
    cue: 2,
    layout: { reconciliation: [0.4, 1], network: [2.6, 1] },
    edges: [{ from: "reconciliation", to: "network", label: "each network" }],
    badges: { reconciliation: "every day" },
    accent: ["reconciliation"],
  },
  { cue: 3, layout: { m78Ours: [0, 1], reconciliation: [1.5, 1] }, edges: [{ from: "m78Ours", to: "reconciliation" }], accent: ["m78Ours"] },
  {
    cue: 4,
    layout: { m78Ours: [0, 1], reconciliation: [1.5, 1], m78Theirs: [3, 1] },
    edges: [{ from: "m78Ours", to: "reconciliation" }, { from: "m78Theirs", to: "reconciliation" }],
    badges: { m78Theirs: "masked numbers only" },
    accent: ["m78Theirs"],
  },
  // Pairs and breaks.
  { cue: 5, layout: SIDES, edges: [...SIDE_EDGES], badges: { m78Pair: "must agree" }, accent: ["m78Pair"] },
  { cue: 6, layout: SIDES, edges: [...SIDE_EDGES], badges: { m78Pair: "break" }, danger: ["m78Pair"] },
  // The exception: an owner, a deadline, and someone else decides.
  {
    cue: 7,
    layout: { m78Pair: [0, 1], m78Exception: [1.5, 1], admin: [3, 1] },
    edges: [{ from: "m78Pair", to: "m78Exception" }, { from: "m78Exception", to: "admin" }],
    badges: { m78Pair: "break", admin: "owner" },
    danger: ["m78Pair"],
    accent: ["m78Exception"],
  },
  {
    cue: 8,
    layout: DECIDE,
    edges: [{ from: "admin", to: "m78Exception", label: "evidence" }, { from: "m78Exception", to: "checker", label: "write off?" }],
    badges: { checker: "decides" },
    accent: ["checker"],
  },
  { cue: 9, layout: DECIDE, edges: [{ from: "admin", to: "m78Exception" }, { from: "m78Exception", to: "checker" }], badges: { m78Exception: "never ignored" } },
];
