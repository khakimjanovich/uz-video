import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 13: counting the keys, not the doors. Sunday 3 a.m., a script on Malika's page (0–8), the bridge (9–10),
// per-session tries are not enough (11–15), count every attempt (16–18), four counters (19–23), the velocity limit (24–30),
// what counts (31–35), the alert (36), Saturday's real buyer (37–42), Sunday's script (43–49), Timur's team's email (50–53),
// Malika's ordinary Sunday (54–57), next (58).
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
  // Sunday, 3 a.m.: a script on Malika's page.
  { cue: 0, ...TEST, badges: { m2SmallShop: "Sun 03:00" } },
  { cue: 1, ...TEST, packets: tries("attacker", "m2SmallShop", "card?"), badges: { m2SmallShop: "Malika asleep" } },
  { cue: 2, layout: { attacker: [1.5, 1] }, badges: { attacker: "10,000 numbers" } },
  { cue: 3, layout: { attacker: [1.5, 1] }, badges: { attacker: "most are dead" } },
  { cue: 4, ...TEST, packets: [0, 15, 30, 45, 60].map((delay) => ({ from: "attacker" as const, to: "m2SmallShop" as const, label: "card", delay })), badges: { m2SmallShop: "nobody watching" } },
  { cue: 5, ...TEST, danger: ["m2SmallShop"], badges: { m2SmallShop: "card testing" } },
  { cue: 6, ...REACH, packets: [{ from: "m2SmallShop", to: "network", label: "try" }] },
  { cue: 7, ...REACH, packets: [{ from: "network", to: "m2Person", label: "a code" }], danger: ["m2Person"] },
  { cue: 8, ...REACH, badges: { network: "costs money", m2Person: "flooded", m2SmallShop: "live cards found" } },
  // Per-session tries are not enough.
  { cue: 11, layout: { attacker: [0.4, 1], m2SessionA: [2.6, 1] }, edges: [{ from: "attacker", to: "m2SessionA" }], badges: { m2SessionA: "a few tries" } },
  { cue: 12, layout: { attacker: [0.4, 1], m2SessionA: [2.6, 1] }, crossed: ["m2SessionA"], badges: { m2SessionA: "ended" } },
  { cue: 13, layout: { attacker: [0.4, 1], m2SessionA: [2.6, 0.2], m2SessionB: [2.6, 1.8] }, edges: [{ from: "attacker", to: "m2SessionB" }], crossed: ["m2SessionA"], accent: ["m2SessionB"], badges: { m2SessionB: "a new one" } },
  { cue: 14, ...SESSIONS, badges: { m2Keys: "nearly useless" } },
  { cue: 15, layout: DOORS, edges: [{ from: "attacker", to: "m2DoorA", broken: true }, { from: "attacker", to: "m2DoorB" }], packets: [{ from: "attacker", to: "m2DoorB", label: "key" }], badges: { m2DoorA: "locked after 3" } },
  // Count every attempt, first.
  { cue: 16, ...COUNT, accent: ["m2Counter"], badges: { m2Counter: "counts the keys" } },
  { cue: 17, ...COUNT, packets: [{ from: "m2SmallShop", to: "m2Counter", label: "attempt" }, { from: "m2Counter", to: "network", label: "then ask", delay: 60 }], badges: { m2Counter: "written first" } },
  { cue: 18, ...COUNT, packets: tries("m2SmallShop", "m2Counter", "at once"), badges: { m2Counter: "speed doesn't help" } },
  // Four counters.
  { cue: 19, ...FOUR },
  { cue: 20, ...FOUR, accent: ["m2CountCard"], badges: { m2CountCard: "never the number" } },
  { cue: 21, ...FOUR, accent: ["m2CountBin"] },
  { cue: 22, ...FOUR, accent: ["m2CountAddress"] },
  { cue: 23, ...FOUR, accent: ["m2CountShop"] },
  // The velocity limit.
  { cue: 24, ...FOUR, badges: { m2Counter: "the bank's choice" } },
  { cue: 25, ...FOUR, badges: { m2CountCard: "so many", m2CountBin: "so many", m2CountAddress: "so many", m2CountShop: "so many" } },
  { cue: 26, ...FOUR, badges: { m2Counter: "velocity limit" } },
  { cue: 27, ...BLOCKED, packets: [{ from: "m2SmallShop", to: "m2Counter", label: "try", stopAt: 0.9 }], badges: { m2Counter: "refused" } },
  { cue: 28, ...BLOCKED, badges: { network: "no code sent" } },
  { cue: 29, ...BLOCKED, badges: { m2SmallShop: "no attempt spent" } },
  { cue: 30, ...BLOCKED, badges: { m2SmallShop: "no new session" } },
  // What counts.
  { cue: 31, ...COUNT, badges: { m2Counter: "card failures only" } },
  { cue: 32, ...COUNT, packets: [{ from: "m2SmallShop", to: "m2Counter", label: "wrong code" }], badges: { m2Counter: "counts" } },
  { cue: 33, ...COUNT, packets: [{ from: "network", to: "m2Counter", label: "bank says no" }], badges: { m2Counter: "counts" } },
  { cue: 34, ...FOUR, badges: { m2CountBin: "not for an expiry typo" } },
  { cue: 35, ...COUNT, edges: [{ from: "m2SmallShop", to: "m2Counter" }, { from: "m2Counter", to: "network", broken: true }], danger: ["network"], badges: { m2Counter: "never counted" } },
  // The alert.
  { cue: 36, ...ALERT, packets: [{ from: "m2AlertEmail", to: "m2Team", label: "alert" }], badges: { m2Counter: "refusals pile up" } },
  // Saturday: a real buyer runs out of tries.
  { cue: 37, layout: { buyer: [1.5, 1] }, badges: { buyer: "Sat · a bad day" } },
  { cue: 40, layout: { buyer: [0.4, 1], m2SessionA: [2.6, 1] }, edges: [{ from: "buyer", to: "m2SessionA" }], crossed: ["m2SessionA"], badges: { m2SessionA: "out of tries" } },
  // Sunday: the script meets the counters.
  { cue: 43, ...COUNT, layout: { attacker: [0, 1], m2Counter: [1.5, 1], network: [3, 1] }, edges: [{ from: "attacker", to: "m2Counter" }, { from: "m2Counter", to: "network" }], packets: tries("attacker", "m2Counter", "card"), badges: { attacker: "Sun 03:00" } },
  { cue: 44, ...COUNT, layout: { attacker: [0, 1], m2Counter: [1.5, 1], network: [3, 1] }, edges: [{ from: "attacker", to: "m2Counter" }, { from: "m2Counter", to: "network" }], packets: [{ from: "network", to: "m2Counter", label: "refused" }] },
  { cue: 45, ...FOUR, danger: ["m2CountBin"], badges: { m2CountBin: "limit reached" } },
  { cue: 48, ...BLOCKED, badges: { network: "not asked" } },
  { cue: 49, ...REACH, crossed: ["network"], badges: { m2Person: "no buzz" } },
  // Timur's team gets the email.
  { cue: 50, ...ALERT, packets: [{ from: "m2AlertEmail", to: "m2Team", label: "email" }], badges: { m2Team: "Timur's team" } },
  { cue: 51, ...ALERT, badges: { m2AlertEmail: "a velocity rule" } },
  { cue: 52, ...ALERT, badges: { m2AlertEmail: "caller · counter" } },
  { cue: 53, ...ALERT, badges: { m2Team: "logs · addresses" } },
  // Malika's ordinary Sunday.
  { cue: 54, layout: { shop: [1.5, 1] }, accent: ["shop"], badges: { shop: "ordinary orders" } },
  { cue: 55, ...TEST, crossed: ["attacker"], badges: { m2SmallShop: "no testing bench" } },
  { cue: 56, ...REACH, crossed: ["network"], badges: { m2Person: "quiet" } },
  { cue: 57, ...BLOCKED, badges: { network: "no cost", m2Counter: "no live list" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 9, part: 3, current: ["card", "bin"] },
  { cue: 10, part: 3, current: ["frame", "card", "bin"], units: { cards: "counters" } },
  { cue: 58, part: 3, current: ["frame", "card", "cardsinfra", "procport"], units: { cards: "all layers" } },
];

// The card form: a wrong code, a session out of tries, a velocity refusal.
const FORM = [460, 268, 520, 360] as const;
export const screens: ScreenStep[] = [
  {
    cue: 38,
    src: "screens/c-13-fraud-limits/code-wrong.png",
    title: "Payment page · card form",
    region: [...FORM],
    focus: [[555, 375, 340, 40]],
    beats: [{ cue: 39, region: [...FORM], focus: [[555, 478, 340, 30]] }],
  },
  {
    cue: 41,
    src: "screens/c-13-fraud-limits/ended.png",
    title: "Payment page · a fresh card form",
    region: [...FORM],
    focus: [[545, 316, 350, 76]],
    beats: [{ cue: 42, region: [...FORM], focus: [[555, 435, 340, 150]] }],
  },
  {
    cue: 46,
    src: "screens/c-13-fraud-limits/velocity.png",
    title: "Payment page · card form",
    region: [...FORM],
    focus: [[555, 554, 340, 52]],
  },
];
