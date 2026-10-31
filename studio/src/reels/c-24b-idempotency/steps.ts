import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 24b: the lift button. The lost answer and the retry (0–3), the lift (4),
// the idempotency key: replay, refused, the race (5–8), one payment (9), the close (10).
const SEND = { merchant: [0, 1], m6Ecom: [3, 1] } as const;
const SEND_EDGE = [{ from: "merchant", to: "m6Ecom" }] as const;
const KEY = { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1], m6Answer: [3, 2.1] } as const;
const KEY_EDGES = [...SEND_EDGE, { from: "m6Ecom", to: "m6Answer" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 0,
    layout: SEND,
    edges: [...SEND_EDGE],
    packets: [{ from: "merchant", to: "m6Ecom", label: "create" }, { from: "merchant", to: "m6Ecom", label: "create", delay: 55 }],
    badges: { m6Ecom: "twice?" },
  },
  {
    cue: 1,
    layout: SEND,
    edges: [...SEND_EDGE],
    packets: [{ from: "merchant", to: "m6Ecom", label: "create payment" }, { from: "m6Ecom", to: "merchant", label: "answer", delay: 55, stopAt: 0.5 }],
    badges: { merchant: "no answer" },
  },
  { cue: 2, layout: SEND, edges: [...SEND_EDGE], packets: [{ from: "merchant", to: "m6Ecom", label: "same again" }], badges: { merchant: "retry" } },
  {
    cue: 3,
    layout: { merchant: [0, 1], m6Ecom: [1.5, 1], m6Page: [3, 0.2], m6Page2: [3, 1.8] },
    edges: [...SEND_EDGE, { from: "m6Ecom", to: "m6Page" }, { from: "m6Ecom", to: "m6Page2" }],
    danger: ["m6Page2"],
    badges: { m6Page2: "pay twice?" },
  },
  {
    cue: 4,
    layout: { buyer: [0, 1], m6Lift: [2, 1] },
    edges: [{ from: "buyer", to: "m6Lift" }],
    packets: [10, 25, 40].map((delay) => ({ from: "buyer" as const, to: "m6Lift" as const, label: "press", delay, duration: 20 })),
    badges: { m6Lift: "one lift" },
  },
  {
    cue: 5,
    layout: { merchant: [0, 1], m6IdemKey: [1.5, 0], m6Ecom: [3, 1] },
    edges: [...SEND_EDGE],
    accent: ["m6IdemKey"],
    packets: [{ from: "merchant", to: "m6Ecom", label: "create + key" }],
  },
  {
    cue: 6,
    layout: KEY,
    edges: [...KEY_EDGES],
    packets: [{ from: "merchant", to: "m6Ecom", label: "same key, same" }, { from: "m6Ecom", to: "merchant", label: "first answer", delay: 60 }],
    accent: ["m6Answer"],
    badges: { merchant: "replay", m6IdemKey: "same key" },
  },
  {
    cue: 7,
    layout: KEY,
    edges: [...KEY_EDGES],
    packets: [{ from: "merchant", to: "m6Ecom", label: "same key, new body", stopAt: 0.85 }],
    badges: { m6Ecom: "refused", m6IdemKey: "same key" },
  },
  {
    cue: 8,
    layout: KEY,
    edges: [...KEY_EDGES],
    packets: [
      { from: "merchant", to: "m6Ecom", label: "retry" },
      { from: "merchant", to: "m6Ecom", label: "retry", delay: 32 },
      { from: "m6Ecom", to: "merchant", label: "winner's answer", delay: 80 },
    ],
    badges: { m6Ecom: "one wins", m6IdemKey: "same key" },
  },
  {
    cue: 9,
    layout: { merchant: [0, 1], m6Ecom: [1.5, 1], m6Page: [3, 1] },
    edges: [...SEND_EDGE, { from: "m6Ecom", to: "m6Page" }],
    packets: [
      ...[10, 25, 40].map((delay) => ({ from: "merchant" as const, to: "m6Ecom" as const, label: "create", delay, duration: 20 })),
      { from: "m6Ecom", to: "m6Page", label: "one payment", delay: 70 },
    ],
    accent: ["m6Page"],
  },
];

export const map: BuildMapStep[] = [{ cue: 10, part: 6, current: ["buyer", "payment"], units: { ecom: "one payment" } }];
