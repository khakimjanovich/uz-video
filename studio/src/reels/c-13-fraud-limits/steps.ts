import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 13: counting the keys, not the doors. The bag of keys (0–6), card testing (7–13), per-session tries
// are not enough (14–17), count every attempt (18–20), four counters (21–25), the velocity limit (26–33),
// what counts (34–38), the alert (39), the product (40–58), what it protects (59–62), the keys again (63–65), next (66).
const DOORS = { attacker: [0, 1], m2DoorA: [3, 0], m2DoorB: [3, 1], m2DoorC: [3, 2] } as const;
const SESSIONS: Beat = {
  layout: { m2Keys: [0, 1], m2SessionA: [3, 0], m2SessionB: [3, 1], m2SessionC: [3, 2] },
  edges: [{ from: "m2Keys", to: "m2SessionA" }, { from: "m2Keys", to: "m2SessionB" }, { from: "m2Keys", to: "m2SessionC" }],
};
const TEST: Beat = { layout: { attacker: [0.4, 1], m2SmallShop: [2.6, 1] }, edges: [{ from: "attacker", to: "m2SmallShop" }] };
const REACH: Beat = {
  layout: { m2SmallShop: [0, 1], network: [1.5, 1], m2Person: [3, 1] },
  edges: [{ from: "m2SmallShop", to: "network" }, { from: "network", to: "m2Person" }],
};
const ZONE = { label: "Card zone", from: [1.5, 1], to: [1.5, 1], tone: "wall" } as const;
const COUNT: Beat = {
  layout: { m2SmallShop: [0, 1], m2Counter: [1.5, 1], network: [3, 1] },
  edges: [{ from: "m2SmallShop", to: "m2Counter" }, { from: "m2Counter", to: "network" }],
  frames: [ZONE],
};
const BLOCKED: Beat = { ...COUNT, edges: [{ from: "m2SmallShop", to: "m2Counter" }, { from: "m2Counter", to: "network", broken: true }] };
const FOUR: Beat = {
  layout: { m2Counter: [0, 1.1], m2CountCard: [2.4, 0], m2CountBin: [2.4, 0.73], m2CountAddress: [2.4, 1.47], m2CountShop: [2.4, 2.2] },
  edges: [
    { from: "m2Counter", to: "m2CountCard" },
    { from: "m2Counter", to: "m2CountBin" },
    { from: "m2Counter", to: "m2CountAddress" },
    { from: "m2Counter", to: "m2CountShop" },
  ],
};
const ALERT: Beat = {
  layout: { m2Counter: [0, 1], m2AlertEmail: [1.5, 1], m2Team: [3, 1] },
  edges: [{ from: "m2Counter", to: "m2AlertEmail" }, { from: "m2AlertEmail", to: "m2Team" }],
};
const tries = (from: BuildId, to: BuildId, label: string, stopAt?: number) =>
  [0, 20, 40].map((delay) => ({ from, to, label, delay, stopAt }));

export const diagram: DiagramStep<BuildId>[] = [
  // Testing stolen cards.
  { cue: 0, ...TEST, packets: tries("attacker", "m2SmallShop", "card?") },
  // The bag of keys.
  { cue: 1, layout: { attacker: [1.5, 1] }, badges: { attacker: "a bag of keys" } },
  { cue: 2, layout: { attacker: [0.4, 1], m2Lock: [2.6, 1] }, packets: tries("attacker", "m2Lock", "key", 0.9) },
  { cue: 3, layout: DOORS, edges: [{ from: "attacker", to: "m2DoorA", broken: true }], badges: { m2DoorA: "locked after 3" } },
  { cue: 4, layout: DOORS, edges: [{ from: "attacker", to: "m2DoorA", broken: true }, { from: "attacker", to: "m2DoorB" }], packets: [{ from: "attacker", to: "m2DoorB", label: "key" }] },
  // Keys are cards; doors are sessions.
  { cue: 5, ...SESSIONS, accent: ["m2Keys"] },
  { cue: 6, ...SESSIONS, accent: ["m2SessionA", "m2SessionB", "m2SessionC"] },
  // Card testing.
  { cue: 7, layout: { attacker: [1.5, 1] }, badges: { attacker: "10,000 numbers" } },
  { cue: 8, layout: { attacker: [1.5, 1] }, badges: { attacker: "most are dead" } },
  { cue: 9, ...TEST, packets: [0, 15, 30, 45, 60].map((delay) => ({ from: "attacker" as const, to: "m2SmallShop" as const, label: "card", delay })) },
  { cue: 10, ...TEST, danger: ["m2SmallShop"], badges: { m2SmallShop: "card testing" } },
  { cue: 11, ...REACH, packets: [{ from: "m2SmallShop", to: "network", label: "try" }] },
  { cue: 12, ...REACH, packets: [{ from: "network", to: "m2Person", label: "a code" }], danger: ["m2Person"] },
  { cue: 13, ...REACH, badges: { network: "costs money", m2Person: "flooded", m2SmallShop: "live cards found" } },
  // Per-session tries are not enough.
  { cue: 14, layout: { attacker: [0.4, 1], m2SessionA: [2.6, 1] }, edges: [{ from: "attacker", to: "m2SessionA" }], badges: { m2SessionA: "a few tries" } },
  { cue: 15, layout: { attacker: [0.4, 1], m2SessionA: [2.6, 1] }, crossed: ["m2SessionA"], badges: { m2SessionA: "ended" } },
  { cue: 16, layout: { attacker: [0.4, 1], m2SessionA: [2.6, 0.2], m2SessionB: [2.6, 1.8] }, edges: [{ from: "attacker", to: "m2SessionB" }], crossed: ["m2SessionA"], accent: ["m2SessionB"], badges: { m2SessionB: "a new one" } },
  { cue: 17, ...SESSIONS, badges: { m2Keys: "not enough" } },
  // Count every attempt, first.
  { cue: 18, ...COUNT, accent: ["m2Counter"], badges: { m2Counter: "counts the keys" } },
  { cue: 19, ...COUNT, packets: [{ from: "m2SmallShop", to: "m2Counter", label: "attempt" }, { from: "m2Counter", to: "network", label: "then ask", delay: 60 }], badges: { m2Counter: "written first" } },
  { cue: 20, ...COUNT, packets: tries("m2SmallShop", "m2Counter", "at once"), badges: { m2Counter: "speed doesn't help" } },
  // Four counters.
  { cue: 21, ...FOUR },
  { cue: 22, ...FOUR, accent: ["m2CountCard"], badges: { m2CountCard: "never the number" } },
  { cue: 23, ...FOUR, accent: ["m2CountBin"] },
  { cue: 24, ...FOUR, accent: ["m2CountAddress"] },
  { cue: 25, ...FOUR, accent: ["m2CountShop"] },
  // The velocity limit.
  { cue: 26, ...FOUR, badges: { m2Counter: "limit · window" } },
  { cue: 27, ...FOUR, badges: { m2CountCard: "so many", m2CountBin: "so many", m2CountAddress: "so many", m2CountShop: "so many" } },
  { cue: 28, ...FOUR, badges: { m2Counter: "the bank's choice" } },
  { cue: 29, ...FOUR, badges: { m2Counter: "velocity limit" } },
  { cue: 30, ...BLOCKED, packets: [{ from: "m2SmallShop", to: "m2Counter", label: "try", stopAt: 0.9 }], badges: { m2Counter: "refused" } },
  { cue: 31, ...BLOCKED, badges: { network: "no code sent" } },
  { cue: 32, ...BLOCKED, badges: { m2SmallShop: "no attempt spent" } },
  { cue: 33, ...BLOCKED, badges: { m2SmallShop: "no new session" } },
  // What counts.
  { cue: 34, ...COUNT, badges: { m2Counter: "card failures only" } },
  { cue: 35, ...COUNT, packets: [{ from: "m2SmallShop", to: "m2Counter", label: "wrong code" }], badges: { m2Counter: "counts" } },
  { cue: 36, ...COUNT, packets: [{ from: "network", to: "m2Counter", label: "bank says no" }], badges: { m2Counter: "counts" } },
  { cue: 37, ...FOUR, badges: { m2CountBin: "not for an expiry typo" } },
  { cue: 38, ...COUNT, edges: [{ from: "m2SmallShop", to: "m2Counter" }, { from: "m2Counter", to: "network", broken: true }], danger: ["network"], badges: { m2Counter: "never counted" } },
  // The alert.
  { cue: 39, ...ALERT, packets: [{ from: "m2AlertEmail", to: "m2Team", label: "alert" }], badges: { m2Counter: "refusals pile up" } },
  // A normal buyer runs out of tries.
  { cue: 43, layout: { buyer: [0.4, 1], m2SessionA: [2.6, 1] }, edges: [{ from: "buyer", to: "m2SessionA" }], crossed: ["m2SessionA"], badges: { m2SessionA: "out of tries" } },
  { cue: 47, layout: { buyer: [1.5, 1] }, badges: { buyer: "a bad day" } },
  // The thief's script.
  { cue: 48, ...COUNT, layout: { attacker: [0, 1], m2Counter: [1.5, 1], network: [3, 1] }, edges: [{ from: "attacker", to: "m2Counter" }, { from: "m2Counter", to: "network" }], packets: tries("attacker", "m2Counter", "card") },
  { cue: 49, ...COUNT, layout: { attacker: [0, 1], m2Counter: [1.5, 1], network: [3, 1] }, edges: [{ from: "attacker", to: "m2Counter" }, { from: "m2Counter", to: "network" }], packets: [{ from: "network", to: "m2Counter", label: "refused" }] },
  { cue: 50, ...FOUR, danger: ["m2CountBin"], badges: { m2CountBin: "limit reached" } },
  // The alert email.
  { cue: 55, ...ALERT, packets: [{ from: "m2AlertEmail", to: "m2Team", label: "email" }] },
  { cue: 56, ...ALERT, badges: { m2AlertEmail: "a velocity rule" } },
  { cue: 57, ...ALERT, badges: { m2AlertEmail: "caller · counter" } },
  { cue: 58, ...ALERT, badges: { m2Team: "logs · addresses" } },
  // What it protects.
  { cue: 60, ...REACH, crossed: ["network"], badges: { m2Person: "no flood" } },
  { cue: 61, ...TEST, crossed: ["attacker"], badges: { m2SmallShop: "no testing bench" } },
  { cue: 62, ...BLOCKED, badges: { network: "no cost", m2Counter: "no live list" } },
  // The keys again.
  { cue: 63, layout: DOORS, edges: [{ from: "attacker", to: "m2DoorA" }, { from: "attacker", to: "m2DoorB" }, { from: "attacker", to: "m2DoorC" }], badges: { attacker: "a bag of keys" } },
  { cue: 64, layout: DOORS, edges: [{ from: "attacker", to: "m2DoorA", broken: true }, { from: "attacker", to: "m2DoorB", broken: true }, { from: "attacker", to: "m2DoorC", broken: true }], badges: { m2DoorB: "same keys counted" } },
  { cue: 65, ...COUNT, accent: ["m2Counter"], badges: { m2Counter: "keys, not doors" } },
];

export const map: BuildMapStep[] = [
  { cue: 40, part: 2, current: ["frame", "card"], units: { cards: "card form" } },
  { cue: 66, part: 2, current: ["frame", "card", "cardsinfra", "procport"], units: { cards: "all layers" } },
];

// The card form: a wrong code, a session out of tries, a velocity refusal.
const FORM = [460, 268, 520, 360] as const;
export const screens: ScreenStep[] = [
  {
    cue: 41,
    src: "screens/c-13-fraud-limits/code-wrong.png",
    title: "Payment page · card form",
    region: [...FORM],
    focus: [[555, 375, 340, 40]],
    beats: [{ cue: 42, region: [...FORM], focus: [[555, 478, 340, 30]] }],
  },
  {
    cue: 44,
    src: "screens/c-13-fraud-limits/ended.png",
    title: "Payment page · a fresh card form",
    region: [470, 300, 500, 312],
    beats: [
      { cue: 45, region: [470, 300, 500, 312], focus: [[545, 325, 350, 70]] },
      { cue: 46, region: [470, 300, 500, 312], focus: [[555, 420, 340, 140]] },
    ],
  },
  {
    cue: 51,
    src: "screens/c-13-fraud-limits/velocity.png",
    title: "Payment page · card form",
    region: [...FORM],
    focus: [[555, 554, 340, 52]],
  },
];
