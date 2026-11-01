import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 36b: one install everywhere. The install nobody can repeat (cues 1–3), one recipe (4–10), the card zone's
// values (11–17), order (18–20), preflight, settings, services, changes, health (21–28), the installer (29–46),
// ecom's install (47–50), what it protects (51–56).
const HAND = { m78Alone: [0, 1], m78Prod: [1.5, 1], m78TestServer: [3, 1] } as const;
const HAND_EDGES = [{ from: "m78Alone", to: "m78Prod", label: "by hand" }] as const;
const KITCHENS = { m78Recipe: [1.5, 0.3], laptop: [0.3, 1.8], m78TestServer: [1.5, 1.8], m78Prod: [2.7, 1.8] } as const;
const KITCHEN_EDGES = [
  { from: "m78Recipe", to: "laptop" },
  { from: "m78Recipe", to: "m78TestServer" },
  { from: "m78Recipe", to: "m78Prod" },
] as const;
const VALUES = { zone: [0, 1], m78Values: [1.5, 1], vault: [3, 1] } as const;
const VALUE_EDGES = [{ from: "zone", to: "m78Values", label: "its own" }] as const;
const ORDER = { zone: [0.4, 1], m78Ecom: [2.6, 1] } as const;
const PRE = { m78Preflight: [0, 1], m78Server: [1.5, 1], m78Fix: [3, 1] } as const;
const PRE_EDGES = [{ from: "m78Preflight", to: "m78Server", label: "checks" }] as const;
const RUN = { m78Installer: [0, 1], m78Values: [1.5, 1], admin: [3, 1] } as const;
const RUN_EDGES = [{ from: "m78Installer", to: "m78Values", label: "one at a time" }, { from: "admin", to: "m78Values", label: "answers" }] as const;
const UP = { m78Installer: [0, 1], m78Services: [1.5, 1], m78Health: [3, 1] } as const;
const UP_EDGES = [{ from: "m78Installer", to: "m78Services", label: "in order" }, { from: "m78Services", to: "m78Health" }] as const;
const PAIR = { zone: [0.4, 1], m78Ecom: [2.6, 1] } as const;
const PAIR_EDGE = [{ from: "m78Ecom", to: "zone", label: "certificate request" }] as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 8, current: ["kubernetes"] },
  { cue: 57, part: 8, current: ["kubernetes"], units: { ecom: "release", cards: "release" } },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The install nobody can repeat.
  { cue: 1, layout: HAND, edges: [...HAND_EDGES], badges: { m78Alone: "moved on" }, crossed: ["m78Alone"] },
  { cue: 2, layout: HAND, edges: [...HAND_EDGES], badges: { m78Prod: "which values?", m78TestServer: "why different?" }, danger: ["m78Prod", "m78TestServer"] },
  { cue: 3, layout: HAND, edges: [...HAND_EDGES], badges: { m78Prod: "nobody understands" }, danger: ["m78Prod"] },
  // One recipe in every kitchen.
  { cue: 4, layout: { m78Recipe: [1.5, 1] }, badges: { m78Recipe: "Lesson 6" }, accent: ["m78Recipe"] },
  { cue: 5, layout: KITCHENS, edges: [...KITCHEN_EDGES], packets: KITCHEN_EDGES.map((e) => ({ ...e, label: "same steps" })) },
  { cue: 6, layout: KITCHENS, edges: [...KITCHEN_EDGES], badges: { laptop: "own ingredients", m78TestServer: "own ingredients", m78Prod: "own ingredients" } },
  { cue: 7, layout: KITCHENS, edges: [...KITCHEN_EDGES], badges: { m78Recipe: "our install" }, accent: ["m78Recipe"] },
  { cue: 8, layout: KITCHENS, edges: [...KITCHEN_EDGES], badges: { laptop: "same steps", m78TestServer: "same steps", m78Prod: "same steps" } },
  { cue: 9, layout: KITCHENS, edges: [...KITCHEN_EDGES], badges: { laptop: "own values", m78TestServer: "own values", m78Prod: "own values" }, accent: ["laptop", "m78TestServer", "m78Prod"] },
  { cue: 10, layout: { m78Values: [1.5, 1] }, badges: { m78Values: "address · certificate · email" }, accent: ["m78Values"] },
  // The card zone's own values.
  { cue: 11, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "the bank sets each" } },
  { cue: 12, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "callers · roles" } },
  { cue: 13, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "fraud limits" } },
  { cue: 14, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "session · tries · code" } },
  { cue: 15, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "the bank's choice" }, accent: ["m78Values"] },
  { cue: 16, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "no defaults" }, accent: ["m78Values"] },
  { cue: 17, layout: VALUES, edges: [...VALUE_EDGES, { from: "m78Values", to: "vault", label: "kept" }], packets: [{ from: "m78Values", to: "vault", label: "per environment" }] },
  // Order.
  { cue: 18, layout: ORDER, badges: { zone: "1", m78Ecom: "2" } },
  { cue: 19, layout: ORDER, badges: { zone: "installs first" }, accent: ["zone"] },
  {
    cue: 20,
    layout: PAIR,
    edges: [...PAIR_EDGE],
    packets: [{ from: "m78Ecom", to: "zone", label: "please sign" }, { from: "zone", to: "m78Ecom", label: "signed", delay: 80 }],
    badges: { m78Ecom: "waits" },
  },
  // Preflight, settings, services, changes, health.
  { cue: 21, layout: PRE, edges: [...PRE_EDGES], accent: ["m78Preflight"] },
  { cue: 22, layout: PRE, edges: [...PRE_EDGES], badges: { m78Preflight: "before any work" } },
  { cue: 23, layout: PRE, edges: [...PRE_EDGES], badges: { m78Server: "tools · free ports" } },
  { cue: 24, layout: PRE, edges: [...PRE_EDGES, { from: "m78Server", to: "m78Fix", label: "missing" }], accent: ["m78Fix"] },
  { cue: 25, layout: { vault: [0.4, 1], m78Settings: [2.6, 1] }, edges: [{ from: "vault", to: "m78Settings", label: "written from" }], packets: [{ from: "vault", to: "m78Settings", label: "values" }] },
  { cue: 26, layout: UP, edges: [UP_EDGES[0]], packets: [{ from: "m78Installer", to: "m78Services", label: "start" }], badges: { m78Services: "each waits" } },
  { cue: 27, layout: { m78Value: [0.4, 1], m78Services: [2.6, 1] }, edges: [{ from: "m78Value", to: "m78Services", label: "same way" }], badges: { m78Services: "only its users restart" } },
  { cue: 28, layout: UP, edges: [...UP_EDGES], packets: [{ from: "m78Services", to: "m78Health", label: "ready?" }], accent: ["m78Health"] },
  // The installer.
  { cue: 30, layout: { admin: [0, 1], m78Installer: [1.5, 1], m78Server: [3, 1] }, edges: [{ from: "admin", to: "m78Installer" }, { from: "m78Installer", to: "m78Server" }], badges: { m78Installer: "card zone" } },
  { cue: 31, layout: PRE, edges: [...PRE_EDGES], badges: { m78Preflight: "first" } },
  { cue: 32, layout: PRE, edges: [...PRE_EDGES], badges: { m78Server: "most lines pass" } },
  { cue: 33, layout: PRE, edges: [...PRE_EDGES, { from: "m78Server", to: "m78Fix", label: "fails" }], badges: { m78Fix: "right under it" }, danger: ["m78Server"] },
  { cue: 34, layout: PRE, edges: [...PRE_EDGES, { from: "m78Server", to: "m78Fix" }], badges: { m78Fix: "fixed" }, accent: ["m78Fix"] },
  { cue: 35, layout: PRE, edges: [...PRE_EDGES], badges: { m78Server: "everything passes" }, accent: ["m78Server"] },
  { cue: 36, layout: RUN, edges: [...RUN_EDGES], badges: { m78Installer: "which release?" } },
  { cue: 37, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "m78Installer", to: "m78Values", label: "ask" }, { from: "admin", to: "m78Values", label: "answer", delay: 50 }] },
  { cue: 38, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "where doors listen" } },
  { cue: 39, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "which callers" } },
  { cue: 40, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "websites · session · tries" } },
  { cue: 41, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "fraud · alerts · certificate" } },
  { cue: 42, layout: RUN, edges: [...RUN_EDGES], badges: { m78Installer: "checks each answer" }, accent: ["m78Installer"] },
  { cue: 43, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "admin", to: "m78Values", label: "wrong form", stopAt: 0.6 }], badges: { m78Installer: "asked again" } },
  { cue: 44, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "admin", to: "m78Values", label: "certificate ≠ key", stopAt: 0.6 }], badges: { m78Installer: "asked again · why" } },
  { cue: 45, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "every value is there" }, accent: ["m78Values"] },
  { cue: 46, layout: UP, edges: [...UP_EDGES], packets: [{ from: "m78Services", to: "m78Health", label: "ready?" }], badges: { m78Health: "every service healthy" }, accent: ["m78Health"] },
  // ecom's install.
  { cue: 47, layout: PAIR, edges: [...PAIR_EDGE], badges: { m78Ecom: "its installer" } },
  { cue: 48, layout: PAIR, edges: [...PAIR_EDGE], packets: [{ from: "m78Ecom", to: "zone", label: "request" }], badges: { m78Ecom: "waits" } },
  { cue: 49, layout: PAIR, edges: [...PAIR_EDGE], packets: [{ from: "zone", to: "m78Ecom", label: "signed" }], badges: { zone: "signed" }, accent: ["zone"] },
  { cue: 50, layout: { m78Ecom: [0.4, 1], m78Health: [2.6, 1] }, edges: [{ from: "m78Ecom", to: "m78Health" }], badges: { m78Health: "healthy too" }, accent: ["m78Health"] },
  // What it protects.
  { cue: 51, layout: KITCHENS, edges: [...KITCHEN_EDGES] },
  { cue: 52, layout: { m78Values: [1.5, 1] }, badges: { m78Values: "written once, one place" }, accent: ["m78Values"] },
  { cue: 53, layout: { m78Values: [0.4, 1], m78Installer: [2.6, 1] }, edges: [{ from: "m78Values", to: "m78Installer", label: "missing" }], badges: { m78Installer: "stops, no guess" }, danger: ["m78Installer"] },
  { cue: 54, layout: { laptop: [0.4, 1], m78Prod: [2.6, 1] }, edges: [{ from: "laptop", to: "m78Prod", label: "same install" }], accent: ["laptop", "m78Prod"] },
  { cue: 55, layout: KITCHENS, edges: [...KITCHEN_EDGES] },
  { cue: 56, layout: KITCHENS, edges: [...KITCHEN_EDGES], badges: { m78Recipe: "one recipe", laptop: "own ingredients", m78TestServer: "own ingredients", m78Prod: "own ingredients" } },
];
