import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 31: one payment, followed. The spinning payment (cues 0–3), the wristband (4), one trace number (5–6),
// cleaned lines (7), monitoring and alerts (8–9), the close (10).
const CHAIN = { m78PayPage: [0, 0.4], m78Ecom: [1, 0.4], zone: [2, 0.4], m78Adapter: [3, 0.4], network: [3, 1.9] } as const;
const CHAIN_EDGES = [
  { from: "m78PayPage", to: "m78Ecom" },
  { from: "m78Ecom", to: "zone" },
  { from: "zone", to: "m78Adapter" },
  { from: "m78Adapter", to: "network" },
] as const;
const walk = (label: string) => CHAIN_EDGES.map((e, k) => ({ ...e, label, delay: 10 + k * 30 }));
const TRACED = { m78PayPage: "7f3a", m78Ecom: "7f3a", zone: "7f3a", m78Adapter: "7f3a", network: "7f3a" };

export const map: BuildMapStep[] = [
  { cue: 0, part: 7, current: ["observability"] },
  { cue: 8, part: 7, current: ["observability", "cardsinfra"], units: { ecom: "own monitoring", cards: "own monitoring" } },
  { cue: 10, part: 7, current: ["merchant", "reconciliation"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The spinning payment.
  { cue: 1, layout: { merchant: [0.4, 1], m78Support: [2.6, 1] }, edges: [{ from: "merchant", to: "m78Support" }], packets: [{ from: "merchant", to: "m78Support", label: "still spinning" }] },
  { cue: 2, layout: CHAIN, edges: [...CHAIN_EDGES], packets: walk("payment") },
  {
    cue: 3,
    layout: CHAIN,
    edges: [...CHAIN_EDGES],
    danger: ["m78Ecom", "zone", "m78Adapter", "network"],
    badges: { m78Ecom: "search?", zone: "search?", m78Adapter: "search?", network: "guess?" },
  },
  // The wristband.
  { cue: 4, layout: { m78Wristband: [1.5, 1] }, accent: ["m78Wristband"], badges: { m78Wristband: "No. 4521" } },
  // One trace number, across both products and every log line.
  { cue: 5, layout: CHAIN, edges: [...CHAIN_EDGES], packets: walk("7f3a"), accent: ["m78PayPage"], badges: TRACED },
  {
    cue: 6,
    layout: { m78Logs: [0.4, 1], m78Request: [2.6, 1] },
    edges: [{ from: "m78Logs", to: "m78Request", label: "7f3a" }],
    packets: [{ from: "m78Logs", to: "m78Request", label: "warning" }],
    badges: { m78Logs: "warning · 7f3a" },
    accent: ["m78Request"],
  },
  // Cleaned before it is written.
  {
    cue: 7,
    layout: { m78RawLine: [0, 1], m78Cleaner: [1.5, 1], masked: [3, 1] },
    edges: [{ from: "m78RawLine", to: "m78Cleaner" }, { from: "m78Cleaner", to: "masked" }],
    packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "card number" }, { from: "m78Cleaner", to: "masked", label: "6 + 4", delay: 60 }],
    badges: { m78Cleaner: "secrets hidden", masked: "first 6 · last 4" },
    accent: ["m78Cleaner"],
  },
  // Dashboards and alerts.
  {
    cue: 9,
    layout: { m78Monitoring: [0.4, 1], m78Email: [2.6, 1] },
    edges: [{ from: "m78Monitoring", to: "m78Email", label: "unknown too long" }],
    packets: [{ from: "m78Monitoring", to: "m78Email", label: "alert", delay: 50 }],
    badges: { m78Monitoring: "how payments end" },
    accent: ["m78Email"],
  },
];
