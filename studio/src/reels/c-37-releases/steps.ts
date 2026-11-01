import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 37: releases. Whatever is newest (cues 1–6), the printed edition (7–9), three-part numbers (10–15),
// a release and its bill of materials (16–20), pinned versions (21–25), the four-step upgrade (26–36),
// the operator's upgrade (37–51), what it protects (52–56).
const NEWEST = { m78Newest: [0.4, 1], m78Prod: [2.6, 1] } as const;
const NEWEST_EDGE = [{ from: "m78Newest", to: "m78Prod", label: "pulls" }] as const;
const ASK = { assessor: [0.4, 1], zone: [2.6, 1] } as const;
const ASK_EDGE = [{ from: "assessor", to: "zone", label: "what's inside?" }] as const;
const PARTS = { m78Major: [0, 1], m78Minor: [1.5, 1], m78Patch: [3, 1] } as const;
const BUILT = { m78Release: [0, 1], m78Built: [1.5, 1], m78Bom: [3, 1] } as const;
const BUILT_EDGES = [{ from: "m78Release", to: "m78Built", label: "built from" }, { from: "m78Built", to: "m78Bom", label: "carries" }] as const;
const PINS = { m78Pins: [1.5, 0.3], laptop: [0.3, 1.8], m78TestServer: [1.5, 1.8], m78Prod: [2.7, 1.8] } as const;
const PIN_EDGES = [
  { from: "m78Pins", to: "laptop" },
  { from: "m78Pins", to: "m78TestServer" },
  { from: "m78Pins", to: "m78Prod" },
] as const;
const FOUR = { m78BackUp: [0, 1], m78ChangeVersion: [1, 1], m78Deploy: [2, 1], m78Check: [3, 1] } as const;
const FOUR_EDGES = [
  { from: "m78BackUp", to: "m78ChangeVersion" },
  { from: "m78ChangeVersion", to: "m78Deploy" },
  { from: "m78Deploy", to: "m78Check" },
] as const;
const DB = { m78Db: [0, 1], m78Rollback: [1.5, 1], backup: [3, 1] } as const;
const PLAN = { admin: [0, 1], m78Release: [1.5, 1], m78ReleaseNotes: [3, 1] } as const;
const PLAN_EDGES = [{ from: "admin", to: "m78Release", label: "chooses" }, { from: "m78Release", to: "m78ReleaseNotes" }] as const;
const UP = { m78Pins: [0, 1], m78Services: [1.5, 1], m78Health: [3, 1] } as const;
const UP_EDGES = [{ from: "m78Pins", to: "m78Services", label: "deploy" }, { from: "m78Services", to: "m78Health" }] as const;
const SHELF = { m78Book: [0, 1], m78Release: [1.5, 1], m78Bom: [3, 1] } as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 7, current: ["kubernetes"], units: { ecom: "which version?", cards: "which version?" } },
  { cue: 59, part: 7, current: ["kubernetes"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // Whatever is newest.
  { cue: 1, layout: NEWEST, edges: [...NEWEST_EDGE], accent: ["m78Newest"] },
  { cue: 2, layout: NEWEST, edges: [...NEWEST_EDGE], packets: [{ from: "m78Newest", to: "m78Prod", label: "untested" }], badges: { m78Prod: "Tuesday" }, danger: ["m78Prod"] },
  { cue: 3, layout: NEWEST, edges: [...NEWEST_EDGE], packets: [{ from: "m78Newest", to: "m78Prod", label: "same broken" }], badges: { m78Prod: "Wednesday" }, danger: ["m78Prod"] },
  { cue: 4, layout: ASK, edges: [...ASK_EDGE], packets: [{ from: "assessor", to: "zone", label: "what runs?" }] },
  { cue: 5, layout: ASK, edges: [...ASK_EDGE], badges: { zone: "no answer" }, danger: ["zone"] },
  { cue: 6, layout: { m78Newest: [1.5, 1] }, badges: { m78Newest: "can't say what runs" }, crossed: ["m78Newest"] },
  // The printed edition.
  { cue: 7, layout: { m78Book: [1.5, 1] }, accent: ["m78Book"] },
  { cue: 8, layout: { m78Book: [1.5, 1] }, badges: { m78Book: "printed once" }, accent: ["m78Book"] },
  { cue: 9, layout: { m78Book: [1.5, 1] }, badges: { m78Book: "2nd ed. · same page" } },
  // Three-part numbers.
  { cue: 10, layout: { m78Release: [1.5, 1] }, accent: ["m78Release"] },
  { cue: 11, layout: PARTS, badges: { m78Minor: "three parts" } },
  { cue: 12, layout: PARTS, accent: ["m78Major"], badges: { m78Major: "breaks callers" } },
  { cue: 13, layout: PARTS, accent: ["m78Minor"], badges: { m78Major: "breaks callers", m78Minor: "adds" } },
  { cue: 14, layout: PARTS, accent: ["m78Patch"], badges: { m78Major: "breaks callers", m78Minor: "adds", m78Patch: "fixes" } },
  { cue: 15, layout: PARTS, badges: { m78Major: "careful", m78Minor: "easy", m78Patch: "safe" } },
  // A release and its bill of materials.
  { cue: 16, layout: { m78Release: [1.5, 1] }, badges: { m78Release: "made once · never changed" }, accent: ["m78Release"] },
  { cue: 17, layout: BUILT, edges: [BUILT_EDGES[0]], packets: [{ from: "m78Release", to: "m78Built", label: "1.4.0" }], badges: { m78Built: "under its number" } },
  { cue: 18, layout: BUILT, edges: [...BUILT_EDGES], badges: { m78Bom: "each with its version" }, accent: ["m78Bom"] },
  { cue: 19, layout: BUILT, edges: [...BUILT_EDGES], badges: { m78Built: "how it was built" } },
  { cue: 20, layout: { assessor: [0.4, 1], m78Bom: [2.6, 1] }, edges: [{ from: "assessor", to: "m78Bom", label: "reads" }], badges: { m78Bom: "the answer" }, accent: ["m78Bom"] },
  // Pinned versions.
  { cue: 21, layout: PINS, edges: [...PIN_EDGES], accent: ["m78Pins"] },
  { cue: 22, layout: PINS, edges: [...PIN_EDGES], badges: { m78Pins: "one exact release" } },
  { cue: 23, layout: PINS, edges: [...PIN_EDGES], badges: { m78Pins: "zone · ecom · portals" } },
  { cue: 24, layout: PINS, edges: [...PIN_EDGES], badges: { laptop: "real release", m78TestServer: "real release", m78Prod: "real release" } },
  { cue: 25, layout: { laptop: [0.4, 1], m78Prod: [2.6, 1] }, edges: [{ from: "laptop", to: "m78Prod", label: "same" }], accent: ["laptop", "m78Prod"] },
  // The four-step upgrade.
  { cue: 26, layout: FOUR, edges: [...FOUR_EDGES] },
  { cue: 27, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m78BackUp"] },
  { cue: 28, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m78ChangeVersion"] },
  { cue: 29, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m78Deploy"] },
  { cue: 30, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m78Check"] },
  { cue: 31, layout: { zone: [0.4, 1], m78Ecom: [2.6, 1] }, edges: [{ from: "zone", to: "m78Ecom", label: "then" }], badges: { zone: "first" } },
  { cue: 32, layout: { m78ReleaseNotes: [1.5, 1] }, badges: { m78ReleaseNotes: "changes · new value?" }, accent: ["m78ReleaseNotes"] },
  { cue: 33, layout: DB, badges: { m78Db: "forward only" }, accent: ["m78Db"] },
  { cue: 34, layout: DB, edges: [{ from: "m78Db", to: "m78Rollback" }], badges: { m78Rollback: "never" }, crossed: ["m78Rollback"] },
  { cue: 35, layout: { m78Db: [0.4, 1], backup: [2.6, 1] }, edges: [{ from: "backup", to: "m78Db", label: "restore" }], packets: [{ from: "backup", to: "m78Db", label: "just before" }], accent: ["backup"] },
  { cue: 36, layout: FOUR, edges: [...FOUR_EDGES], badges: { m78BackUp: "always step one" }, accent: ["m78BackUp"] },
  // The operator's upgrade.
  { cue: 38, layout: PLAN, edges: [...PLAN_EDGES], badges: { admin: "plans" } },
  { cue: 39, layout: PLAN, edges: [...PLAN_EDGES], badges: { m78Release: "the list" } },
  { cue: 40, layout: PLAN, edges: [...PLAN_EDGES], badges: { m78Release: "1.4.0", m78ReleaseNotes: "its notes" } },
  { cue: 41, layout: PLAN, edges: [...PLAN_EDGES], packets: [{ from: "admin", to: "m78Release", label: "newest" }], accent: ["m78ReleaseNotes"] },
  { cue: 42, layout: PLAN, edges: [...PLAN_EDGES], badges: { m78ReleaseNotes: "breaking? new value?" } },
  { cue: 43, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m78BackUp"], badges: { m78BackUp: "taken" } },
  { cue: 44, layout: { m78Pins: [1.5, 1] }, badges: { m78Pins: "zone: 1.3.2 → 1.4.0" }, accent: ["m78Pins"] },
  { cue: 45, layout: UP, edges: [UP_EDGES[0]], packets: [{ from: "m78Pins", to: "m78Services", label: "1.4.0" }] },
  { cue: 46, layout: UP, edges: [UP_EDGES[0]], badges: { m78Services: "restart in order" } },
  { cue: 47, layout: UP, edges: [...UP_EDGES], badges: { m78Health: "every service healthy" }, accent: ["m78Health"] },
  { cue: 48, layout: { zone: [0.4, 1], m78Ecom: [2.6, 1] }, edges: [{ from: "zone", to: "m78Ecom", label: "only then" }], badges: { zone: "1.4.0", m78Ecom: "same four steps" } },
  { cue: 49, layout: ASK, edges: [...ASK_EDGE], packets: [{ from: "assessor", to: "zone", label: "what's inside?" }] },
  { cue: 50, layout: { m78Built: [0.4, 1], m78Bom: [2.6, 1] }, edges: [{ from: "m78Built", to: "m78Bom", label: "opens" }] },
  { cue: 51, layout: { m78Built: [0.4, 1], m78Bom: [2.6, 1] }, edges: [{ from: "m78Built", to: "m78Bom" }], badges: { m78Bom: "142 components" }, accent: ["m78Bom"] },
  // What it protects.
  { cue: 52, layout: SHELF },
  { cue: 53, layout: { m78Pins: [1.5, 1] }, badges: { m78Pins: "no surprises" }, accent: ["m78Pins"] },
  { cue: 54, layout: SHELF, badges: { m78Release: "still the same" }, accent: ["m78Release"] },
  { cue: 55, layout: SHELF, badges: { m78Release: "still the same", m78Bom: "says what's inside" }, accent: ["m78Bom"] },
  { cue: 56, layout: FOUR, edges: [...FOUR_EDGES], badges: { m78BackUp: "before the change" }, accent: ["m78BackUp"] },
  { cue: 57, layout: SHELF },
  { cue: 58, layout: SHELF, badges: { m78Book: "named by number", m78Release: "never changed", m78Bom: "contents listed" } },
];
