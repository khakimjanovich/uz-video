import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 15: the phone check. The old number (cues 0–3); the bridge (4–5); why a face is not enough
// (6–11); the three steps (12–24); Confirmed (25–26); not owner (27–29); no answer and the phone review
// (30–43); the check history (44–49); the check (50–52); the summary (53–56); the close (57–58).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 4, rows: [4], current: ["custgw", "postgres", "myid"], dot: "postgres", units: { heeyid: "MyID number: protected" } },
  { cue: 5, part: 4, rows: [4], current: ["custgw", "adapters", "taf", "myid"], dot: "custgw", units: { heeyid: "the phone check" } },
  { cue: 37, part: 4, current: ["staff", "admingw"], dot: "admingw", units: { heeyid: "review list, then an alert by age" } },
  { cue: 53, part: 4, rows: [4], current: ["custgw", "adapters", "taf", "myid", "admingw"], dot: "off", units: { heeyid: "person and number" } },
  { cue: 58, part: 4, rows: [4], dot: "off", units: { heeyid: "in the bank" } },
];

const OLD = { aziz: [0, 1], myid: [2.5, 1] } as const;
const WHY = { impostor: [0, 1], newPhone: [1.5, 1], myid: [3, 1] } as const;
const WHY_EDGES = [{ from: "impostor", to: "newPhone" }, { from: "newPhone", to: "myid" }] as const;
const CHECK = { azizPhone: [0, 1], platform: [1.5, 1], taf: [3, 0.3], myid: [3, 1.7] } as const;
const CHECK_EDGES = [{ from: "azizPhone", to: "platform" }, { from: "platform", to: "taf" }, { from: "myid", to: "platform" }] as const;
const DONE = { aziz: [0, 1], azizPhone: [1.5, 1], platform: [3, 1] } as const;
const DONE_EDGES = [{ from: "aziz", to: "azizPhone" }, { from: "azizPhone", to: "platform" }] as const;
const CLOSED = { aziz: [0, 1], platform: [1.5, 1], smsService: [3, 1] } as const;
const CLOSED_EDGES = [{ from: "aziz", to: "platform" }, { from: "platform", to: "smsService" }] as const;
const REVIEW = { aziz: [0, 1], platform: [1.5, 1], caseOperator: [3, 1] } as const;
const REVIEW_EDGES = [{ from: "aziz", to: "platform" }, { from: "platform", to: "caseOperator" }] as const;
const LOG = { azizPhone: [0, 1], checkLog: [1.5, 1], mobileBank: [3, 0], myid: [3, 1.1], taf: [3, 2.2] } as const;
const LOG_EDGES = [{ from: "azizPhone", to: "checkLog" }] as const;
const LOG_ALL = [...LOG_EDGES, { from: "checkLog", to: "mobileBank" }, { from: "checkLog", to: "myid" }, { from: "checkLog", to: "taf" }] as const;
const LOG_BADGES = { mobileBank: "TAF code · registration", myid: "MyID · today · different", taf: "TAF · owner" } as const;

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
  { cue: 12, layout: CHECK, edges: [...CHECK_EDGES], accent: ["platform"], badges: { azizPhone: "data confirmed" } },
  { cue: 13, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], packets: [{ from: "platform", to: "taf", label: "1 · face confirmation" }] },
  { cue: 14, layout: CHECK, edges: [...CHECK_EDGES], badges: { azizPhone: "never sees the number" } },
  { cue: 15, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], packets: [{ from: "myid", to: "platform", label: "2 · MyID number" }], badges: { platform: "full numbers" } },
  { cue: 16, layout: CHECK, edges: [...CHECK_EDGES], badges: { platform: "same → Confirmed" } },
  { cue: 17, layout: CHECK, edges: [...CHECK_EDGES], danger: ["myid"], badges: { platform: "≠", myid: "old number" } },
  { cue: 18, layout: CHECK, edges: [...CHECK_EDGES], badges: { platform: "≠", myid: "no number: same path" } },
  { cue: 19, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], packets: [{ from: "platform", to: "taf", label: "3 · owner?" }] },
  { cue: 20, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], badges: { taf: "number ↔ step 1" } },
  { cue: 21, layout: CHECK, edges: [...CHECK_EDGES], badges: { taf: "owner → Confirmed" } },
  { cue: 22, layout: CHECK, edges: [...CHECK_EDGES], badges: { taf: "not owner → closed" } },
  { cue: 23, layout: CHECK, edges: [...CHECK_EDGES], badges: { taf: "no answer → Processing" } },
  { cue: 24, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], packets: [{ from: "taf", to: "platform", label: "owner" }], badges: { taf: "owner ✓" } },
  // Confirmed.
  { cue: 25, layout: DONE, edges: [...DONE_EDGES], accent: ["aziz"], badges: { platform: "Confirmed", aziz: "level 2" } },
  { cue: 26, layout: DONE, edges: [...DONE_EDGES], accent: ["platform"], badges: { platform: "event: identity verified", aziz: "level 2" } },
  // Not owner: the level-1 record closes.
  { cue: 27, layout: CHECK, edges: [...CHECK_EDGES], danger: ["taf"], badges: { taf: "not owner" } },
  { cue: 28, layout: CLOSED, edges: [...CLOSED_EDGES], danger: ["aziz"], badges: { aziz: "level-1 record closed" } },
  { cue: 29, layout: CLOSED, edges: [...CLOSED_EDGES], danger: ["aziz"], packets: [{ from: "platform", to: "smsService", label: "number not yours" }], badges: { platform: "+1 failed: number · phone" } },
  // No answer: Processing and a phone review.
  { cue: 30, layout: CHECK, edges: [...CHECK_EDGES], danger: ["taf"], badges: { taf: "no answer" } },
  { cue: 31, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { platform: "Processing" } },
  { cue: 32, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { aziz: "level 1 · Processing" } },
  { cue: 33, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["caseOperator"], packets: [{ from: "platform", to: "caseOperator", label: "phone review" }] },
  { cue: 34, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["caseOperator"], badges: { caseOperator: "masked · time · device · app" } },
  { cue: 35, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { aziz: "level 1 until decided", caseOperator: "no timer" } },
  { cue: 36, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["platform"], badges: { platform: "does not guess" } },
  { cue: 37, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { caseOperator: "watches the review list" } },
  { cue: 38, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["caseOperator"], badges: { caseOperator: "alert after the configured age" } },
  { cue: 39, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["caseOperator"], badges: { caseOperator: "approve / reject + reason" } },
  { cue: 40, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["caseOperator"], badges: { caseOperator: "approve: 2 operators · reject: 1" } },
  { cue: 41, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["aziz"], packets: [{ from: "caseOperator", to: "platform", label: "approved twice" }], badges: { aziz: "level 2" } },
  { cue: 42, layout: REVIEW, edges: [...REVIEW_EDGES], danger: ["aziz"], packets: [{ from: "caseOperator", to: "platform", label: "reject" }], badges: { aziz: "record closed" } },
  { cue: 43, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { platform: "audit trail" } },
  // The check history.
  { cue: 44, layout: DONE, edges: [...DONE_EDGES], accent: ["aziz"], badges: { platform: "Confirmed" } },
  { cue: 45, layout: LOG, edges: [...LOG_EDGES], accent: ["checkLog"], badges: { checkLog: "provider · app · time" } },
  { cue: 46, layout: LOG, edges: [...LOG_EDGES, { from: "checkLog", to: "mobileBank" }], badges: { mobileBank: LOG_BADGES.mobileBank } },
  { cue: 47, layout: LOG, edges: [...LOG_EDGES, { from: "checkLog", to: "mobileBank" }, { from: "checkLog", to: "myid" }], badges: { mobileBank: LOG_BADGES.mobileBank, myid: LOG_BADGES.myid } },
  { cue: 48, layout: LOG, edges: [...LOG_ALL], badges: { ...LOG_BADGES } },
  { cue: 49, layout: LOG, edges: [...LOG_ALL], accent: ["checkLog"], badges: { ...LOG_BADGES, checkLog: "how the bank knows" } },
  // The check.
  { cue: 50, layout: CHECK, edges: [...CHECK_EDGES], badges: { platform: "check" } },
  { cue: 51, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], badges: { myid: "same number?", taf: "asked?" } },
  { cue: 52, layout: CHECK, edges: [...CHECK_EDGES], accent: ["platform"], badges: { platform: "same → Confirmed", taf: "no owner question" } },
  // The summary.
  { cue: 53, layout: CHECK, edges: [...CHECK_EDGES], accent: ["platform"], badges: { platform: "person + number" } },
  { cue: 54, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], badges: { myid: "first", taf: "only if different or missing" } },
  { cue: 55, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], badges: { taf: "owner · not owner · no answer" } },
  { cue: 56, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["caseOperator"], badges: { caseOperator: "approve: 2 · reject: 1" } },
  // The close.
  { cue: 57, layout: DONE, edges: [...DONE_EDGES], accent: ["aziz"], badges: { aziz: "level 2" } },
  { cue: 58, layout: DONE, edges: [...DONE_EDGES], accent: ["azizPhone"], badges: { aziz: "level 2", azizPhone: "the money phone · lesson 16" } },
];
