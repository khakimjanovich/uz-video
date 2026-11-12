import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 8: registration in the mobile bank, week 1, Sunday. The question and the bridge (0–5); two entries and the
// terms (6–12); the request, four checks, the record (13–25); the code through TAF (26–32); a second registration
// (33–38); the phone that started, verified, verdict, lookup (39–46); restart and password (47–56); level 1 and
// "registration complete" (57–64); expiry (65–68); the check (69–71); summary and hand-off (72–77).
const UNIT = { heeyid: "registration" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 0, part: 3, current: ["customer", "mobile"], dot: "mobile" },
  { cue: 4, part: 3, rows: [2, 3], current: ["mobile", "edge", "custgw"], dot: "custgw", units: UNIT },
  { cue: 6, part: 3, current: ["customer", "mobile"], dot: "mobile", units: UNIT },
  { cue: 11, part: 3, current: ["mobile", "adapters", "taf"], dot: "taf", units: { heeyid: "terms name TAF" } },
  { cue: 13, part: 3, current: ["mobile", "edge", "custgw"], dot: "custgw", units: UNIT },
  { cue: 22, part: 3, current: ["custgw", "postgres"], dot: "postgres", units: UNIT },
  { cue: 26, part: 3, current: ["custgw", "postgres"], dot: "postgres", units: { heeyid: "code: fingerprint only" } },
  { cue: 30, part: 3, current: ["custgw", "adapters", "taf"], dot: "taf", units: { heeyid: "master app: TAF" } },
  { cue: 32, part: 3, current: ["adapters", "sms"], dot: "sms", units: { heeyid: "TAF silent: SMS vendor" } },
  { cue: 33, part: 3, current: ["mobile", "custgw", "postgres"], dot: "postgres", units: UNIT },
  { cue: 43, part: 3, current: ["custgw", "adapters", "taf"], dot: "taf", units: { heeyid: "verdict: lesson 10" } },
  { cue: 44, part: 3, current: ["custgw", "postgres"], dot: "postgres", units: UNIT },
  { cue: 47, part: 3, current: ["mobile", "custgw"], dot: "mobile", units: UNIT },
  { cue: 53, part: 3, current: ["mobile", "custgw", "postgres"], dot: "postgres", units: UNIT },
  { cue: 57, part: 3, current: ["custgw", "postgres", "keycloak"], dot: "postgres", units: { heeyid: "level 1" } },
  { cue: 63, part: 3, current: ["custgw", "adapters", "sms", "push"], dot: "sms", units: { heeyid: "registration complete" } },
  { cue: 65, part: 3, current: ["postgres", "workers"], dot: "postgres", units: UNIT },
  { cue: 69, part: 3, current: ["mobile", "custgw", "postgres"], dot: "custgw", units: UNIT },
  { cue: 72, part: 3, rows: [3], current: ["mobile", "custgw", "taf"], dot: "off", units: UNIT },
  { cue: 77, part: 3, current: ["custgw", "valkey"], dot: "valkey", units: { heeyid: "lesson 9: limits" } },
];

const BASE = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1] } as const;
const BASE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }] as const;
const TERMS = { ...BASE, taf: [3, 0.3] } as const;
const CHECKS = { ...BASE, acceptance: [3, 1.7] } as const;
const CHECKS_EDGES = [...BASE_EDGES, { from: "platform", to: "acceptance" }] as const;
const REC = { ...BASE, registration: [3, 0.3] } as const;
const REC_EDGES = [...BASE_EDGES, { from: "platform", to: "registration" }] as const;
const CODE = { ...REC, codeStore: [3, 1.7] } as const;
const CODE_EDGES = [...REC_EDGES, { from: "platform", to: "codeStore" }] as const;
const SEND = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1.7], taf: [2, 0.3], registration: [3, 1.7] } as const;
const SEND_EDGES = [...BASE_EDGES, { from: "platform", to: "taf" }, { from: "taf", to: "mobileBank", label: "SMS" }, { from: "platform", to: "registration" }] as const;
const SECOND = { ...BASE, registrationRec: [3, 0.3], registration: [3, 1.7] } as const;
const SECOND_EDGES = [...BASE_EDGES, { from: "platform", to: "registrationRec" }, { from: "platform", to: "registration" }] as const;
const PHONES = { aziz: [0, 0.4], mobileBank: [1, 0.4], newPhone: [1, 1.7], platform: [2, 1], registration: [3, 1] } as const;
const PHONES_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "newPhone", to: "platform" }, { from: "platform", to: "registration" }] as const;
const VERDICT = { ...BASE, taf: [3, 0.3], registration: [3, 1.7] } as const;
const VERDICT_EDGES = [...BASE_EDGES, { from: "platform", to: "taf" }, { from: "platform", to: "registration" }] as const;
const NOTIFY = { ...BASE, smsService: [3, 0.3], pushService: [3, 1.7] } as const;
const NOTIFY_EDGES = [...BASE_EDGES, { from: "platform", to: "smsService" }, { from: "platform", to: "pushService" }] as const;
const HANDOFF = { ...BASE, codeStore: [3, 0.3], valkey: [3, 1.7] } as const;
const HANDOFF_EDGES = [...BASE_EDGES, { from: "platform", to: "codeStore" }, { from: "platform", to: "valkey" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Sunday, week 1: the mobile bank on his one phone.
  { cue: 0, layout: { aziz: [0.6, 1], mobileBank: [2, 1] }, edges: [{ from: "aziz", to: "mobileBank" }], accent: ["mobileBank"] },
  { cue: 1, layout: { aziz: [0.6, 1], mobileBank: [2, 1] }, edges: [{ from: "aziz", to: "mobileBank" }], badges: { mobileBank: "week 1 · Sunday" } },
  { cue: 2, layout: { aziz: [0.6, 1], mobileBank: [2, 1] }, edges: [{ from: "aziz", to: "mobileBank" }], badges: { aziz: "a phone number" } },
  { cue: 3, layout: BASE, edges: [...BASE_EDGES], badges: { aziz: "a phone number", platform: "an account?" } },
  { cue: 4, layout: BASE, edges: [...BASE_EDGES], badges: { platform: "the contract" } },
  { cue: 5, layout: BASE, edges: [...BASE_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "first call" }] },
  // Two entries, a fixed link, the terms.
  { cue: 6, layout: BASE, edges: [...BASE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "Register · Log in" } },
  { cue: 7, layout: BASE, edges: [...BASE_EDGES], badges: { mobileBank: "link: fixed text" } },
  { cue: 8, layout: BASE, edges: [...BASE_EDGES], badges: { mobileBank: "same for every number" } },
  { cue: 9, layout: BASE, edges: [...BASE_EDGES], badges: { mobileBank: "Register" } },
  { cue: 10, layout: BASE, edges: [...BASE_EDGES], badges: { mobileBank: "terms · his language" } },
  { cue: 11, layout: TERMS, edges: [...BASE_EDGES], accent: ["taf"], badges: { mobileBank: "terms · his language", taf: "gets number · model" } },
  { cue: 12, layout: TERMS, edges: [...BASE_EDGES], badges: { mobileBank: "terms accepted ✓" } },
  // One request, four checks, the record.
  { cue: 13, layout: BASE, edges: [...BASE_EDGES], badges: { mobileBank: "number · Continue" } },
  { cue: 14, layout: BASE, edges: [...BASE_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "number · language · terms · phone" }] },
  { cue: 15, layout: BASE, edges: [...BASE_EDGES], badges: { mobileBank: "platform · model · system · app" } },
  { cue: 16, layout: BASE, edges: [...BASE_EDGES], badges: { platform: "+ network address" } },
  { cue: 17, layout: BASE, edges: [...BASE_EDGES], accent: ["platform"], badges: { platform: "4 checks" } },
  { cue: 18, layout: BASE, edges: [...BASE_EDGES], badges: { platform: "mobile number ✓" } },
  { cue: 19, layout: BASE, edges: [...BASE_EDGES], badges: { platform: "app active ✓" } },
  { cue: 20, layout: CHECKS, edges: [...CHECKS_EDGES], accent: ["acceptance"], badges: { platform: "terms current ✓", acceptance: "recorded" } },
  { cue: 21, layout: CHECKS, edges: [...CHECKS_EDGES], badges: { platform: "under the limit ✓" } },
  { cue: 22, layout: REC, edges: [...REC_EDGES], accent: ["registration"], badges: { registration: "Started" } },
  { cue: 23, layout: REC, edges: [...REC_EDGES], badges: { registration: "Started · his language" } },
  { cue: 24, layout: REC, edges: [...REC_EDGES], packets: [{ from: "platform", to: "mobileBank", label: "device identifier" }], badges: { registration: "device identifier" } },
  { cue: 25, layout: REC, edges: [...REC_EDGES], accent: ["mobileBank"], badges: { mobileBank: "only this phone", registration: "Started" } },
  // The code: random, a fingerprint only, sent by TAF.
  { cue: 26, layout: CODE, edges: [...CODE_EDGES], accent: ["codeStore"], packets: [{ from: "platform", to: "codeStore", label: "code" }], badges: { registration: "Started" } },
  { cue: 27, layout: CODE, edges: [...CODE_EDGES], badges: { registration: "Started", codeStore: "random" } },
  { cue: 28, layout: CODE, edges: [...CODE_EDGES], badges: { registration: "Started", codeStore: "fingerprint only" } },
  { cue: 29, layout: CODE, edges: [...CODE_EDGES], packets: [{ from: "platform", to: "mobileBank", label: "lifetime · resends" }], badges: { mobileBank: "no code", codeStore: "fingerprint only" } },
  { cue: 30, layout: SEND, edges: [...SEND_EDGES], accent: ["taf"], packets: [{ from: "platform", to: "taf", label: "code" }, { from: "taf", to: "mobileBank", label: "SMS code", delay: 30 }], badges: { mobileBank: "master app", registration: "Code sent" } },
  { cue: 31, layout: SEND, edges: [...SEND_EDGES], badges: { taf: "this phone · this SIM", registration: "Code sent" } },
  { cue: 32, layout: { ...SEND, smsService: [3, 0.3] }, edges: [...SEND_EDGES, { from: "platform", to: "smsService" }], crossed: ["taf"], accent: ["smsService"], badges: { smsService: "only when TAF is silent" } },
  // A second registration ends the open one.
  { cue: 33, layout: SEND, edges: [...SEND_EDGES], badges: { taf: "slow…", registration: "Code sent" } },
  { cue: 34, layout: SEND, edges: [...SEND_EDGES], shake: { mobileBank: 0.5 }, badges: { mobileBank: "Register again" } },
  { cue: 35, layout: SECOND, edges: [...SECOND_EDGES], crossed: ["registrationRec"], accent: ["registration"], badges: { registrationRec: "ended · code void", registration: "Started" } },
  { cue: 36, layout: SECOND, edges: [...SECOND_EDGES], crossed: ["registrationRec"], badges: { platform: "one open per number" } },
  { cue: 37, layout: SEND, edges: [...SEND_EDGES], packets: [{ from: "taf", to: "mobileBank", label: "code 1" }, { from: "taf", to: "mobileBank", label: "code 2", delay: 30 }], badges: { mobileBank: "code 2 alive" } },
  { cue: 38, layout: REC, edges: [...REC_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "code 2" }], badges: { registration: "Code sent" } },
  // Only the phone that started.
  { cue: 39, layout: PHONES, edges: [...PHONES_EDGES], accent: ["mobileBank"], badges: { mobileBank: "started it", registration: "Code sent" } },
  { cue: 40, layout: PHONES, edges: [...PHONES_EDGES], danger: ["newPhone"], packets: [{ from: "newPhone", to: "platform", label: "right code", stopAt: 0.6 }], badges: { platform: "wrong entry" } },
  { cue: 41, layout: CODE, edges: [...CODE_EDGES], badges: { platform: "fingerprints match ✓", registration: "Code sent" } },
  { cue: 42, layout: CODE, edges: [...CODE_EDGES], accent: ["registration"], crossed: ["codeStore"], badges: { registration: "Number verified", codeStore: "void" } },
  // The verdict, then the lookup.
  { cue: 43, layout: VERDICT, edges: [...VERDICT_EDGES], accent: ["taf"], badges: { taf: "Green", registration: "Number verified" } },
  { cue: 44, layout: VERDICT, edges: [...VERDICT_EDGES], badges: { taf: "Green", platform: "look up the number" } },
  { cue: 45, layout: VERDICT, edges: [...VERDICT_EDGES], accent: ["aziz"], badges: { aziz: "new person", platform: "nobody's number" } },
  { cue: 46, layout: REC, edges: [...REC_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "session?", stopAt: 0.5 }], badges: { platform: "not verified: nothing" } },
  // The password, a phone call, the restart.
  { cue: 47, layout: REC, edges: [...REC_EDGES], badges: { mobileBank: "password?", registration: "Number verified" } },
  { cue: 48, layout: REC, edges: [...REC_EDGES], shake: { mobileBank: 0.2 }, badges: { mobileBank: "a call: his mother" } },
  { cue: 49, layout: REC, edges: [...REC_EDGES], crossed: ["mobileBank"], badges: { mobileBank: "app closed", registration: "Number verified" } },
  { cue: 50, layout: REC, edges: [...REC_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "state?" }], badges: { mobileBank: "opened again" } },
  { cue: 51, layout: REC, edges: [...REC_EDGES], accent: ["mobileBank"], packets: [{ from: "platform", to: "mobileBank", label: "Number verified" }], badges: { mobileBank: "password screen" } },
  { cue: 52, layout: PHONES, edges: [...PHONES_EDGES], badges: { mobileBank: "Number verified", newPhone: "Expired" } },
  { cue: 53, layout: REC, edges: [...REC_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "password · again" }], badges: { registration: "Number verified" } },
  { cue: 54, layout: REC, edges: [...REC_EDGES], danger: ["mobileBank"], shake: { mobileBank: 0.3 }, badges: { mobileBank: "entries differ ✕" } },
  { cue: 55, layout: REC, edges: [...REC_EDGES], accent: ["mobileBank"], badges: { mobileBank: "entries match ✓" } },
  { cue: 56, layout: REC, edges: [...REC_EDGES], badges: { platform: "rules: lesson 11" } },
  // Level 1: four things at once.
  { cue: 57, layout: REC, edges: [...REC_EDGES], accent: ["platform"], badges: { registration: "Number verified" } },
  { cue: 58, layout: REC, edges: [...REC_EDGES], accent: ["aziz"], badges: { aziz: "level 1" } },
  { cue: 59, layout: REC, edges: [...REC_EDGES], accent: ["mobileBank"], badges: { mobileBank: "app account" } },
  { cue: 60, layout: REC, edges: [...REC_EDGES], badges: { mobileBank: "device: known, not trusted" } },
  { cue: 61, layout: REC, edges: [...REC_EDGES], badges: { mobileBank: "session" } },
  { cue: 62, layout: REC, edges: [...REC_EDGES], accent: ["registration"], badges: { aziz: "level 1", registration: "Onboarded" } },
  { cue: 63, layout: NOTIFY, edges: [...NOTIFY_EDGES], accent: ["smsService"], packets: [{ from: "platform", to: "smsService", label: "registration complete" }], badges: { smsService: "at once" } },
  { cue: 64, layout: NOTIFY, edges: [...NOTIFY_EDGES], accent: ["pushService"], packets: [{ from: "platform", to: "pushService", label: "registration complete" }], badges: { smsService: "at once", pushService: "after the push token" } },
  // Expiry.
  { cue: 65, layout: REC, edges: [...REC_EDGES], badges: { registration: "Code sent" } },
  { cue: 66, layout: REC, edges: [...REC_EDGES], danger: ["registration"], badges: { registration: "Expired" } },
  { cue: 67, layout: REC, edges: [...REC_EDGES], crossed: ["registration"], badges: { platform: "audit events kept" } },
  { cue: 68, layout: REC, edges: [...REC_EDGES], crossed: ["registration"], badges: { mobileBank: "start again" } },
  // The check: the code from the first message.
  { cue: 69, layout: SECOND, edges: [...SECOND_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "code 1" }], badges: { registrationRec: "first", registration: "second" } },
  { cue: 70, layout: SECOND, edges: [...SECOND_EDGES], badges: { registrationRec: "first", registration: "second", platform: "works?" } },
  { cue: 71, layout: SECOND, edges: [...SECOND_EDGES], crossed: ["registrationRec"], packets: [{ from: "mobileBank", to: "platform", label: "code 1", stopAt: 0.5 }], badges: { registrationRec: "ended", platform: "wrong entry" } },
  // Summary and hand-off.
  { cue: 72, layout: VERDICT, edges: [...VERDICT_EDGES], accent: ["mobileBank"], badges: { mobileBank: "Register · Log in" } },
  { cue: 73, layout: VERDICT, edges: [...VERDICT_EDGES], accent: ["platform"], badges: { platform: "terms · 4 checks · record" } },
  { cue: 74, layout: VERDICT, edges: [...VERDICT_EDGES], accent: ["taf"], badges: { taf: "code · this phone" } },
  { cue: 75, layout: VERDICT, edges: [...VERDICT_EDGES], accent: ["registration"], badges: { registration: "one open · resumes" } },
  { cue: 76, layout: VERDICT, edges: [...VERDICT_EDGES], accent: ["aziz"], badges: { aziz: "level 1" } },
  { cue: 77, layout: HANDOFF, edges: [...HANDOFF_EDGES], accent: ["valkey"], badges: { codeStore: "fingerprint only", valkey: "lesson 9" } },
];
