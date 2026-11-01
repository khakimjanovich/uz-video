import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 40: releases. One night carries it: Timur upgrades the card zone before Malika's busy Friday.
// Thursday night (cues 0–3), the bridge (4–6), whatever is newest (7–13), three-part numbers (14–18),
// a release and its bill of materials (19–23), pinned versions (24–28), the four-step upgrade (29–39),
// Timur's upgrade (40–49), the assessor's question (50–53), Friday night (54–56).
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
const NIGHT = { admin: [0.4, 1], zone: [2.6, 1] } as const;
const NIGHT_EDGE = [{ from: "admin", to: "zone", label: "upgrades" }] as const;

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 4, part: 7, current: ["kubernetes"] },
  { cue: 5, part: 7, current: ["kubernetes"], units: { ecom: "same product?", cards: "same product?" } },
  { cue: 6, part: 7, current: ["kubernetes"], units: { ecom: "release", cards: "release" } },
  { cue: 57, part: 7, current: ["kubernetes"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // Thursday night, before Malika's Friday.
  { cue: 0, layout: NIGHT, edges: [...NIGHT_EDGE], badges: { admin: "Timur", zone: "Thu 23:00" } },
  { cue: 1, layout: NIGHT, edges: [...NIGHT_EDGE], badges: { admin: "Timur" }, accent: ["zone"] },
  { cue: 2, layout: { zone: [0.4, 1], shop: [2.6, 1] }, edges: [{ from: "shop", to: "zone" }], badges: { shop: "Malika · Friday" }, accent: ["shop"] },
  { cue: 3, layout: { admin: [0, 1], m78Release: [1.5, 1], m78Rollback: [3, 1] }, edges: [{ from: "admin", to: "m78Release" }, { from: "m78Release", to: "m78Rollback" }], badges: { m78Release: "what runs?", m78Rollback: "how to go back?" } },
  // Whatever is newest.
  { cue: 7, layout: NEWEST, edges: [...NEWEST_EDGE], accent: ["m78Newest"] },
  { cue: 8, layout: NEWEST, edges: [...NEWEST_EDGE], packets: [{ from: "m78Newest", to: "m78Prod", label: "untested" }], badges: { m78Prod: "Tuesday" }, danger: ["m78Prod"] },
  { cue: 9, layout: NEWEST, edges: [...NEWEST_EDGE], packets: [{ from: "m78Newest", to: "m78Prod", label: "same broken" }], badges: { m78Prod: "Wednesday" }, danger: ["m78Prod"] },
  { cue: 10, layout: ASK, edges: [...ASK_EDGE], packets: [{ from: "assessor", to: "zone", label: "what runs?" }] },
  { cue: 11, layout: ASK, edges: [...ASK_EDGE], badges: { zone: "no answer" }, danger: ["zone"] },
  { cue: 12, layout: { m78Newest: [1.5, 1] }, badges: { m78Newest: "can't say what runs" }, crossed: ["m78Newest"] },
  { cue: 13, layout: { m78Newest: [1.5, 1] }, badges: { m78Newest: "the most dangerous word" }, danger: ["m78Newest"] },
  // Three-part numbers.
  { cue: 14, layout: PARTS, badges: { m78Minor: "three parts" } },
  { cue: 15, layout: PARTS, accent: ["m78Major"], badges: { m78Major: "breaks callers" } },
  { cue: 16, layout: PARTS, accent: ["m78Minor"], badges: { m78Major: "breaks callers", m78Minor: "adds" } },
  { cue: 17, layout: PARTS, accent: ["m78Patch"], badges: { m78Major: "breaks callers", m78Minor: "adds", m78Patch: "fixes" } },
  { cue: 18, layout: PARTS, badges: { m78Major: "careful", m78Minor: "easy", m78Patch: "safe" } },
  // A release and its bill of materials.
  { cue: 19, layout: { m78Release: [1.5, 1] }, badges: { m78Release: "made once · never changed" }, accent: ["m78Release"] },
  { cue: 20, layout: BUILT, edges: [BUILT_EDGES[0]], packets: [{ from: "m78Release", to: "m78Built", label: "1.4.0" }], badges: { m78Built: "under its number" } },
  { cue: 21, layout: BUILT, edges: [...BUILT_EDGES], badges: { m78Bom: "each with its version" }, accent: ["m78Bom"] },
  { cue: 22, layout: BUILT, edges: [...BUILT_EDGES], badges: { m78Built: "how it was built" } },
  { cue: 23, layout: { assessor: [0.4, 1], m78Bom: [2.6, 1] }, edges: [{ from: "assessor", to: "m78Bom", label: "reads" }], badges: { m78Bom: "the answer" }, accent: ["m78Bom"] },
  // Pinned versions.
  { cue: 24, layout: PINS, edges: [...PIN_EDGES], accent: ["m78Pins"] },
  { cue: 25, layout: PINS, edges: [...PIN_EDGES], badges: { m78Pins: "one exact release" } },
  { cue: 26, layout: PINS, edges: [...PIN_EDGES], badges: { m78Pins: "zone · ecom · portals" } },
  { cue: 27, layout: PINS, edges: [...PIN_EDGES], badges: { laptop: "real release", m78TestServer: "real release", m78Prod: "real release" } },
  { cue: 28, layout: { laptop: [0.4, 1], m78Prod: [2.6, 1] }, edges: [{ from: "laptop", to: "m78Prod", label: "same" }], badges: { laptop: "Bekzod" }, accent: ["laptop", "m78Prod"] },
  // The four-step upgrade.
  { cue: 29, layout: FOUR, edges: [...FOUR_EDGES] },
  { cue: 30, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m78BackUp"] },
  { cue: 31, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m78ChangeVersion"] },
  { cue: 32, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m78Deploy"] },
  { cue: 33, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m78Check"] },
  { cue: 34, layout: { zone: [0.4, 1], m78Ecom: [2.6, 1] }, edges: [{ from: "zone", to: "m78Ecom", label: "then" }], badges: { zone: "first" } },
  { cue: 35, layout: { m78ReleaseNotes: [1.5, 1] }, badges: { m78ReleaseNotes: "changes · new value?" }, accent: ["m78ReleaseNotes"] },
  { cue: 36, layout: DB, badges: { m78Db: "forward only" }, accent: ["m78Db"] },
  { cue: 37, layout: DB, edges: [{ from: "m78Db", to: "m78Rollback" }], badges: { m78Rollback: "never" }, crossed: ["m78Rollback"] },
  { cue: 38, layout: { m78Db: [0.4, 1], backup: [2.6, 1] }, edges: [{ from: "backup", to: "m78Db", label: "restore" }], packets: [{ from: "backup", to: "m78Db", label: "just before" }], accent: ["backup"] },
  { cue: 39, layout: FOUR, edges: [...FOUR_EDGES], badges: { m78BackUp: "always step one" }, accent: ["m78BackUp"] },
  // Timur's upgrade.
  { cue: 40, layout: PLAN, edges: [...PLAN_EDGES], badges: { admin: "Timur", m78Release: "the list" } },
  { cue: 41, layout: PLAN, edges: [...PLAN_EDGES], badges: { admin: "Timur", m78Release: "1.4.0", m78ReleaseNotes: "its notes" } },
  { cue: 42, layout: PLAN, edges: [...PLAN_EDGES], packets: [{ from: "admin", to: "m78Release", label: "newest" }], badges: { admin: "Timur" }, accent: ["m78ReleaseNotes"] },
  { cue: 43, layout: PLAN, edges: [...PLAN_EDGES], badges: { admin: "Timur", m78ReleaseNotes: "breaking? new value?" } },
  { cue: 44, layout: FOUR, edges: [...FOUR_EDGES], accent: ["m78BackUp"], badges: { m78BackUp: "taken" } },
  { cue: 45, layout: { m78Pins: [1.5, 1] }, badges: { m78Pins: "zone: 1.3.2 → 1.4.0" }, accent: ["m78Pins"] },
  { cue: 46, layout: UP, edges: [UP_EDGES[0]], packets: [{ from: "m78Pins", to: "m78Services", label: "1.4.0" }] },
  { cue: 47, layout: UP, edges: [UP_EDGES[0]], badges: { m78Services: "restart in order" } },
  { cue: 48, layout: UP, edges: [...UP_EDGES], badges: { m78Health: "every service healthy" }, accent: ["m78Health"] },
  { cue: 49, layout: { zone: [0.4, 1], m78Ecom: [2.6, 1] }, edges: [{ from: "zone", to: "m78Ecom", label: "only then" }], badges: { zone: "1.4.0", m78Ecom: "same four steps" } },
  // A month later: the assessor's question.
  { cue: 50, layout: ASK, edges: [...ASK_EDGE], packets: [{ from: "assessor", to: "zone", label: "what's inside?" }] },
  { cue: 51, layout: { m78Built: [0.4, 1], m78Bom: [2.6, 1] }, edges: [{ from: "m78Built", to: "m78Bom", label: "opens" }] },
  { cue: 52, layout: { m78Built: [0.4, 1], m78Bom: [2.6, 1] }, edges: [{ from: "m78Built", to: "m78Bom" }], badges: { m78Bom: "142 components" }, accent: ["m78Bom"] },
  { cue: 53, layout: { assessor: [0.4, 1], m78Bom: [2.6, 1] }, edges: [{ from: "assessor", to: "m78Bom", label: "reads" }], badges: { assessor: "trusts every piece" }, accent: ["assessor"] },
  // Friday night.
  { cue: 54, layout: { m78Pins: [0.4, 1], shop: [2.6, 1] }, edges: [{ from: "m78Pins", to: "shop", label: "1.4.0" }], badges: { shop: "Malika · Friday" }, accent: ["shop"] },
  { cue: 55, layout: { m78Pins: [1.5, 1] }, badges: { m78Pins: "no surprises" }, accent: ["m78Pins"] },
  { cue: 56, layout: { m78Release: [0.4, 1], backup: [2.6, 1] }, badges: { m78Release: "still the same", backup: "before the change" }, accent: ["m78Release", "backup"] },
];
