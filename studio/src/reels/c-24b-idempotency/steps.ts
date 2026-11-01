import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 24b: the lift button. The lost answer and the retry (1–13), the lift (14–18), the idempotency key (19–23),
// three cases: replay, refused, the race (24–36), a fresh seal, the same key (37–41), the merchant's server (42–51),
// what it protects (52–57), the close (58–61).
const SEND = { merchant: [0, 1], m6Ecom: [3, 1] } as const;
const SEND_EDGE = [{ from: "merchant", to: "m6Ecom" }] as const;
const TWO = { merchant: [0, 1], m6Ecom: [1.5, 1], m6Page: [3, 0.2], m6Page2: [3, 1.8] } as const;
const TWO_EDGES = [...SEND_EDGE, { from: "m6Ecom", to: "m6Page" }, { from: "m6Ecom", to: "m6Page2" }] as const;
const LIFT = { buyer: [0, 1], m6Lift: [3, 1] } as const;
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
const lift = (cue: number, presses: number, badge?: string): DiagramStep<BuildId> => ({
  cue,
  layout: LIFT,
  edges: [{ from: "buyer", to: "m6Lift" }],
  packets: Array.from({ length: presses }, (_, i) => ({ from: "buyer" as const, to: "m6Lift" as const, label: "press", delay: 10 + i * 14, duration: 20 })),
  badges: badge ? { m6Lift: badge } : {},
});
const key = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: KEY, edges: [...KEY_EDGES], ...rest });

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: SEND, edges: [...SEND_EDGE], accent: ["merchant"] },
  send(2, "create payment"),
  { cue: 3, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "create", stopAt: 0.5 }] },
  { cue: 4, layout: SEND, edges: [...SEND_EDGE], badges: { m6Ecom: "arrived?" } },
  { cue: 5, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "m6Ecom", to: "merchant", label: "answer", stopAt: 0.5 }] },
  { cue: 6, layout: SEND, edges: [...SEND_EDGE], badges: { merchant: "which half?" } },
  send(7, "same again", { merchant: "retry" }),
  { cue: 8, layout: TWO, edges: [...TWO_EDGES], packets: [{ from: "m6Ecom", to: "m6Page2", label: "second" }], danger: ["m6Page2"] },
  { cue: 9, layout: TWO, edges: [...TWO_EDGES], danger: ["m6Page2"], badges: { m6Page: "one order", m6Page2: "one order" } },
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
  lift(14, 0),
  lift(15, 1, "lift called"),
  lift(16, 10),
  lift(17, 3, "one lift"),
  lift(18, 3, "a lift here"),
  send(19, "create"),
  { cue: 20, layout: { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] }, edges: [...SEND_EDGE], accent: ["m6IdemKey"], packets: [{ from: "merchant", to: "m6Ecom", label: "create + key" }] },
  { cue: 21, layout: { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] }, edges: [...SEND_EDGE], badges: { m6IdemKey: "order + counter" } },
  {
    cue: 22,
    layout: { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] },
    edges: [...SEND_EDGE],
    packets: [{ from: "merchant", to: "m6Ecom", label: "retry + same key" }],
    badges: { m6IdemKey: "same on every retry" },
  },
  key(23, { accent: ["m6Answer"], packets: [{ from: "m6Ecom", to: "m6Answer", label: "key · request · answer" }] }),
  key(24, { badges: { m6Ecom: "three cases" } }),
  key(25, { packets: [{ from: "merchant", to: "m6Ecom", label: "same key, same" }], badges: { m6IdemKey: "same key" } }),
  key(26, { badges: { m6Ecom: "creates nothing" } }),
  key(27, { packets: [{ from: "m6Answer", to: "m6Ecom", label: "first answer" }, { from: "m6Ecom", to: "merchant", label: "same page link", delay: 50 }] }),
  key(28, { badges: { merchant: "replay" } }),
  key(29, { packets: [{ from: "merchant", to: "m6Ecom", label: "same key, new amount", stopAt: 0.85 }], badges: { m6IdemKey: "same key" } }),
  key(30, { badges: { m6Ecom: "refused" } }),
  key(31, { badges: { m6Ecom: "never guesses" } }),
  key(32, {
    packets: [
      { from: "merchant", to: "m6Ecom", label: "retry" },
      { from: "merchant", to: "m6Ecom", label: "retry", delay: 8 },
    ],
  }),
  key(33, { badges: { m6Answer: "nothing saved yet" } }),
  key(34, { accent: ["m6Answer"], badges: { m6Answer: "written once" } }),
  key(35, { packets: [{ from: "m6Ecom", to: "m6Answer", label: "wins" }], badges: { m6Ecom: "one payment" } }),
  key(36, { packets: [{ from: "m6Ecom", to: "merchant", label: "winner's answer" }] }),
  { cue: 37, layout: SEAL, edges: [...SEND_EDGE], badges: {} },
  { cue: 38, layout: SEAL, edges: [...SEND_EDGE], accent: ["m6Letter"], badges: { m6Letter: "new time · new number" } },
  { cue: 39, layout: SEAL, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "new seal, same key" }] },
  { cue: 40, layout: { ...SEAL, attacker: [0, 2.1] }, edges: [...SEND_EDGE, { from: "attacker", to: "m6Ecom" }], packets: [{ from: "attacker", to: "m6Ecom", label: "copy", stopAt: 0.7 }], danger: ["attacker"], badges: { m6Letter: "stops copies" } },
  { cue: 41, layout: SEAL, edges: [...SEND_EDGE], accent: ["m6IdemKey"], badges: { m6IdemKey: "ties the retries" } },
  { cue: 42, layout: KEY, edges: [...KEY_EDGES], accent: ["merchant"] },
  key(43, { packets: [{ from: "merchant", to: "m6Ecom", label: "create + key" }] }),
  key(44, { packets: [{ from: "m6Ecom", to: "merchant", label: "answer", stopAt: 0.5 }] }),
  key(45, { packets: [{ from: "merchant", to: "m6Ecom", label: "sealed again, same key" }] }),
  key(46, { packets: [{ from: "m6Ecom", to: "merchant", label: "answer" }] }),
  key(47, { badges: { merchant: "replay · same link" } }),
  key(49, { packets: [{ from: "merchant", to: "m6Ecom", label: "same key, new amount", stopAt: 0.85 }] }),
  key(50, { badges: { m6Ecom: "key already used" } }),
  { cue: 52, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }] },
  { cue: 53, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }], packets: [{ from: "buyer", to: "m6Page", label: "pay once" }], badges: { buyer: "pays once" } },
  { cue: 54, layout: { shop: [1.5, 1] }, accent: ["shop"], badges: { shop: "no refunds · no calls" } },
  key(55, { packets: [{ from: "merchant", to: "m6Ecom", label: "in doubt? again" }], badges: { m6IdemKey: "same key" } }),
  {
    cue: 56,
    layout: { merchant: [0, 1], m6Page: [3, 0.2], m6Page2: [3, 1.8] },
    edges: [{ from: "merchant", to: "m6Page" }, { from: "merchant", to: "m6Page2" }],
    danger: ["m6Page2"],
    badges: { m6Page: "lost order?", m6Page2: "double charge?" },
  },
  key(57, { packets: [{ from: "merchant", to: "m6Ecom", label: "retry" }], badges: { merchant: "always safe" } }),
  lift(58, 0, "back to it"),
  lift(59, 10),
  {
    cue: 60,
    layout: { merchant: [0, 1], m6Ecom: [1.5, 1], m6Page: [3, 1] },
    edges: [...SEND_EDGE, { from: "m6Ecom", to: "m6Page" }],
    packets: [
      ...[10, 25, 40].map((delay) => ({ from: "merchant" as const, to: "m6Ecom" as const, label: "create", delay, duration: 20 })),
      { from: "m6Ecom", to: "m6Page", label: "one payment", delay: 70 },
    ],
    accent: ["m6Page"],
  },
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["merchant", "payment"], units: { ecom: "twice?" } },
  { cue: 61, part: 5, current: ["buyer", "payment"], units: { ecom: "payment page next" } },
];

const LIST = "screens/c-24b-idempotency/payments-one.png";
const ROW = [530, 200, 820, 525] as const;
export const screens: ScreenStep[] = [
  { cue: 48, src: LIST, title: "Merchant portal · Payments", region: [...ROW], focus: [[540, 260, 800, 80]] },
  { cue: 51, src: LIST, title: "Merchant portal · Payments", region: [...ROW], focus: [[540, 260, 800, 80]] },
];
