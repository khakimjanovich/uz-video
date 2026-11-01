import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 13: counting the keys, not the doors. The bag of keys (0–9), card testing (10–16), per-session tries
// are not enough (17–20), count every attempt (21–23), four counters (24–28), the velocity limit (29–36),
// what counts (37–41), the alert (42), the product (43–61), what it protects (62–65), the keys again (66–68), next (69).
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
  { cue: 4, layout: { attacker: [1.5, 1] }, badges: { attacker: "a bag of keys" } },
  { cue: 5, layout: { attacker: [0.4, 1], m2Lock: [2.6, 1] }, packets: tries("attacker", "m2Lock", "key", 0.9) },
  { cue: 6, layout: DOORS, edges: [{ from: "attacker", to: "m2DoorA", broken: true }], badges: { m2DoorA: "locked after 3" } },
  { cue: 7, layout: DOORS, edges: [{ from: "attacker", to: "m2DoorA", broken: true }, { from: "attacker", to: "m2DoorB" }], packets: [{ from: "attacker", to: "m2DoorB", label: "key" }] },
  // Keys are cards; doors are sessions.
  { cue: 8, ...SESSIONS, accent: ["m2Keys"] },
  { cue: 9, ...SESSIONS, accent: ["m2SessionA", "m2SessionB", "m2SessionC"] },
  // Card testing.
  { cue: 10, layout: { attacker: [1.5, 1] }, badges: { attacker: "10,000 numbers" } },
  { cue: 11, layout: { attacker: [1.5, 1] }, badges: { attacker: "most are dead" } },
  { cue: 12, ...TEST, packets: [0, 15, 30, 45, 60].map((delay) => ({ from: "attacker" as const, to: "m2SmallShop" as const, label: "card", delay })) },
  { cue: 13, ...TEST, danger: ["m2SmallShop"], badges: { m2SmallShop: "card testing" } },
  { cue: 14, ...REACH, packets: [{ from: "m2SmallShop", to: "network", label: "try" }] },
  { cue: 15, ...REACH, packets: [{ from: "network", to: "m2Person", label: "a code" }], danger: ["m2Person"] },
  { cue: 16, ...REACH, badges: { network: "costs money", m2Person: "flooded", m2SmallShop: "live cards found" } },
  // Per-session tries are not enough.
  { cue: 17, layout: { attacker: [0.4, 1], m2SessionA: [2.6, 1] }, edges: [{ from: "attacker", to: "m2SessionA" }], badges: { m2SessionA: "a few tries" } },
  { cue: 18, layout: { attacker: [0.4, 1], m2SessionA: [2.6, 1] }, crossed: ["m2SessionA"], badges: { m2SessionA: "ended" } },
  { cue: 19, layout: { attacker: [0.4, 1], m2SessionA: [2.6, 0.2], m2SessionB: [2.6, 1.8] }, edges: [{ from: "attacker", to: "m2SessionB" }], crossed: ["m2SessionA"], accent: ["m2SessionB"], badges: { m2SessionB: "a new one" } },
  { cue: 20, ...SESSIONS, badges: { m2Keys: "not enough" } },
  // Count every attempt, first.
  { cue: 21, ...COUNT, accent: ["m2Counter"], badges: { m2Counter: "counts the keys" } },
  { cue: 22, ...COUNT, packets: [{ from: "m2SmallShop", to: "m2Counter", label: "attempt" }, { from: "m2Counter", to: "network", label: "then ask", delay: 60 }], badges: { m2Counter: "written first" } },
  { cue: 23, ...COUNT, packets: tries("m2SmallShop", "m2Counter", "at once"), badges: { m2Counter: "speed doesn't help" } },
  // Four counters.
  { cue: 24, ...FOUR },
  { cue: 25, ...FOUR, accent: ["m2CountCard"], badges: { m2CountCard: "never the number" } },
  { cue: 26, ...FOUR, accent: ["m2CountBin"] },
  { cue: 27, ...FOUR, accent: ["m2CountAddress"] },
  { cue: 28, ...FOUR, accent: ["m2CountShop"] },
  // The velocity limit.
  { cue: 29, ...FOUR, badges: { m2Counter: "limit · window" } },
  { cue: 30, ...FOUR, badges: { m2CountCard: "so many", m2CountBin: "so many", m2CountAddress: "so many", m2CountShop: "so many" } },
  { cue: 31, ...FOUR, badges: { m2Counter: "the bank's choice" } },
  { cue: 32, ...FOUR, badges: { m2Counter: "velocity limit" } },
  { cue: 33, ...BLOCKED, packets: [{ from: "m2SmallShop", to: "m2Counter", label: "try", stopAt: 0.9 }], badges: { m2Counter: "refused" } },
  { cue: 34, ...BLOCKED, badges: { network: "no code sent" } },
  { cue: 35, ...BLOCKED, badges: { m2SmallShop: "no attempt spent" } },
  { cue: 36, ...BLOCKED, badges: { m2SmallShop: "no new session" } },
  // What counts.
  { cue: 37, ...COUNT, badges: { m2Counter: "card failures only" } },
  { cue: 38, ...COUNT, packets: [{ from: "m2SmallShop", to: "m2Counter", label: "wrong code" }], badges: { m2Counter: "counts" } },
  { cue: 39, ...COUNT, packets: [{ from: "network", to: "m2Counter", label: "bank says no" }], badges: { m2Counter: "counts" } },
  { cue: 40, ...FOUR, badges: { m2CountBin: "not for an expiry typo" } },
  { cue: 41, ...COUNT, edges: [{ from: "m2SmallShop", to: "m2Counter" }, { from: "m2Counter", to: "network", broken: true }], danger: ["network"], badges: { m2Counter: "never counted" } },
  // The alert.
  { cue: 42, ...ALERT, packets: [{ from: "m2AlertEmail", to: "m2Team", label: "alert" }], badges: { m2Counter: "refusals pile up" } },
  // A normal buyer runs out of tries.
  { cue: 46, layout: { buyer: [0.4, 1], m2SessionA: [2.6, 1] }, edges: [{ from: "buyer", to: "m2SessionA" }], crossed: ["m2SessionA"], badges: { m2SessionA: "out of tries" } },
  { cue: 50, layout: { buyer: [1.5, 1] }, badges: { buyer: "a bad day" } },
  // The thief's script.
  { cue: 51, ...COUNT, layout: { attacker: [0, 1], m2Counter: [1.5, 1], network: [3, 1] }, edges: [{ from: "attacker", to: "m2Counter" }, { from: "m2Counter", to: "network" }], packets: tries("attacker", "m2Counter", "card") },
  { cue: 52, ...COUNT, layout: { attacker: [0, 1], m2Counter: [1.5, 1], network: [3, 1] }, edges: [{ from: "attacker", to: "m2Counter" }, { from: "m2Counter", to: "network" }], packets: [{ from: "network", to: "m2Counter", label: "refused" }] },
  { cue: 53, ...FOUR, danger: ["m2CountBin"], badges: { m2CountBin: "limit reached" } },
  // The alert email.
  { cue: 58, ...ALERT, packets: [{ from: "m2AlertEmail", to: "m2Team", label: "email" }] },
  { cue: 59, ...ALERT, badges: { m2AlertEmail: "a velocity rule" } },
  { cue: 60, ...ALERT, badges: { m2AlertEmail: "caller · counter" } },
  { cue: 61, ...ALERT, badges: { m2Team: "logs · addresses" } },
  // What it protects.
  { cue: 63, ...REACH, crossed: ["network"], badges: { m2Person: "no flood" } },
  { cue: 64, ...TEST, crossed: ["attacker"], badges: { m2SmallShop: "no testing bench" } },
  { cue: 65, ...BLOCKED, badges: { network: "no cost", m2Counter: "no live list" } },
  // The keys again.
  { cue: 66, layout: DOORS, edges: [{ from: "attacker", to: "m2DoorA" }, { from: "attacker", to: "m2DoorB" }, { from: "attacker", to: "m2DoorC" }], badges: { attacker: "a bag of keys" } },
  { cue: 67, layout: DOORS, edges: [{ from: "attacker", to: "m2DoorA", broken: true }, { from: "attacker", to: "m2DoorB", broken: true }, { from: "attacker", to: "m2DoorC", broken: true }], badges: { m2DoorB: "same keys counted" } },
  { cue: 68, ...COUNT, accent: ["m2Counter"], badges: { m2Counter: "keys, not doors" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 3, current: ["buyer", "frame"] },
  { cue: 2, part: 3, current: ["card", "bin"] },
  { cue: 3, part: 3, current: ["frame", "card", "bin"] },
  { cue: 43, part: 3, current: ["frame", "card"], units: { cards: "card form" } },
  { cue: 69, part: 3, current: ["frame", "card", "cardsinfra", "procport"], units: { cards: "all layers" } },
];

// The card form: a wrong code, a session out of tries, a velocity refusal.
const FORM = [460, 268, 520, 360] as const;
export const screens: ScreenStep[] = [
  {
    cue: 44,
    src: "screens/c-13-fraud-limits/code-wrong.png",
    title: "Payment page · card form",
    region: [...FORM],
    focus: [[555, 375, 340, 40]],
    beats: [{ cue: 45, region: [...FORM], focus: [[555, 478, 340, 30]] }],
  },
  {
    cue: 47,
    src: "screens/c-13-fraud-limits/ended.png",
    title: "Payment page · a fresh card form",
    region: [...FORM],
    beats: [
      { cue: 48, region: [...FORM], focus: [[545, 316, 350, 76]] },
      { cue: 49, region: [...FORM], focus: [[555, 435, 340, 150]] },
    ],
  },
  {
    cue: 54,
    src: "screens/c-13-fraud-limits/velocity.png",
    title: "Payment page · card form",
    region: [...FORM],
    focus: [[555, 554, 340, 52]],
  },
];
