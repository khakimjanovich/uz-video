import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 26: one slip at the cash desk. Once (0), the cash desk (1), the claim, terminal and fee (3–5),
// the logbook first (6), the charge through the card zone (7–8), three answers (9–11), the close (12).
const DESK = { m6Cashier: [0, 1], m6Logbook: [1.5, 1], m6Drawer: [3, 1] } as const;
const FIND = { m6Claim: [0.4, 1], m6Terminal: [1.8, 0.2], m6Fee: [1.8, 1.8] } as const;
const FIND_EDGES = [{ from: "m6Claim", to: "m6Terminal" }, { from: "m6Claim", to: "m6Fee" }] as const;
const CHARGE = { m6Ecom: [0, 1], m6Zone: [1.5, 1], network: [3, 1] } as const;
const CHARGE_EDGES = [{ from: "m6Ecom", to: "m6Zone" }, { from: "m6Zone", to: "network" }] as const;
const ZONE_WALL = { label: "Card zone", from: [1.5, 1], to: [1.5, 1], tone: "wall" } as const;
const answer = (label: string) => [{ from: "network" as const, to: "m6Zone" as const, label }, { from: "m6Zone" as const, to: "m6Ecom" as const, label, delay: 50 }];

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 0,
    layout: { buyer: [0, 1], network: [3, 1] },
    edges: [{ from: "buyer", to: "network" }],
    packets: [{ from: "buyer", to: "network", label: "charge" }],
    badges: { network: "exactly once" },
  },
  {
    cue: 1,
    layout: DESK,
    edges: [{ from: "m6Cashier", to: "m6Logbook" }, { from: "m6Logbook", to: "m6Drawer" }],
    packets: [{ from: "m6Cashier", to: "m6Logbook", label: "write", delay: 40 }, { from: "m6Logbook", to: "m6Drawer", label: "open", delay: 110 }],
    badges: { m6Cashier: "one slip" },
  },
  {
    cue: 3,
    layout: { buyer: [0, 0.2], merchant: [0, 1.8], m6Claim: [1.5, 1], m6Ecom: [3, 1] },
    edges: [{ from: "buyer", to: "m6Claim" }, { from: "merchant", to: "m6Claim" }, { from: "m6Claim", to: "m6Ecom" }],
    packets: [
      { from: "buyer", to: "m6Claim", label: "click", delay: 10 },
      { from: "merchant", to: "m6Claim", label: "retry", delay: 20 },
      { from: "buyer", to: "m6Claim", label: "click", delay: 35 },
      { from: "m6Claim", to: "m6Ecom", label: "one wins", delay: 75 },
    ],
    accent: ["m6Claim"],
  },
  { cue: 4, layout: FIND, edges: [...FIND_EDGES], packets: [{ from: "m6Claim", to: "m6Terminal", label: "find" }, { from: "m6Claim", to: "m6Fee", label: "find", delay: 30 }], accent: ["m6Terminal", "m6Fee"] },
  { cue: 5, layout: FIND, edges: [...FIND_EDGES], danger: ["m6Terminal"], crossed: ["m6Terminal"], badges: { m6Claim: "nothing charged" } },
  {
    cue: 6,
    layout: { m6Claim: [0, 1], m6Logbook: [1.5, 1], network: [3, 1] },
    edges: [{ from: "m6Claim", to: "m6Logbook" }, { from: "m6Logbook", to: "network" }],
    packets: [{ from: "m6Claim", to: "m6Logbook", label: "charge" }],
    accent: ["m6Logbook"],
    badges: { network: "not yet" },
  },
  {
    cue: 7,
    layout: CHARGE,
    edges: [...CHARGE_EDGES],
    frames: [ZONE_WALL],
    packets: [
      { from: "m6Ecom", to: "m6Zone", label: "token + id" },
      { from: "m6Ecom", to: "m6Zone", label: "token + id", delay: 50 },
      { from: "m6Zone", to: "network", label: "once", delay: 95 },
    ],
    badges: { m6Zone: "charged once" },
  },
  {
    cue: 8,
    layout: CHARGE,
    edges: [...CHARGE_EDGES],
    frames: [ZONE_WALL],
    packets: [{ from: "m6Zone", to: "network", label: "take it" }],
    badges: { network: "holds first", m6Zone: "takes at once" },
  },
  { cue: 9, layout: CHARGE, edges: [...CHARGE_EDGES], frames: [ZONE_WALL], packets: answer("approved"), accent: ["m6Ecom"], badges: { m6Ecom: "paid" } },
  { cue: 10, layout: CHARGE, edges: [...CHARGE_EDGES], frames: [ZONE_WALL], packets: answer("declined"), badges: { m6Ecom: "final" } },
  {
    cue: 11,
    layout: CHARGE,
    edges: [...CHARGE_EDGES],
    frames: [ZONE_WALL],
    packets: [{ from: "m6Zone", to: "network", label: "charge", stopAt: 0.6 }],
    danger: ["network"],
    badges: { m6Ecom: "unknown" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 2, part: 6, current: ["payment", "procport", "card"], units: { ecom: "charge" } },
  { cue: 12, part: 6, current: ["payment", "procport", "adapters", "procsvc"], units: { cards: "silent?" } },
];
