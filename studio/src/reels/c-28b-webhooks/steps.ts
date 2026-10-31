import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 28b: a registered letter. The question (0), the letter (1), the webhook, its signature,
// public addresses only, retries and asking again (2–6), the close (7).
const HOOK = { m6Ecom: [0, 1], m6Hook: [3, 1] } as const;
const HOOK_EDGE = [{ from: "m6Ecom", to: "m6Hook" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { m6Ecom: [0, 1], merchant: [3, 1] }, edges: [{ from: "m6Ecom", to: "merchant" }], packets: [{ from: "m6Ecom", to: "merchant", label: "paid" }] },
  {
    cue: 1,
    layout: { m6Postman: [0, 1], m6Registered: [1.5, 1], m6Street: [3, 1] },
    edges: [{ from: "m6Postman", to: "m6Registered" }, { from: "m6Registered", to: "m6Street" }],
    packets: [{ from: "m6Registered", to: "m6Street", label: "letter", delay: 40 }, { from: "m6Registered", to: "m6Street", label: "again", delay: 120 }],
    badges: { m6Street: "nobody home" },
  },
  { cue: 2, layout: HOOK, edges: [...HOOK_EDGE], packets: [{ from: "m6Ecom", to: "m6Hook", label: "payment event" }], accent: ["m6Hook"] },
  {
    cue: 3,
    layout: { ...HOOK, attacker: [1.5, 2.1] },
    edges: [...HOOK_EDGE],
    packets: [{ from: "m6Ecom", to: "m6Hook", label: "signed" }, { from: "attacker", to: "m6Hook", label: "forged", delay: 50, stopAt: 0.85 }],
    badges: { m6Hook: "real or forged?" },
  },
  {
    cue: 4,
    layout: { ...HOOK, m6Inside: [1.5, 2.1] },
    edges: [...HOOK_EDGE],
    frames: [{ label: "Inside the bank", from: [1.5, 2.1], to: [1.5, 2.1], tone: "wall" }],
    packets: [{ from: "m6Ecom", to: "m6Inside", label: "event", stopAt: 0.5 }],
    badges: { m6Hook: "public only" },
  },
  {
    cue: 5,
    layout: HOOK,
    edges: [...HOOK_EDGE],
    packets: [10, 45, 110].map((delay) => ({ from: "m6Ecom" as const, to: "m6Hook" as const, label: "try", delay, duration: 25, stopAt: 0.8 })),
    danger: ["m6Hook"],
    badges: { m6Hook: "undelivered" },
  },
  {
    cue: 6,
    layout: HOOK,
    edges: [...HOOK_EDGE],
    packets: [{ from: "m6Hook", to: "m6Ecom", label: "send again" }, { from: "m6Ecom", to: "m6Hook", label: "event", delay: 55 }],
    accent: ["m6Hook"],
  },
];

export const map: BuildMapStep[] = [{ cue: 7, part: 6, current: ["merchant", "payment"], units: { ecom: "no website?" } }];
