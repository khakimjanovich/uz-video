import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 26: the side-app login. The laptop (cues 0–5); the bridge and what a side app cannot do (6–13, map);
// a new customer on the web (14–22); Aziz's login and the approval (23–41); the other paths (42–57);
// the credit and the close (58–68).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 6, part: 6, rows: [5, 6], current: ["mobile", "taf"], dot: "mobile", units: { heeyid: "lesson 24: new phone" } },
  { cue: 7, part: 6, current: ["sideapps"], dot: "sideapps", units: { heeyid: "side apps: no TAF, no MyID" } },
  { cue: 9, part: 6, current: ["sideapps", "taf"], dot: "sideapps", units: { heeyid: "no TAF part in a browser" } },
  { cue: 10, part: 6, current: ["sideapps", "myid"], dot: "sideapps", units: { heeyid: "no MyID in a side app" } },
  { cue: 11, part: 6, current: ["mobile", "taf", "myid"], dot: "mobile", units: { heeyid: "master app only" } },
  { cue: 12, part: 6, current: ["sideapps", "custgw", "adapters", "sms"], dot: "sms", units: { heeyid: "password + bank SMS" } },
  { cue: 13, part: 6, current: ["sideapps", "custgw", "mobile"], dot: "mobile", units: { heeyid: "and the master app" } },
  { cue: 68, part: 6, rows: [6], dot: "off", current: ["sideapps", "mobile"], units: { heeyid: "next: the account link" } },
];

const WEB = { aziz: [0, 1], marketWeb: [1.5, 1] } as const;
const NEW = { marketWeb: [0, 1], platform: [1.5, 1], smsService: [3, 1] } as const;
const NEW_EDGES = [{ from: "marketWeb", to: "platform" }, { from: "platform", to: "smsService" }] as const;
const LOGIN = { marketWeb: [0, 1], platform: [1.5, 1], trusted: [3, 1] } as const;
const LOGIN_EDGES = [{ from: "marketWeb", to: "platform" }, { from: "platform", to: "trusted" }] as const;
const NO_SMS = { ...LOGIN, smsService: [1.5, 2.1] } as const;
const PATHS = { marketWeb: [0, 1], platform: [1.5, 1], trusted: [3, 0.4], smsService: [3, 1.7] } as const;
const PATH_EDGES = [{ from: "marketWeb", to: "platform" }, { from: "platform", to: "trusted" }, { from: "platform", to: "smsService" }] as const;
const PHONE = { newPhone: [0, 1], platform: [1.5, 1], trusted: [3, 0.4], smsService: [3, 1.7] } as const;
const PHONE_EDGES = [{ from: "newPhone", to: "platform" }, { from: "platform", to: "trusted" }, { from: "platform", to: "smsService" }] as const;
const NO_MYID = { newPhone: [0, 1], platform: [1.5, 1], myid: [3, 1] } as const;
const CREDIT = { marketWeb: [0, 1], credit: [1.5, 0.4], mobileBank: [1.5, 1.7], myid: [3, 1.7] } as const;
const CREDIT_EDGES = [{ from: "marketWeb", to: "credit" }, { from: "marketWeb", to: "mobileBank" }, { from: "mobileBank", to: "myid" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The laptop that has never seen Aziz.
  { cue: 0, layout: WEB, edges: [{ from: "aziz", to: "marketWeb" }], accent: ["aziz"] },
  { cue: 2, layout: WEB, edges: [{ from: "aziz", to: "marketWeb" }], accent: ["marketWeb"], badges: { marketWeb: "mother's laptop" } },
  { cue: 3, layout: WEB, edges: [{ from: "aziz", to: "marketWeb" }], badges: { marketWeb: "never seen him" } },
  { cue: 4, layout: { ...WEB, taf: [3, 0.4], myid: [3, 1.6] }, edges: [{ from: "aziz", to: "marketWeb" }], crossed: ["taf", "myid"], badges: { marketWeb: "no face · no SIM" } },
  { cue: 5, layout: { ...WEB, taf: [3, 0.4], myid: [3, 1.6] }, edges: [{ from: "aziz", to: "marketWeb" }], crossed: ["taf", "myid"], badges: { aziz: "really Aziz?" } },
  // A new customer on the web: SMS code, password two times, level 1, not confirmed.
  { cue: 14, layout: NEW, edges: [...NEW_EDGES], accent: ["marketWeb"], badges: { marketWeb: "new customer" } },
  { cue: 15, layout: NEW, edges: [...NEW_EDGES], packets: [{ from: "marketWeb", to: "platform", label: "phone number" }] },
  { cue: 16, layout: NEW, edges: [...NEW_EDGES], accent: ["smsService"], packets: [{ from: "platform", to: "smsService", label: "one-time code" }] },
  { cue: 17, layout: NEW, edges: [...NEW_EDGES], packets: [{ from: "marketWeb", to: "platform", label: "code + password ×2" }] },
  { cue: 18, layout: NEW, edges: [...NEW_EDGES], accent: ["platform"], badges: { platform: "level 1", marketWeb: "account + session" } },
  { cue: 19, layout: NEW, edges: [...NEW_EDGES], badges: { platform: "level 1", marketWeb: "never trusted" } },
  { cue: 20, layout: NEW, edges: [...NEW_EDGES], danger: ["marketWeb"], badges: { platform: "level 1", marketWeb: "not confirmed" } },
  { cue: 21, layout: { ...NEW, mobileBank: [1.5, 2.1] }, edges: [...NEW_EDGES, { from: "platform", to: "mobileBank" }], danger: ["marketWeb"], badges: { marketWeb: "not confirmed", mobileBank: "until a TAF check" } },
  // Aziz logs in: the password first, then the approval in place of the code.
  { cue: 23, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["marketWeb"], badges: { marketWeb: "Aziz" } },
  { cue: 24, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "marketWeb", to: "platform", label: "number + password" }] },
  { cue: 25, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["platform"], badges: { platform: "password first" } },
  { cue: 26, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { platform: "nothing before ✓" } },
  { cue: 27, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["trusted"], badges: { trusted: "master app?" } },
  { cue: 28, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["trusted"], badges: { trusted: "session ✓" } },
  { cue: 29, layout: NO_SMS, edges: [...LOGIN_EDGES], crossed: ["smsService"], badges: { smsService: "no code" } },
  { cue: 30, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "platform", to: "trusted", label: "push signal" }], badges: { platform: "approval request" } },
  { cue: 31, layout: LOGIN, edges: [...LOGIN_EDGES], badges: { trusted: "request id only" } },
  { cue: 32, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "trusted", to: "platform", label: "pull request" }] },
  { cue: 33, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["trusted"], badges: { trusted: "browser · address · time" } },
  { cue: 34, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["trusted"], badges: { trusted: "Approve · This was not me" } },
  { cue: 35, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "trusted", to: "platform", label: "Approve" }], badges: { trusted: "Approve" } },
  { cue: 36, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["marketWeb"], badges: { marketWeb: "level of the approver" } },
  { cue: 37, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["marketWeb", "trusted"], badges: { marketWeb: "level 2", trusted: "level 2 · trusted" } },
  { cue: 38, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["trusted"], badges: { marketWeb: "level 2 only this way" } },
  { cue: 40, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["trusted"], badges: { trusted: "already trusted" } },
  { cue: 41, layout: LOGIN, edges: [...LOGIN_EDGES], accent: ["trusted"], badges: { trusted: "no code inside" } },
  // The other paths: no answer, no master-app session, "This was not me".
  { cue: 42, layout: PATHS, edges: [...PATH_EDGES] },
  { cue: 43, layout: PATHS, edges: [...PATH_EDGES], badges: { trusted: "no answer" } },
  { cue: 44, layout: PATHS, edges: [...PATH_EDGES], badges: { trusted: "no answer", platform: "the configured time" } },
  { cue: 45, layout: PATHS, edges: [...PATH_EDGES], accent: ["smsService"], packets: [{ from: "platform", to: "smsService", label: "SMS code" }] },
  { cue: 46, layout: PATHS, edges: [...PATH_EDGES], accent: ["smsService"], badges: { marketWeb: "level 1" } },
  { cue: 47, layout: PATHS, edges: [...PATH_EDGES], crossed: ["trusted"], badges: { trusted: "no master-app session", marketWeb: "level 1" } },
  { cue: 48, layout: LOGIN, edges: [...LOGIN_EDGES], danger: ["marketWeb"], packets: [{ from: "trusted", to: "platform", label: "This was not me" }] },
  { cue: 49, layout: LOGIN, edges: [...LOGIN_EDGES], danger: ["marketWeb"], crossed: ["marketWeb"], badges: { platform: "number on hold" } },
  // The marketplace app on a new phone: the same approval, never MyID.
  { cue: 51, layout: PHONE, edges: [...PHONE_EDGES], accent: ["newPhone"], badges: { newPhone: "marketplace app" } },
  { cue: 52, layout: PHONE, edges: [...PHONE_EDGES], accent: ["trusted"], packets: [{ from: "trusted", to: "platform", label: "Approve" }], badges: { trusted: "passed TAF", smsService: "no code" } },
  { cue: 53, layout: PHONE, edges: [...PHONE_EDGES], accent: ["smsService"], crossed: ["trusted"], packets: [{ from: "platform", to: "smsService", label: "SMS code" }], badges: { newPhone: "level 1" } },
  { cue: 54, layout: NO_MYID, edges: [{ from: "newPhone", to: "platform" }, { from: "platform", to: "myid" }], crossed: ["myid"], badges: { myid: "never at login" } },
  { cue: 55, layout: NO_MYID, edges: [{ from: "newPhone", to: "platform" }, { from: "platform", to: "myid" }], crossed: ["myid"], badges: { newPhone: "level 1" } },
  { cue: 56, layout: PHONE, edges: [...PHONE_EDGES], accent: ["newPhone", "trusted"], packets: [{ from: "trusted", to: "platform", label: "Approve" }], badges: { newPhone: "level 2" } },
  { cue: 57, layout: PATHS, edges: [...PATH_EDGES], packets: [{ from: "platform", to: "trusted", label: "new web login" }, { from: "platform", to: "smsService", label: "new web login", delay: 30 }], badges: { trusted: "push", smsService: "SMS" } },
  // The credit: level 2, or go to the mobile bank.
  { cue: 58, layout: CREDIT, edges: [...CREDIT_EDGES], accent: ["credit"] },
  { cue: 59, layout: CREDIT, edges: [...CREDIT_EDGES], accent: ["credit"], badges: { credit: "needs level 2" } },
  { cue: 60, layout: CREDIT, edges: [...CREDIT_EDGES], crossed: ["myid"], badges: { marketWeb: "level 1", myid: "not here" } },
  { cue: 61, layout: CREDIT, edges: [...CREDIT_EDGES], accent: ["mobileBank", "myid"], packets: [{ from: "marketWeb", to: "mobileBank", label: "go to the mobile bank" }] },
  // Recap and the open question.
  { cue: 62, layout: PATHS, edges: [...PATH_EDGES], badges: { platform: "password first" } },
  { cue: 63, layout: PATHS, edges: [...PATH_EDGES], badges: { trusted: "approval", smsService: "or SMS code" } },
  { cue: 64, layout: PATHS, edges: [...PATH_EDGES], accent: ["trusted"], badges: { marketWeb: "level 2 only by approval" } },
  { cue: 65, layout: { marketWeb: [0.5, 1], mobileBank: [2.5, 1] }, edges: [{ from: "marketWeb", to: "mobileBank" }], danger: ["marketWeb"], badges: { marketWeb: "not confirmed" } },
  { cue: 67, layout: { marketWeb: [0.5, 1], mobileBank: [2.5, 1] }, edges: [{ from: "marketWeb", to: "mobileBank" }], danger: ["marketWeb"], badges: { marketWeb: "whose account?" } },
];
