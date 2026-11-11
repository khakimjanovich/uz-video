import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 16: prove once. The question (cues 0–1); the bridge (2–3); the reusable identifier (4–8); the
// river and the re-check (9–24); which kind when (25–31); the rule (32–38); side apps (39–42); reuse in
// one journey (43–46); the close (47–51).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 2, part: 4, rows: [4], current: ["mobile", "custgw", "myid"], dot: "myid", units: { heeyid: "lesson 15: full proofing" } },
  { cue: 3, part: 4, rows: [4], current: ["custgw", "postgres", "myid"], dot: "postgres", units: { heeyid: "what the platform keeps" } },
  { cue: 47, part: 4, rows: [4], current: ["custgw", "postgres", "myid"], dot: "off", units: { heeyid: "prove once, then bind" } },
  { cue: 51, part: 4, rows: [4], dot: "off", units: { heeyid: "in the bank" } },
];

const KEEP = { myid: [0, 1], platform: [1.5, 1], identity: [3, 1] } as const;
const KEEP_EDGES = [{ from: "myid", to: "platform" }, { from: "platform", to: "identity" }] as const;
const RIVER = { trusted: [0, 0.3], aziz: [0, 1.7], newPhone: [1.3, 1.7], platform: [2.3, 1], taf: [3, 0.3] } as const;
const RIVER_EDGES = [{ from: "aziz", to: "newPhone" }, { from: "newPhone", to: "platform" }, { from: "platform", to: "trusted" }, { from: "platform", to: "taf" }] as const;
const RECHECK = { aziz: [0, 1], newPhone: [1, 1], platform: [2, 1], myid: [3, 1] } as const;
const RECHECK_EDGES = [{ from: "aziz", to: "newPhone" }, { from: "newPhone", to: "platform" }, { from: "platform", to: "myid" }] as const;
const KINDS = { platform: [0, 1], credit: [1.5, 0], identity: [3, 0], newPhone: [1.5, 2], taf: [3, 2] } as const;
const KIND_EDGES = [{ from: "platform", to: "credit" }, { from: "platform", to: "identity" }, { from: "platform", to: "newPhone" }, { from: "platform", to: "taf" }] as const;
const RULE = { platform: [0.5, 1], myid: [2.5, 1] } as const;
const SIDE = { aziz: [0, 1], marketplace: [1.5, 0.4], mobileBank: [1.5, 1.6], platform: [3, 1] } as const;
const SIDE_EDGES = [{ from: "aziz", to: "marketplace" }, { from: "aziz", to: "mobileBank" }, { from: "marketplace", to: "platform" }, { from: "mobileBank", to: "marketplace" }] as const;
const REUSE = { mobileBank: [0, 1], platform: [1.5, 1], myid: [3, 1] } as const;
const REUSE_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "myid" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  { cue: 0, layout: { aziz: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "aziz", to: "myid" }], badges: { myid: "how often?" } },
  { cue: 1, layout: { aziz: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "aziz", to: "myid" }], accent: ["aziz"], badges: { myid: "once" } },
  // The reusable identifier.
  { cue: 4, layout: KEEP, edges: [...KEEP_EDGES], packets: [{ from: "myid", to: "platform", label: "identity + identifier" }] },
  { cue: 5, layout: KEEP, edges: [...KEEP_EDGES], accent: ["platform"], badges: { platform: "reusable identifier" } },
  { cue: 6, layout: KEEP, edges: [...KEEP_EDGES], badges: { platform: "valid to a contract date" } },
  { cue: 7, layout: KEEP, edges: [...KEEP_EDGES], accent: ["identity"], packets: [{ from: "platform", to: "identity", label: "identifier + expiry" }] },
  { cue: 8, layout: { ...KEEP, trusted: [1.5, 2.1] }, edges: [...KEEP_EDGES, { from: "platform", to: "trusted" }], packets: [{ from: "platform", to: "trusted", label: "identifier", stopAt: 0.5 }], badges: { trusted: "never on the phone" } },
  // The river, a new phone, a re-check.
  { cue: 9, layout: { trusted: [0, 0.3], aziz: [0, 1.7] }, crossed: ["trusted"], badges: { trusted: "in the river" } },
  { cue: 10, layout: { trusted: [0, 0.3], aziz: [0, 1.7] }, crossed: ["trusted"], accent: ["aziz"], badges: { aziz: "identifier still valid" } },
  { cue: 11, layout: RIVER, edges: [...RIVER_EDGES], crossed: ["trusted"], packets: [{ from: "newPhone", to: "platform", label: "number + password" }] },
  { cue: 12, layout: RIVER, edges: [...RIVER_EDGES], crossed: ["trusted"], accent: ["taf"], badges: { taf: "green", newPhone: "code ✓" } },
  { cue: 13, layout: RIVER, edges: [...RIVER_EDGES], crossed: ["trusted"], badges: { trusted: "cannot approve", platform: "wait → code enough" } },
  { cue: 14, layout: RIVER, edges: [...RIVER_EDGES], crossed: ["trusted"], accent: ["platform"], badges: { platform: "was level 2 · unknown device" } },
  { cue: 15, layout: RECHECK, edges: [...RECHECK_EDGES], badges: { myid: "not everything" } },
  { cue: 16, layout: RECHECK, edges: [...RECHECK_EDGES], accent: ["myid"], badges: { myid: "re-check" } },
  { cue: 17, layout: RECHECK, edges: [...RECHECK_EDGES], accent: ["newPhone"], badges: { newPhone: "consent again ✓" } },
  { cue: 18, layout: RECHECK, edges: [...RECHECK_EDGES], packets: [{ from: "platform", to: "myid", label: "identifier preset" }] },
  { cue: 19, layout: RECHECK, edges: [...RECHECK_EDGES], accent: ["myid"], badges: { myid: "no document · camera" } },
  { cue: 20, layout: RECHECK, edges: [...RECHECK_EDGES], packets: [{ from: "newPhone", to: "platform", label: "face" }], badges: { myid: "live · same person?" } },
  { cue: 21, layout: RECHECK, edges: [...RECHECK_EDGES], packets: [{ from: "myid", to: "platform", label: "match ✓ · no profile" }] },
  { cue: 22, layout: RECHECK, edges: [...RECHECK_EDGES], accent: ["platform"], badges: { platform: "confidence · refs · time" } },
  { cue: 23, layout: RECHECK, edges: [...RECHECK_EDGES], accent: ["newPhone"], badges: { newPhone: "trusted" } },
  { cue: 24, layout: RECHECK, edges: [...RECHECK_EDGES], accent: ["aziz"], badges: { aziz: "one look" } },
  // Which kind for which purpose.
  { cue: 25, layout: KINDS, edges: [...KIND_EDGES], accent: ["platform"], badges: { platform: "which kind?" } },
  { cue: 26, layout: KINDS, edges: [...KIND_EDGES], accent: ["platform"], badges: { platform: "purpose + identifier" } },
  { cue: 27, layout: KINDS, edges: [...KIND_EDGES], accent: ["credit"], badges: { credit: "step-up: full" } },
  { cue: 28, layout: KINDS, edges: [...KIND_EDGES], accent: ["identity"], badges: { credit: "step-up: full", identity: "refresh: full" } },
  { cue: 29, layout: KINDS, edges: [...KIND_EDGES], accent: ["newPhone"], badges: { credit: "step-up: full", identity: "refresh: full", newPhone: "new device · dormant: re-check" } },
  { cue: 30, layout: KINDS, edges: [...KIND_EDGES], accent: ["newPhone"], badges: { credit: "step-up: full", identity: "refresh: full", newPhone: "expired: full, number preset" } },
  { cue: 31, layout: KINDS, edges: [...KIND_EDGES], accent: ["taf"], badges: { credit: "step-up: full", identity: "refresh: full", newPhone: "re-check", taf: "yellow: re-check" } },
  // The rule: never to MyID for nothing.
  { cue: 32, layout: RULE, edges: [{ from: "platform", to: "myid", broken: true }], badges: { platform: "level 2 · valid document", myid: "not again" } },
  { cue: 33, layout: RULE, edges: [{ from: "platform", to: "myid", broken: true }], badges: { platform: "no channel · app · partner" } },
  { cue: 34, layout: RULE, edges: [{ from: "platform", to: "myid", broken: true }], accent: ["platform"] },
  { cue: 35, layout: RULE, edges: [{ from: "platform", to: "myid", broken: true }], badges: { myid: "every call costs" } },
  { cue: 36, layout: RULE, edges: [{ from: "platform", to: "myid" }], accent: ["platform"], badges: { platform: "prove once, then bind" } },
  { cue: 37, layout: RULE, edges: [{ from: "platform", to: "myid" }], badges: { platform: "no face template · no face engine" } },
  { cue: 38, layout: RULE, edges: [{ from: "platform", to: "myid" }], badges: { myid: "liveness", platform: "keeps the result" } },
  // Side apps never ask for MyID.
  { cue: 39, layout: SIDE, edges: [...SIDE_EDGES], accent: ["marketplace"] },
  { cue: 40, layout: SIDE, edges: [...SIDE_EDGES], accent: ["marketplace"], badges: { marketplace: "new phone" } },
  { cue: 41, layout: SIDE, edges: [...SIDE_EDGES], badges: { marketplace: "no MyID at login" } },
  { cue: 42, layout: SIDE, edges: [...SIDE_EDGES], accent: ["mobileBank"], packets: [{ from: "mobileBank", to: "marketplace", label: "Approve", delay: 40 }], badges: { marketplace: "level 1 → level 2" } },
  // Reuse inside one journey.
  { cue: 43, layout: REUSE, edges: [...REUSE_EDGES], badges: { platform: "one journey" } },
  { cue: 44, layout: REUSE, edges: [...REUSE_EDGES], crossed: ["mobileBank"], packets: [{ from: "myid", to: "platform", label: "result" }], badges: { mobileBank: "app closed" } },
  { cue: 45, layout: REUSE, edges: [...REUSE_EDGES], accent: ["platform"], badges: { platform: "same result, reuse period", myid: "no new call" } },
  { cue: 46, layout: REUSE, edges: [...REUSE_EDGES], badges: { platform: "later: new proofing" } },
  // The close.
  { cue: 48, layout: { platform: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "platform", to: "identity" }], accent: ["identity"], badges: { identity: "names · document · addresses" } },
  { cue: 49, layout: { platform: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "platform", to: "identity" }], danger: ["identity"], badges: { identity: "most sensitive" } },
  { cue: 50, layout: { platform: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "platform", to: "identity" }], accent: ["identity"], badges: { identity: "who reads it?" } },
];
