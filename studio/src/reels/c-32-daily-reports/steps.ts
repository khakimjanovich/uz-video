import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 32: the merchant's day. The till (cues 0–1), the nightly count (2–3), the totals (4–5),
// counting again (6), every line behind a total (7), the close (8).
const TOTALS = { m78Paid: [0, 1], m78Fee: [1, 1], m78Refunded: [2, 1], m78Payout: [3, 1] } as const;
const SUM = { m78Paid: "+ sales", m78Fee: "− fee", m78Refunded: "− refunds", m78Payout: "= payout" };

export const map: BuildMapStep[] = [
  { cue: 0, part: 7, current: ["merchant", "reconciliation"] },
  { cue: 8, part: 7, current: ["buyer", "admin"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The till.
  {
    cue: 1,
    layout: { shop: [0.4, 1], m78Till: [2.6, 1] },
    edges: [{ from: "shop", to: "m78Till", label: "count" }],
    packets: [{ from: "shop", to: "m78Till", label: "count" }, { from: "shop", to: "m78Till", label: "again", delay: 80 }],
    badges: { m78Till: "same answer" },
  },
  // Every night, per website, on one business day.
  {
    cue: 2,
    layout: { salespoint: [0, 1], m78Night: [1.5, 1], m78Report: [3, 1] },
    edges: [{ from: "salespoint", to: "m78Night" }, { from: "m78Night", to: "m78Report" }],
    packets: [{ from: "m78Night", to: "m78Report", label: "totals", delay: 30 }],
    badges: { m78Night: "every night" },
    accent: ["m78Night"],
  },
  {
    cue: 3,
    layout: { m78Day: [1.5, 0.3], m78Reversal: [0.5, 1.9], m78Refund: [2.5, 1.9] },
    edges: [{ from: "m78Day", to: "m78Reversal" }, { from: "m78Day", to: "m78Refund" }],
    badges: { m78Day: "bank's time zone" },
    accent: ["m78Day"],
  },
  // The totals.
  { cue: 4, layout: TOTALS, badges: SUM },
  { cue: 5, layout: TOTALS, badges: { ...SUM, m78Refunded: "− big refunds", m78Payout: "negative" }, danger: ["m78Payout"] },
  // Counting again replaces the day.
  {
    cue: 6,
    layout: { m78Night: [0.4, 1], m78Report: [2.6, 1] },
    edges: [{ from: "m78Night", to: "m78Report", label: "count again" }],
    packets: [{ from: "m78Night", to: "m78Report", label: "missed night" }],
    badges: { m78Report: "replaced, not added" },
  },
  // Every line behind every total.
  {
    cue: 7,
    layout: { m78Report: [0.4, 1], m78Lines: [2.6, 1] },
    edges: [{ from: "m78Report", to: "m78Lines", label: "explains" }],
    accent: ["m78Lines"],
  },
];
