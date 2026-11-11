import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 32: number changes. A recycled number (cues 0–5); the bridge (6–7, map); reassignment (8–26);
// the new holder (27–32); re-registration (33–48); dormant account (49–62); one transaction (63–64);
// the close (65–72).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 6, part: 7, rows: [7], current: ["mobile", "custgw"], dot: "custgw", units: { heeyid: "lesson 31: number left" } },
  { cue: 7, part: 7, current: ["custgw", "myid", "postgres"], dot: "myid", units: { heeyid: "reassign · re-register · dormant" } },
  { cue: 63, part: 7, current: ["postgres", "kafka"], dot: "postgres", units: { heeyid: "one transaction + its events" } },
  { cue: 64, part: 7, current: ["postgres"], dot: "postgres", units: { heeyid: "never one number on two" } },
  { cue: 72, part: 7, rows: [7, 8], dot: "off", current: ["myid", "workers"], units: { heeyid: "next: the identity refresh" } },
];

const RECYCLED = { aziz: [0, 1], newPhone: [1.3, 1], platform: [2.6, 1], someone: [2.6, 2.2] } as const;
const RECYCLED_EDGES = [{ from: "aziz", to: "newPhone" }, { from: "newPhone", to: "platform" }, { from: "someone", to: "platform" }] as const;
const CHECK = { newPhone: [0, 1], platform: [1.2, 1], taf: [2.2, 0.3], myid: [2.2, 1.7], someone: [3.1, 1] } as const;
const CHECK_EDGES = [{ from: "newPhone", to: "platform" }, { from: "platform", to: "taf" }, { from: "platform", to: "myid" }] as const;
const OLD = { platform: [0, 1], someone: [1.6, 1], trusted: [3.1, 1] } as const;
const OLD_EDGES = [{ from: "platform", to: "someone" }, { from: "someone", to: "trusted" }] as const;
const HOLDER = { myid: [0, 1], aziz: [1.5, 1], platform: [3, 1] } as const;
const HOLDER_EDGES = [{ from: "myid", to: "aziz" }, { from: "aziz", to: "platform" }] as const;
const REREG = { newPhone: [0.5, 0.4], records: [1.8, 1], platform: [3.1, 0.4], myid: [3.1, 1.7], trusted: [0.5, 1.7] } as const;
const REREG_EDGES = [{ from: "newPhone", to: "platform" }, { from: "platform", to: "myid" }, { from: "platform", to: "records" }, { from: "trusted", to: "records" }] as const;
const SMS = { ...REREG, smsService: [1.8, 2.3] } as const;
const SMS_EDGES = [...REREG_EDGES, { from: "records", to: "smsService" }] as const;
const DORMANT = { newPhone: [0, 1], platform: [1.4, 1], myid: [2.8, 0.4], marketplace: [2.8, 1.7] } as const;
const DORMANT_EDGES = [{ from: "newPhone", to: "platform" }, { from: "platform", to: "myid" }, { from: "platform", to: "marketplace" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // A recycled number.
  { cue: 0, layout: { aziz: [0.5, 1], newPhone: [2.5, 1] }, edges: [{ from: "aziz", to: "newPhone" }], accent: ["aziz"], badges: { newPhone: "new SIM" } },
  { cue: 1, layout: { aziz: [0.5, 1], newPhone: [2.5, 1] }, edges: [{ from: "aziz", to: "newPhone" }], badges: { newPhone: "a used number" } },
  { cue: 2, layout: RECYCLED, edges: [...RECYCLED_EDGES], accent: ["someone"], badges: { someone: "old owner · still a customer" } },
  { cue: 3, layout: RECYCLED, edges: [...RECYCLED_EDGES], packets: [{ from: "newPhone", to: "platform", label: "phone number" }] },
  { cue: 4, layout: RECYCLED, edges: [...RECYCLED_EDGES], danger: ["aziz"], badges: { platform: "known number · strange phone · no password" } },
  { cue: 5, layout: RECYCLED, edges: [...RECYCLED_EDGES], danger: ["aziz"], badges: { aziz: "owner or thief?" } },
  // Reassignment: the reset, TAF, MyID.
  { cue: 8, layout: RECYCLED, edges: [...RECYCLED_EDGES], badges: { platform: "reassignment" } },
  { cue: 9, layout: RECYCLED, edges: [...RECYCLED_EDGES], badges: { platform: "not a registration" } },
  { cue: 10, layout: RECYCLED, edges: [...RECYCLED_EDGES], badges: { someone: "their password", aziz: "does not know it" } },
  { cue: 11, layout: CHECK, edges: [...CHECK_EDGES], packets: [{ from: "newPhone", to: "platform", label: "Forgot password" }], badges: { platform: "new-phone checks" } },
  { cue: 12, layout: CHECK, edges: [...CHECK_EDGES], accent: ["taf"], packets: [{ from: "taf", to: "newPhone", label: "code" }], badges: { newPhone: "his SIM now" } },
  { cue: 13, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], badges: { someone: "was level 2", myid: "required" } },
  { cue: 14, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], packets: [{ from: "newPhone", to: "myid", label: "face" }], badges: { myid: "face ✓" } },
  { cue: 15, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], badges: { myid: "different person" } },
  { cue: 17, layout: CHECK, edges: [...CHECK_EDGES], badges: { myid: "thief: face ✕" } },
  { cue: 18, layout: CHECK, edges: [...CHECK_EDGES], accent: ["newPhone"], badges: { myid: "owner: face ✓, someone else" } },
  { cue: 19, layout: OLD, edges: [...OLD_EDGES], accent: ["platform"], packets: [{ from: "platform", to: "someone", label: "number removed" }] },
  { cue: 20, layout: OLD, edges: [...OLD_EDGES], badges: { someone: "not blocked" } },
  { cue: 21, layout: OLD, edges: [...OLD_EDGES], badges: { someone: "did nothing wrong" } },
  { cue: 22, layout: OLD, edges: [...OLD_EDGES], crossed: ["trusted"], badges: { trusted: "sessions end" } },
  { cue: 23, layout: OLD, edges: [...OLD_EDGES], crossed: ["trusted"], packets: [{ from: "someone", to: "trusted", label: "push: number removed" }], badges: { someone: "new number next login" } },
  { cue: 24, layout: OLD, edges: [...OLD_EDGES], accent: ["platform"], badges: { platform: "audit: number reassigned" } },
  { cue: 25, layout: OLD, edges: [...OLD_EDGES], accent: ["someone"], badges: { someone: "never a block" } },
  // Who gets the number.
  { cue: 27, layout: HOLDER, edges: [...HOLDER_EDGES], accent: ["aziz"], badges: { aziz: "who gets it?" } },
  { cue: 28, layout: HOLDER, edges: [...HOLDER_EDGES], accent: ["myid"], badges: { myid: "the person found" } },
  { cue: 29, layout: HOLDER, edges: [...HOLDER_EDGES], accent: ["aziz"], badges: { aziz: "listed → level 2" } },
  { cue: 30, layout: HOLDER, edges: [...HOLDER_EDGES], badges: { aziz: "not listed → level 1 · review" } },
  { cue: 31, layout: HOLDER, edges: [...HOLDER_EDGES], accent: ["platform"], badges: { aziz: "has an old number", platform: "already a customer" } },
  { cue: 32, layout: HOLDER, edges: [...HOLDER_EDGES], accent: ["platform"], badges: { platform: "→ re-registration" } },
  // Re-registration.
  { cue: 33, layout: REREG, edges: [...REREG_EDGES], accent: ["records"], badges: { records: "one person, two numbers" } },
  { cue: 35, layout: REREG, edges: [...REREG_EDGES], packets: [{ from: "newPhone", to: "platform", label: "level 1 · step-up" }] },
  { cue: 36, layout: REREG, edges: [...REREG_EDGES], accent: ["myid"], badges: { myid: "already exists" } },
  { cue: 38, layout: REREG, edges: [...REREG_EDGES], accent: ["myid"], badges: { myid: "number on the list?" } },
  { cue: 39, layout: REREG, edges: [...REREG_EDGES], accent: ["records"], packets: [{ from: "platform", to: "records", label: "move the number" }] },
  { cue: 40, layout: REREG, edges: [...REREG_EDGES], accent: ["newPhone"], badges: { newPhone: "trusted" } },
  { cue: 41, layout: REREG, edges: [...REREG_EDGES], crossed: ["trusted"], badges: { newPhone: "trusted", trusted: "replaced by re-registration" } },
  { cue: 42, layout: REREG, edges: [...REREG_EDGES], badges: { platform: "level-1 record closed" } },
  { cue: 43, layout: SMS, edges: [...SMS_EDGES], packets: [{ from: "records", to: "smsService", label: "new phone registered" }], badges: { smsService: "to the old number" } },
  { cue: 44, layout: REREG, edges: [...REREG_EDGES], accent: ["myid"], badges: { myid: "listed ✓" } },
  { cue: 45, layout: REREG, edges: [...REREG_EDGES], accent: ["newPhone"], crossed: ["trusted"], badges: { newPhone: "trusted", trusted: "revoked" } },
  { cue: 46, layout: { ...REREG, operator: [1.8, 2.3] }, edges: [...REREG_EDGES, { from: "operator", to: "records" }], danger: ["myid"], badges: { myid: "not listed" } },
  { cue: 47, layout: { ...REREG, operator: [1.8, 2.3] }, edges: [...REREG_EDGES, { from: "operator", to: "records" }], accent: ["operator"], badges: { platform: "step-up stops", operator: "a case" } },
  { cue: 48, layout: REREG, edges: [...REREG_EDGES], badges: { platform: "limited per day" } },
  // Dormant account.
  { cue: 49, layout: DORMANT, edges: [...DORMANT_EDGES], accent: ["platform"] },
  { cue: 51, layout: DORMANT, edges: [...DORMANT_EDGES], badges: { platform: "unused > dormancy period" } },
  { cue: 52, layout: DORMANT, edges: [...DORMANT_EDGES], danger: ["platform"], badges: { platform: "dormant" } },
  { cue: 53, layout: DORMANT, edges: [...DORMANT_EDGES], danger: ["platform"], packets: [{ from: "newPhone", to: "platform", label: "code only", stopAt: 0.6 }] },
  { cue: 54, layout: DORMANT, edges: [...DORMANT_EDGES], danger: ["platform"], badges: { platform: "nobody watching" } },
  { cue: 56, layout: DORMANT, edges: [...DORMANT_EDGES], accent: ["myid"], badges: { myid: "re-check or full proofing" } },
  { cue: 57, layout: DORMANT, edges: [...DORMANT_EDGES], accent: ["marketplace"], badges: { marketplace: "level 1 until approval" } },
  { cue: 58, layout: DORMANT, edges: [...DORMANT_EDGES], crossed: ["myid"], badges: { myid: "never level 2" } },
  { cue: 59, layout: { ...DORMANT, records: [1.4, 2.2] }, edges: [...DORMANT_EDGES, { from: "platform", to: "records" }], accent: ["records"], badges: { records: "old locked · new level 1" } },
  { cue: 60, layout: { ...DORMANT, records: [1.4, 2.2] }, edges: [...DORMANT_EDGES, { from: "platform", to: "records" }], badges: { platform: "audit: dormant reset" } },
  { cue: 62, layout: DORMANT, edges: [...DORMANT_EDGES], accent: ["myid"], badges: { myid: "different person → reassignment" } },
  // Recap and the next question.
  { cue: 65, layout: CHECK, edges: [...CHECK_EDGES], accent: ["myid"], badges: { myid: "MyID decides" } },
  { cue: 66, layout: OLD, edges: [...OLD_EDGES], badges: { someone: "no block" } },
  { cue: 67, layout: REREG, edges: [...REREG_EDGES], badges: { myid: "listed → joined" } },
  { cue: 68, layout: DORMANT, edges: [...DORMANT_EDGES], badges: { platform: "more than a code" } },
  { cue: 69, layout: { aziz: [0.5, 1], newPhone: [2.5, 1] }, edges: [{ from: "aziz", to: "newPhone" }], accent: ["aziz", "newPhone"], badges: { aziz: "level 2", newPhone: "trusted" } },
  { cue: 70, layout: { aziz: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "aziz", to: "myid" }], danger: ["myid"], badges: { myid: "passport expires" } },
  { cue: 71, layout: { aziz: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "aziz", to: "myid" }], danger: ["myid"], badges: { aziz: "level 2?" } },
];
