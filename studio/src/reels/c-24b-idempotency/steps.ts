import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 24b: the lift button. The lost answer and the retry (4–16), the lift (17–21), the idempotency key (22–26),
// three cases: replay, refused, the race (27–39), a fresh seal, the same key (40–44), the merchant's server (45–54),
// what it protects (55–60), the close (61–64).
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
  { cue: 4, layout: SEND, edges: [...SEND_EDGE], accent: ["merchant"] },
  send(5, "create payment"),
  { cue: 6, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "create", stopAt: 0.5 }] },
  { cue: 7, layout: SEND, edges: [...SEND_EDGE], badges: { m6Ecom: "arrived?" } },
  { cue: 8, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "m6Ecom", to: "merchant", label: "answer", stopAt: 0.5 }] },
  { cue: 9, layout: SEND, edges: [...SEND_EDGE], badges: { merchant: "which half?" } },
  send(10, "same again", { merchant: "retry" }),
  { cue: 11, layout: TWO, edges: [...TWO_EDGES], packets: [{ from: "m6Ecom", to: "m6Page2", label: "second" }], danger: ["m6Page2"] },
  { cue: 12, layout: TWO, edges: [...TWO_EDGES], danger: ["m6Page2"], badges: { m6Page: "one order", m6Page2: "one order" } },
  {
    cue: 13,
    layout: { buyer: [0, 1], m6Page: [3, 0.2], m6Page2: [3, 1.8] },
    edges: [{ from: "buyer", to: "m6Page" }, { from: "buyer", to: "m6Page2" }],
    packets: [{ from: "buyer", to: "m6Page", label: "pay" }, { from: "buyer", to: "m6Page2", label: "pay", delay: 40 }],
    danger: ["m6Page2"],
  },
  {
    cue: 14,
    layout: { buyer: [0, 1], shop: [3, 1] },
    edges: [{ from: "shop", to: "buyer" }],
    packets: [{ from: "shop", to: "buyer", label: "money back" }],
    badges: { buyer: "lost trust" },
  },
  send(15, "retry", { merchant: "right" }),
  { cue: 16, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "retry" }], badges: { m6Ecom: "new or old?" } },
  lift(17, 0),
  lift(18, 1, "lift called"),
  lift(19, 10),
  lift(20, 3, "one lift"),
  lift(21, 3, "a lift here"),
  send(22, "create"),
  { cue: 23, layout: { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] }, edges: [...SEND_EDGE], accent: ["m6IdemKey"], packets: [{ from: "merchant", to: "m6Ecom", label: "create + key" }] },
  { cue: 24, layout: { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] }, edges: [...SEND_EDGE], badges: { m6IdemKey: "order + counter" } },
  {
    cue: 25,
    layout: { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] },
    edges: [...SEND_EDGE],
    packets: [{ from: "merchant", to: "m6Ecom", label: "retry + same key" }],
    badges: { m6IdemKey: "same on every retry" },
  },
  key(26, { accent: ["m6Answer"], packets: [{ from: "m6Ecom", to: "m6Answer", label: "key · request · answer" }] }),
  key(27, { badges: { m6Ecom: "three cases" } }),
  key(28, { packets: [{ from: "merchant", to: "m6Ecom", label: "same key, same" }], badges: { m6IdemKey: "same key" } }),
  key(29, { badges: { m6Ecom: "creates nothing" } }),
  key(30, { packets: [{ from: "m6Answer", to: "m6Ecom", label: "first answer" }, { from: "m6Ecom", to: "merchant", label: "same page link", delay: 50 }] }),
  key(31, { badges: { merchant: "replay" } }),
  key(32, { packets: [{ from: "merchant", to: "m6Ecom", label: "same key, new amount", stopAt: 0.85 }], badges: { m6IdemKey: "same key" } }),
  key(33, { badges: { m6Ecom: "refused" } }),
  key(34, { badges: { m6Ecom: "never guesses" } }),
  key(35, {
    packets: [
      { from: "merchant", to: "m6Ecom", label: "retry" },
      { from: "merchant", to: "m6Ecom", label: "retry", delay: 8 },
    ],
  }),
  key(36, { badges: { m6Answer: "nothing saved yet" } }),
  key(37, { accent: ["m6Answer"], badges: { m6Answer: "written once" } }),
  key(38, { packets: [{ from: "m6Ecom", to: "m6Answer", label: "wins" }], badges: { m6Ecom: "one payment" } }),
  key(39, { packets: [{ from: "m6Ecom", to: "merchant", label: "winner's answer" }] }),
  { cue: 40, layout: SEAL, edges: [...SEND_EDGE], badges: {} },
  { cue: 41, layout: SEAL, edges: [...SEND_EDGE], accent: ["m6Letter"], badges: { m6Letter: "new time · new number" } },
  { cue: 42, layout: SEAL, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "new seal, same key" }] },
  { cue: 43, layout: { ...SEAL, attacker: [0, 2.1] }, edges: [...SEND_EDGE, { from: "attacker", to: "m6Ecom" }], packets: [{ from: "attacker", to: "m6Ecom", label: "copy", stopAt: 0.7 }], danger: ["attacker"], badges: { m6Letter: "stops copies" } },
  { cue: 44, layout: SEAL, edges: [...SEND_EDGE], accent: ["m6IdemKey"], badges: { m6IdemKey: "ties the retries" } },
  { cue: 45, layout: KEY, edges: [...KEY_EDGES], accent: ["merchant"] },
  key(46, { packets: [{ from: "merchant", to: "m6Ecom", label: "create + key" }] }),
  key(47, { packets: [{ from: "m6Ecom", to: "merchant", label: "answer", stopAt: 0.5 }] }),
  key(48, { packets: [{ from: "merchant", to: "m6Ecom", label: "sealed again, same key" }] }),
  key(49, { packets: [{ from: "m6Ecom", to: "merchant", label: "answer" }] }),
  key(50, { badges: { merchant: "replay · same link" } }),
  key(52, { packets: [{ from: "merchant", to: "m6Ecom", label: "same key, new amount", stopAt: 0.85 }] }),
  key(53, { badges: { m6Ecom: "key already used" } }),
  { cue: 55, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }] },
  { cue: 56, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }], packets: [{ from: "buyer", to: "m6Page", label: "pay once" }], badges: { buyer: "pays once" } },
  { cue: 57, layout: { shop: [1.5, 1] }, accent: ["shop"], badges: { shop: "no refunds · no calls" } },
  key(58, { packets: [{ from: "merchant", to: "m6Ecom", label: "in doubt? again" }], badges: { m6IdemKey: "same key" } }),
  {
    cue: 59,
    layout: { merchant: [0, 1], m6Page: [3, 0.2], m6Page2: [3, 1.8] },
    edges: [{ from: "merchant", to: "m6Page" }, { from: "merchant", to: "m6Page2" }],
    danger: ["m6Page2"],
    badges: { m6Page: "lost order?", m6Page2: "double charge?" },
  },
  key(60, { packets: [{ from: "merchant", to: "m6Ecom", label: "retry" }], badges: { merchant: "always safe" } }),
  lift(61, 0, "back to it"),
  lift(62, 10),
  {
    cue: 63,
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
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 5, current: ["merchant", "payment"] },
  { cue: 2, part: 5, current: ["merchant", "payment"] },
  { cue: 3, part: 5, current: ["payment"] },
  { cue: 64, part: 5, current: ["buyer", "payment"], units: { ecom: "payment page next" } },
];

const LIST = "screens/c-24b-idempotency/payments-one.png";
const ROW = [530, 200, 820, 525] as const;
export const screens: ScreenStep[] = [
  { cue: 51, src: LIST, title: "Merchant portal · Payments", region: [...ROW], focus: [[540, 260, 800, 80]] },
  { cue: 54, src: LIST, title: "Merchant portal · Payments", region: [...ROW], focus: [[540, 260, 800, 80]] },
];
