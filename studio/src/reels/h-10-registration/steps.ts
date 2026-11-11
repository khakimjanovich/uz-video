import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 10: registration. The question (0–5); Sunday on the marketplace web: record, code, SMS, verify (6–33);
// the new person, the password, level 1 (34–48); Monday in the master app: TAF and a known number (49–63);
// expiry (64–68); recap and the open question (69–77).
const UNIT = { heeyid: "registration" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 0, part: 3, current: ["customer", "sideapps"], dot: "sideapps" },
  { cue: 4, part: 3, rows: [2, 3], current: ["mobile", "sideapps", "edge", "custgw"], dot: "custgw", units: UNIT },
  { cue: 6, part: 3, current: ["sideapps", "edge", "custgw"], dot: "custgw" },
  { cue: 13, part: 3, current: ["custgw", "postgres"], dot: "postgres" },
  { cue: 21, part: 3, current: ["custgw", "adapters", "sms"], dot: "sms", units: { heeyid: "side app: bank SMS" } },
  { cue: 26, part: 3, current: ["sideapps", "custgw", "postgres"], dot: "custgw", units: UNIT },
  { cue: 42, part: 3, current: ["custgw", "postgres", "keycloak"], dot: "postgres", units: { heeyid: "level 1" } },
  { cue: 49, part: 3, current: ["mobile", "custgw", "adapters", "taf"], dot: "taf", units: { heeyid: "master app: TAF" } },
  { cue: 53, part: 3, current: ["adapters", "taf", "sms"], dot: "sms", units: { heeyid: "TAF down: bank SMS" } },
  { cue: 55, part: 3, current: ["mobile", "custgw", "postgres"], dot: "postgres", units: { heeyid: "known number: a login" } },
  { cue: 64, part: 3, current: ["postgres", "workers"], dot: "postgres", units: UNIT },
  { cue: 69, part: 3, rows: [3], current: ["mobile", "sideapps", "custgw", "taf", "sms"], dot: "off", units: UNIT },
];

const WEB = { aziz: [0, 1], webProfile: [1.1, 1], platform: [2.2, 1] } as const;
const WEB_EDGES = [{ from: "aziz", to: "webProfile" }, { from: "webProfile", to: "platform" }] as const;
const REC = { ...WEB, registration: [3, 0.3] } as const;
const REC_EDGES = [...WEB_EDGES, { from: "platform", to: "registration" }] as const;
const CODE = { ...REC, codeStore: [3, 1.7] } as const;
const CODE_EDGES = [...REC_EDGES, { from: "platform", to: "codeStore" }] as const;
const SMS = { aziz: [0, 1], webProfile: [1, 1], platform: [2, 1], registration: [2, 0.1], smsService: [3, 1.7], azizPhone: [3, 0.4] } as const;
const SMS_EDGES = [...WEB_EDGES, { from: "platform", to: "registration" }, { from: "platform", to: "smsService" }, { from: "smsService", to: "azizPhone" }] as const;
const LEVEL1 = { aziz: [0, 1], platform: [1.5, 1], webProfile: [3, 0.4], registration: [3, 1.7] } as const;
const LEVEL1_EDGES = [{ from: "aziz", to: "platform" }, { from: "platform", to: "webProfile" }, { from: "platform", to: "registration" }] as const;
const MON = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1], taf: [3, 0.3], smsService: [3, 1.7] } as const;
const MON_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "taf" }] as const;
const KNOWN = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1], registration: [3, 0.3], webProfile: [3, 1.7] } as const;
const KNOWN_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "registration" }] as const;
const ALL = { aziz: [0, 1], webProfile: [1, 0.3], mobileBank: [1, 1.7], platform: [2, 1], smsService: [3, 0.3], taf: [3, 1.7] } as const;
const ALL_EDGES = [
  { from: "aziz", to: "webProfile" }, { from: "aziz", to: "mobileBank" }, { from: "webProfile", to: "platform" }, { from: "mobileBank", to: "platform" },
  { from: "platform", to: "smsService", label: "side apps" }, { from: "platform", to: "taf", label: "master app" },
] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Sunday: a phone number on a web page.
  { cue: 0, layout: { aziz: [0.5, 1], webProfile: [2, 1] }, edges: [{ from: "aziz", to: "webProfile" }], accent: ["webProfile"] },
  { cue: 1, layout: { aziz: [0.5, 1], webProfile: [2, 1] }, edges: [{ from: "aziz", to: "webProfile" }], badges: { webProfile: "phone number?" } },
  { cue: 3, layout: WEB, edges: [...WEB_EDGES], badges: { webProfile: "phone number?", platform: "customer?" } },
  // The request, the three checks, the record.
  { cue: 6, layout: WEB, edges: [...WEB_EDGES], packets: [{ from: "webProfile", to: "platform", label: "number · language · device" }] },
  { cue: 9, layout: WEB, edges: [...WEB_EDGES], accent: ["platform"], badges: { platform: "3 checks" } },
  { cue: 10, layout: WEB, edges: [...WEB_EDGES], badges: { platform: "mobile number ✓" } },
  { cue: 11, layout: WEB, edges: [...WEB_EDGES], badges: { platform: "app active ✓" } },
  { cue: 12, layout: WEB, edges: [...WEB_EDGES], badges: { platform: "under the limit ✓" } },
  { cue: 13, layout: REC, edges: [...REC_EDGES], accent: ["registration"], badges: { registration: "Started" } },
  { cue: 14, layout: REC, edges: [...REC_EDGES], badges: { registration: "Started · his language" } },
  // The code: random, a digest only, never back to the app.
  { cue: 15, layout: CODE, edges: [...CODE_EDGES], accent: ["codeStore"], packets: [{ from: "platform", to: "codeStore", label: "code" }], badges: { registration: "Started" } },
  { cue: 16, layout: CODE, edges: [...CODE_EDGES], badges: { registration: "Started", codeStore: "random" } },
  { cue: 18, layout: CODE, edges: [...CODE_EDGES], badges: { registration: "Started", codeStore: "digest only" } },
  { cue: 19, layout: CODE, edges: [...CODE_EDGES], packets: [{ from: "platform", to: "webProfile", label: "lifetime · resends" }], badges: { registration: "Code sent", codeStore: "digest only" } },
  { cue: 20, layout: CODE, edges: [...CODE_EDGES], badges: { registration: "Code sent", webProfile: "no code" } },
  // Who sends it: a side app has no TAF part, so the bank SMS service does.
  { cue: 21, layout: { ...SMS, taf: [3, 1.7] }, edges: [...WEB_EDGES, { from: "platform", to: "registration" }], badges: { registration: "Code sent", platform: "who sends?" } },
  { cue: 23, layout: { ...SMS, taf: [3, 1.7] }, edges: [...WEB_EDGES, { from: "platform", to: "registration" }], crossed: ["taf"], badges: { webProfile: "no TAF part" } },
  { cue: 25, layout: SMS, edges: [...SMS_EDGES], accent: ["smsService"], packets: [{ from: "smsService", to: "azizPhone", label: "SMS code" }], badges: { registration: "Code sent" } },
  { cue: 26, layout: SMS, edges: [...SMS_EDGES], packets: [{ from: "webProfile", to: "platform", label: "code" }], badges: { registration: "Code sent", webProfile: "code typed" } },
  { cue: 28, layout: SMS, edges: [...SMS_EDGES], accent: ["registration"], badges: { registration: "Number verified", platform: "digests match" } },
  { cue: 29, layout: SMS, edges: [...SMS_EDGES], badges: { registration: "Number verified", platform: "no verdict · source: web" } },
  // Nothing before the number is verified.
  { cue: 31, layout: REC, edges: [...REC_EDGES], badges: { registration: "Code sent" } },
  { cue: 32, layout: REC, edges: [...REC_EDGES], danger: ["registration"], badges: { registration: "not verified: nothing" } },
  { cue: 33, layout: REC, edges: [...REC_EDGES], packets: [{ from: "webProfile", to: "platform", label: "session?", stopAt: 0.5 }], badges: { platform: "number not verified" } },
  // A new number: the password, two times.
  { cue: 34, layout: REC, edges: [...REC_EDGES], badges: { registration: "Number verified", platform: "number known?" } },
  { cue: 35, layout: REC, edges: [...REC_EDGES], accent: ["aziz"], badges: { registration: "Number verified", platform: "new person" } },
  { cue: 36, layout: REC, edges: [...REC_EDGES], badges: { webProfile: "password · again" } },
  { cue: 37, layout: REC, edges: [...REC_EDGES], shake: { webProfile: 0.3 }, danger: ["webProfile"], badges: { webProfile: "entries differ ✕" } },
  { cue: 39, layout: REC, edges: [...REC_EDGES], accent: ["webProfile"], badges: { webProfile: "long · not breached · no number" } },
  { cue: 40, layout: REC, edges: [...REC_EDGES], badges: { webProfile: "no symbol rules" } },
  // Level 1: four things at once.
  { cue: 42, layout: LEVEL1, edges: [...LEVEL1_EDGES], accent: ["platform"], badges: { registration: "Number verified" } },
  { cue: 43, layout: LEVEL1, edges: [...LEVEL1_EDGES], accent: ["aziz"], badges: { aziz: "level 1" } },
  { cue: 44, layout: LEVEL1, edges: [...LEVEL1_EDGES], accent: ["webProfile"], badges: { aziz: "level 1", webProfile: "app account" } },
  { cue: 45, layout: LEVEL1, edges: [...LEVEL1_EDGES], badges: { aziz: "level 1", webProfile: "browser: never trusted" } },
  { cue: 46, layout: LEVEL1, edges: [...LEVEL1_EDGES], badges: { aziz: "level 1", webProfile: "session" } },
  { cue: 47, layout: LEVEL1, edges: [...LEVEL1_EDGES], accent: ["registration"], badges: { aziz: "level 1", registration: "Onboarded" } },
  { cue: 48, layout: LEVEL1, edges: [...LEVEL1_EDGES], badges: { aziz: "level 1", webProfile: "needs level 1 ✓" } },
  // Monday: the master app, the code through TAF.
  { cue: 49, layout: MON, edges: [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }], accent: ["mobileBank"] },
  { cue: 51, layout: MON, edges: [...MON_EDGES], accent: ["taf"], packets: [{ from: "platform", to: "taf", label: "code" }], badges: { mobileBank: "master app" } },
  { cue: 52, layout: MON, edges: [...MON_EDGES], badges: { taf: "this phone · this SIM" } },
  { cue: 53, layout: MON, edges: [...MON_EDGES, { from: "platform", to: "smsService" }], crossed: ["taf"], accent: ["smsService"], badges: { smsService: "only when TAF is down" } },
  // A known number: not a registration.
  { cue: 54, layout: KNOWN, edges: [...KNOWN_EDGES], badges: { registration: "Number verified" } },
  { cue: 55, layout: KNOWN, edges: [...KNOWN_EDGES, { from: "platform", to: "webProfile" }], accent: ["aziz"], badges: { registration: "Number verified", aziz: "customer since Sunday" } },
  { cue: 56, layout: KNOWN, edges: [...KNOWN_EDGES], crossed: ["registration"], badges: { registration: "not a registration" } },
  { cue: 57, layout: KNOWN, edges: [...KNOWN_EDGES], badges: { platform: "account not shown" } },
  { cue: 58, layout: KNOWN, edges: [...KNOWN_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "same password" }] },
  { cue: 59, layout: KNOWN, edges: [...KNOWN_EDGES], accent: ["mobileBank"], badges: { mobileBank: "app account +1", platform: "new-device login" } },
  { cue: 60, layout: ALL, edges: [...ALL_EDGES], accent: ["aziz"], badges: { aziz: "one number · one password" } },
  { cue: 61, layout: KNOWN, edges: [...KNOWN_EDGES], badges: { mobileBank: "password?" } },
  { cue: 62, layout: KNOWN, edges: [...KNOWN_EDGES], badges: { mobileBank: "reset, never a 2nd account" } },
  { cue: 63, layout: KNOWN, edges: [...KNOWN_EDGES], danger: ["platform"], badges: { platform: "Please contact the bank" } },
  // Expiry.
  { cue: 65, layout: REC, edges: [...REC_EDGES], badges: { registration: "Code sent" } },
  { cue: 66, layout: REC, edges: [...REC_EDGES], danger: ["registration"], badges: { registration: "Expired" } },
  { cue: 67, layout: REC, edges: [...REC_EDGES], crossed: ["registration"], badges: { platform: "audit events kept" } },
  // Recap and the open question.
  { cue: 69, layout: ALL, edges: [...ALL_EDGES] },
  { cue: 71, layout: ALL, edges: [...ALL_EDGES], accent: ["platform"], badges: { platform: "record · digest" } },
  { cue: 72, layout: ALL, edges: [...ALL_EDGES], accent: ["smsService", "taf"] },
  { cue: 73, layout: ALL, edges: [...ALL_EDGES], accent: ["aziz"], badges: { aziz: "level 1, or a login" } },
  { cue: 74, layout: WEB, edges: [...WEB_EDGES], badges: { webProfile: "phone number?" } },
  { cue: 75, layout: { bot: [0, 0.3], aziz: [0, 1.7], webProfile: [1.1, 1], platform: [2.2, 1], azizPhone: [3.2, 1] }, edges: [{ from: "bot", to: "webProfile" }, { from: "webProfile", to: "platform" }, { from: "platform", to: "azizPhone" }], danger: ["bot"], badges: { bot: "anyone" } },
  { cue: 76, layout: { bot: [0, 0.3], aziz: [0, 1.7], webProfile: [1.1, 1], platform: [2.2, 1], azizPhone: [3.2, 1] }, edges: [{ from: "bot", to: "webProfile" }, { from: "webProfile", to: "platform" }, { from: "platform", to: "azizPhone" }], danger: ["bot"], packets: [{ from: "platform", to: "azizPhone", label: "code" }, { from: "platform", to: "azizPhone", label: "code", delay: 40 }], badges: { bot: "all night?" } },
];
