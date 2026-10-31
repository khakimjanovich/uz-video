import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 30: crossing out, or handing back. Money back (0), the tab book: reversal or refund (1–4),
// the cap and the window (5), claim, logbook, card zone and the answers (6–8), refund on request (9), the close (10).
const BOOK = { tabBook: [0, 1], m6Reversal: [2.2, 0.2], m6Refund: [2.2, 1.8] } as const;
const ASK = { m6Claim: [0, 1], m6Logbook: [1.5, 1], m6Zone: [3, 1] } as const;
const ASK_EDGES = [{ from: "m6Claim", to: "m6Logbook" }, { from: "m6Logbook", to: "m6Zone" }] as const;
const ZONE_WALL = { label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { merchant: [0, 1], buyer: [3, 1] }, edges: [{ from: "merchant", to: "buyer" }], packets: [{ from: "merchant", to: "buyer", label: "money back" }] },
  { cue: 1, layout: { tabBook: [1.5, 1] }, accent: ["tabBook"] },
  { cue: 2, layout: { tabBook: [0, 1], m6Reversal: [2.2, 0.2] }, edges: [{ from: "tabBook", to: "m6Reversal" }], crossed: ["tabBook"], badges: { m6Reversal: "same day" } },
  {
    cue: 3,
    layout: BOOK,
    edges: [{ from: "tabBook", to: "m6Reversal" }, { from: "tabBook", to: "m6Refund" }],
    packets: [{ from: "tabBook", to: "m6Refund", label: "money back" }],
    badges: { m6Reversal: "same day", m6Refund: "after the day" },
  },
  {
    cue: 4,
    layout: { m6Clock: [0, 1], m6Reversal: [2.2, 0.2], m6Refund: [2.2, 1.8] },
    edges: [{ from: "m6Clock", to: "m6Reversal" }, { from: "m6Clock", to: "m6Refund" }],
    accent: ["m6Clock"],
    badges: { m6Reversal: "whole amount", m6Refund: "whole amount" },
  },
  {
    cue: 5,
    layout: { merchant: [0, 1], m6Paid: [2.5, 1] },
    edges: [{ from: "merchant", to: "m6Paid" }],
    packets: [{ from: "merchant", to: "m6Paid", label: "give back" }],
    badges: { m6Paid: "refund cap · window" },
  },
  {
    cue: 6,
    layout: ASK,
    edges: [...ASK_EDGES],
    frames: [ZONE_WALL],
    packets: [{ from: "m6Claim", to: "m6Logbook", label: "refund" }, { from: "m6Logbook", to: "m6Zone", label: "ask", delay: 60 }],
  },
  { cue: 7, layout: ASK, edges: [...ASK_EDGES], frames: [ZONE_WALL], packets: [{ from: "m6Zone", to: "m6Logbook", label: "refused" }], badges: { m6Logbook: "still paid" } },
  {
    cue: 8,
    layout: ASK,
    edges: [...ASK_EDGES],
    frames: [ZONE_WALL],
    packets: [{ from: "m6Logbook", to: "m6Zone", label: "refund", stopAt: 0.6 }],
    badges: { m6Logbook: "never twice", m6Zone: "asked later" },
  },
  {
    cue: 9,
    layout: { admin: [0, 1], m6Request: [1.5, 1], checker: [3, 1] },
    edges: [{ from: "admin", to: "m6Request" }, { from: "checker", to: "m6Request" }],
    packets: [{ from: "admin", to: "m6Request", label: "asks" }, { from: "checker", to: "m6Request", label: "approves", delay: 60 }],
    accent: ["m6Request"],
  },
];

export const map: BuildMapStep[] = [{ cue: 10, part: 6, current: ["payment", "procport", "card", "admin"], units: { ecom: "refunds" } }];
