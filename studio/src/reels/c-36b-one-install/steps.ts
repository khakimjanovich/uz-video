import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 36b: one install. One recipe (cues 0–3), the card zone first (4), preflight and settings (5–6),
// start and health check (7), a later change (8), the close (9).
const ENVS = { m78Recipe: [1.5, 0.3], laptop: [0, 1.9], m78TestServer: [1.5, 1.9], m78Prod: [3, 1.9] } as const;
const ENV_EDGES = [{ from: "m78Recipe", to: "laptop" }, { from: "m78Recipe", to: "m78TestServer" }, { from: "m78Recipe", to: "m78Prod" }] as const;
const BOTH = ["frame", "card", "bin", "adapters", "cardsinfra", "partner", "commission", "epos", "payment", "reconciliation"] as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 8, current: ["kubernetes"] },
  { cue: 7, part: 8, current: [...BOTH], units: { cards: "healthy", ecom: "healthy" } },
  { cue: 9, part: 8, current: ["kubernetes"], units: { cards: "release", ecom: "release" } },
];

export const diagram: DiagramStep<BuildId>[] = [
  // One recipe, every kitchen.
  { cue: 1, layout: { m78Recipe: [1.5, 1] }, badges: { m78Recipe: "same everywhere" }, accent: ["m78Recipe"] },
  { cue: 2, layout: ENVS, edges: [...ENV_EDGES], packets: ENV_EDGES.map((e, k) => ({ ...e, label: "install", delay: 15 + k * 20 })) },
  { cue: 3, layout: ENVS, edges: [...ENV_EDGES], badges: { laptop: "own values", m78TestServer: "own values", m78Prod: "own values" } },
  // The card zone first.
  {
    cue: 4,
    layout: { zone: [0.4, 1], m78Ecom: [2.6, 1] },
    edges: [{ from: "zone", to: "m78Ecom", label: "certificate" }],
    packets: [{ from: "zone", to: "m78Ecom", label: "certificate", delay: 40 }],
    badges: { zone: "first", m78Ecom: "waits" },
  },
  // Preflight, then settings from Vault.
  { cue: 5, layout: { m78Preflight: [0.4, 1], m78Fix: [2.6, 1] }, edges: [{ from: "m78Preflight", to: "m78Fix" }], accent: ["m78Preflight"] },
  {
    cue: 6,
    layout: { vault: [0.4, 1], m78Settings: [2.6, 1] },
    edges: [{ from: "vault", to: "m78Settings", label: "written from it" }],
    packets: [{ from: "vault", to: "m78Settings", label: "settings" }],
  },
  // A later change.
  {
    cue: 8,
    layout: { m78Value: [0.4, 1], m78Prod: [2.6, 1] },
    edges: [{ from: "m78Value", to: "m78Prod", label: "same way" }],
    packets: [{ from: "m78Value", to: "m78Prod", label: "new value" }],
    accent: ["m78Value"],
  },
];
