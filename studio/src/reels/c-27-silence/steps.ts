import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 27: silent tracking. The silent network (0), the parcel (1–3), the unknown charge (4),
// the durable workflow and its three outcomes (5–8), the deadline and manual review (9), the close (10).
const PARCEL = { buyer: [0, 1], m6Parcel: [1.5, 1], m6Tracking: [3, 1] } as const;
const PARCEL_EDGES = [{ from: "buyer", to: "m6Parcel" }, { from: "m6Parcel", to: "m6Tracking" }] as const;
const ASK = { m6Ecom: [0, 1], m6Workflow: [1.5, 1], network: [3, 1] } as const;
const ASK_EDGES = [{ from: "m6Ecom", to: "m6Workflow" }, { from: "m6Workflow", to: "network" }] as const;
const reply = (label: string) => [{ from: "m6Workflow" as const, to: "network" as const, label: "this charge?" }, { from: "network" as const, to: "m6Workflow" as const, label, delay: 50 }];

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 0,
    layout: { m6Ecom: [0, 1], network: [3, 1] },
    edges: [{ from: "m6Ecom", to: "network" }],
    packets: [{ from: "m6Ecom", to: "network", label: "charge" }, { from: "network", to: "m6Ecom", label: "…", delay: 50, stopAt: 0.4 }],
    danger: ["network"],
  },
  { cue: 1, layout: PARCEL, edges: [...PARCEL_EDGES], packets: [{ from: "buyer", to: "m6Parcel", label: "sent" }], badges: { m6Tracking: "nothing" } },
  {
    cue: 2,
    layout: { ...PARCEL, m6Parcel2: [1.5, 2.1] },
    edges: [...PARCEL_EDGES],
    crossed: ["m6Parcel2"],
    badges: { m6Tracking: "nothing" },
  },
  {
    cue: 3,
    layout: { buyer: [0, 1], m6Tracking: [3, 0.2], m6PostOffice: [3, 1.8] },
    edges: [{ from: "buyer", to: "m6Tracking" }, { from: "buyer", to: "m6PostOffice" }],
    packets: [
      { from: "buyer", to: "m6Tracking", label: "check", delay: 5, duration: 20 },
      { from: "buyer", to: "m6Tracking", label: "check", delay: 35, duration: 20 },
      { from: "buyer", to: "m6Tracking", label: "check", delay: 85, duration: 20 },
      { from: "buyer", to: "m6PostOffice", label: "ask", delay: 150 },
    ],
    accent: ["m6PostOffice"],
  },
  {
    cue: 4,
    layout: { m6Ecom: [0, 1], m6Unknown: [1.5, 1], network: [3, 1] },
    edges: [{ from: "m6Ecom", to: "m6Unknown" }, { from: "m6Unknown", to: "network" }],
    packets: [{ from: "m6Unknown", to: "network", label: "again?", delay: 40, stopAt: 0.3 }],
    badges: { m6Unknown: "not declined" },
  },
  {
    cue: 5,
    layout: ASK,
    edges: [...ASK_EDGES],
    packets: [10, 45, 110].map((delay) => ({ from: "m6Workflow" as const, to: "network" as const, label: "this charge?", delay, duration: 25 })),
    accent: ["m6Workflow"],
    badges: { m6Workflow: "longer each time" },
  },
  { cue: 6, layout: ASK, edges: [...ASK_EDGES], packets: reply("found"), accent: ["m6Ecom"], badges: { m6Ecom: "paid" } },
  { cue: 7, layout: ASK, edges: [...ASK_EDGES], packets: reply("not found"), badges: { m6Ecom: "declined" } },
  {
    cue: 8,
    layout: ASK,
    edges: [...ASK_EDGES],
    packets: [{ from: "network", to: "m6Workflow", label: "found, late" }, { from: "m6Workflow", to: "network", label: "money back", delay: 60 }],
    badges: { m6Ecom: "page closed" },
  },
  {
    cue: 9,
    layout: { m6Ecom: [0, 0.4], m6Workflow: [1.5, 0.4], network: [3, 0.4], review: [1.5, 2] },
    edges: [...ASK_EDGES, { from: "m6Workflow", to: "review" }],
    packets: [{ from: "m6Workflow", to: "review", label: "still unknown", delay: 40 }],
    accent: ["review"],
    badges: { m6Workflow: "before the deadline", review: "a person decides" },
  },
];

export const map: BuildMapStep[] = [{ cue: 10, part: 6, current: ["payment", "temporal", "merchant"], units: { ecom: "the shop hears" } }];
