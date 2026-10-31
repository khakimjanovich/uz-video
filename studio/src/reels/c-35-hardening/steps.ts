import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 35: limits. The last seat (cues 0–1), the two limits (2–3), the daily race (4–7), the edge (8), the close (9).
const RACE = { m78Buyers: [0.3, 1], m78PerDay: [2.7, 1] } as const;
const RACE_EDGE = [{ from: "m78Buyers", to: "m78PerDay" }] as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 7, current: ["payment"] },
  { cue: 9, part: 7, current: ["vault", "cardsinfra"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The last seat.
  {
    cue: 1,
    layout: { m78Clerk1: [0, 1.8], m78Seat: [1.5, 0.3], m78Clerk2: [3, 1.8] },
    edges: [{ from: "m78Clerk1", to: "m78Seat" }, { from: "m78Clerk2", to: "m78Seat" }],
    packets: [{ from: "m78Clerk1", to: "m78Seat", label: "sell" }, { from: "m78Clerk2", to: "m78Seat", label: "sell", delay: 24, stopAt: 0.6 }],
    badges: { m78Seat: "sold once" },
  },
  // Two limits.
  {
    cue: 2,
    layout: { salespoint: [0.4, 1], m78PerPay: [2.6, 0.3], m78PerDay: [2.6, 1.8] },
    edges: [{ from: "salespoint", to: "m78PerPay" }, { from: "salespoint", to: "m78PerDay" }],
    accent: ["m78PerPay", "m78PerDay"],
  },
  {
    cue: 3,
    layout: { buyer: [0.4, 1], m78PerPay: [2.6, 1] },
    edges: [{ from: "buyer", to: "m78PerPay" }],
    packets: [{ from: "buyer", to: "m78PerPay", label: "too big", stopAt: 0.6 }],
    badges: { m78PerPay: "refused at once" },
  },
  // The daily race.
  {
    cue: 4,
    layout: RACE,
    edges: [...RACE_EDGE],
    packets: [0, 8, 16].map((d) => ({ from: "m78Buyers" as const, to: "m78PerDay" as const, label: "pay", delay: 15 + d })),
    badges: { m78PerDay: "all at once" },
    danger: ["m78PerDay"],
  },
  {
    cue: 5,
    layout: RACE,
    edges: [...RACE_EDGE],
    packets: [{ from: "m78Buyers", to: "m78PerDay", label: "reserve" }],
    badges: { m78PerDay: "only if it fits" },
    accent: ["m78PerDay"],
  },
  {
    cue: 6,
    layout: RACE,
    edges: [...RACE_EDGE],
    packets: ["1st", "2nd", "3rd"].map((label, k) => ({ from: "m78Buyers" as const, to: "m78PerDay" as const, label, delay: 10 + k * 35 })),
    badges: { m78PerDay: "one at a time" },
  },
  {
    cue: 7,
    layout: RACE,
    edges: [...RACE_EDGE],
    packets: [{ from: "m78Buyers", to: "m78PerDay", label: "no room", stopAt: 0.6 }],
    badges: { m78PerDay: "full", m78Buyers: "no money moved" },
  },
  // The edge.
  {
    cue: 8,
    layout: { buyer: [0, 0.3], attacker: [0, 1.9], m78EdgeDoor: [1.5, 1.1], m78Ecom: [3, 1.1] },
    edges: [{ from: "buyer", to: "m78EdgeDoor", label: "encrypted" }, { from: "attacker", to: "m78EdgeDoor" }, { from: "m78EdgeDoor", to: "m78Ecom" }],
    packets: [{ from: "buyer", to: "m78EdgeDoor", label: "small" }, { from: "attacker", to: "m78EdgeDoor", label: "old · huge", stopAt: 0.6, delay: 40 }],
    badges: { m78EdgeDoor: "modern only" },
    accent: ["m78EdgeDoor"],
  },
];
