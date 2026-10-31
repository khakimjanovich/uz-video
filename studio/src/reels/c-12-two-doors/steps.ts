import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 12: a counter and a mail slot. Two kinds of visitor (1–3), one big entrance (4), two narrow doors (5–6),
// the payers' door (7–9), the callers' door (10–13), nothing in clear text (14), the close (15).
const VISITORS = { buyer: [0, 0.2], m2Ecom: [0, 1.8], card: [3, 1] } as const;
const ROOM = { label: "Locked room", from: [3, 1], to: [3, 1], tone: "wall" } as const;

const DOORS = { buyer: [0, 0.2], m2Ecom: [0, 1.8], ingress: [1.6, 0.2], partnerdoor: [1.6, 1.8], card: [3, 1] } as const;
const DOOR_EDGES = [
  { from: "buyer", to: "ingress" },
  { from: "m2Ecom", to: "partnerdoor" },
  { from: "ingress", to: "card" },
  { from: "partnerdoor", to: "card" },
] as const;
const WALL = { label: "Locked room", from: [1.6, 0.2], to: [3, 1.8], tone: "wall" } as const;
const D = { edges: [...DOOR_EDGES], frames: [WALL] };
const ODD = { ...DOORS, attacker: [0, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Two kinds of visitor.
  { cue: 1, layout: VISITORS, frames: [ROOM], accent: ["buyer", "m2Ecom"] },
  { cue: 2, layout: VISITORS, frames: [ROOM], packets: [{ from: "buyer", to: "card", label: "card" }], badges: { buyer: "from the internet" } },
  { cue: 3, layout: VISITORS, frames: [ROOM], packets: [{ from: "m2Ecom", to: "card", label: "charge" }], badges: { m2Ecom: "own servers" } },
  // One big entrance: the most valuable box.
  {
    cue: 4,
    layout: { ...VISITORS, m2BigDoor: [1.6, 1] },
    edges: [{ from: "buyer", to: "m2BigDoor" }, { from: "m2Ecom", to: "m2BigDoor" }, { from: "m2BigDoor", to: "card" }],
    frames: [ROOM],
    danger: ["m2BigDoor"],
    badges: { m2BigDoor: "sees everything" },
  },
  // Two narrow doors.
  { cue: 5, layout: DOORS, ...D, accent: ["ingress", "partnerdoor"] },
  { cue: 6, layout: DOORS, ...D, badges: { ingress: "counter", partnerdoor: "mail slot" } },
  // The payers' door: the counter.
  { cue: 7, layout: DOORS, ...D, accent: ["ingress"], badges: { ingress: "counter" } },
  {
    cue: 8,
    layout: ODD,
    ...D,
    packets: [{ from: "buyer", to: "ingress", label: "card form" }, { from: "ingress", to: "card", label: "card form", delay: 45 }, { from: "attacker", to: "ingress", label: "anything else", delay: 30, stopAt: 0.85 }],
    badges: { ingress: "not found" },
  },
  {
    cue: 9,
    layout: DOORS,
    ...D,
    packets: [
      { from: "buyer", to: "ingress", label: "card" },
      { from: "buyer", to: "ingress", label: "card", delay: 35 },
      { from: "buyer", to: "ingress", label: "card", delay: 50, stopAt: 0.85 },
    ],
    badges: { ingress: "how fast" },
  },
  // The callers' door: the mail slot.
  { cue: 10, layout: DOORS, ...D, accent: ["partnerdoor"], badges: { partnerdoor: "mail slot" } },
  { cue: 11, layout: DOORS, ...D, packets: [{ from: "m2Ecom", to: "partnerdoor", label: "sealed · name" }] },
  {
    cue: 12,
    layout: DOORS,
    ...D,
    packets: [{ from: "m2Ecom", to: "partnerdoor", label: "sealed" }, { from: "partnerdoor", to: "card", label: "still sealed", delay: 45 }],
    badges: { partnerdoor: "reads the name" },
  },
  {
    cue: 13,
    layout: ODD,
    ...D,
    packets: [{ from: "attacker", to: "partnerdoor", label: "unknown name", stopAt: 0.85 }],
    badges: { card: "checks the caller" },
  },
  // Nothing in clear text.
  { cue: 14, layout: DOORS, ...D, accent: ["ingress", "partnerdoor"], badges: { ingress: "browsers only", partnerdoor: "never opened" } },
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 2, current: ["frame", "card", "bin", "adapters"], units: { cards: "locked room" } },
  { cue: 15, part: 2, current: ["procport"], units: { cards: "certificate" } },
];
