import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 39: one install everywhere. One afternoon carries it: Timur installs the bank, Bekzod his laptop, the same way.
// Monday afternoon and the bridge (cues 0–5), the install nobody can repeat (6–8), same steps, own values (10–12),
// the card zone's values (13–20), order (21–23), preflight, settings, services, changes, health (24–31),
// Timur's install (32–49), ecom's install (50–53), by evening (54–56).
const HAND = { m78Alone: [0, 1], m78Prod: [1.5, 1], m78TestServer: [3, 1] } as const;
const HAND_EDGES = [{ from: "m78Alone", to: "m78Prod", label: "by hand" }] as const;
const SAME = { m78Installer: [1.5, 0.3], laptop: [0.3, 1.8], m78TestServer: [1.5, 1.8], m78Prod: [2.7, 1.8] } as const;
const SAME_EDGES = [
  { from: "m78Installer", to: "laptop" },
  { from: "m78Installer", to: "m78TestServer" },
  { from: "m78Installer", to: "m78Prod" },
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
  // The bridge: what this lesson uses from the ones before.
  { cue: 2, part: 7, current: ["vault", "cardsinfra"] },
  { cue: 5, part: 7, current: ["kubernetes"] },
  { cue: 60, part: 7, rows: [7], current: ["kubernetes"], units: { ecom: "release", cards: "release" } },
];

export const diagram: DiagramStep<BuildId>[] = [
  // Monday afternoon: Vault is open; Timur and Bekzod install.
  { cue: 0, layout: { keyholders: [0.4, 1], vault: [2.6, 1] }, edges: [{ from: "keyholders", to: "vault" }], badges: { vault: "Mon 14:00" } },
  { cue: 1, layout: { keyholders: [0.4, 1], vault: [2.6, 1] }, edges: [{ from: "keyholders", to: "vault" }], badges: { keyholders: "back at desks", vault: "open" }, accent: ["vault"] },
  { cue: 3, layout: { admin: [0.4, 1], m78Prod: [2.6, 1] }, edges: [{ from: "admin", to: "m78Prod", label: "installs" }], badges: { admin: "Timur", m78Prod: "everything else" } },
  { cue: 4, layout: { m78Prod: [0.4, 1], laptop: [2.6, 1] }, edges: [{ from: "m78Prod", to: "laptop", label: "same install" }], badges: { m78Prod: "Timur", laptop: "Bekzod" }, accent: ["laptop"] },
  // The install nobody can repeat.
  { cue: 6, layout: HAND, edges: [...HAND_EDGES], badges: { m78Alone: "moved on" }, crossed: ["m78Alone"] },
  { cue: 7, layout: HAND, edges: [...HAND_EDGES], badges: { m78Prod: "which values?", m78TestServer: "why different?" }, danger: ["m78Prod", "m78TestServer"] },
  { cue: 8, layout: HAND, edges: [...HAND_EDGES], badges: { m78Prod: "nobody understands" }, danger: ["m78Prod"] },
  // Same steps, own values.
  { cue: 9, layout: HAND, edges: [...HAND_EDGES], badges: { m78Prod: "same as a laptop?" } },
  { cue: 10, layout: SAME, edges: [...SAME_EDGES], packets: SAME_EDGES.map((e) => ({ ...e, label: "same steps" })) },
  { cue: 11, layout: SAME, edges: [...SAME_EDGES], badges: { laptop: "own values", m78TestServer: "own values", m78Prod: "own values" }, accent: ["laptop", "m78TestServer", "m78Prod"] },
  { cue: 12, layout: { m78Values: [1.5, 1] }, badges: { m78Values: "address · certificate · email" }, accent: ["m78Values"] },
  // The card zone's own values.
  { cue: 13, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "the bank sets each" } },
  { cue: 14, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "callers · roles" } },
  { cue: 15, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "fraud limits" } },
  { cue: 16, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "session · tries · code" } },
  { cue: 17, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "the bank's choice" }, accent: ["m78Values"] },
  { cue: 18, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "no defaults" }, accent: ["m78Values"] },
  { cue: 19, layout: VALUES, edges: [...VALUE_EDGES], badges: { m78Values: "a default: nobody decided" }, danger: ["m78Values"] },
  { cue: 20, layout: VALUES, edges: [...VALUE_EDGES, { from: "m78Values", to: "vault", label: "kept" }], packets: [{ from: "m78Values", to: "vault", label: "per environment" }] },
  // Order.
  { cue: 21, layout: ORDER, badges: { zone: "1", m78Ecom: "2" } },
  { cue: 22, layout: ORDER, badges: { zone: "installs first" }, accent: ["zone"] },
  {
    cue: 23,
    layout: PAIR,
    edges: [...PAIR_EDGE],
    packets: [{ from: "m78Ecom", to: "zone", label: "please sign" }, { from: "zone", to: "m78Ecom", label: "signed", delay: 80 }],
    badges: { m78Ecom: "waits" },
  },
  // Preflight, settings, services, changes, health.
  { cue: 24, layout: PRE, edges: [...PRE_EDGES], accent: ["m78Preflight"] },
  { cue: 25, layout: PRE, edges: [...PRE_EDGES], badges: { m78Preflight: "before any work" } },
  { cue: 26, layout: PRE, edges: [...PRE_EDGES], badges: { m78Server: "tools · free ports" } },
  { cue: 27, layout: PRE, edges: [...PRE_EDGES, { from: "m78Server", to: "m78Fix", label: "missing" }], accent: ["m78Fix"] },
  { cue: 28, layout: { vault: [0.4, 1], m78Settings: [2.6, 1] }, edges: [{ from: "vault", to: "m78Settings", label: "written from" }], packets: [{ from: "vault", to: "m78Settings", label: "values" }] },
  { cue: 29, layout: UP, edges: [UP_EDGES[0]], packets: [{ from: "m78Installer", to: "m78Services", label: "start" }], badges: { m78Services: "each waits" } },
  { cue: 30, layout: { m78Value: [0.4, 1], m78Services: [2.6, 1] }, edges: [{ from: "m78Value", to: "m78Services", label: "same way" }], badges: { m78Services: "only its users restart" } },
  { cue: 31, layout: UP, edges: [...UP_EDGES], packets: [{ from: "m78Services", to: "m78Health", label: "ready?" }], accent: ["m78Health"] },
  // Timur's install.
  { cue: 32, layout: { admin: [0, 1], m78Installer: [1.5, 1], m78Server: [3, 1] }, edges: [{ from: "admin", to: "m78Installer" }, { from: "m78Installer", to: "m78Server" }], badges: { admin: "Timur", m78Installer: "card zone" } },
  { cue: 33, layout: PRE, edges: [...PRE_EDGES], badges: { m78Preflight: "first" } },
  { cue: 34, layout: PRE, edges: [...PRE_EDGES], badges: { m78Server: "most lines pass" } },
  { cue: 35, layout: PRE, edges: [...PRE_EDGES, { from: "m78Server", to: "m78Fix", label: "fails" }], badges: { m78Fix: "right under it" }, danger: ["m78Server"] },
  { cue: 36, layout: PRE, edges: [...PRE_EDGES, { from: "m78Server", to: "m78Fix" }], badges: { m78Fix: "fixed" }, accent: ["m78Fix"] },
  { cue: 37, layout: PRE, edges: [...PRE_EDGES], badges: { m78Server: "everything passes" }, accent: ["m78Server"] },
  { cue: 38, layout: RUN, edges: [...RUN_EDGES], badges: { m78Installer: "which release?", admin: "Timur" } },
  { cue: 39, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "m78Installer", to: "m78Values", label: "ask" }, { from: "admin", to: "m78Values", label: "answer", delay: 50 }], badges: { admin: "Timur" } },
  { cue: 40, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "where doors listen" } },
  { cue: 41, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "which callers" } },
  { cue: 42, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "websites · session · tries" } },
  { cue: 43, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "Malika's shop: one website" }, accent: ["m78Values"] },
  { cue: 44, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "fraud · alerts · certificate" } },
  { cue: 45, layout: RUN, edges: [...RUN_EDGES], badges: { m78Installer: "checks each answer" }, accent: ["m78Installer"] },
  { cue: 46, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "admin", to: "m78Values", label: "wrong form", stopAt: 0.6 }], badges: { m78Installer: "asked again" } },
  { cue: 47, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "admin", to: "m78Values", label: "certificate ≠ key", stopAt: 0.6 }], badges: { m78Installer: "asked again · why" } },
  { cue: 48, layout: RUN, edges: [...RUN_EDGES], badges: { m78Values: "every value is there" }, accent: ["m78Values"] },
  { cue: 49, layout: UP, edges: [...UP_EDGES], packets: [{ from: "m78Services", to: "m78Health", label: "ready?" }], badges: { m78Health: "every service healthy" }, accent: ["m78Health"] },
  // ecom's install.
  { cue: 50, layout: PAIR, edges: [...PAIR_EDGE], badges: { m78Ecom: "its installer" } },
  { cue: 51, layout: PAIR, edges: [...PAIR_EDGE], packets: [{ from: "m78Ecom", to: "zone", label: "request" }], badges: { m78Ecom: "waits" } },
  { cue: 52, layout: PAIR, edges: [...PAIR_EDGE], packets: [{ from: "zone", to: "m78Ecom", label: "signed" }], badges: { zone: "signed" }, accent: ["zone"] },
  { cue: 53, layout: { m78Ecom: [0.4, 1], m78Health: [2.6, 1] }, edges: [{ from: "m78Ecom", to: "m78Health" }], badges: { m78Health: "healthy too" }, accent: ["m78Health"] },
  // By evening.
  { cue: 54, layout: { m78Values: [1.5, 1] }, badges: { m78Values: "written once, one place" }, accent: ["m78Values"] },
  { cue: 55, layout: { m78Values: [0.4, 1], m78Installer: [2.6, 1] }, edges: [{ from: "m78Values", to: "m78Installer", label: "missing" }], badges: { m78Installer: "stops, no guess" }, danger: ["m78Installer"] },
  { cue: 56, layout: { laptop: [0.4, 1], m78Prod: [2.6, 1] }, edges: [{ from: "laptop", to: "m78Prod", label: "same install" }], badges: { laptop: "Bekzod" }, accent: ["laptop", "m78Prod"] },
  { cue: 57, layout: SAME, edges: [...SAME_EDGES], badges: { m78Installer: "same steps" }, accent: ["m78Installer"] },
  { cue: 58, layout: { m78Values: [0.4, 1], m78Installer: [2.6, 1] }, edges: [{ from: "m78Values", to: "m78Installer", label: "missing" }], badges: { m78Installer: "what now?" } },
  { cue: 59, layout: { m78Values: [0.4, 1], m78Installer: [2.6, 1] }, edges: [{ from: "m78Values", to: "m78Installer", label: "missing" }], badges: { m78Installer: "stops, no guess" }, danger: ["m78Installer"] },
];
