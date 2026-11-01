import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 33: one payment, followed. Malika's spinning payment and Dilnoza on the phone (cues 0–8), the bridge (9–10),
// one trace number (11–19), log masking (20–30), each product's own monitoring (31–33), Dilnoza's screens (34–42),
// the centre goes quiet and the rule fires (43–51), what it protects (52–55), next (56).
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
const GUARDS = { shop: [0, 1], masked: [1.5, 1], m78Email: [3, 1] } as const;
const CALL = { shop: [0.4, 1], m78Support: [2.6, 1] } as const;
const CALL_EDGE = [{ from: "shop", to: "m78Support" }] as const;

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 9, part: 6, current: ["payment", "card", "adapters", "procsvc"], units: { cards: "masked on screens" } },
  { cue: 10, part: 6, current: ["observability"] },
  { cue: 31, part: 6, current: ["observability", "cardsinfra"], units: { ecom: "own monitoring", cards: "own monitoring" } },
  { cue: 56, part: 6, current: ["merchant", "reconciliation"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // Tuesday evening: a payment spins, Malika calls, Dilnoza picks up.
  { cue: 0, layout: { buyer: [0.4, 1], m78PayPage: [2.6, 1] }, edges: [{ from: "buyer", to: "m78PayPage" }], badges: { m78PayPage: "Tue 20:40" } },
  {
    cue: 1,
    layout: { buyer: [0.4, 1], m78PayPage: [2.6, 1] },
    edges: [{ from: "buyer", to: "m78PayPage" }],
    packets: [{ from: "buyer", to: "m78PayPage", label: "roses" }],
    badges: { m78PayPage: "spinning…" },
    danger: ["m78PayPage"],
  },
  { cue: 2, layout: CALL, edges: [...CALL_EDGE], packets: [{ from: "shop", to: "m78Support", label: "calls" }], badges: { shop: "Malika" } },
  { cue: 3, layout: CALL, edges: [...CALL_EDGE], badges: { shop: "Malika", m78Support: "Dilnoza" }, accent: ["m78Support"] },
  { cue: 4, layout: CALL, edges: [...CALL_EDGE], badges: { shop: "still spinning", m78Support: "Dilnoza" }, danger: ["shop"] },
  { cue: 5, layout: CHAIN, edges: [...CHAIN_EDGES], packets: walk("payment") },
  {
    cue: 6,
    layout: CHAIN,
    edges: [...CHAIN_EDGES],
    badges: { m78PayPage: "own log", m78Ecom: "own log", zone: "own log", m78Adapter: "own log" },
  },
  {
    cue: 7,
    layout: CHAIN,
    edges: [...CHAIN_EDGES],
    danger: ["m78Ecom", "zone", "m78Adapter", "network"],
    badges: { m78PayPage: "search?", m78Ecom: "search?", zone: "search?", m78Adapter: "guess?" },
  },
  { cue: 8, layout: { m78RawLine: [1.5, 1] }, badges: { m78RawLine: "card number?" }, danger: ["m78RawLine"] },
  // One trace number.
  { cue: 11, layout: CHAIN, edges: [...CHAIN_EDGES], packets: walk("7f3a"), badges: { m78PayPage: "trace 7f3a" }, accent: ["m78PayPage"] },
  { cue: 12, layout: CHAIN, edges: [...CHAIN_EDGES], packets: [{ from: "m78Ecom", to: "zone", label: "7f3a" }], badges: { m78Ecom: "7f3a", zone: "7f3a" } },
  { cue: 13, layout: CHAIN, edges: [...CHAIN_EDGES], packets: [{ from: "zone", to: "m78Adapter", label: "7f3a" }], badges: { m78Ecom: "7f3a", zone: "7f3a", m78Adapter: "7f3a" } },
  { cue: 14, layout: CHAIN, edges: [...CHAIN_EDGES], badges: TRACED, frames: [...BOTH] },
  {
    cue: 15,
    layout: { m78Ecom: [0.4, 1], merchant: [2.6, 1] },
    edges: [{ from: "m78Ecom", to: "merchant", label: "answer" }],
    packets: [{ from: "m78Ecom", to: "merchant", label: "no · 7f3a" }],
    badges: { merchant: "trace 7f3a" },
  },
  {
    cue: 16,
    layout: { merchant: [0, 1], shop: [1.5, 1], m78Support: [3, 1] },
    edges: [{ from: "merchant", to: "shop", label: "the order" }, { from: "shop", to: "m78Support", label: "reads it out" }],
    packets: [{ from: "merchant", to: "shop", label: "7f3a" }, { from: "shop", to: "m78Support", label: "7f3a", delay: 50 }],
    badges: { merchant: "Bekzod keeps it", shop: "Malika" },
  },
  { cue: 17, layout: CALL, edges: [...CALL_EDGE], badges: { shop: "7f3a", m78Support: "in seconds" }, accent: ["m78Support"] },
  { cue: 18, layout: { m78Logs: [1.5, 1] }, badges: { m78Logs: "every line · 7f3a" }, accent: ["m78Logs"] },
  {
    cue: 19,
    layout: { m78Logs: [0.4, 1], m78Request: [2.6, 1] },
    edges: [{ from: "m78Logs", to: "m78Request", label: "7f3a" }],
    packets: [{ from: "m78Logs", to: "m78Request", label: "warning" }],
    badges: { m78Logs: "warning · 7f3a" },
    accent: ["m78Request"],
  },
  // Log masking.
  { cue: 20, layout: { m78RawLine: [1.5, 1] }, badges: { m78RawLine: "card number?" }, danger: ["m78RawLine"] },
  { cue: 21, layout: { m78Logs: [1.5, 1] }, badges: { m78Logs: "the leakiest place" }, danger: ["m78Logs"] },
  {
    cue: 22,
    layout: { m78RawLine: [0.4, 1], m78Logs: [2.6, 1] },
    edges: [{ from: "m78RawLine", to: "m78Logs" }],
    packets: [{ from: "m78RawLine", to: "m78Logs", label: "card number" }],
    badges: { m78Logs: "while chasing a bug" },
    danger: ["m78Logs"],
  },
  { cue: 23, layout: CLEAN, edges: [...CLEAN_EDGES], packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "line" }], accent: ["m78Cleaner"] },
  { cue: 24, layout: CLEAN, edges: [...CLEAN_EDGES], badges: { m78Cleaner: "log masking" }, accent: ["m78Cleaner"] },
  {
    cue: 25,
    layout: CLEAN,
    edges: [...CLEAN_EDGES],
    packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "card number" }, { from: "m78Cleaner", to: "masked", label: "6 + 4", delay: 60 }],
    badges: { masked: "first 6 · last 4" },
  },
  { cue: 26, layout: CLEAN, edges: [...CLEAN_EDGES], packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "long digits" }], badges: { m78Cleaner: "treated as a card" } },
  { cue: 27, layout: CLEAN, edges: [...CLEAN_EDGES], packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "token" }], badges: { masked: "token: last 4" } },
  { cue: 28, layout: CLEAN, edges: [...CLEAN_EDGES], packets: [{ from: "m78RawLine", to: "m78Cleaner", label: "password" }], badges: { masked: "hidden" } },
  { cue: 29, layout: CLEAN, edges: [...CLEAN_EDGES], badges: { m78Cleaner: "every line" } },
  { cue: 30, layout: CLEAN, edges: [...CLEAN_EDGES], badges: { m78Cleaner: "every line", masked: "no card leaks" }, accent: ["masked"] },
  // Dilnoza's screens: dashboards, one trace, masked lines.
  { cue: 34, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Support: "Dilnoza" }, accent: ["m78Dashboard"] },
  { cue: 35, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Dashboard: "paid · declined · unknown" } },
  { cue: 36, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Dashboard: "unknown in red" }, danger: ["m78Dashboard"] },
  { cue: 37, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Dashboard: "unknown: 0" } },
  { cue: 38, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], packets: [{ from: "m78Support", to: "m78Dashboard", label: "7f3a" }], badges: { m78Dashboard: "trace 7f3a" } },
  {
    cue: 39,
    layout: { m78Ecom: [0, 1], zone: [1.5, 1], m78Adapter: [3, 1] },
    edges: [{ from: "m78Ecom", to: "zone" }, { from: "zone", to: "m78Adapter" }],
    packets: [{ from: "m78Ecom", to: "zone", label: "7f3a" }, { from: "zone", to: "m78Adapter", label: "7f3a", delay: 50 }],
    badges: { m78Ecom: "40 ms", zone: "120 ms", m78Adapter: "900 ms" },
  },
  {
    cue: 40,
    layout: { m78Adapter: [0.4, 1], network: [2.6, 1] },
    edges: [{ from: "m78Adapter", to: "network" }],
    packets: [{ from: "m78Adapter", to: "network", label: "charge" }, { from: "network", to: "m78Adapter", label: "answer", delay: 60 }],
    badges: { m78Adapter: "900 ms" },
    accent: ["m78Adapter"],
  },
  { cue: 41, layout: { m78Logs: [0.4, 1], masked: [2.6, 1] }, edges: [{ from: "m78Logs", to: "masked" }], badges: { m78Logs: "7f3a" } },
  { cue: 42, layout: { m78Logs: [0.4, 1], masked: [2.6, 1] }, edges: [{ from: "m78Logs", to: "masked" }], badges: { m78Logs: "7f3a", masked: "6 · stars · 4" }, accent: ["masked"] },
  // Later that night: the centre goes quiet; the rule fires.
  {
    cue: 43,
    layout: { m78Adapter: [0.4, 1], network: [2.6, 1] },
    edges: [{ from: "m78Adapter", to: "network" }],
    packets: [{ from: "m78Adapter", to: "network", label: "charge", stopAt: 0.6 }],
    badges: { network: "quiet" },
    danger: ["network"],
  },
  { cue: 44, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Dashboard: "unknown climbs" }, danger: ["m78Dashboard"] },
  { cue: 45, layout: WATCH, edges: [{ from: "m78Support", to: "m78Dashboard" }], badges: { m78Support: "gone home", m78Dashboard: "unknown climbs" }, crossed: ["m78Support"], danger: ["m78Dashboard"] },
  { cue: 46, layout: ALERT, edges: [...ALERT_EDGES], badges: { m78Dashboard: "unknown climbs" }, accent: ["m78Rule"] },
  { cue: 47, layout: ALERT, edges: [...ALERT_EDGES], badges: { m78Rule: "written down" }, accent: ["m78Rule"] },
  { cue: 48, layout: ALERT, edges: [...ALERT_EDGES], packets: [{ from: "m78Dashboard", to: "m78Rule", label: "too long" }, { from: "m78Rule", to: "m78Email", label: "fires", delay: 60 }], badges: { m78Rule: "fires" }, danger: ["m78Rule"] },
  { cue: 49, layout: ALERT, edges: [...ALERT_EDGES], badges: { m78Email: "to Dilnoza: stuck" }, accent: ["m78Email"] },
  { cue: 50, layout: ALERT, edges: [...ALERT_EDGES], badges: { m78Email: "what · since when" }, accent: ["m78Email"] },
  {
    cue: 51,
    layout: { m78Email: [0.4, 1], m78Dashboard: [2.6, 1] },
    edges: [{ from: "m78Email", to: "m78Dashboard", label: "opens" }],
    packets: [{ from: "m78Email", to: "m78Dashboard", label: "Dilnoza" }],
    badges: { m78Dashboard: "same red line" },
    danger: ["m78Dashboard"],
  },
  // What it protects.
  { cue: 52, layout: GUARDS, badges: { shop: "an hour guessing" }, danger: ["shop"] },
  { cue: 53, layout: GUARDS, badges: { shop: "an hour guessing", masked: "a second card store" }, danger: ["masked"] },
  { cue: 54, layout: GUARDS, badges: { shop: "an hour guessing", masked: "a second card store", m78Email: "angry buyer first" }, danger: ["m78Email"] },
  { cue: 55, layout: GUARDS, badges: { shop: "seconds", masked: "clean logs", m78Email: "bank first" }, accent: ["shop", "masked", "m78Email"] },
];
