import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 24: a wax-sealed letter. A pass is not enough (1–9), the letter (10–14), the seal and what it covers (15–21),
// the key and its safe (22–25), the four checks and the nonce (26–35), the merchant's server and three refusals (36–50),
// what it protects (51–57), the close (58–63).
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
  { cue: 1, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "create payment" }] },
  { cue: 2, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "token" }], badges: { merchant: "a pass" } },
  { cue: 3, layout: SEND, edges: [...SEND_EDGE], badges: { merchant: "who you are" } },
  { cue: 4, layout: SEND, edges: [...SEND_EDGE], badges: { merchant: "who you are", m6Ecom: "wrote this?" } },
  { cue: 5, layout: LEAK, edges: [...LEAK_EDGES], packets: [{ from: "merchant", to: "m6Log", label: "token" }], danger: ["m6Log"] },
  {
    cue: 6,
    layout: LEAK,
    edges: [...LEAK_EDGES, { from: "attacker", to: "m6Ecom" }],
    packets: [{ from: "m6Log", to: "attacker", label: "token" }, { from: "attacker", to: "m6Ecom", label: "any amount", delay: 60 }],
    danger: ["attacker"],
  },
  { cue: 7, layout: { merchant: [0, 0.3], m6Ecom: [3, 0.3], attacker: [0, 1.9] }, edges: [...SEND_EDGE], danger: ["attacker"] },
  {
    cue: 8,
    layout: { merchant: [0, 0.3], m6Ecom: [3, 0.3], attacker: [0, 1.9] },
    edges: [...SEND_EDGE, { from: "attacker", to: "m6Ecom" }],
    packets: [{ from: "merchant", to: "m6Ecom", label: "honest" }, { from: "attacker", to: "m6Ecom", label: "same, tomorrow", delay: 70 }],
    danger: ["attacker"],
  },
  { cue: 9, layout: SEND, edges: [...SEND_EDGE], badges: { merchant: "not enough" } },
  wax(10, "closed"),
  wax(11, "your own ring"),
  wax(12, "broken = opened"),
  wax(13, "a date"),
  wax(14, "a serial number"),
  { cue: 15, layout: SEAL, edges: [...SEAL_EDGES], packets: [{ from: "merchant", to: "m6Letter", label: "request" }] },
  { cue: 16, layout: SEAL, edges: [...SEAL_EDGES], accent: ["m6Letter"], packets: [{ from: "m6Letter", to: "m6Ecom", label: "signature" }] },
  covers("method: create", 17),
  covers("full address", 18),
  covers("the token", 19),
  covers("body fingerprint", 20),
  covers("time · one-time number", 21),
  { cue: 22, layout: { ...SEAL, m6Key: [1.5, 2.1] }, edges: [...SEAL_EDGES, { from: "m6Key", to: "m6Letter", label: "seals" }], accent: ["m6Key"] },
  { cue: 23, layout: { ...SEAL, m6Key: [1.5, 2.1] }, edges: [...SEAL_EDGES, { from: "m6Key", to: "m6Letter", label: "seals" }], badges: { m6Key: "bank + one client" } },
  { cue: 24, layout: SAFE, edges: [SAFE_EDGES[0]], packets: [{ from: "bankStaff", to: "m6KeySafe", label: "key" }], accent: ["m6KeySafe"] },
  { cue: 25, layout: SAFE, edges: [...SAFE_EDGES], packets: [{ from: "m6KeySafe", to: "m6App", label: "key" }], badges: { m6App: "never changes it" } },
  { cue: 26, layout: SEAL, edges: [...SEAL_EDGES], packets: [{ from: "m6Letter", to: "m6Ecom", label: "sealed" }], badges: { m6Ecom: "fixed order" } },
  checks("1 · fresh", 27),
  checks("2 · body matches", 28),
  checks("3 · right client", 29),
  checks("4 · seal made again", 30),
  { cue: 31, layout: GUARD, edges: [...GUARD_EDGES], packets: [{ from: "m6Ecom", to: "m6Spent", label: "nonce" }], accent: ["m6Spent"] },
  { cue: 32, layout: GUARD, edges: [...GUARD_EDGES], badges: { m6Spent: "works once" } },
  {
    cue: 33,
    layout: GUARD,
    edges: [...GUARD_EDGES],
    packets: [{ from: "attacker", to: "m6Ecom", label: "forged", stopAt: 0.8 }],
    danger: ["attacker"],
    badges: { m6Spent: "untouched" },
  },
  { cue: 34, layout: { m6Ecom: [0, 1], salespoint: [3, 1] }, edges: [{ from: "m6Ecom", to: "salespoint" }] },
  { cue: 35, layout: { m6Ecom: [0, 1], salespoint: [3, 1] }, edges: [{ from: "m6Ecom", to: "salespoint" }], accent: ["salespoint"], badges: { salespoint: "own · switched on" } },
  { cue: 36, layout: SEND, edges: [...SEND_EDGE], accent: ["merchant"] },
  { cue: 37, layout: SEND, edges: [...SEND_EDGE], badges: { merchant: "website · order · amount" } },
  { cue: 38, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "sealed create" }] },
  { cue: 39, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "m6Ecom", to: "merchant", label: "answer" }] },
  { cue: 40, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "m6Ecom", to: "merchant", label: "page link" }], badges: { m6Ecom: "created" } },
  attack(42, "merchant", "same, unchanged", "checking"),
  attack(43, "merchant", "same, unchanged", "refused"),
  { ...attack(44, "merchant", "same, unchanged", "refused"), badges: { m6Ecom: "refused", m6Spent: "already used" } },
  attack(45, "attacker", "amount changed", "checking"),
  attack(46, "attacker", "amount changed", "body doesn't match"),
  attack(47, "attacker", "sealed long ago", "checking"),
  attack(48, "attacker", "sealed long ago", "not fresh"),
  {
    cue: 51,
    layout: { attacker: [0, 1], m6Ecom: [3, 1] },
    edges: [{ from: "attacker", to: "m6Ecom" }],
    packets: [{ from: "attacker", to: "m6Ecom", label: "leaked token" }],
    danger: ["attacker"],
  },
  { cue: 52, layout: { attacker: [0, 1], m6Ecom: [3, 1] }, edges: [{ from: "attacker", to: "m6Ecom" }], danger: ["attacker"], badges: { attacker: "a blank cheque" } },
  {
    cue: 53,
    layout: { attacker: [0, 1], m6Ecom: [1.5, 1], buyer: [3, 1] },
    edges: [{ from: "attacker", to: "m6Ecom" }, { from: "m6Ecom", to: "buyer" }],
    packets: [{ from: "attacker", to: "m6Ecom", label: "any amount" }, { from: "m6Ecom", to: "buyer", label: "fake page", delay: 60 }],
    danger: ["attacker"],
  },
  {
    cue: 54,
    layout: { attacker: [0, 1], m6Ecom: [3, 1] },
    edges: [{ from: "attacker", to: "m6Ecom" }],
    packets: [10, 30, 50, 70].map((delay) => ({ from: "attacker" as const, to: "m6Ecom" as const, label: "copy", delay, duration: 22 })),
    danger: ["attacker"],
  },
  { cue: 55, layout: SEAL, edges: [...SEAL_EDGES], accent: ["m6Letter"], badges: { m6Letter: "name · every number" } },
  { cue: 56, layout: GUARD, edges: [...GUARD_EDGES], accent: ["m6Spent"], badges: { m6Spent: "no copies" } },
  { cue: 57, layout: SAFE, edges: [...SAFE_EDGES], accent: ["m6KeySafe"], badges: { m6KeySafe: "nobody types it" } },
  wax(58, "back to the letter"),
  wax(59, "yours · unopened"),
  wax(60, "fresh"),
  wax(61, "the only one"),
  wax(62, "can't forge · can't copy"),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 6, current: ["merchant", "payment"], units: { ecom: "who wrote it?" } },
  { cue: 63, part: 6, current: ["merchant", "payment"], units: { ecom: "same payment twice" } },
];

const LIST = "screens/c-24-signed-requests/payments-one.png";
const ROW = [530, 200, 820, 525] as const;
export const screens: ScreenStep[] = [
  { cue: 41, src: LIST, title: "Merchant portal · Payments", region: [...ROW], focus: [[540, 260, 800, 80]] },
  { cue: 49, src: LIST, title: "Merchant portal · Payments", region: [...ROW], focus: [[540, 260, 800, 80]] },
];
