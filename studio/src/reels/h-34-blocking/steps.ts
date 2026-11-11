import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 34: blocks. The stolen phone (0–5); who can block, and why a failed face never does (6–14);
// what one block does, and why at the next request (15–30); the case (31–36); Saturday's unblock and the
// mismatch exception (37–48); the close and the open question (49–55).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 8, rows: [8], current: ["postgres", "myid"], dot: "myid", units: { heeyid: "lesson 33: a refresh mismatch" } },
  { cue: 5, part: 8, rows: [8], current: ["staff", "admingw", "custgw"], dot: "admingw", units: { heeyid: "block · unblock" } },
  { cue: 27, part: 8, rows: [8], current: ["custgw", "postgres", "keycloak", "kafka"], dot: "custgw", units: { heeyid: "three writes together" } },
  { cue: 28, part: 8, rows: [8], current: ["custgw", "valkey"], dot: "valkey", units: { heeyid: "revocation list" } },
  { cue: 55, part: 8, rows: [8], dot: "off", units: UNIT },
];

const BAZAAR = { phoneThief: [0, 0.4], trusted: [1.5, 0.4], aziz: [0, 1.7], operator: [3, 1.7] } as const;
const BAZAAR_EDGES = [{ from: "phoneThief", to: "trusted" }, { from: "aziz", to: "operator", label: "lock everything" }] as const;
const WHO = { platform: [0.8, 1], operator: [2.4, 1] } as const;
const FACE = { trusted: [0, 1], myid: [1.5, 1], platform: [3, 1] } as const;
const FACE_EDGES = [{ from: "trusted", to: "myid" }, { from: "myid", to: "platform" }] as const;
const GRANTS = { platform: [0.2, 1], keycloak: [1.6, 1], mobileBank: [3, 0.3], marketplace: [3, 1.7] } as const;
const GRANTS_EDGES = [{ from: "platform", to: "keycloak" }, { from: "keycloak", to: "mobileBank" }, { from: "keycloak", to: "marketplace" }] as const;
const POCKET = { phoneThief: [0, 1], trusted: [1.4, 1], platform: [3, 1] } as const;
const POCKET_EDGES = [{ from: "phoneThief", to: "trusted" }, { from: "trusted", to: "platform" }] as const;
const TRAIL = { platform: [0.3, 1], auditTrail: [2.3, 0.3], antifraud: [2.3, 1.7] } as const;
const TRAIL_EDGES = [{ from: "platform", to: "auditTrail" }, { from: "platform", to: "antifraud" }] as const;
const CASE = { operator: [0.5, 1], caseFile: [2.5, 1] } as const;
const UNBLOCK = { aziz: [0, 1.7], operator: [1.5, 1.7], platform: [3, 1] } as const;
const UNBLOCK_EDGES = [{ from: "aziz", to: "operator" }, { from: "operator", to: "platform" }] as const;
const BACK = { operator: [0, 1.6], platform: [1.4, 1.6], trusted: [2, 0.3], phoneThief: [3.2, 0.3] } as const;
const BACK_EDGES = [{ from: "operator", to: "platform" }, { from: "platform", to: "trusted" }, { from: "phoneThief", to: "trusted" }] as const;
const PROOF = { newPhone: [0, 1], myid: [1.5, 1], platform: [3, 1] } as const;
const PROOF_EDGES = [{ from: "newPhone", to: "myid" }, { from: "myid", to: "platform" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Friday night at the bazaar.
  { cue: 0, layout: { phoneThief: [0, 0.4], trusted: [1.5, 0.4], aziz: [0, 1.7] }, edges: [{ from: "phoneThief", to: "trusted" }], danger: ["phoneThief"] },
  { cue: 1, layout: { phoneThief: [0, 0.4], trusted: [1.5, 0.4], aziz: [0, 1.7] }, edges: [{ from: "phoneThief", to: "trusted" }], danger: ["phoneThief"], badges: { trusted: "stolen · signed in" } },
  { cue: 2, layout: BAZAAR, edges: [...BAZAAR_EDGES], accent: ["operator"], packets: [{ from: "aziz", to: "operator", label: "sister's phone" }], badges: { trusted: "stolen · signed in" } },
  { cue: 3, layout: BAZAAR, edges: [...BAZAAR_EDGES], badges: { operator: "who may?" } },
  // Who can block: two, and a failed face is not one of them.
  { cue: 6, layout: WHO, badges: { platform: "who can block?" } },
  { cue: 7, layout: WHO, accent: ["platform", "operator"], badges: { platform: "different number at a refresh", operator: "with a reason" } },
  { cue: 8, layout: WHO, accent: ["platform"], badges: { platform: "the only automatic block" } },
  { cue: 9, layout: { ...WHO, stranger: [1.6, 0] }, accent: ["stranger"], badges: { stranger: "number reassigned: no block" } },
  { cue: 10, layout: FACE, edges: [...FACE_EDGES], shake: { myid: 0.4 }, badges: { myid: "face ✕", platform: "no block" } },
  { cue: 11, layout: FACE, edges: [...FACE_EDGES], badges: { platform: "+1: number · device · ID number" } },
  { cue: 12, layout: FACE, edges: [...FACE_EDGES], badges: { platform: "cool-down · daily cap" } },
  { cue: 13, layout: FACE, edges: [...FACE_EDGES], badges: { myid: "counted: person or capture" } },
  { cue: 14, layout: FACE, edges: [...FACE_EDGES], badges: { myid: "service failed: not counted" } },
  // One block, one reason, and what it does.
  { cue: 16, layout: { operator: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "operator", to: "platform" }], accent: ["operator"], packets: [{ from: "operator", to: "platform", label: "block: phone stolen" }] },
  { cue: 18, layout: GRANTS, edges: [...GRANTS_EDGES], crossed: ["mobileBank", "marketplace"], badges: { keycloak: "all grants ended" } },
  { cue: 19, layout: POCKET, edges: [...POCKET_EDGES], danger: ["phoneThief"], packets: [{ from: "trusted", to: "platform", label: "balance?", stopAt: 0.6 }], badges: { platform: "refused" } },
  { cue: 20, layout: { newPhone: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "newPhone", to: "platform" }], packets: [{ from: "newPhone", to: "platform", label: "login: Aziz's number", stopAt: 0.6 }], badges: { platform: "refused" } },
  { cue: 21, layout: { platform: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "platform", to: "myid", broken: true }], badges: { myid: "open sessions stopped" } },
  { cue: 22, layout: { platform: [0.5, 1], identity: [2.5, 0.4], trusted: [2.5, 1.6] }, edges: [{ from: "platform", to: "identity" }, { from: "platform", to: "trusted" }], accent: ["identity", "trusted"], badges: { identity: "kept", trusted: "kept" } },
  { cue: 23, layout: { platform: [0.5, 1], aziz: [2.5, 1] }, edges: [{ from: "platform", to: "aziz" }], packets: [{ from: "platform", to: "aziz", label: "account blocked" }] },
  { cue: 24, layout: { platform: [0.5, 1], caseFile: [2.5, 1] }, edges: [{ from: "platform", to: "caseFile" }], accent: ["caseFile"], badges: { caseFile: "opened or updated" } },
  { cue: 25, layout: TRAIL, edges: [...TRAIL_EDGES], packets: [{ from: "platform", to: "auditTrail", label: "blocked" }, { from: "platform", to: "antifraud", label: "risk event", delay: 40 }] },
  // Why it holds at the very next request.
  { cue: 29, layout: { trusted: [0, 1], platform: [1.5, 1], revocation: [3, 1] }, edges: [{ from: "trusted", to: "platform" }, { from: "platform", to: "revocation" }], accent: ["revocation"], packets: [{ from: "trusted", to: "platform", label: "renew", stopAt: 0.7 }], badges: { platform: "binding check first" } },
  { cue: 30, layout: { operator: [0, 0.3], myid: [0, 1.7], platform: [1.8, 1] }, edges: [{ from: "operator", to: "platform" }, { from: "myid", to: "platform" }], badges: { platform: "same three writes" } },
  // The case: the operator's folder for one problem.
  { cue: 32, layout: CASE, edges: [{ from: "operator", to: "caseFile" }], accent: ["caseFile"] },
  { cue: 33, layout: CASE, edges: [{ from: "operator", to: "caseFile" }], badges: { caseFile: "trigger · masked values · notes" } },
  { cue: 34, layout: CASE, edges: [{ from: "operator", to: "caseFile" }], badges: { caseFile: "data refused · re-registration · link" } },
  { cue: 35, layout: CASE, edges: [{ from: "operator", to: "caseFile" }], badges: { operator: "phone reviews: own list" } },
  { cue: 36, layout: CASE, edges: [{ from: "operator", to: "caseFile" }], badges: { caseFile: "no action · unblocked · link · contacted" } },
  // Saturday: revoke the stolen phone, then unblock.
  { cue: 37, layout: { aziz: [0.5, 1], newPhone: [2.5, 1] }, edges: [{ from: "aziz", to: "newPhone" }], accent: ["newPhone"], badges: { newPhone: "old number" } },
  { cue: 38, layout: UNBLOCK, edges: [...UNBLOCK_EDGES], packets: [{ from: "operator", to: "platform", label: "unblock, with a reason" }] },
  { cue: 39, layout: UNBLOCK, edges: [...UNBLOCK_EDGES], accent: ["operator"], badges: { operator: "only an operator" } },
  { cue: 40, layout: { platform: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "platform", to: "trusted" }], accent: ["trusted"], badges: { trusted: "trusted again" } },
  { cue: 42, layout: BACK, edges: [...BACK_EDGES], danger: ["phoneThief"], badges: { trusted: "trusted again?" } },
  { cue: 43, layout: BACK, edges: [...BACK_EDGES], crossed: ["trusted"], packets: [{ from: "operator", to: "platform", label: "revoke first" }], badges: { trusted: "revoked" } },
  { cue: 44, layout: { newPhone: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "newPhone", to: "platform" }], accent: ["newPhone"], badges: { newPhone: "checks of lesson 24" } },
  // The exception: after a mismatch, no device comes back.
  { cue: 45, layout: { myid: [0.5, 1], identity: [2.5, 1] }, edges: [{ from: "myid", to: "identity", label: "different number", broken: true }], danger: ["identity"] },
  { cue: 46, layout: { platform: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "platform", to: "trusted", broken: true }], crossed: ["trusted"], badges: { platform: "no device back" } },
  { cue: 47, layout: PROOF, edges: [...PROOF_EDGES], accent: ["myid"], packets: [{ from: "newPhone", to: "myid", label: "full proofing" }], badges: { newPhone: "then trusted" } },
  // Recap and the open question.
  { cue: 49, layout: WHO, accent: ["platform", "operator"], badges: { platform: "different number", operator: "with a reason" } },
  { cue: 50, layout: { platform: [0.3, 1], keycloak: [2, 0.3], caseFile: [2, 1.7] }, edges: [{ from: "platform", to: "keycloak" }, { from: "platform", to: "caseFile" }], badges: { keycloak: "sessions end", caseFile: "case" } },
  { cue: 51, layout: { operator: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "operator", to: "platform" }], accent: ["operator"], badges: { operator: "only an operator unblocks" } },
  { cue: 52, layout: { phoneThief: [0.3, 1], trusted: [1.7, 1], platform: [3, 1] }, edges: [{ from: "phoneThief", to: "trusted" }, { from: "platform", to: "trusted" }], danger: ["phoneThief"] },
  { cue: 53, layout: { phoneThief: [0.3, 1], trusted: [1.7, 1], platform: [3, 1] }, edges: [{ from: "phoneThief", to: "trusted" }, { from: "platform", to: "trusted" }], danger: ["phoneThief"], packets: [{ from: "platform", to: "trusted", label: "account blocked" }] },
  { cue: 54, layout: { phoneThief: [0.3, 1], trusted: [1.7, 1], platform: [3, 1] }, edges: [{ from: "phoneThief", to: "trusted" }, { from: "platform", to: "trusted" }], danger: ["phoneThief"], badges: { trusted: "what does it show?" } },
];
