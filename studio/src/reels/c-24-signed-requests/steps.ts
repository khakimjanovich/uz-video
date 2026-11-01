import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 24: a wax-sealed letter. A pass is not enough (4–12), the letter (13–17), the seal and what it covers (18–24),
// the key and its safe (25–28), the four checks and the nonce (29–38), the merchant's server and three refusals (39–53),
// what it protects (54–60), the close (61–66).
const SEND = { merchant: [0, 1], m6Ecom: [3, 1] } as const;
const SEND_EDGE = [{ from: "merchant", to: "m6Ecom" }] as const;
const LEAK = { merchant: [0, 0.3], m6Log: [1.5, 1.9], attacker: [0, 1.9], m6Ecom: [3, 0.3] } as const;
const LEAK_EDGES = [{ from: "merchant", to: "m6Ecom" }, { from: "m6Log", to: "attacker", label: "reads" }] as const;
const SEAL = { merchant: [0, 1], m6Letter: [1.5, 1], m6Ecom: [3, 1] } as const;
const SEAL_EDGES = [{ from: "merchant", to: "m6Letter" }, { from: "m6Letter", to: "m6Ecom" }] as const;
const SAFE = { bankStaff: [0, 1], m6KeySafe: [1.5, 1], m6App: [3, 1] } as const;
const SAFE_EDGES = [{ from: "bankStaff", to: "m6KeySafe", label: "writes" }, { from: "m6App", to: "m6KeySafe", label: "reads only" }] as const;
const GUARD = { merchant: [0, 0.3], m6Ecom: [3, 0.3], m6Spent: [3, 1.9], attacker: [0, 1.9] } as const;
const GUARD_EDGES = [{ from: "merchant", to: "m6Ecom" }, { from: "m6Ecom", to: "m6Spent" }, { from: "attacker", to: "m6Ecom" }] as const;
const covers = (badge: string, cue: number): DiagramStep<BuildId> => ({ cue, layout: SEAL, edges: [...SEAL_EDGES], badges: { m6Letter: badge } });
const checks = (badge: string, cue: number): DiagramStep<BuildId> => ({
  cue,
  layout: SEAL,
  edges: [...SEAL_EDGES],
  packets: [{ from: "m6Letter", to: "m6Ecom", label: "sealed" }],
  badges: { m6Ecom: badge },
});
const attack = (cue: number, from: "merchant" | "attacker", label: string, badge: string): DiagramStep<BuildId> => ({
  cue,
  layout: GUARD,
  edges: [...GUARD_EDGES],
  packets: [{ from, to: "m6Ecom", label, stopAt: 0.8 }],
  danger: from === "attacker" ? ["attacker"] : [],
  badges: { m6Ecom: badge },
});
const wax = (cue: number, badge: string): DiagramStep<BuildId> => ({ cue, layout: { m6Wax: [1.5, 1] }, accent: ["m6Wax"], badges: { m6Wax: badge } });

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 4, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "create payment" }] },
  { cue: 5, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "token" }], badges: { merchant: "a pass" } },
  { cue: 6, layout: SEND, edges: [...SEND_EDGE], badges: { merchant: "who you are" } },
  { cue: 7, layout: SEND, edges: [...SEND_EDGE], badges: { merchant: "who you are", m6Ecom: "wrote this?" } },
  { cue: 8, layout: LEAK, edges: [...LEAK_EDGES], packets: [{ from: "merchant", to: "m6Log", label: "token" }], danger: ["m6Log"] },
  {
    cue: 9,
    layout: LEAK,
    edges: [...LEAK_EDGES, { from: "attacker", to: "m6Ecom" }],
    packets: [{ from: "m6Log", to: "attacker", label: "token" }, { from: "attacker", to: "m6Ecom", label: "any amount", delay: 60 }],
    danger: ["attacker"],
  },
  { cue: 10, layout: { merchant: [0, 0.3], m6Ecom: [3, 0.3], attacker: [0, 1.9] }, edges: [...SEND_EDGE], danger: ["attacker"] },
  {
    cue: 11,
    layout: { merchant: [0, 0.3], m6Ecom: [3, 0.3], attacker: [0, 1.9] },
    edges: [...SEND_EDGE, { from: "attacker", to: "m6Ecom" }],
    packets: [{ from: "merchant", to: "m6Ecom", label: "honest" }, { from: "attacker", to: "m6Ecom", label: "same, tomorrow", delay: 70 }],
    danger: ["attacker"],
  },
  { cue: 12, layout: SEND, edges: [...SEND_EDGE], badges: { merchant: "not enough" } },
  wax(13, "closed"),
  wax(14, "your own ring"),
  wax(15, "broken = opened"),
  wax(16, "a date"),
  wax(17, "a serial number"),
  { cue: 18, layout: SEAL, edges: [...SEAL_EDGES], packets: [{ from: "merchant", to: "m6Letter", label: "request" }] },
  { cue: 19, layout: SEAL, edges: [...SEAL_EDGES], accent: ["m6Letter"], packets: [{ from: "m6Letter", to: "m6Ecom", label: "signature" }] },
  covers("method: create", 20),
  covers("full address", 21),
  covers("the token", 22),
  covers("body fingerprint", 23),
  covers("time · one-time number", 24),
  { cue: 25, layout: { ...SEAL, m6Key: [1.5, 2.1] }, edges: [...SEAL_EDGES, { from: "m6Key", to: "m6Letter", label: "seals" }], accent: ["m6Key"] },
  { cue: 26, layout: { ...SEAL, m6Key: [1.5, 2.1] }, edges: [...SEAL_EDGES, { from: "m6Key", to: "m6Letter", label: "seals" }], badges: { m6Key: "bank + one client" } },
  { cue: 27, layout: SAFE, edges: [SAFE_EDGES[0]], packets: [{ from: "bankStaff", to: "m6KeySafe", label: "key" }], accent: ["m6KeySafe"] },
  { cue: 28, layout: SAFE, edges: [...SAFE_EDGES], packets: [{ from: "m6KeySafe", to: "m6App", label: "key" }], badges: { m6App: "never changes it" } },
  { cue: 29, layout: SEAL, edges: [...SEAL_EDGES], packets: [{ from: "m6Letter", to: "m6Ecom", label: "sealed" }], badges: { m6Ecom: "fixed order" } },
  checks("1 · fresh", 30),
  checks("2 · body matches", 31),
  checks("3 · right client", 32),
  checks("4 · seal made again", 33),
  { cue: 34, layout: GUARD, edges: [...GUARD_EDGES], packets: [{ from: "m6Ecom", to: "m6Spent", label: "nonce" }], accent: ["m6Spent"] },
  { cue: 35, layout: GUARD, edges: [...GUARD_EDGES], badges: { m6Spent: "works once" } },
  {
    cue: 36,
    layout: GUARD,
    edges: [...GUARD_EDGES],
    packets: [{ from: "attacker", to: "m6Ecom", label: "forged", stopAt: 0.8 }],
    danger: ["attacker"],
    badges: { m6Spent: "untouched" },
  },
  { cue: 37, layout: { m6Ecom: [0, 1], salespoint: [3, 1] }, edges: [{ from: "m6Ecom", to: "salespoint" }] },
  { cue: 38, layout: { m6Ecom: [0, 1], salespoint: [3, 1] }, edges: [{ from: "m6Ecom", to: "salespoint" }], accent: ["salespoint"], badges: { salespoint: "own · switched on" } },
  { cue: 39, layout: SEND, edges: [...SEND_EDGE], accent: ["merchant"] },
  { cue: 40, layout: SEND, edges: [...SEND_EDGE], badges: { merchant: "website · order · amount" } },
  { cue: 41, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "sealed create" }] },
  { cue: 42, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "m6Ecom", to: "merchant", label: "answer" }] },
  { cue: 43, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "m6Ecom", to: "merchant", label: "page link" }], badges: { m6Ecom: "created" } },
  attack(45, "merchant", "same, unchanged", "checking"),
  attack(46, "merchant", "same, unchanged", "refused"),
  { ...attack(47, "merchant", "same, unchanged", "refused"), badges: { m6Ecom: "refused", m6Spent: "already used" } },
  attack(48, "attacker", "amount changed", "checking"),
  attack(49, "attacker", "amount changed", "body doesn't match"),
  attack(50, "attacker", "sealed long ago", "checking"),
  attack(51, "attacker", "sealed long ago", "not fresh"),
  {
    cue: 54,
    layout: { attacker: [0, 1], m6Ecom: [3, 1] },
    edges: [{ from: "attacker", to: "m6Ecom" }],
    packets: [{ from: "attacker", to: "m6Ecom", label: "leaked token" }],
    danger: ["attacker"],
  },
  { cue: 55, layout: { attacker: [0, 1], m6Ecom: [3, 1] }, edges: [{ from: "attacker", to: "m6Ecom" }], danger: ["attacker"], badges: { attacker: "a blank cheque" } },
  {
    cue: 56,
    layout: { attacker: [0, 1], m6Ecom: [1.5, 1], buyer: [3, 1] },
    edges: [{ from: "attacker", to: "m6Ecom" }, { from: "m6Ecom", to: "buyer" }],
    packets: [{ from: "attacker", to: "m6Ecom", label: "any amount" }, { from: "m6Ecom", to: "buyer", label: "fake page", delay: 60 }],
    danger: ["attacker"],
  },
  {
    cue: 57,
    layout: { attacker: [0, 1], m6Ecom: [3, 1] },
    edges: [{ from: "attacker", to: "m6Ecom" }],
    packets: [10, 30, 50, 70].map((delay) => ({ from: "attacker" as const, to: "m6Ecom" as const, label: "copy", delay, duration: 22 })),
    danger: ["attacker"],
  },
  { cue: 58, layout: SEAL, edges: [...SEAL_EDGES], accent: ["m6Letter"], badges: { m6Letter: "name · every number" } },
  { cue: 59, layout: GUARD, edges: [...GUARD_EDGES], accent: ["m6Spent"], badges: { m6Spent: "no copies" } },
  { cue: 60, layout: SAFE, edges: [...SAFE_EDGES], accent: ["m6KeySafe"], badges: { m6KeySafe: "nobody types it" } },
  wax(61, "back to the letter"),
  wax(62, "yours · unopened"),
  wax(63, "fresh"),
  wax(64, "the only one"),
  wax(65, "can't forge · can't copy"),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["merchant", "payment"], units: { ecom: "who wrote it?" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 5, current: ["merchant", "keycloak"] },
  { cue: 2, part: 5, current: ["merchant", "payment"] },
  { cue: 3, part: 5, current: ["merchant", "payment"] },
  { cue: 66, part: 5, current: ["merchant", "payment"], units: { ecom: "same payment twice" } },
];

const LIST = "screens/c-24-signed-requests/payments-one.png";
const ROW = [530, 200, 820, 525] as const;
export const screens: ScreenStep[] = [
  { cue: 44, src: LIST, title: "Merchant portal · Payments", region: [...ROW], focus: [[540, 260, 800, 80]] },
  { cue: 52, src: LIST, title: "Merchant portal · Payments", region: [...ROW], focus: [[540, 260, 800, 80]] },
];
