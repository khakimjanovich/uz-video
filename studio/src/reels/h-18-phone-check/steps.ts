import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 18: the phone check. The old number (cues 0–3); the bridge (4–5); why a face is not enough
// (6–11); the three steps (12–23); Confirmed (24–27); Processing and the review (28–41); the check log
// (42–48); the close (49–53).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 4, rows: [4], current: ["custgw", "postgres", "myid"], dot: "postgres", units: { heeyid: "MyID number: protected" } },
  { cue: 5, part: 4, rows: [4], current: ["custgw", "adapters", "taf", "myid"], dot: "custgw", units: { heeyid: "the phone check" } },
  { cue: 41, part: 4, current: ["staff", "admingw"], dot: "admingw", units: { heeyid: "review list: the only alert" } },
  { cue: 49, part: 4, rows: [4], current: ["custgw", "adapters", "taf", "myid", "admingw"], dot: "off", units: { heeyid: "in the bank" } },
  { cue: 53, part: 4, rows: [4], dot: "off", units: { heeyid: "in the bank" } },
];

const OLD = { aziz: [0, 1], myid: [2.5, 1] } as const;
const WHY = { impostor: [0, 1], newPhone: [1.5, 1], myid: [3, 1] } as const;
const WHY_EDGES = [{ from: "impostor", to: "newPhone" }, { from: "newPhone", to: "myid" }] as const;
const CHECK = { trusted: [0, 1], platform: [1.5, 1], taf: [3, 0.3], myid: [3, 1.7] } as const;
const CHECK_EDGES = [{ from: "trusted", to: "platform" }, { from: "platform", to: "taf" }, { from: "myid", to: "platform" }] as const;
const DONE = { aziz: [0, 1], trusted: [1.5, 1], platform: [3, 1] } as const;
const DONE_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }] as const;
const REVIEW = { aziz: [0, 1], platform: [1.5, 1], caseOperator: [3, 1] } as const;
const REVIEW_EDGES = [{ from: "aziz", to: "platform" }, { from: "platform", to: "caseOperator" }] as const;
const LOG = { trusted: [0, 1], checkLog: [1.5, 1], marketplace: [3, 0], mobileBank: [3, 1.2], myid: [3, 2.2] } as const;
const LOG_EDGES = [{ from: "trusted", to: "checkLog" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  { cue: 0, layout: OLD, edges: [{ from: "aziz", to: "myid" }], badges: { aziz: "an old number" } },
  { cue: 1, layout: OLD, edges: [{ from: "aziz", to: "myid" }], packets: [{ from: "aziz", to: "myid", label: "university number" }] },
  { cue: 2, layout: OLD, edges: [{ from: "aziz", to: "myid" }], accent: ["myid"], badges: { myid: "still on the record" } },
  { cue: 3, layout: OLD, edges: [{ from: "aziz", to: "myid" }], accent: ["myid"], badges: { aziz: "face ✓", myid: "whose number?" } },
  // Why a face is not enough.
  { cue: 6, layout: OLD, edges: [{ from: "aziz", to: "myid" }], badges: { aziz: "face ✓", myid: "enough?" } },
  { cue: 7, layout: OLD, edges: [{ from: "aziz", to: "myid" }], accent: ["aziz"], badges: { aziz: "person + number" } },
  { cue: 8, layout: WHY, edges: [...WHY_EDGES], badges: { myid: "face: who holds it" } },
  { cue: 9, layout: WHY, edges: [...WHY_EDGES], badges: { newPhone: "number: whose?" } },
  { cue: 10, layout: WHY, edges: [...WHY_EDGES], danger: ["impostor"], packets: [{ from: "newPhone", to: "myid", label: "own face" }], badges: { newPhone: "a stranger's number" } },
  { cue: 11, layout: WHY, edges: [...WHY_EDGES], danger: ["impostor"], shake: { impostor: 0.4 }, badges: { impostor: "level 2?" } },
  // Three steps.
  { cue: 12, layout: CHECK, edges: [...CHECK_EDGES], accent: ["platform"], badges: { trusted: "data confirmed" } },
  { cue: 13, layout: CHECK, edges: [...CHECK_EDGES], badges: { platform: "step-up only" } },
  { cue: 14, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], packets: [{ from: "platform", to: "taf", label: "1 · face confirmation" }] },
  { cue: 15, layout: CHECK, edges: [...CHECK_EDGES], badges: { trusted: "never sees the number" } },
  { cue: 16, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], packets: [{ from: "myid", to: "platform", label: "2 · MyID number" }], badges: { platform: "full numbers" } },
  { cue: 17, layout: CHECK, edges: [...CHECK_EDGES], badges: { platform: "same → Confirmed" } },
  { cue: 18, layout: CHECK, edges: [...CHECK_EDGES], danger: ["myid"], badges: { platform: "≠", myid: "old number" } },
  { cue: 19, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], packets: [{ from: "platform", to: "taf", label: "3 · owner?" }] },
  { cue: 20, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], badges: { taf: "number ↔ step 1" } },
  { cue: 21, layout: CHECK, edges: [...CHECK_EDGES], badges: { taf: "owner → Confirmed" } },
  { cue: 22, layout: CHECK, edges: [...CHECK_EDGES], badges: { taf: "else → Processing" } },
  { cue: 23, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], packets: [{ from: "taf", to: "platform", label: "owner" }], badges: { taf: "owner ✓" } },
  // Confirmed.
  { cue: 24, layout: DONE, edges: [...DONE_EDGES], accent: ["platform"], badges: { platform: "Confirmed" } },
  { cue: 25, layout: DONE, edges: [...DONE_EDGES], accent: ["aziz"], badges: { aziz: "level 2, every app" } },
  { cue: 26, layout: DONE, edges: [...DONE_EDGES], accent: ["trusted"], packets: [{ from: "platform", to: "trusted", label: "grant: level 2" }], badges: { trusted: "trusted" } },
  { cue: 27, layout: { ...DONE, records: [3, 2.2] }, edges: [...DONE_EDGES, { from: "platform", to: "records" }], accent: ["records"], badges: { records: "linking" } },
  // Processing: a person decides.
  { cue: 28, layout: CHECK, edges: [...CHECK_EDGES], danger: ["taf"], badges: { taf: "not owner" } },
  { cue: 29, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { platform: "Processing" } },
  { cue: 30, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { aziz: "level 1 · Processing" } },
  { cue: 31, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["caseOperator"], packets: [{ from: "platform", to: "caseOperator", label: "phone review" }] },
  { cue: 32, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["caseOperator"], badges: { caseOperator: "masked · time · device · app" } },
  { cue: 33, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { caseOperator: "no timer" } },
  { cue: 34, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { aziz: "level 1 until decided" } },
  { cue: 35, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["platform"], badges: { platform: "Processing" } },
  { cue: 36, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["caseOperator"], badges: { platform: "does not guess" } },
  { cue: 37, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["caseOperator"], badges: { caseOperator: "approve / reject + reason" } },
  { cue: 38, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["aziz"], packets: [{ from: "caseOperator", to: "platform", label: "approve" }], badges: { aziz: "level 2 · trusted" } },
  { cue: 39, layout: REVIEW, edges: [...REVIEW_EDGES], packets: [{ from: "caseOperator", to: "platform", label: "reject" }], badges: { aziz: "level 1 · Rejected" } },
  { cue: 40, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { aziz: "notification", caseOperator: "audit" } },
  // The check log.
  { cue: 42, layout: DONE, edges: [...DONE_EDGES], accent: ["aziz"], badges: { platform: "Confirmed" } },
  { cue: 43, layout: LOG, edges: [...LOG_EDGES], accent: ["checkLog"] },
  { cue: 44, layout: LOG, edges: [...LOG_EDGES], accent: ["checkLog"], badges: { checkLog: "provider · app · time" } },
  { cue: 45, layout: LOG, edges: [...LOG_EDGES, { from: "checkLog", to: "marketplace" }], badges: { marketplace: "SMS · March" } },
  { cue: 46, layout: LOG, edges: [...LOG_EDGES, { from: "checkLog", to: "marketplace" }, { from: "checkLog", to: "mobileBank" }], badges: { marketplace: "SMS · March", mobileBank: "TAF · registration" } },
  { cue: 47, layout: LOG, edges: [...LOG_EDGES, { from: "checkLog", to: "marketplace" }, { from: "checkLog", to: "mobileBank" }, { from: "checkLog", to: "myid" }], badges: { marketplace: "SMS · March", mobileBank: "TAF · registration", myid: "MyID · today" } },
  { cue: 48, layout: LOG, edges: [...LOG_EDGES, { from: "checkLog", to: "marketplace" }, { from: "checkLog", to: "mobileBank" }, { from: "checkLog", to: "myid" }], accent: ["checkLog"], badges: { checkLog: "how do we know?" } },
  // The close.
  { cue: 50, layout: { aziz: [0.5, 1], records: [2.5, 1] }, edges: [{ from: "aziz", to: "records" }], accent: ["aziz"], badges: { aziz: "Confirmed" } },
  { cue: 51, layout: { aziz: [0.5, 1], records: [2.5, 1] }, edges: [{ from: "aziz", to: "records" }], accent: ["records"], badges: { records: "already a customer?" } },
  { cue: 52, layout: { aziz: [0.5, 1], records: [2.5, 1] }, edges: [{ from: "aziz", to: "records", broken: true, label: "by phone?" }], badges: { records: "how to find him?" } },
];
