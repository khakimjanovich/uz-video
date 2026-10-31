import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 13: counting the keys, not the doors. The thief and the keys (0–2), keys = cards, doors = sessions (3–6),
// the counter and the velocity limit (7–10), the alert (11), the moral (12), the close (13).
const DOORS = { attacker: [0, 1], m2DoorA: [3, 0], m2DoorB: [3, 1], m2DoorC: [3, 2] } as const;
const SESSIONS = { m2Keys: [0, 1], m2SessionA: [3, 0], m2SessionB: [3, 1], m2SessionC: [3, 2] } as const;
const COUNT = { m2SmallShop: [0, 1], m2Counter: [1.5, 1], network: [3, 1] } as const;
const COUNT_EDGES = [{ from: "m2SmallShop", to: "m2Counter" }, { from: "m2Counter", to: "network" }] as const;
const ZONE = { label: "Card zone", from: [1.5, 1], to: [1.5, 1], tone: "wall" } as const;
const TRIES = (to: "m2Counter" | "m2SmallShop", from: BuildId, label: string) =>
  [0, 25, 50].map((delay) => ({ from, to, label, delay }));

export const diagram: DiagramStep<BuildId>[] = [
  // Testing stolen cards.
  { cue: 0, layout: { attacker: [0.4, 1], m2SmallShop: [2.6, 1] }, packets: TRIES("m2SmallShop", "attacker", "card?") },
  // The bag of keys.
  {
    cue: 1,
    layout: { attacker: [0.4, 1], m2Lock: [2.6, 1] },
    packets: [0, 30, 60].map((delay) => ({ from: "attacker" as const, to: "m2Lock" as const, label: "key", delay, stopAt: 0.9 })),
    badges: { attacker: "a bag of keys" },
  },
  {
    cue: 2,
    layout: DOORS,
    edges: [{ from: "attacker", to: "m2DoorA", broken: true }, { from: "attacker", to: "m2DoorB" }],
    packets: [{ from: "attacker", to: "m2DoorB", label: "key", delay: 30 }],
    badges: { m2DoorA: "locked after 3" },
  },
  // Keys are card numbers; doors are payment sessions.
  {
    cue: 3,
    layout: SESSIONS,
    edges: [{ from: "m2Keys", to: "m2SessionA" }, { from: "m2Keys", to: "m2SessionB" }, { from: "m2Keys", to: "m2SessionC" }],
  },
  {
    cue: 4,
    layout: { attacker: [0.4, 1], m2SmallShop: [2.6, 1] },
    edges: [{ from: "attacker", to: "m2SmallShop" }],
    packets: [0, 15, 30, 45, 60].map((delay) => ({ from: "attacker" as const, to: "m2SmallShop" as const, label: "card", delay })),
    badges: { attacker: "10,000 numbers" },
  },
  { cue: 5, layout: { attacker: [0.4, 1], m2SmallShop: [2.6, 1] }, edges: [{ from: "attacker", to: "m2SmallShop" }], danger: ["m2SmallShop"], badges: { m2SmallShop: "card testing" } },
  {
    cue: 6,
    layout: { m2SmallShop: [0, 1], network: [1.5, 1], m2Person: [3, 1] },
    edges: [{ from: "m2SmallShop", to: "network" }, { from: "network", to: "m2Person" }],
    packets: [{ from: "m2SmallShop", to: "network", label: "try" }, { from: "network", to: "m2Person", label: "a code", delay: 50 }],
  },
  // Count every attempt, before any network.
  { cue: 7, layout: COUNT, edges: [...COUNT_EDGES], frames: [ZONE], accent: ["m2Counter"], packets: TRIES("m2Counter", "m2SmallShop", "attempt") },
  { cue: 8, layout: COUNT, edges: [...COUNT_EDGES], frames: [ZONE], badges: { m2Counter: "fails per window" } },
  {
    cue: 9,
    layout: COUNT,
    edges: [{ from: "m2SmallShop", to: "m2Counter" }, { from: "m2Counter", to: "network", broken: true }],
    frames: [ZONE],
    packets: [{ from: "m2SmallShop", to: "m2Counter", label: "try", stopAt: 0.9 }],
    badges: { m2Counter: "refused", network: "not asked" },
  },
  { cue: 10, layout: COUNT, edges: [...COUNT_EDGES], frames: [ZONE], badges: { m2Counter: "card failures only" } },
  // An alert.
  {
    cue: 11,
    layout: { m2SmallShop: [0, 1], m2Counter: [1.5, 1], m2Team: [3, 1] },
    edges: [{ from: "m2SmallShop", to: "m2Counter" }, { from: "m2Counter", to: "m2Team" }],
    frames: [ZONE],
    packets: [{ from: "m2Counter", to: "m2Team", label: "alert" }],
  },
  // The moral.
  { cue: 12, layout: DOORS, accent: ["attacker"], badges: { attacker: "keys counted" } },
];

export const map: BuildMapStep[] = [
  { cue: 13, part: 2, current: ["partner", "merchant"], units: { ecom: "merchants" } },
];
