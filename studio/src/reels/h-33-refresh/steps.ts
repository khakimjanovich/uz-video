import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 33: identity refresh. Sunday's yellow line (0–5); the document status (6–13); expired: restricted,
// not blocked (14–23); what a refresh is and who starts it (24–37); the new version and the rule (38–49);
// the close and the open question (50–55).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 8, rows: [4, 8], current: ["mobile", "myid", "postgres"], dot: "myid", units: { heeyid: "lesson 15: proofing · lesson 17: versions" } },
  { cue: 5, part: 8, rows: [8], current: ["postgres", "workers"], dot: "postgres", units: { heeyid: "time: documents expire" } },
  { cue: 32, part: 8, rows: [4], current: ["mobile", "custgw", "myid"], dot: "myid", units: { heeyid: "the road of module 4" } },
  { cue: 50, part: 8, rows: [8], current: ["workers", "postgres", "myid"], dot: "off", units: UNIT },
  { cue: 55, part: 8, rows: [8], dot: "off", units: UNIT },
];

const SUNDAY = { aziz: [0, 1], mobileBank: [1.5, 1] } as const;
const DRAWER = { aziz: [0, 1], mobileBank: [1.5, 0.4], passport: [1.5, 1.7] } as const;
const STATUS = { passport: [0, 1], identity: [1.5, 1], workers: [3, 1] } as const;
const STATUS_EDGES = [{ from: "passport", to: "identity" }, { from: "workers", to: "identity" }] as const;
const ASK = { identity: [0, 1], mobileBank: [1.5, 1], aziz: [3, 1] } as const;
const ASK_EDGES = [{ from: "identity", to: "mobileBank" }, { from: "mobileBank", to: "aziz" }] as const;
const GRANT = { aziz: [0, 1], trusted: [1.5, 1], platform: [3, 1] } as const;
const GRANT_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }] as const;
const STARTS = { aziz: [0, 0.2], mobileBank: [0, 1], operator: [0, 1.8], platform: [2.2, 1] } as const;
const STARTS_EDGES = [{ from: "aziz", to: "platform" }, { from: "mobileBank", to: "platform" }, { from: "operator", to: "platform" }] as const;
const ROAD = { aziz: [0, 1], trusted: [1, 1], platform: [2, 1.6], myid: [3, 0.6] } as const;
const ROAD_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }, { from: "platform", to: "myid" }, { from: "trusted", to: "myid" }] as const;
const VERSIONS = { identityOld: [0.5, 1], identity: [2.5, 1] } as const;
const RULE = { operator: [0, 0.3], records: [0, 1.7], identity: [1.6, 1], myid: [3, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Sunday: a yellow line, though nothing about Aziz has changed.
  { cue: 0, layout: SUNDAY, edges: [{ from: "aziz", to: "mobileBank" }], accent: ["mobileBank"] },
  { cue: 1, layout: SUNDAY, edges: [{ from: "aziz", to: "mobileBank" }], badges: { mobileBank: "passport expires soon" } },
  { cue: 2, layout: SUNDAY, edges: [{ from: "aziz", to: "mobileBank" }], badges: { aziz: "face · phone · password ✓" } },
  { cue: 3, layout: DRAWER, edges: [{ from: "aziz", to: "mobileBank" }, { from: "aziz", to: "passport" }], accent: ["passport"], badges: { passport: "a date" } },
  // The document status, calculated by a daily job.
  { cue: 6, layout: { passport: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "passport", to: "identity" }], accent: ["passport"] },
  { cue: 7, layout: { passport: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "passport", to: "identity" }], accent: ["identity"], badges: { identity: "expiry date" } },
  { cue: 8, layout: { passport: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "passport", to: "identity" }], badges: { identity: "valid · expiring · expired" } },
  { cue: 9, layout: { passport: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "passport", to: "identity" }], badges: { passport: "lead time → expiring", identity: "after the date → expired" } },
  { cue: 10, layout: STATUS, edges: [...STATUS_EDGES], accent: ["workers"], packets: [{ from: "workers", to: "identity", label: "status" }], badges: { workers: "each day" } },
  { cue: 11, layout: STATUS, edges: [...STATUS_EDGES], badges: { identity: "expiring", workers: "audit: document expiring" } },
  { cue: 12, layout: ASK, edges: [...ASK_EDGES], badges: { identity: "expiring" }, packets: [{ from: "mobileBank", to: "aziz", label: "refresh?" }] },
  { cue: 13, layout: ASK, edges: [...ASK_EDGES], badges: { identity: "expiring", mobileBank: "at each start" } },
  // Expired: restricted, never blocked.
  { cue: 14, layout: ASK, edges: [...ASK_EDGES], badges: { aziz: "later" }, shake: { aziz: 0.3 } },
  { cue: 15, layout: ASK, edges: [...ASK_EDGES], danger: ["identity"], badges: { identity: "expired" } },
  { cue: 17, layout: GRANT, edges: [...GRANT_EDGES], accent: ["trusted"], badges: { trusted: "grant valid" } },
  { cue: 18, layout: GRANT, edges: [...GRANT_EDGES], badges: { trusted: "grant valid", platform: "no block · no MyID at login" } },
  { cue: 19, layout: GRANT, edges: [...GRANT_EDGES], accent: ["trusted"], packets: [{ from: "platform", to: "trusted", label: "restricted + allowed actions" }], badges: { trusted: "restricted" } },
  { cue: 20, layout: GRANT, edges: [...GRANT_EDGES], packets: [{ from: "platform", to: "trusted", label: "document expired" }], badges: { trusted: "SMS + push" } },
  { cue: 21, layout: GRANT, edges: [...GRANT_EDGES], badges: { trusted: "restricted", platform: "audit: document expired" } },
  { cue: 22, layout: GRANT, edges: [...GRANT_EDGES], accent: ["trusted"], badges: { trusted: "the app applies the flag" } },
  { cue: 23, layout: GRANT, edges: [...GRANT_EDGES], accent: ["platform"], badges: { trusted: "restricted", platform: "only a refresh lifts it" } },
  // A refresh is a proofing, not an edit.
  { cue: 25, layout: { operator: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "operator", to: "identity", label: "type a new number", broken: true }], crossed: ["operator"] },
  { cue: 26, layout: { trusted: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "trusted", to: "myid" }], accent: ["myid"], badges: { myid: "full proofing · refresh" } },
  { cue: 27, layout: STARTS, edges: [...STARTS_EDGES], accent: ["platform"], badges: { platform: "refresh" } },
  { cue: 28, layout: STARTS, edges: [...STARTS_EDGES], accent: ["aziz"], packets: [{ from: "aziz", to: "platform", label: "new passport" }] },
  { cue: 29, layout: STARTS, edges: [...STARTS_EDGES], accent: ["mobileBank"], packets: [{ from: "mobileBank", to: "platform", label: "expiring · expired" }] },
  { cue: 30, layout: STARTS, edges: [...STARTS_EDGES], accent: ["operator"], packets: [{ from: "operator", to: "platform", label: "with a reason" }] },
  { cue: 31, layout: { trusted: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "trusted", to: "platform" }], accent: ["trusted"], badges: { trusted: "trusted · grant valid" } },
  { cue: 33, layout: ROAD, edges: [...ROAD_EDGES], accent: ["trusted"], badges: { trusted: "consent ✓" } },
  { cue: 34, layout: ROAD, edges: [...ROAD_EDGES], packets: [{ from: "platform", to: "myid", label: "number preset" }] },
  { cue: 35, layout: ROAD, edges: [...ROAD_EDGES], accent: ["myid"], packets: [{ from: "trusted", to: "myid", label: "face" }] },
  { cue: 36, layout: ROAD, edges: [...ROAD_EDGES], packets: [{ from: "myid", to: "platform", label: "result" }], badges: { trusted: "confirm" } },
  { cue: 37, layout: ROAD, edges: [...ROAD_EDGES], badges: { platform: "no phone check" } },
  // Same number: a new version next to the old one.
  { cue: 38, layout: { identity: [1.5, 1] }, accent: ["identity"] },
  { cue: 39, layout: VERSIONS, edges: [{ from: "identityOld", to: "identity" }], accent: ["identity"], badges: { identity: "v2 · current" } },
  { cue: 40, layout: VERSIONS, edges: [{ from: "identityOld", to: "identity" }], accent: ["identityOld"], badges: { identityOld: "v1 · kept", identity: "v2 · current" } },
  { cue: 41, layout: VERSIONS, edges: [{ from: "identityOld", to: "identity" }], badges: { identityOld: "v1 · kept", identity: "new reusable identifier" } },
  { cue: 42, layout: VERSIONS, edges: [{ from: "identityOld", to: "identity" }], accent: ["identity"], badges: { identityOld: "v1 · kept", identity: "valid · no flag" } },
  { cue: 43, layout: VERSIONS, edges: [{ from: "identityOld", to: "identity" }], badges: { identityOld: "v1 · kept", identity: "identity refreshed" } },
  // The rule: only a live face check writes the record.
  { cue: 45, layout: RULE, edges: [{ from: "myid", to: "identity", label: "live face" }], accent: ["myid"], badges: { identity: "only this way" } },
  { cue: 46, layout: RULE, edges: [{ from: "myid", to: "identity", label: "live face" }, { from: "operator", to: "identity", broken: true }, { from: "records", to: "identity", broken: true }], crossed: ["operator", "records"] },
  { cue: 47, layout: RULE, edges: [{ from: "myid", to: "identity", label: "live face" }, { from: "operator", to: "identity", broken: true }], crossed: ["operator"], badges: { operator: "ask: yes · type: no" } },
  { cue: 48, layout: { trusted: [0.5, 1.5], platform: [2.5, 1.5], operator: [2.5, 0.2] }, edges: [{ from: "trusted", to: "platform" }], accent: ["platform"], badges: { platform: "attempt limits" } },
  { cue: 49, layout: { trusted: [0.5, 1.5], platform: [2.5, 1.5], operator: [2.5, 0.2] }, edges: [{ from: "trusted", to: "platform" }, { from: "operator", to: "platform" }], accent: ["operator"], badges: { operator: "not counted" } },
  // Recap and the open question.
  { cue: 51, layout: STATUS, edges: [...STATUS_EDGES], badges: { identity: "expiring asks · expired restricts" } },
  { cue: 52, layout: { ...VERSIONS, myid: [1.5, 0] }, edges: [{ from: "identityOld", to: "identity" }, { from: "myid", to: "identity", label: "live face" }], accent: ["identity"] },
  { cue: 53, layout: { myid: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "myid", to: "identity", label: "different number", broken: true }], danger: ["identity"] },
  { cue: 54, layout: { myid: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "myid", to: "identity", label: "different number", broken: true }], danger: ["identity"], badges: { identity: "block?" } },
];
