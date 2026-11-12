import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 10: the TAF verdict. The café question (0–7); what TAF is and the app's job (8–22); two verdicts and the
// waiting time (23–31); the café: Red, then Green (32–41); Yellow (42–44); the face confirmation (45–53);
// TAF down: not scored (54–60); the trusted-bank stop (61–64); what TAF receives (65–69); the check (70–72);
// summary and the hand-off (73–78).
const UNIT = { heeyid: "master app only" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 0, part: 3, current: ["customer", "mobile"], dot: "mobile" },
  { cue: 5, part: 3, rows: [3], current: ["mobile", "custgw", "adapters", "taf"], dot: "taf", units: UNIT },
  { cue: 8, part: 3, current: ["adapters", "taf"], dot: "taf", units: { heeyid: "TAF agent in the bank" } },
  { cue: 17, part: 3, current: ["mobile", "taf"], dot: "mobile", units: UNIT },
  { cue: 23, part: 3, current: ["custgw", "adapters", "taf"], dot: "taf", units: { heeyid: "basic + risk verdict" } },
  { cue: 32, part: 3, current: ["mobile", "custgw", "taf"], dot: "custgw", units: UNIT },
  { cue: 42, part: 3, current: ["mobile", "custgw", "taf"], dot: "custgw", units: { heeyid: "Yellow: refuse" } },
  { cue: 45, part: 3, current: ["mobile", "custgw", "adapters", "taf"], dot: "taf", units: { heeyid: "face confirmation" } },
  { cue: 54, part: 3, rows: [3], current: ["adapters", "taf", "sms"], dot: "sms", units: { heeyid: "not scored" } },
  { cue: 59, part: 3, current: ["custgw", "kafka", "workers"], dot: "kafka", units: { heeyid: "audit · antifraud · alert" } },
  { cue: 61, part: 3, current: ["adapters", "taf"], dot: "taf", units: { heeyid: "trusted bank: stop" } },
  { cue: 65, part: 3, current: ["adapters", "taf"], dot: "taf", units: UNIT },
  { cue: 70, part: 3, current: ["adapters", "taf", "sms"], dot: "taf", units: { heeyid: "trusted bank: stop" } },
  { cue: 73, part: 3, current: ["mobile", "custgw", "taf", "sms"], dot: "off", units: UNIT },
  { cue: 77, part: 3, current: ["custgw", "postgres"], dot: "postgres", units: UNIT },
];

const CAFE = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1], taf: [3, 1] } as const;
const CAFE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "taf" }] as const;
const SPLIT = { mobileBank: [0, 1], platform: [1.5, 1], taf: [3, 1] } as const;
const SPLIT_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "taf" }] as const;
const APP = { mobileBank: [0.5, 1], taf: [2.5, 1] } as const;
const APP_EDGES = [{ from: "mobileBank", to: "taf", label: "TAF part" }] as const;
const DECIDE = { taf: [0, 1], platform: [1.5, 1], mobileBank: [3, 1] } as const;
const DECIDE_EDGES = [{ from: "taf", to: "platform" }, { from: "platform", to: "mobileBank" }] as const;
const FACE = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1], taf: [3, 1] } as const;
const FACE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "taf" }] as const;
const DOWN = { mobileBank: [0, 1], platform: [1.4, 1], taf: [2.8, 0.3], smsService: [2.8, 1.7] } as const;
const DOWN_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "taf" }, { from: "platform", to: "smsService" }] as const;
const PORTAL = { mobileBank: [0, 1], platform: [1.1, 1], taf: [2.2, 1], portal: [3.2, 0.3], smsService: [2.2, 1.9] } as const;
const PORTAL_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "taf" }, { from: "portal", to: "taf" }] as const;
const DATA = { platform: [0.5, 1], taf: [2.5, 1] } as const;
const DATA_EDGES = [{ from: "platform", to: "taf" }] as const;
const RECAP = { mobileBank: [0, 1], platform: [1.2, 1], taf: [2.5, 0.3], smsService: [2.5, 1.7] } as const;
const RECAP_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "taf" }, { from: "platform", to: "smsService" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The café: a right code, and still a refusal.
  { cue: 0, layout: { aziz: [0.5, 1], mobileBank: [2, 1] }, edges: [{ from: "aziz", to: "mobileBank" }], accent: ["aziz"] },
  { cue: 1, layout: { aziz: [0.5, 1], mobileBank: [2, 1] }, edges: [{ from: "aziz", to: "mobileBank" }], badges: { aziz: "café Wi-Fi" } },
  { cue: 2, layout: CAFE, edges: [...CAFE_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "password · code" }], badges: { aziz: "café Wi-Fi" } },
  { cue: 3, layout: CAFE, edges: [...CAFE_EDGES], danger: ["mobileBank"], badges: { mobileBank: "cannot complete" } },
  { cue: 4, layout: CAFE, edges: [...CAFE_EDGES], badges: { mobileBank: "right code: refused?" } },
  { cue: 5, layout: CAFE, edges: [...CAFE_EDGES], badges: { platform: "counters: life · tries · requests" } },
  { cue: 6, layout: CAFE, edges: [...CAFE_EDGES], accent: ["taf"], badges: { taf: "where it arrived" } },
  { cue: 7, layout: SPLIT, edges: [...SPLIT_EDGES], accent: ["mobileBank"], badges: { mobileBank: "master app only" } },
  // What TAF is: a state service; a recommendation, not a decision.
  { cue: 8, layout: CAFE, edges: [...CAFE_EDGES], accent: ["taf"] },
  { cue: 9, layout: CAFE, edges: [...CAFE_EDGES], badges: { taf: "state service" } },
  { cue: 10, layout: CAFE, edges: [...CAFE_EDGES], badges: { taf: "agent in the bank · via TAF adapter" } },
  { cue: 11, layout: CAFE, edges: [...CAFE_EDGES], packets: [{ from: "platform", to: "taf", label: "code" }], badges: { taf: "sends the SMS" } },
  { cue: 12, layout: CAFE, edges: [...CAFE_EDGES], badges: { mobileBank: "this phone · this SIM" } },
  { cue: 13, layout: CAFE, edges: [...CAFE_EDGES], packets: [{ from: "taf", to: "platform", label: "verdict" }] },
  { cue: 14, layout: DECIDE, edges: [...DECIDE_EDGES], accent: ["taf"], badges: { taf: "recommendation" } },
  { cue: 15, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { taf: "advice" } },
  { cue: 16, layout: DECIDE, edges: [...DECIDE_EDGES], accent: ["platform"], badges: { taf: "advice", platform: "decides · bank policy" } },
  // The app's job.
  { cue: 17, layout: APP, edges: [...APP_EDGES], accent: ["mobileBank"] },
  { cue: 18, layout: APP, edges: [...APP_EDGES], badges: { mobileBank: "1 · start the part" } },
  { cue: 19, layout: APP, edges: [...APP_EDGES], badges: { mobileBank: "2 · send its identifier" } },
  { cue: 20, layout: APP, edges: [...APP_EDGES], packets: [{ from: "mobileBank", to: "taf", label: "typed code" }], badges: { mobileBank: "3 · code to TAF first" } },
  { cue: 21, layout: APP, edges: [...APP_EDGES], badges: { mobileBank: "4 · tell at logout" } },
  { cue: 22, layout: APP, edges: [...APP_EDGES], danger: ["mobileBank"], badges: { taf: "step skipped: negative" } },
  // Two verdicts and the waiting time.
  { cue: 23, layout: DECIDE, edges: [...DECIDE_EDGES], packets: [{ from: "taf", to: "platform", label: "basic" }, { from: "taf", to: "platform", label: "risk", delay: 40 }] },
  { cue: 24, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { taf: "basic: 7 yes/no" } },
  { cue: 25, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { taf: "risk: Green · Yellow · Red" } },
  { cue: 26, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { platform: "ask again · until the wait ends" } },
  { cue: 27, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { taf: "not ready: basic decides" } },
  { cue: 28, layout: DECIDE, edges: [...DECIDE_EDGES], accent: ["platform"], badges: { platform: "7 × yes = Green" } },
  { cue: 29, layout: DECIDE, edges: [...DECIDE_EDGES], danger: ["platform"], badges: { platform: "one no = Red" } },
  { cue: 30, layout: DECIDE, edges: [...DECIDE_EDGES], accent: ["platform"], badges: { platform: "result · source · SIM match" } },
  { cue: 31, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { platform: "SIM match → lesson 16" } },
  // The café: Red on Wi-Fi, then Green on the mobile network.
  { cue: 32, layout: CAFE, edges: [...CAFE_EDGES], badges: { aziz: "café Wi-Fi" } },
  { cue: 33, layout: CAFE, edges: [...CAFE_EDGES], badges: { taf: "risk: not ready" } },
  { cue: 34, layout: CAFE, edges: [...CAFE_EDGES], danger: ["taf"], shake: { taf: 0.6 }, badges: { taf: "device ≠ SIM · Red" } },
  { cue: 35, layout: CAFE, edges: [...CAFE_EDGES], danger: ["platform"], badges: { platform: "Red: refuse" } },
  { cue: 36, layout: CAFE, edges: [...CAFE_EDGES], crossed: ["mobileBank"], badges: { mobileBank: "attempt ends" } },
  { cue: 37, layout: CAFE, edges: [...CAFE_EDGES], badges: { platform: "no block · no counter" } },
  { cue: 38, layout: CAFE, edges: [...CAFE_EDGES], badges: { mobileBank: "use the mobile network" } },
  { cue: 39, layout: CAFE, edges: [...CAFE_EDGES], accent: ["aziz"], badges: { aziz: "mobile network" } },
  { cue: 40, layout: CAFE, edges: [...CAFE_EDGES], accent: ["taf"], badges: { taf: "risk: Green" } },
  { cue: 41, layout: CAFE, edges: [...CAFE_EDGES], accent: ["mobileBank"], badges: { taf: "risk: Green", platform: "SIM match ✓" } },
  // Yellow: refuse, with the reason text.
  { cue: 42, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { taf: "Yellow" } },
  { cue: 43, layout: DECIDE, edges: [...DECIDE_EDGES], danger: ["platform"], badges: { taf: "Yellow", platform: "refuse", mobileBank: "reason text · his language" } },
  { cue: 44, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { platform: "texts: bank configuration", mobileBank: "nothing blocked" } },
  // The face confirmation: the phone's biometric, sent by the platform.
  { cue: 45, layout: FACE, edges: [...FACE_EDGES], badges: { aziz: "level 1: nothing more" } },
  { cue: 46, layout: FACE, edges: [...FACE_EDGES], accent: ["mobileBank"], badges: { aziz: "level 2", mobileBank: "phone face biometric" } },
  { cue: 47, layout: FACE, edges: [...FACE_EDGES], badges: { mobileBank: "not MyID · no level" } },
  { cue: 48, layout: FACE, edges: [...FACE_EDGES], danger: ["mobileBank"], badges: { mobileBank: "fails: stop · try again" } },
  { cue: 49, layout: FACE, edges: [...FACE_EDGES], badges: { mobileBank: "no face biometric: continue", taf: "nothing sent" } },
  { cue: 50, layout: FACE, edges: [...FACE_EDGES], accent: ["taf"], packets: [{ from: "platform", to: "taf", label: "face confirmation" }] },
  { cue: 51, layout: FACE, edges: [...FACE_EDGES], accent: ["platform"], badges: { platform: "sends it", mobileBank: "no personal ID" } },
  { cue: 52, layout: FACE, edges: [...FACE_EDGES], crossed: ["taf"], badges: { platform: "login continues · next login" } },
  { cue: 53, layout: FACE, edges: [...FACE_EDGES], badges: { taf: "before ownership check · lesson 15" } },
  // TAF down: not scored.
  { cue: 54, layout: DOWN, edges: [...DOWN_EDGES], danger: ["taf"] },
  { cue: 55, layout: DOWN, edges: [...DOWN_EDGES], badges: { taf: "health · timeout" } },
  { cue: 56, layout: DOWN, edges: [...DOWN_EDGES], crossed: ["taf"], accent: ["smsService"], packets: [{ from: "platform", to: "smsService", label: "code" }] },
  { cue: 57, layout: DOWN, edges: [...DOWN_EDGES], crossed: ["taf"], badges: { platform: "not scored" } },
  { cue: 58, layout: DOWN, edges: [...DOWN_EDGES], crossed: ["taf"], badges: { platform: "no verdict · face · ownership · SIM" } },
  { cue: 59, layout: DOWN, edges: [...DOWN_EDGES], crossed: ["taf"], badges: { platform: "audit · antifraud · alert" } },
  { cue: 60, layout: DOWN, edges: [...DOWN_EDGES], accent: ["taf"], packets: [{ from: "platform", to: "taf", label: "next code" }], badges: { taf: "back" } },
  // The trusted-bank stop.
  { cue: 61, layout: PORTAL, edges: [...PORTAL_EDGES], badges: { taf: "not an outage" } },
  { cue: 62, layout: PORTAL, edges: [...PORTAL_EDGES], accent: ["portal"] },
  { cue: 63, layout: PORTAL, edges: [...PORTAL_EDGES], danger: ["taf"], badges: { portal: "another bank", taf: "refuses" } },
  { cue: 64, layout: PORTAL, edges: [...PORTAL_EDGES], badges: { mobileBank: "change it there" } },
  // What TAF receives.
  { cue: 65, layout: DATA, edges: [...DATA_EDGES], accent: ["taf"] },
  { cue: 66, layout: DATA, edges: [...DATA_EDGES], packets: [{ from: "platform", to: "taf", label: "number · identifier · code" }, { from: "platform", to: "taf", label: "type · model · language", delay: 45 }] },
  { cue: 67, layout: DATA, edges: [...DATA_EDGES], packets: [{ from: "platform", to: "taf", label: "personal ID" }], badges: { taf: "personal ID: face confirmation only" } },
  { cue: 68, layout: DATA, edges: [...DATA_EDGES], packets: [{ from: "platform", to: "taf", label: "TAF part identifier" }], badges: { taf: "ownership: part identifier" } },
  { cue: 69, layout: DATA, edges: [...DATA_EDGES], badges: { taf: "no name · document · photo" } },
  // The check: another bank on the portal.
  { cue: 70, layout: PORTAL, edges: [...PORTAL_EDGES], danger: ["taf"], badges: { portal: "another bank", taf: "refuses" } },
  { cue: 71, layout: PORTAL, edges: [...PORTAL_EDGES], badges: { smsService: "instead?" } },
  { cue: 72, layout: PORTAL, edges: [...PORTAL_EDGES], crossed: ["smsService"], danger: ["platform"], badges: { platform: "stop · no code" } },
  // Summary and the hand-off.
  { cue: 73, layout: RECAP, edges: [...RECAP_EDGES], accent: ["taf"], badges: { taf: "code + verdict" } },
  { cue: 74, layout: RECAP, edges: [...RECAP_EDGES], accent: ["platform"], badges: { platform: "Green: go · Yellow, Red: refuse" } },
  { cue: 75, layout: RECAP, edges: [...RECAP_EDGES], accent: ["smsService"], badges: { smsService: "not scored" } },
  { cue: 76, layout: RECAP, edges: [...RECAP_EDGES], crossed: ["smsService"], badges: { taf: "other bank: no code" } },
  { cue: 77, layout: CAFE, edges: [...CAFE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "password first" } },
  { cue: 78, layout: CAFE, edges: [...CAFE_EDGES], accent: ["platform"], badges: { platform: "password: lesson 11" } },
];
