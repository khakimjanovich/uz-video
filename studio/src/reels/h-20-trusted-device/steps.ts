import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 20: the trusted device. The question (cues 0–4); the record (5–18); Known, then Trusted (19–26);
// the app PIN (27–39); the copied tokens and the binding check (40–60); the close (61–68).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 5, rows: [5], current: ["mobile", "custgw", "postgres"], units: UNIT },
  { cue: 6, part: 5, current: ["mobile", "custgw", "postgres"], dot: "postgres", units: { heeyid: "a record for the phone" } },
  { cue: 45, part: 5, current: ["mobile", "edge", "custgw"], dot: "custgw", units: { heeyid: "binding check, each request" } },
  { cue: 58, part: 5, current: ["staff", "admingw", "postgres"], dot: "admingw", units: { heeyid: "operator revokes" } },
  { cue: 68, part: 5, rows: [5], dot: "off", units: UNIT },
];

const REC = { aziz: [0, 1], trusted: [1.5, 1], platform: [3, 1] } as const;
const REC_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }] as const;
const PROOF = { aziz: [0, 1], trusted: [1.5, 1], platform: [3, 1.7], myid: [3, 0.3] } as const;
const PROOF_EDGES = [...REC_EDGES, { from: "trusted", to: "myid" }] as const;
const THREAT = { stranger: [0, 0.4], newPhone: [1.4, 0.4], platform: [3, 1], trusted: [1.4, 1.7], aziz: [0, 1.7] } as const;
const THREAT_EDGES = [
  { from: "aziz", to: "trusted" }, { from: "stranger", to: "newPhone" }, { from: "trusted", to: "newPhone", label: "copy" },
  { from: "newPhone", to: "platform" }, { from: "trusted", to: "platform" },
] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Glass, a chip and a SIM card: whose phone is it?
  { cue: 0, layout: { trusted: [1.5, 1] }, accent: ["trusted"] },
  { cue: 1, layout: { trusted: [1.5, 1] }, badges: { trusted: "glass · chip · SIM" } },
  { cue: 2, layout: { aziz: [0, 1], trusted: [1.5, 1] }, edges: [{ from: "aziz", to: "trusted" }], badges: { trusted: "Aziz's?" } },
  // Registration day: a record with a random identifier.
  { cue: 5, layout: REC, edges: [...REC_EDGES], accent: ["trusted"], badges: { aziz: "registration" } },
  { cue: 7, layout: REC, edges: [...REC_EDGES], packets: [{ from: "platform", to: "trusted", label: "random identifier" }], badges: { trusted: "device id" } },
  { cue: 8, layout: REC, edges: [...REC_EDGES], packets: [{ from: "trusted", to: "platform", label: "device id" }], badges: { trusted: "device id" } },
  { cue: 9, layout: REC, edges: [...REC_EDGES], badges: { trusted: "no hardware value" } },
  { cue: 11, layout: REC, edges: [...REC_EDGES], accent: ["platform"], badges: { platform: "device record" } },
  { cue: 12, layout: REC, edges: [...REC_EDGES], badges: { platform: "customer reference" } },
  { cue: 13, layout: REC, edges: [...REC_EDGES], badges: { platform: "ID number · one-way" } },
  { cue: 14, layout: REC, edges: [...REC_EDGES], badges: { platform: "model · OS · app" } },
  { cue: 15, layout: REC, edges: [...REC_EDGES], badges: { platform: "recorded · last seen" } },
  { cue: 16, layout: REC, edges: [...REC_EDGES], badges: { platform: "state" } },
  { cue: 17, layout: REC, edges: [...REC_EDGES], badges: { trusted: "one customer, for life" } },
  // Known at level 1, Trusted after MyID.
  { cue: 19, layout: REC, edges: [...REC_EDGES], badges: { aziz: "level 1", trusted: "Known" } },
  { cue: 21, layout: REC, edges: [...REC_EDGES], badges: { aziz: "level 1", trusted: "Known: seen before" } },
  { cue: 23, layout: PROOF, edges: [...PROOF_EDGES], accent: ["myid"], packets: [{ from: "trusted", to: "myid", label: "face" }], badges: { aziz: "level 2" } },
  { cue: 24, layout: PROOF, edges: [...PROOF_EDGES], accent: ["trusted"], badges: { aziz: "level 2", trusted: "Trusted" } },
  { cue: 25, layout: PROOF, edges: [...PROOF_EDGES], badges: { trusted: "Trusted", myid: "Confirmed only" } },
  { cue: 26, layout: PROOF, edges: [...PROOF_EDGES], badges: { trusted: "code ✕ · password ✕" } },
  // The app PIN stays on the phone.
  { cue: 27, layout: REC, edges: [...REC_EDGES], accent: ["trusted"], badges: { trusted: "set app PIN" } },
  { cue: 30, layout: REC, edges: [...REC_EDGES], badges: { trusted: "length: policy" } },
  { cue: 31, layout: REC, edges: [...REC_EDGES], shake: { trusted: 0.3 }, badges: { trusted: "easy PIN ✕" } },
  { cue: 33, layout: REC, edges: [...REC_EDGES], accent: ["trusted"], badges: { trusted: "PIN stays here" } },
  { cue: 34, layout: REC, edges: [...REC_EDGES], packets: [{ from: "trusted", to: "platform", label: "PIN set · time" }], badges: { trusted: "PIN stays here" } },
  { cue: 36, layout: REC, edges: [...REC_EDGES], badges: { platform: "PIN is no proof" } },
  { cue: 37, layout: REC, edges: [...REC_EDGES], badges: { trusted: "PIN ≠ password" } },
  // A stranger copies the tokens to his own phone.
  { cue: 40, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], badges: { trusted: "Trusted" } },
  { cue: 42, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], packets: [{ from: "trusted", to: "newPhone", label: "tokens" }] },
  { cue: 43, layout: THREAT, edges: [...THREAT_EDGES], danger: ["stranger"], packets: [{ from: "newPhone", to: "platform", label: "tokens + own id" }] },
  // The binding check: three questions.
  { cue: 46, layout: THREAT, edges: [...THREAT_EDGES], accent: ["platform"], badges: { platform: "1. Trusted or Known?" } },
  { cue: 47, layout: THREAT, edges: [...THREAT_EDGES], accent: ["platform"], badges: { platform: "2. Aziz's device?" } },
  { cue: 48, layout: THREAT, edges: [...THREAT_EDGES], accent: ["platform"], badges: { platform: "3. same ID number?" } },
  { cue: 49, layout: THREAT, edges: [...THREAT_EDGES], danger: ["newPhone"], shake: { newPhone: 0.3 }, badges: { platform: "2. ✕" } },
  { cue: 52, layout: THREAT, edges: [...THREAT_EDGES], danger: ["newPhone"], packets: [{ from: "newPhone", to: "platform", label: "request", stopAt: 0.5 }], badges: { newPhone: "grant ended" } },
  { cue: 53, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["newPhone"], badges: { newPhone: "Revoked" } },
  { cue: 54, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["newPhone"], badges: { newPhone: "Revoked", platform: "security event" } },
  { cue: 55, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["newPhone"], badges: { newPhone: "never trusted again" } },
  { cue: 57, layout: THREAT, edges: [...THREAT_EDGES], crossed: ["newPhone"], badges: { newPhone: "new login: new record" } },
  { cue: 59, layout: REC, edges: [...REC_EDGES], accent: ["platform"], badges: { platform: "ends at next request" } },
  { cue: 60, layout: REC, edges: [...REC_EDGES], accent: ["platform"], badges: { platform: "every request" } },
  // Recap and the open question.
  { cue: 61, layout: REC, edges: [...REC_EDGES], accent: ["trusted"], badges: { trusted: "random id · 3 states" } },
  { cue: 62, layout: REC, edges: [...REC_EDGES], badges: { trusted: "Known: seen before" } },
  { cue: 63, layout: REC, edges: [...REC_EDGES], badges: { trusted: "Trusted: MyID here" } },
  { cue: 64, layout: REC, edges: [...REC_EDGES], badges: { trusted: "Revoked: final" } },
  { cue: 65, layout: REC, edges: [...REC_EDGES], packets: [{ from: "trusted", to: "platform", label: "id + ?" }], badges: { platform: "what does it check?" } },
];
