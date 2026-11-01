import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 31: one payment, followed. The spinning payment (cues 4–9), the wristband (10–13), one trace number
// (14–22), log masking (23–31), each product's own monitoring (32–34), the product (35–52), what it protects (53–59).
const CHAIN = { m78PayPage: [0, 0.4], m78Ecom: [1, 0.4], zone: [2, 0.4], m78Adapter: [3, 0.4], network: [3, 1.9] } as const;
const CHAIN_EDGES = [
  { from: "m78PayPage", to: "m78Ecom" },
  { from: "m78Ecom", to: "zone" },
  { from: "zone", to: "m78Adapter" },
  { from: "m78Adapter", to: "network" },
] as const;
const walk = (label: string) => CHAIN_EDGES.map((e, k) => ({ ...e, label, delay: 10 + k * 30 }));
const TRACED = { m78PayPage: "7f3a", m78Ecom: "7f3a", zone: "7f3a", m78Adapter: "7f3a", network: "7f3a" };
const BOTH = [
  { label: "ecom", from: [1, 0.4], to: [1, 0.4] },
  { label: "card zone", from: [2, 0.4], to: [3, 0.4] },
] as const;
const CLEAN = { m78RawLine: [0, 1], m78Cleaner: [1.5, 1], masked: [3, 1] } as const;
const CLEAN_EDGES = [{ from: "m78RawLine", to: "m78Cleaner" }, { from: "m78Cleaner", to: "masked" }] as const;
const WATCH = { m78Support: [0, 1], m78Dashboard: [2, 1] } as const;
const ALERT = { m78Dashboard: [0, 1], m78Rule: [1.5, 1], m78Email: [3, 1] } as const;
const ALERT_EDGES = [{ from: "m78Dashboard", to: "m78Rule" }, { from: "m78Rule", to: "m78Email" }] as const;
const GUARDS = { merchant: [0, 1], masked: [1.5, 1], m78Email: [3, 1] } as const;
const WRISTBAND = { m78Wristband: [1.5, 0.3], m78Lab: [0.3, 1.8], m78Scan: [1.5, 1.8], m78Ward: [2.7, 1.8] } as const;
const CHARTS = [
  { from: "m78Wristband", to: "m78Lab" },
  { from: "m78Wristband", to: "m78Scan" },
  { from: "m78Wristband", to: "m78Ward" },
] as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 6, current: ["observability"] },
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 6, current: ["payment", "card", "adapters", "procsvc"] },
  { cue: 2, part: 6, current: ["card"] },
  { cue: 3, part: 6, current: ["observability"] },
  { cue: 32, part: 6, current: ["observability", "cardsinfra"], units: { ecom: "own monitoring", cards: "own monitoring" } },
  { cue: 62, part: 6, current: ["merchant", "reconciliation"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The spinning payment.
  { cue: 4, layout: { merchant: [0.4, 1], m78Support: [2.6, 1] }, edges: [{ from: "merchant", to: "m78Support" }], packets: [{ from: "merchant", to: "m78Support", label: "calls" }] },
  { cue: 5, layout: { merchant: [0.4, 1], m78Support: [2.6, 1] }, edges: [{ from: "merchant", to: "m78Support" }], badges: { merchant: "still spinning" }, danger: ["merchant"] },
  { cue: 6, layout: CHAIN, edges: [...CHAIN_EDGES], packets: walk("payment") },
  {
    cue: 7,
    layout: CHAIN,
    edges: [...CHAIN_EDGES],
    badges: { m78PayPage: "own log", m78Ecom: "own log", zone: "own log", m78Adapter: "own log" },
  },
  {
    cue: 8,
    layout: CHAIN,
    edges: [...CHAIN_EDGES],
    danger: ["m78Ecom", "zone", "m78Adapter", "network"],
    badges: { m78PayPage: "search?", m78Ecom: "search?", zone: "search?", m78Adapter: "guess?" },
  },
  { cue: 9, layout: { m78RawLine: [1.5, 1] }, badges: { m78RawLine: "card number?" }, danger: ["m78RawLine"] },
  // The wristband.
  { cue: 10, layout: { m78Wristband: [1.5, 1] }, accent: ["m78Wristband"] },
  { cue: 11, layout: { m78Wristband: [1.5, 1] }, accent: ["m78Wristband"], badges: { m78Wristband: "No. 4521" } },
  { cue: 12, layout: WRISTBAND, edges: [...CHARTS], badges: { m78Wristband: "No. 4521" } },
  { cue: 13, layout: WRISTBAND, edges: [...CHARTS], badges: { m78Wristband: "whole stay" }, accent: ["m78Lab", "m78Scan", "m78Ward"] },
  // One trace number.
  { cue: 14, layout: CHAIN, edges: [...CHAIN_EDGES], badges: { m78PayPage: "7f3a" }, accent: ["m78PayPage"] },
  { cue: 15, layout: CHAIN, edges: [...CHAIN_EDGES], packets: walk("7f3a"), badges: { m78PayPage: "trace 7f3a" }, accent: ["m78PayPage"] },
  { cue: 16, layout: CHAIN, edges: [...CHAIN_EDGES], packets: [{ from: "m78Ecom", to: "zone", label: "7f3a" }], badges: { m78Ecom: "7f3a", zone: "7f3a" } },
  { cue: 17, layout: CHAIN, edges: [...CHAIN_EDGES], packets: [{ from: "zone", to: "m78Adapter", label: "7f3a" }], badges: { m78Ecom: "7f3a", zone: "7f3a", m78Adapter: "7f3a" } },
  { cue: 18, layout: CHAIN, edges: [...CHAIN_EDGES], badges: TRACED, frames: [...BOTH] },
  {
    cue: 19,
    layout: { m78Ecom: [0.4, 1], merchant: [2.6, 1] },
    edges: [{ from: "m78Ecom", to: "merchant", label: "answer" }],
    packets: [{ from: "m78Ecom", to: "merchant", label: "no · 7f3a" }],
    badges: { merchant: "trace 7f3a" },
  },
  {
    cue: 20,
    layout: { merchant: [0.4, 1], m78Support: [2.6, 1] },
    edges: [{ from: "merchant", to: "m78Support", label: "quotes" }],
    packets: [{ from: "merchant", to: "m78Support", label: "7f3a" }],
    badges: { m78Support: "in seconds" },
    accent: ["m78Support"],
  },
  { cue: 21, layout: { m78Logs: [1.5, 1] }, badges: { m78Logs: "every line · 7f3a" }, accent: ["m78Logs"] },
  {
    cue: 22,
    layout: { m78Logs: [0.4, 1], m78Request: [2.6, 1] },
    edges: [{ from: "m78Logs", to: "m78Request", label: "7f3a" }],
    packets: [{ from: "m78Logs", to: "m78Request", label: "warning" }],
    badges: { m78Logs: "warning · 7f3a" },
    accent: ["m78Request"],
  },
  // Log masking.
  { cue: 23, layout: { m78RawLine: [1.5, 1] }, badges: { m78RawLine: "card number?" }, danger: ["m78RawLine"] },
  { cue: 24, layout: CLEAN, edges: [...CLEAN_EDGES], packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "line" }], accent: ["m78Cleaner"] },
  { cue: 25, layout: CLEAN, edges: [...CLEAN_EDGES], badges: { m78Cleaner: "log masking" }, accent: ["m78Cleaner"] },
  {
    cue: 26,
    layout: CLEAN,
    edges: [...CLEAN_EDGES],
    packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "card number" }, { from: "m78Cleaner", to: "masked", label: "6 + 4", delay: 60 }],
    badges: { masked: "first 6 · last 4" },
  },
  { cue: 27, layout: CLEAN, edges: [...CLEAN_EDGES], packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "long digits" }], badges: { m78Cleaner: "treated as a card" } },
  { cue: 28, layout: CLEAN, edges: [...CLEAN_EDGES], packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "token" }], badges: { masked: "token: last 4" } },
  { cue: 29, layout: CLEAN, edges: [...CLEAN_EDGES], packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "password" }], badges: { masked: "hidden" } },
  { cue: 30, layout: CLEAN, edges: [...CLEAN_EDGES], badges: { m78Cleaner: "every line" } },
  { cue: 31, layout: CLEAN, edges: [...CLEAN_EDGES], badges: { m78Cleaner: "every line", masked: "no card leaks" }, accent: ["masked"] },
  // The product: dashboards, one trace, masked lines.
  { cue: 35, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], accent: ["m78Dashboard"] },
  { cue: 37, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Dashboard: "paid · declined · unknown" } },
  { cue: 38, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Dashboard: "unknown in red" }, danger: ["m78Dashboard"] },
  { cue: 39, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Dashboard: "unknown: 0" } },
  { cue: 40, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], packets: [{ from: "m78Support", to: "m78Dashboard", label: "7f3a" }], badges: { m78Dashboard: "trace 7f3a" } },
  {
    cue: 41,
    layout: { m78Ecom: [0, 1], zone: [1.5, 1], m78Adapter: [3, 1] },
    edges: [{ from: "m78Ecom", to: "zone" }, { from: "zone", to: "m78Adapter" }],
    packets: [{ from: "m78Ecom", to: "zone", label: "7f3a" }, { from: "zone", to: "m78Adapter", label: "7f3a", delay: 50 }],
    badges: { m78Ecom: "40 ms", zone: "120 ms", m78Adapter: "900 ms" },
  },
  { cue: 42, layout: { m78Logs: [0.4, 1], masked: [2.6, 1] }, edges: [{ from: "m78Logs", to: "masked" }], badges: { m78Logs: "7f3a" } },
  { cue: 43, layout: { m78Logs: [0.4, 1], masked: [2.6, 1] }, edges: [{ from: "m78Logs", to: "masked" }], badges: { m78Logs: "7f3a", masked: "6 · stars · 4" }, accent: ["masked"] },
  // The centre goes quiet; the rule fires.
  {
    cue: 44,
    layout: { m78Adapter: [0.4, 1], network: [2.6, 1] },
    edges: [{ from: "m78Adapter", to: "network" }],
    packets: [{ from: "m78Adapter", to: "network", label: "charge", stopAt: 0.6 }],
    badges: { network: "quiet" },
    danger: ["network"],
  },
  { cue: 45, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Dashboard: "unknown climbs" }, danger: ["m78Dashboard"] },
  { cue: 46, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Support: "not watching", m78Dashboard: "unknown climbs" }, crossed: ["m78Support"], danger: ["m78Dashboard"] },
  { cue: 47, layout: ALERT, edges: [...ALERT_EDGES], badges: { m78Dashboard: "unknown climbs" }, accent: ["m78Rule"] },
  { cue: 48, layout: ALERT, edges: [...ALERT_EDGES], badges: { m78Rule: "written down" }, accent: ["m78Rule"] },
  { cue: 49, layout: ALERT, edges: [...ALERT_EDGES], packets: [{ from: "m78Dashboard", to: "m78Rule", label: "too long" }, { from: "m78Rule", to: "m78Email", label: "fires", delay: 60 }], badges: { m78Rule: "fires" }, danger: ["m78Rule"] },
  { cue: 50, layout: ALERT, edges: [...ALERT_EDGES], badges: { m78Email: "payments are stuck" }, accent: ["m78Email"] },
  { cue: 51, layout: ALERT, edges: [...ALERT_EDGES], badges: { m78Email: "what · since when" }, accent: ["m78Email"] },
  {
    cue: 52,
    layout: { m78Email: [0.4, 1], m78Dashboard: [2.6, 1] },
    edges: [{ from: "m78Email", to: "m78Dashboard", label: "opens" }],
    packets: [{ from: "m78Email", to: "m78Dashboard", label: "support" }],
    badges: { m78Dashboard: "same red line" },
    danger: ["m78Dashboard"],
  },
  // What it protects.
  { cue: 53, layout: GUARDS },
  { cue: 54, layout: GUARDS, badges: { merchant: "an hour guessing" }, danger: ["merchant"] },
  { cue: 55, layout: GUARDS, badges: { masked: "hole in the wall" }, danger: ["masked"] },
  { cue: 56, layout: GUARDS, badges: { m78Email: "angry buyer first" }, danger: ["m78Email"] },
  { cue: 57, layout: GUARDS, badges: { merchant: "time" }, accent: ["merchant"] },
  { cue: 58, layout: GUARDS, badges: { merchant: "time", masked: "card" }, accent: ["masked"] },
  { cue: 59, layout: GUARDS, badges: { merchant: "time", masked: "card", m78Email: "first to know" }, accent: ["m78Email"] },
  { cue: 60, layout: WRISTBAND, edges: [...CHARTS], badges: { m78Wristband: "No. 4521" } },
  { cue: 61, layout: WRISTBAND, edges: [...CHARTS], badges: { m78Wristband: "no secrets" }, accent: ["m78Wristband"] },
];
