import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 31: "This was not me". The buzz (cues 0–6); the bridge (7–8, map); how the request arrived (9–16);
// refuse (17–19); hold (20–30); password change (31–35); the SIM question (36–46); why a hold (47–56);
// only rank 2 refuses (57–60); the close (61–68).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 7, part: 7, rows: [7], current: ["mobile", "myid"], dot: "myid", units: { heeyid: "lesson 30: MyID stopped him" } },
  { cue: 8, part: 7, current: ["mobile", "custgw", "push"], dot: "push", units: { heeyid: "the login and the button" } },
  { cue: 68, part: 7, rows: [7], dot: "off", current: ["custgw", "myid"], units: { heeyid: "next: when numbers change" } },
];

const THREAT = { stranger: [0, 0.4], newPhone: [1.3, 0.4], platform: [2.3, 1], trusted: [1.3, 1.7], aziz: [0, 1.7] } as const;
const THREAT_EDGES = [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "platform" }, { from: "platform", to: "trusted" }, { from: "aziz", to: "trusted" }] as const;
const TAF = { ...THREAT, taf: [3.1, 0.4] } as const;
const TAF_EDGES = [...THREAT_EDGES, { from: "platform", to: "taf" }] as const;
const HOLD = { newPhone: [0, 0.4], marketWeb: [0, 1.7], platform: [1.6, 1], smsService: [3.1, 0.4], trusted: [3.1, 1.7] } as const;
const HOLD_EDGES = [{ from: "newPhone", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "platform", to: "smsService" }, { from: "platform", to: "trusted" }] as const;
const SIM = { aziz: [0, 1], trusted: [1.4, 1], platform: [2.8, 1] } as const;
const SIM_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }] as const;
const SIM_NO = { ...SIM, myid: [2.8, 2.1] } as const;
const SIM_NO_EDGES = [...SIM_EDGES, { from: "trusted", to: "myid" }] as const;
const RANK = { platform: [0, 1], trusted: [1.8, 0.4], marketWeb: [1.8, 1.7], stranger: [3.1, 1.7] } as const;
const RANK_EDGES = [{ from: "platform", to: "trusted" }, { from: "platform", to: "marketWeb" }, { from: "stranger", to: "marketWeb" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The buzz.
  { cue: 0, layout: { aziz: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "aziz", to: "trusted" }], accent: ["aziz"], badges: { aziz: "11 p.m." } },
  { cue: 1, layout: { aziz: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "aziz", to: "trusted" }], accent: ["trusted"], shake: { trusted: 0.6 } },
  { cue: 2, layout: { aziz: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "aziz", to: "trusted" }], accent: ["trusted"], badges: { trusted: "unknown phone · address · 1 min ago" } },
  { cue: 3, layout: { aziz: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "aziz", to: "trusted" }], accent: ["trusted"], badges: { trusted: "Approve · This was not me" } },
  { cue: 4, layout: { aziz: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "aziz", to: "trusted" }], accent: ["trusted"], badges: { trusted: "This was not me" } },
  { cue: 6, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], badges: { platform: "do what?" } },
  // How the request arrived.
  { cue: 10, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], packets: [{ from: "newPhone", to: "platform", label: "number + password" }] },
  { cue: 11, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], badges: { platform: "password ✓ → request" } },
  { cue: 12, layout: TAF, edges: [...TAF_EDGES], danger: ["stranger"], packets: [{ from: "taf", to: "newPhone", label: "code" }], badges: { newPhone: "stranger's SIM" } },
  { cue: 13, layout: TAF, edges: [...TAF_EDGES], accent: ["trusted"], badges: { trusted: "mobile bank" } },
  { cue: 14, layout: TAF, edges: [...TAF_EDGES], accent: ["trusted"], packets: [{ from: "platform", to: "trusted", label: "approval request" }], badges: { trusted: "rank 2" } },
  { cue: 15, layout: TAF, edges: [...TAF_EDGES], accent: ["trusted"], badges: { trusted: "no code inside" } },
  { cue: 16, layout: TAF, edges: [...TAF_EDGES], badges: { newPhone: "code + approval" } },
  // Step 1: refuse.
  { cue: 17, layout: THREAT, edges: [...THREAT_EDGES], accent: ["trusted"], packets: [{ from: "trusted", to: "platform", label: "This was not me" }] },
  { cue: 19, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["newPhone"], shake: { newPhone: 0.2 }, packets: [{ from: "platform", to: "newPhone", label: "access", stopAt: 0.5 }], badges: { platform: "1 · refused · antifraud" } },
  { cue: 20, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["newPhone"], danger: ["stranger"] },
  { cue: 22, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["newPhone"], danger: ["stranger"], badges: { stranger: "knows the password" } },
  { cue: 23, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["newPhone"], danger: ["stranger"], badges: { stranger: "password · SIM?" } },
  // Step 2: the number goes on hold.
  { cue: 25, layout: HOLD, edges: [...HOLD_EDGES], danger: ["platform"], badges: { platform: "2 · number on hold" } },
  { cue: 26, layout: HOLD, edges: [...HOLD_EDGES], danger: ["platform"], crossed: ["newPhone"], badges: { platform: "number on hold", newPhone: "no code logins" } },
  { cue: 27, layout: HOLD, edges: [...HOLD_EDGES], danger: ["platform"], crossed: ["smsService"], badges: { platform: "number on hold", smsService: "no SMS" } },
  { cue: 28, layout: HOLD, edges: [...HOLD_EDGES], crossed: ["smsService"], packets: [{ from: "platform", to: "trusted", label: "push only" }] },
  { cue: 29, layout: HOLD, edges: [...HOLD_EDGES], crossed: ["smsService", "marketWeb"], packets: [{ from: "marketWeb", to: "platform", label: "web login", stopAt: 0.6 }], badges: { marketWeb: "refused" } },
  { cue: 30, layout: HOLD, edges: [...HOLD_EDGES], accent: ["trusted"], crossed: ["smsService"], badges: { trusted: "still works" } },
  // Step 3: the password changes at once.
  { cue: 31, layout: SIM, edges: [...SIM_EDGES], accent: ["trusted"], badges: { trusted: "3" } },
  { cue: 32, layout: SIM, edges: [...SIM_EDGES], accent: ["trusted"], badges: { trusted: "change password now" } },
  { cue: 33, layout: SIM, edges: [...SIM_EDGES], packets: [{ from: "trusted", to: "platform", label: "old + new ×2" }] },
  { cue: 34, layout: RANK, edges: [...RANK_EDGES], accent: ["trusted"], crossed: ["marketWeb"], badges: { trusted: "rank 2", marketWeb: "same or lower: ends" } },
  { cue: 35, layout: RANK, edges: [...RANK_EDGES], accent: ["trusted"], crossed: ["marketWeb"], danger: ["stranger"], badges: { trusted: "rank 2", marketWeb: "every other ends" } },
  // Step 4: the SIM question.
  { cue: 36, layout: SIM, edges: [...SIM_EDGES], accent: ["trusted"], badges: { trusted: "4" } },
  { cue: 37, layout: SIM, edges: [...SIM_EDGES], accent: ["trusted"], badges: { trusted: "SIM still works?" } },
  { cue: 38, layout: SIM, edges: [...SIM_EDGES], packets: [{ from: "trusted", to: "platform", label: "Yes" }], badges: { trusted: "Yes: password only" } },
  { cue: 39, layout: SIM, edges: [...SIM_EDGES], accent: ["platform"], badges: { platform: "hold ends" } },
  { cue: 40, layout: SIM, edges: [...SIM_EDGES], danger: ["platform"], packets: [{ from: "trusted", to: "platform", label: "No" }], badges: { trusted: "No: SIM taken" } },
  { cue: 41, layout: SIM, edges: [...SIM_EDGES], danger: ["platform"], badges: { platform: "number must go" } },
  { cue: 42, layout: SIM_NO, edges: [...SIM_NO_EDGES], accent: ["myid"], packets: [{ from: "trusted", to: "myid", label: "face" }], badges: { myid: "re-check ✓" } },
  { cue: 43, layout: SIM_NO, edges: [...SIM_NO_EDGES], accent: ["trusted"], badges: { platform: "number removed", trusted: "new number" } },
  { cue: 44, layout: SIM_NO, edges: [...SIM_NO_EDGES], accent: ["aziz"], badges: { aziz: "never blocked" } },
  { cue: 45, layout: SIM, edges: [...SIM_EDGES], accent: ["platform"], badges: { platform: "audit · antifraud · each step" } },
  { cue: 46, layout: SIM, edges: [...SIM_EDGES], packets: [{ from: "platform", to: "trusted", label: "number on hold" }] },
  // Why a hold.
  { cue: 47, layout: SIM, edges: [...SIM_EDGES], badges: { platform: "hold, not removal" } },
  { cue: 49, layout: SIM, edges: [...SIM_EDGES], danger: ["aziz"], badges: { aziz: "wrong tap" } },
  { cue: 50, layout: SIM, edges: [...SIM_EDGES], danger: ["aziz"], crossed: ["trusted"], badges: { aziz: "only login gone" } },
  { cue: 51, layout: SIM, edges: [...SIM_EDGES], accent: ["platform"], badges: { platform: "hold: easy to undo" } },
  { cue: 53, layout: HOLD, edges: [...HOLD_EDGES], crossed: ["smsService"], badges: { smsService: "no SMS alerts" } },
  { cue: 55, layout: { ...HOLD, operator: [1.6, 2.2] }, edges: [...HOLD_EDGES, { from: "operator", to: "platform" }], crossed: ["smsService"], badges: { platform: "no session: stuck" } },
  { cue: 56, layout: { ...HOLD, operator: [1.6, 2.2] }, edges: [...HOLD_EDGES, { from: "operator", to: "platform" }], accent: ["operator"], badges: { operator: "ends the hold · reason" } },
  // Only rank 2 can refuse.
  { cue: 58, layout: RANK, edges: [...RANK_EDGES], accent: ["trusted"], badges: { trusted: "rank 2: buttons" } },
  { cue: 59, layout: RANK, edges: [...RANK_EDGES], badges: { trusted: "rank 2: buttons", marketWeb: "rank 1: notice only" } },
  { cue: 60, layout: RANK, edges: [...RANK_EDGES], danger: ["stranger"], crossed: ["stranger"], badges: { marketWeb: "cannot approve" } },
  // Recap and the next question.
  { cue: 61, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["newPhone"], badges: { platform: "refused" } },
  { cue: 62, layout: HOLD, edges: [...HOLD_EDGES], crossed: ["smsService"], badges: { platform: "on hold · push only" } },
  { cue: 63, layout: RANK, edges: [...RANK_EDGES], crossed: ["marketWeb"], badges: { trusted: "new password" } },
  { cue: 64, layout: SIM_NO, edges: [...SIM_NO_EDGES], badges: { trusted: "SIM?", myid: "if no" } },
  { cue: 66, layout: { platform: [0, 1], newHolder: [2.5, 1] }, edges: [{ from: "newHolder", to: "platform" }], accent: ["newHolder"] },
  { cue: 67, layout: { platform: [0, 1], newHolder: [2.5, 1] }, edges: [{ from: "newHolder", to: "platform" }], accent: ["newHolder"], packets: [{ from: "newHolder", to: "platform", label: "register" }], badges: { platform: "what does it see?" } },
];
