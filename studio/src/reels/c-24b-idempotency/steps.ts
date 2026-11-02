import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 24b: order 1042 on the eighth of March. The lost answer (0–4), the bridge (5–6), the retry and two payments (7–13),
// the idempotency key (15–18), three cases: replay, refused, the race (19–31), a fresh seal, the same key (32–37),
// order 1042 again and the edge (38–48), the rule and what it protects (49–52), next (52).
const SEND = { merchant: [0, 1], m6Ecom: [3, 1] } as const;
const SEND_EDGE = [{ from: "merchant", to: "m6Ecom" }] as const;
const TWO = { merchant: [0, 1], m6Ecom: [1.5, 1], m6Page: [3, 0.2], m6Page2: [3, 1.8] } as const;
const TWO_EDGES = [...SEND_EDGE, { from: "m6Ecom", to: "m6Page" }, { from: "m6Ecom", to: "m6Page2" }] as const;
const KEY = { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1], m6Answer: [3, 2.1] } as const;
const KEY_EDGES = [...SEND_EDGE, { from: "m6Ecom", to: "m6Answer" }] as const;
const SEAL = { merchant: [0, 1], m6Letter: [1.5, 2.1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] } as const;
const send = (cue: number, label: string, badges: Partial<Record<BuildId, string>> = {}): DiagramStep<BuildId> => ({
  cue,
  layout: SEND,
  edges: [...SEND_EDGE],
  packets: [{ from: "merchant", to: "m6Ecom", label }],
  badges,
});
const key = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: KEY, edges: [...KEY_EDGES], ...rest });

export const diagram: DiagramStep<BuildId>[] = [
  // The eighth of March, order 1042, and a lost answer.
  { cue: 0, layout: { buyer: [0, 1], shop: [3, 1] }, edges: [{ from: "buyer", to: "shop" }], badges: { shop: "8 March · busiest" } },
  { cue: 1, layout: { buyer: [0, 1], shop: [3, 1] }, edges: [{ from: "buyer", to: "shop" }], packets: [{ from: "buyer", to: "shop", label: "pay · order 1042" }], badges: { shop: "18:10" } },
  { cue: 2, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "create", stopAt: 0.5 }], badges: { merchant: "network hiccup" } },
  { cue: 3, layout: SEND, edges: [...SEND_EDGE], badges: { m6Ecom: "arrived?" } },
  { cue: 4, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "m6Ecom", to: "merchant", label: "answer", stopAt: 0.5 }], badges: { merchant: "which half?" } },
  // The retry, and a second payment.
  send(7, "same again", { merchant: "retry" }),
  { cue: 8, layout: TWO, edges: [...TWO_EDGES], packets: [{ from: "m6Ecom", to: "m6Page2", label: "second" }], danger: ["m6Page2"] },
  { cue: 9, layout: TWO, edges: [...TWO_EDGES], danger: ["m6Page2"], badges: { m6Page: "one bouquet", m6Page2: "one bouquet" } },
  {
    cue: 10,
    layout: { buyer: [0, 1], m6Page: [3, 0.2], m6Page2: [3, 1.8] },
    edges: [{ from: "buyer", to: "m6Page" }, { from: "buyer", to: "m6Page2" }],
    packets: [{ from: "buyer", to: "m6Page", label: "pay" }, { from: "buyer", to: "m6Page2", label: "pay", delay: 40 }],
    danger: ["m6Page2"],
  },
  {
    cue: 11,
    layout: { buyer: [0, 1], shop: [3, 1] },
    edges: [{ from: "shop", to: "buyer" }],
    packets: [{ from: "shop", to: "buyer", label: "money back" }],
    badges: { buyer: "lost trust" },
  },
  send(12, "retry", { merchant: "right" }),
  { cue: 13, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "retry" }], badges: { m6Ecom: "new or old?" } },
  // The idempotency key.
  { cue: 15, layout: { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] }, edges: [...SEND_EDGE], accent: ["m6IdemKey"], packets: [{ from: "merchant", to: "m6Ecom", label: "create + key" }] },
  { cue: 16, layout: { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] }, edges: [...SEND_EDGE], badges: { m6IdemKey: "order + counter" } },
  {
    cue: 17,
    layout: { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] },
    edges: [...SEND_EDGE],
    packets: [{ from: "merchant", to: "m6Ecom", label: "retry + same key" }],
    badges: { m6IdemKey: "same on every retry" },
  },
  key(18, { accent: ["m6Answer"], packets: [{ from: "m6Ecom", to: "m6Answer", label: "key · request · answer" }] }),
  // Three cases.
  key(19, { badges: { m6Ecom: "three cases" } }),
  key(20, { packets: [{ from: "merchant", to: "m6Ecom", label: "same key, same" }], badges: { m6IdemKey: "same key" } }),
  key(21, { badges: { m6Ecom: "creates nothing" } }),
  key(22, { packets: [{ from: "m6Answer", to: "m6Ecom", label: "first answer" }, { from: "m6Ecom", to: "merchant", label: "same page link", delay: 50 }] }),
  key(23, { badges: { merchant: "replay" } }),
  key(24, { packets: [{ from: "merchant", to: "m6Ecom", label: "same key, new amount", stopAt: 0.85 }], badges: { m6IdemKey: "same key" } }),
  key(25, { badges: { m6Ecom: "refused" } }),
  key(26, { badges: { m6Ecom: "never guesses" } }),
  key(27, {
    packets: [
      { from: "merchant", to: "m6Ecom", label: "retry" },
      { from: "merchant", to: "m6Ecom", label: "retry", delay: 8 },
    ],
  }),
  key(28, { badges: { m6Answer: "nothing saved yet" } }),
  key(29, { accent: ["m6Answer"], badges: { m6Answer: "written once" } }),
  key(30, { packets: [{ from: "m6Ecom", to: "m6Answer", label: "wins" }], badges: { m6Ecom: "one payment" } }),
  key(31, { packets: [{ from: "m6Ecom", to: "merchant", label: "winner's answer" }] }),
  // A fresh seal, the same key.
  { cue: 32, layout: SEAL, edges: [...SEND_EDGE], badges: {} },
  { cue: 33, layout: SEAL, edges: [...SEND_EDGE], accent: ["m6Letter"], badges: { m6Letter: "new time · new number" } },
  { cue: 34, layout: SEAL, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "new seal, same key" }] },
  { cue: 35, layout: { ...SEAL, attacker: [0, 2.1] }, edges: [...SEND_EDGE, { from: "attacker", to: "m6Ecom" }], packets: [{ from: "attacker", to: "m6Ecom", label: "copy", stopAt: 0.7 }], danger: ["attacker"], badges: { m6Letter: "stops copies" } },
  { cue: 36, layout: SEAL, edges: [...SEND_EDGE], accent: ["m6IdemKey"], badges: { m6IdemKey: "ties the retries" } },
  { cue: 37, layout: SEAL, edges: [...SEND_EDGE], accent: ["m6Letter", "m6IdemKey"], badges: { m6Letter: "refuses repeats", m6IdemKey: "welcomes them" } },
  // Order 1042 again.
  { cue: 38, layout: KEY, edges: [...KEY_EDGES], accent: ["merchant"], badges: { merchant: "order 1042" } },
  key(39, { packets: [{ from: "merchant", to: "m6Ecom", label: "create + key" }] }),
  key(40, { packets: [{ from: "m6Ecom", to: "merchant", label: "answer", stopAt: 0.5 }] }),
  key(41, { packets: [{ from: "merchant", to: "m6Ecom", label: "sealed again, same key" }] }),
  key(42, { packets: [{ from: "m6Ecom", to: "merchant", label: "answer" }] }),
  key(43, { badges: { merchant: "replay · same link" } }),
  key(45, { accent: ["merchant"], badges: { merchant: "tests the edge" } }),
  key(46, { packets: [{ from: "merchant", to: "m6Ecom", label: "same key, new amount", stopAt: 0.85 }] }),
  key(47, { badges: { m6Ecom: "key already used" } }),
  // The rule, and what it protects.
  key(49, { badges: { merchant: "the simplest rule" } }),
  key(50, { packets: [{ from: "merchant", to: "m6Ecom", label: "in doubt? again" }], badges: { m6IdemKey: "same key" } }),
  {
    cue: 51,
    layout: { merchant: [0, 1], m6Page: [3, 0.2], m6Page2: [3, 1.8] },
    edges: [{ from: "merchant", to: "m6Page" }, { from: "merchant", to: "m6Page2" }],
    danger: ["m6Page2"],
    badges: { m6Page: "lost order?", m6Page2: "double charge?" },
  },
  {
    cue: 52,
    layout: { buyer: [0, 1], m6Page: [1.5, 1], shop: [3, 1] },
    edges: [{ from: "buyer", to: "m6Page" }],
    packets: [{ from: "buyer", to: "m6Page", label: "pay once" }],
    accent: ["shop"],
    badges: { buyer: "pays once", shop: "nothing back" },
  },
  key(53, { accent: ["m6IdemKey"], badges: { m6IdemKey: "same key · one payment" } }),
  key(54, { badges: { m6IdemKey: "same key, same request: ?" } }),
  key(55, { packets: [{ from: "m6Ecom", to: "merchant", label: "first answer" }], accent: ["m6Answer"], badges: { m6Answer: "nothing created" } }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["merchant", "payment"], units: { ecom: "twice?" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 5, part: 5, current: ["merchant", "payment"] },
  { cue: 6, part: 5, current: ["payment"] },
  { cue: 56, part: 5, current: ["buyer", "payment"], units: { ecom: "payment page next" } },
];

const LIST = "screens/c-24b-idempotency/payments-one.png";
const ROW = [530, 200, 820, 525] as const;
export const screens: ScreenStep[] = [
  { cue: 44, src: LIST, title: "Merchant portal · Payments", region: [...ROW], focus: [[540, 260, 800, 80]] },
  { cue: 48, src: LIST, title: "Merchant portal · Payments", region: [...ROW], focus: [[540, 260, 800, 80]] },
];
