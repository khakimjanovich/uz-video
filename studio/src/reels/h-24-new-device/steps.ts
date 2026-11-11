import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 24: login from a new device. The question (cues 0–6); the password and the new-device request
// (7–10); the code through TAF (11–16); the approval on the old phone (17–35); the verdict (36–37);
// the account check and MyID (38–50); completion (51–58); the other button and side apps (59–65); the close (66–73).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 5, rows: [5], current: ["mobile", "custgw", "taf", "push", "myid"], units: UNIT },
  { cue: 10, part: 5, current: ["custgw", "valkey"], dot: "valkey", units: { heeyid: "new-device request" } },
  { cue: 22, part: 5, current: ["custgw", "adapters", "push", "mobile"], dot: "push", units: { heeyid: "push: request id only" } },
  { cue: 73, part: 5, rows: [5], dot: "off", units: UNIT },
];

const NEW = { aziz: [0, 1], newPhone: [1, 0.3], trusted: [1, 1.8], platform: [2, 1], taf: [3, 0.3] } as const;
const NEW_EDGES = [
  { from: "aziz", to: "newPhone" }, { from: "aziz", to: "trusted" }, { from: "newPhone", to: "platform" },
  { from: "trusted", to: "platform" }, { from: "platform", to: "taf" },
] as const;
const PROOF = { ...NEW, myid: [3, 1.8] } as const;
const PROOF_EDGES = [...NEW_EDGES, { from: "newPhone", to: "myid" }] as const;
const THREAT = { stranger: [0, 0.3], newPhone: [1.2, 0.3], platform: [2, 1], myid: [3, 0.3] } as const;
const THREAT_EDGES = [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "platform" }, { from: "newPhone", to: "myid" }] as const;
const SIDE = { aziz: [0, 1], marketplace: [1.2, 0.3], mobileBank: [1.2, 1.8], platform: [2.6, 1] } as const;
const SIDE_EDGES = [{ from: "aziz", to: "marketplace" }, { from: "marketplace", to: "platform" }, { from: "mobileBank", to: "platform" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // A new phone, the right number and password: enough?
  { cue: 0, layout: { aziz: [0, 1], newPhone: [1.5, 1] }, edges: [{ from: "aziz", to: "newPhone" }], accent: ["newPhone"], badges: { newPhone: "brand new" } },
  { cue: 1, layout: { aziz: [0, 1], newPhone: [1.5, 1], mobileBank: [3, 1] }, edges: [{ from: "aziz", to: "newPhone" }, { from: "newPhone", to: "mobileBank" }], badges: { newPhone: "SIM moved in" } },
  { cue: 2, layout: { aziz: [0, 1], newPhone: [1.5, 1], mobileBank: [3, 1] }, edges: [{ from: "aziz", to: "newPhone" }, { from: "newPhone", to: "mobileBank" }], badges: { newPhone: "number ✓ · password ✓" } },
  { cue: 3, layout: { aziz: [0, 1], newPhone: [1.5, 1], mobileBank: [3, 1] }, edges: [{ from: "aziz", to: "newPhone" }, { from: "newPhone", to: "mobileBank" }], badges: { mobileBank: "enough?" } },
  { cue: 4, layout: { stranger: [0, 1], newPhone: [1.5, 1], mobileBank: [3, 1] }, edges: [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "mobileBank" }], danger: ["stranger"], badges: { stranger: "swapped SIM · guessed password" } },
  // Password first, then an unknown device: a new-device request.
  { cue: 7, layout: NEW, edges: [...NEW_EDGES], packets: [{ from: "newPhone", to: "platform", label: "number · password" }], badges: { platform: "1. password" } },
  { cue: 8, layout: NEW, edges: [...NEW_EDGES], accent: ["platform"], badges: { platform: "password ✓" } },
  { cue: 9, layout: NEW, edges: [...NEW_EDGES], accent: ["newPhone"], badges: { newPhone: "not known" } },
  // The code through TAF goes to the SIM, wherever it is.
  { cue: 11, layout: NEW, edges: [...NEW_EDGES], accent: ["taf"], badges: { platform: "new-device request" } },
  { cue: 12, layout: NEW, edges: [...NEW_EDGES], packets: [{ from: "platform", to: "taf", label: "send code" }, { from: "taf", to: "newPhone", label: "SMS code", delay: 50 }] },
  { cue: 13, layout: NEW, edges: [...NEW_EDGES], badges: { taf: "login · new model" } },
  { cue: 14, layout: NEW, edges: [...NEW_EDGES], accent: ["newPhone"], badges: { newPhone: "code lands here" } },
  { cue: 15, layout: NEW, edges: [...NEW_EDGES], badges: { newPhone: "SIM ✓" } },
  { cue: 16, layout: NEW, edges: [...NEW_EDGES], badges: { newPhone: "SIM ✓ · person ?" } },
  // The old phone: rank 2, a push with no code, the approval request.
  { cue: 17, layout: NEW, edges: [...NEW_EDGES], accent: ["trusted"], badges: { trusted: "old phone" } },
  { cue: 18, layout: NEW, edges: [...NEW_EDGES], badges: { trusted: "session in the mobile bank" } },
  { cue: 19, layout: NEW, edges: [...NEW_EDGES], badges: { trusted: "Green: rank 2" } },
  { cue: 21, layout: NEW, edges: [...NEW_EDGES], badges: { trusted: "rank 2: may answer" } },
  { cue: 23, layout: NEW, edges: [...NEW_EDGES], packets: [{ from: "platform", to: "trusted", label: "request id" }], badges: { trusted: "no code" } },
  { cue: 24, layout: NEW, edges: [...NEW_EDGES], packets: [{ from: "trusted", to: "platform", label: "pull request" }] },
  { cue: 25, layout: NEW, edges: [...NEW_EDGES], badges: { trusted: "model · address · time" } },
  { cue: 26, layout: NEW, edges: [...NEW_EDGES], badges: { trusted: "never give a code" } },
  { cue: 27, layout: NEW, edges: [...NEW_EDGES], accent: ["trusted"], badges: { trusted: "Approve · This was not me" } },
  { cue: 29, layout: { ...NEW, scamCaller: [0, 0.3] }, edges: [...NEW_EDGES, { from: "scamCaller", to: "aziz" }], danger: ["scamCaller"], badges: { scamCaller: "\"tell me the code\"" } },
  { cue: 30, layout: NEW, edges: [...NEW_EDGES], badges: { trusted: "no code to read" } },
  { cue: 31, layout: NEW, edges: [...NEW_EDGES], accent: ["trusted", "newPhone"], packets: [{ from: "trusted", to: "platform", label: "Approve" }, { from: "newPhone", to: "platform", label: "code", delay: 40 }] },
  { cue: 32, layout: NEW, edges: [...NEW_EDGES], badges: { platform: "code + approval" } },
  { cue: 33, layout: NEW, edges: [...NEW_EDGES], badges: { trusted: "silent", platform: "after the wait: code" } },
  { cue: 34, layout: NEW, edges: [...NEW_EDGES], badges: { platform: "no rank 2: code" } },
  { cue: 35, layout: NEW, edges: [...NEW_EDGES], badges: { trusted: "rank 1: notice only" } },
  // The verdict.
  { cue: 36, layout: NEW, edges: [...NEW_EDGES], packets: [{ from: "platform", to: "taf", label: "verdict?" }], accent: ["taf"] },
  { cue: 37, layout: NEW, edges: [...NEW_EDGES], accent: ["taf"], badges: { taf: "Green" } },
  // The account check: what kind of account is this?
  { cue: 38, layout: NEW, edges: [...NEW_EDGES], accent: ["platform"], badges: { platform: "account check" } },
  { cue: 40, layout: NEW, edges: [...NEW_EDGES], badges: { platform: "dormant: lesson 32" } },
  { cue: 42, layout: NEW, edges: [...NEW_EDGES], badges: { platform: "never level 2: level 1" } },
  { cue: 43, layout: NEW, edges: [...NEW_EDGES], badges: { platform: "then a step-up" } },
  { cue: 44, layout: PROOF, edges: [...PROOF_EDGES], accent: ["myid"], badges: { aziz: "was level 2" } },
  { cue: 45, layout: PROOF, edges: [...PROOF_EDGES], packets: [{ from: "newPhone", to: "myid", label: "consent · re-check" }] },
  { cue: 46, layout: PROOF, edges: [...PROOF_EDGES], badges: { myid: "expired: full proofing" } },
  { cue: 47, layout: PROOF, edges: [...PROOF_EDGES], accent: ["myid"], badges: { myid: "face ✓" } },
  { cue: 48, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], badges: { myid: "the guard" } },
  { cue: 49, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], badges: { newPhone: "SIM · password · code" } },
  { cue: 50, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["stranger"], shake: { newPhone: 0.3 }, badges: { myid: "face ✕" } },
  // Completion: a record, a grant, a notice.
  { cue: 51, layout: PROOF, edges: [...PROOF_EDGES], accent: ["platform"], badges: { platform: "complete" } },
  { cue: 52, layout: PROOF, edges: [...PROOF_EDGES], badges: { platform: "new device record" } },
  { cue: 53, layout: PROOF, edges: [...PROOF_EDGES], accent: ["newPhone"], badges: { newPhone: "Trusted" } },
  { cue: 54, layout: PROOF, edges: [...PROOF_EDGES], badges: { newPhone: "no MyID: Known" } },
  { cue: 55, layout: PROOF, edges: [...PROOF_EDGES], packets: [{ from: "platform", to: "newPhone", label: "access grant" }], badges: { newPhone: "Trusted" } },
  { cue: 56, layout: PROOF, edges: [...PROOF_EDGES], badges: { platform: "new device login" } },
  { cue: 57, layout: PROOF, edges: [...PROOF_EDGES], packets: [{ from: "platform", to: "trusted", label: "push notice" }, { from: "platform", to: "newPhone", label: "SMS notice", delay: 40 }], badges: { trusted: "model · address · time" } },
  { cue: 58, layout: PROOF, edges: [...PROOF_EDGES], badges: { platform: "audit · antifraud" } },
  // The other button, and side apps in one line.
  { cue: 59, layout: NEW, edges: [...NEW_EDGES], danger: ["trusted"], badges: { trusted: "This was not me" } },
  { cue: 60, layout: NEW, edges: [...NEW_EDGES], crossed: ["newPhone"], badges: { trusted: "This was not me", platform: "number on hold" } },
  { cue: 62, layout: SIDE, edges: [...SIDE_EDGES], accent: ["marketplace"], badges: { marketplace: "new phone" } },
  { cue: 63, layout: SIDE, edges: [...SIDE_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "Approve" }], badges: { marketplace: "approval, no code" } },
  { cue: 64, layout: SIDE, edges: [...SIDE_EDGES], badges: { marketplace: "bank SMS · level 1" } },
  // Recap and the open question.
  { cue: 66, layout: PROOF, edges: [...PROOF_EDGES] },
  { cue: 67, layout: PROOF, edges: [...PROOF_EDGES], badges: { newPhone: "number + password: not enough" } },
  { cue: 68, layout: PROOF, edges: [...PROOF_EDGES], accent: ["taf"], badges: { taf: "code: the SIM" } },
  { cue: 69, layout: PROOF, edges: [...PROOF_EDGES], accent: ["trusted"], badges: { trusted: "approves" } },
  { cue: 70, layout: PROOF, edges: [...PROOF_EDGES], accent: ["myid"], badges: { myid: "the face" } },
  { cue: 71, layout: { aziz: [0, 1], newPhone: [1.5, 1] }, edges: [{ from: "aziz", to: "newPhone" }], accent: ["newPhone"], badges: { newPhone: "Trusted" } },
  { cue: 72, layout: { scamCaller: [0, 0.3], aziz: [0, 1.7], newPhone: [1.5, 1] }, edges: [{ from: "scamCaller", to: "aziz" }, { from: "aziz", to: "newPhone" }], danger: ["scamCaller"], badges: { scamCaller: "install this app" } },
];
