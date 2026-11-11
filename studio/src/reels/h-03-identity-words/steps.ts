import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 3: the words. The login that waits (0–8); authentication (9–17); proofing (18–27); authorisation
// (28–31); levels (32–38); person level vs session level (39–50); the SMS evening (51–59); the standards
// (60–65); recap and the way to the perimeter (66–74).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 72, part: 1, current: ["myid", "taf", "lookup", "postgres"], units: { heeyid: "passports and phone numbers" } },
  { cue: 73, part: 1, current: ["perimeter"], units: { heeyid: "where does it run?" } },
  { cue: 74, part: 2, rows: [2], dot: "off" },
];

const LOGIN = { webLaptop: [0, 1], platform: [1.5, 1], trusted: [3, 1] } as const;
const LOGIN_EDGES = [{ from: "webLaptop", to: "platform" }, { from: "platform", to: "trusted" }] as const;
const WORDS = { authn: [0, 1], proofing: [1.5, 1], authz: [3, 1] } as const;
const MYID = { aziz: [0, 1], mobileBank: [1.5, 1], myid: [3, 1] } as const;
const MYID_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }] as const;
const LEVELS = { level0: [0, 1], level1: [1.5, 1], level2: [3, 1] } as const;
const LEVEL_EDGES = [{ from: "level0", to: "level1", label: "code" }, { from: "level1", to: "level2", label: "MyID" }] as const;
const PERSON = { aziz: [0, 1], webLaptop: [2, 0.4], trusted: [2, 1.6] } as const;
const PERSON_EDGES = [{ from: "aziz", to: "webLaptop" }, { from: "aziz", to: "trusted" }] as const;
const SMS = { webLaptop: [0, 1], platform: [1.5, 1], mobileBank: [3, 0.3], sms: [3, 1.7], order: [0, 2.1] } as const;
const SMS_EDGES = [{ from: "webLaptop", to: "platform" }, { from: "platform", to: "sms" }, { from: "webLaptop", to: "order" }] as const;
const STD = { oauth: [0.5, 1], oidc: [2.5, 1] } as const;
const TOKEN = { keycloak: [0, 1], token: [1.5, 1], webLaptop: [3, 1] } as const;
const TOKEN_EDGES = [{ from: "keycloak", to: "token" }, { from: "token", to: "webLaptop" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The login that waits.
  { cue: 0, layout: { aziz: [0, 1], webLaptop: [1.5, 1] }, edges: [{ from: "aziz", to: "webLaptop" }], accent: ["webLaptop"] },
  { cue: 1, layout: { aziz: [0, 1], webLaptop: [1.5, 1] }, edges: [{ from: "aziz", to: "webLaptop" }], badges: { webLaptop: "where is my kettle?" } },
  { cue: 2, layout: { webLaptop: [0, 1], platform: [1.5, 1] }, edges: [{ from: "webLaptop", to: "platform" }], packets: [{ from: "webLaptop", to: "platform", label: "number + password" }], badges: { platform: "password ✓" } },
  { cue: 3, layout: { webLaptop: [0, 1], platform: [1.5, 1], order: [0, 2.1] }, edges: [{ from: "webLaptop", to: "platform" }, { from: "webLaptop", to: "order" }], danger: ["order"], badges: { platform: "password ✓", order: "closed" } },
  { cue: 4, layout: { ...LOGIN, order: [0, 2.1] }, edges: [...LOGIN_EDGES, { from: "webLaptop", to: "order" }], accent: ["trusted"], packets: [{ from: "platform", to: "trusted", label: "approve?" }], badges: { order: "closed" } },
  { cue: 5, layout: { ...LOGIN, order: [0, 2.1] }, edges: [...LOGIN_EDGES, { from: "webLaptop", to: "order" }], danger: ["order"], badges: { platform: "password ✓", order: "why closed?" } },
  { cue: 6, layout: PERSON, edges: [...PERSON_EDGES], accent: ["aziz"], badges: { aziz: "one person", webLaptop: "session", trusted: "session" } },
  // Three words, three questions.
  { cue: 7, layout: WORDS, accent: ["authn", "proofing", "authz"] },
  { cue: 8, layout: WORDS, badges: { authn: "?", proofing: "?", authz: "?" } },
  { cue: 9, layout: WORDS, accent: ["authn"] },
  { cue: 10, layout: WORDS, accent: ["authn"], badges: { authn: "the owner?" } },
  { cue: 11, layout: { aziz: [0, 1], webLaptop: [1.5, 0.4], trusted: [1.5, 1.6], authn: [3, 1] }, edges: [{ from: "aziz", to: "webLaptop" }, { from: "aziz", to: "trusted" }, { from: "webLaptop", to: "authn" }, { from: "trusted", to: "authn" }], accent: ["authn"], badges: { webLaptop: "knows: password", trusted: "has: phone" } },
  { cue: 12, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "platform", to: "trusted", label: "approval request" }], badges: { trusted: "Approve · This was not me" } },
  { cue: 13, layout: LOGIN, edges: [...LOGIN_EDGES], packets: [{ from: "platform", to: "trusted", label: "one-time code" }], badges: { trusted: "code" } },
  { cue: 14, layout: WORDS, accent: ["authn"], badges: { authn: "owner ✓", proofing: "person ?" } },
  { cue: 15, layout: WORDS, badges: { authn: "owner ✓", proofing: "state records ?" } },
  { cue: 17, layout: { otherPerson: [0, 1], platform: [2, 1] }, edges: [{ from: "otherPerson", to: "platform" }], danger: ["otherPerson"], packets: [{ from: "otherPerson", to: "platform", label: "own phone + password" }], badges: { platform: "authenticated ✓" } },
  // Identity proofing.
  { cue: 18, layout: WORDS, accent: ["proofing"] },
  { cue: 19, layout: WORDS, accent: ["proofing"], badges: { proofing: "the real person?" } },
  { cue: 20, layout: MYID, edges: [...MYID_EDGES], accent: ["myid"], badges: { mobileBank: "master app only" } },
  { cue: 21, layout: MYID, edges: [...MYID_EDGES], accent: ["myid"], packets: [{ from: "mobileBank", to: "myid", label: "face" }, { from: "mobileBank", to: "myid", label: "document", delay: 40 }], badges: { myid: "vs state records" } },
  { cue: 22, layout: MYID, edges: [...MYID_EDGES], accent: ["aziz"], badges: { aziz: "level 2", myid: "one time" } },
  { cue: 23, layout: { authn: [0.5, 1], proofing: [2.5, 1] }, badges: { proofing: "slow · rare" } },
  { cue: 24, layout: { authn: [0.5, 1], proofing: [2.5, 1] }, badges: { authn: "fast · every login", proofing: "slow · rare" } },
  { cue: 25, layout: { authn: [0.5, 1], proofing: [2.5, 1] }, edges: [{ from: "authn", to: "proofing", label: "proof of a person?", broken: true }], danger: ["authn"] },
  { cue: 27, layout: { authn: [0.5, 1], proofing: [2.5, 1] }, edges: [{ from: "authn", to: "proofing", label: "not the same", broken: true }], badges: { authn: "holds the account", proofing: "who you are" } },
  // Authorisation.
  { cue: 28, layout: WORDS, accent: ["authz"] },
  { cue: 29, layout: WORDS, accent: ["authz"], badges: { authz: "may do what, now?" } },
  { cue: 30, layout: { webLaptop: [0, 1], authz: [1.5, 1], order: [3, 1] }, edges: [{ from: "webLaptop", to: "authz" }, { from: "authz", to: "order" }], accent: ["order"], badges: { order: "needs level 2" } },
  { cue: 31, layout: { webLaptop: [0, 1], authz: [1.5, 1], order: [3, 1] }, edges: [{ from: "webLaptop", to: "authz" }, { from: "authz", to: "order", broken: true }], danger: ["order"], badges: { webLaptop: "level 1", order: "needs level 2" } },
  // The levels.
  { cue: 33, layout: LEVELS, accent: ["level0", "level1", "level2"] },
  { cue: 34, layout: { level0: [0, 1] }, accent: ["level0"] },
  { cue: 35, layout: { level0: [0, 1], level1: [1.5, 1] }, edges: [LEVEL_EDGES[0]], accent: ["level1"] },
  { cue: 36, layout: LEVELS, edges: [...LEVEL_EDGES], accent: ["level2"] },
  { cue: 37, layout: LEVELS, edges: [...LEVEL_EDGES], badges: { level1: "only a code", level2: "only MyID" } },
  { cue: 38, layout: { ...LEVELS, maker: [1.5, 2.1] }, edges: [...LEVEL_EDGES, { from: "maker", to: "level2", broken: true }], crossed: ["maker"], badges: { level2: "only MyID" } },
  // A person level and a session level.
  { cue: 40, layout: PERSON, edges: [...PERSON_EDGES], badges: { aziz: "person: level", webLaptop: "session: level", trusted: "session: level" } },
  { cue: 41, layout: PERSON, edges: [...PERSON_EDGES], accent: ["aziz"], badges: { aziz: "level 2" } },
  { cue: 42, layout: PERSON, edges: [...PERSON_EDGES], badges: { aziz: "level 2", trusted: "level 2", webLaptop: "level 1" } },
  { cue: 43, layout: PERSON, edges: [...PERSON_EDGES], accent: ["trusted"], badges: { aziz: "level 2", trusted: "MyID passed here" } },
  { cue: 44, layout: PERSON, edges: [...PERSON_EDGES], accent: ["trusted"], badges: { aziz: "level 2", trusted: "trusted ✓" } },
  { cue: 45, layout: PERSON, edges: [...PERSON_EDGES], badges: { aziz: "level 2", trusted: "trusted ✓", webLaptop: "browser: never trusted" } },
  { cue: 46, layout: PERSON, edges: [...PERSON_EDGES, { from: "trusted", to: "webLaptop" }], accent: ["trusted"], packets: [{ from: "trusted", to: "webLaptop", label: "Approve" }], badges: { webLaptop: "level 1 → 2?" } },
  // Back to Sunday: Approve.
  { cue: 47, layout: { ...LOGIN, order: [0, 2.1] }, edges: [...LOGIN_EDGES, { from: "webLaptop", to: "order" }], danger: ["order"], badges: { order: "closed" } },
  { cue: 48, layout: { ...LOGIN, order: [0, 2.1] }, edges: [...LOGIN_EDGES, { from: "webLaptop", to: "order" }], accent: ["trusted"], badges: { trusted: "browser · address · time" } },
  { cue: 49, layout: { ...LOGIN, order: [0, 2.1] }, edges: [...LOGIN_EDGES, { from: "webLaptop", to: "order" }], packets: [{ from: "trusted", to: "platform", label: "Approve" }], badges: { trusted: "Approve" } },
  { cue: 50, layout: { ...LOGIN, order: [0, 2.1] }, edges: [...LOGIN_EDGES, { from: "webLaptop", to: "order" }], accent: ["order", "webLaptop"], badges: { webLaptop: "level 2", order: "open" } },
  // A different evening: no master-app session, an SMS code, level 1.
  { cue: 52, layout: SMS, edges: [...SMS_EDGES], crossed: ["mobileBank"], badges: { mobileBank: "no session" } },
  { cue: 53, layout: SMS, edges: [...SMS_EDGES], crossed: ["mobileBank"], packets: [{ from: "platform", to: "sms", label: "code" }], accent: ["sms"] },
  { cue: 54, layout: SMS, edges: [...SMS_EDGES], crossed: ["mobileBank"], badges: { webLaptop: "authenticated ✓" } },
  { cue: 55, layout: SMS, edges: [...SMS_EDGES], crossed: ["mobileBank"], danger: ["order"], badges: { webLaptop: "level 1", order: "closed" } },
  { cue: 56, layout: SMS, edges: [...SMS_EDGES], crossed: ["mobileBank"], badges: { webLaptop: "level 1", order: "not refused" } },
  { cue: 57, layout: SMS, edges: [...SMS_EDGES], crossed: ["mobileBank"], packets: [{ from: "platform", to: "webLaptop", label: "step-up: level 2" }], badges: { webLaptop: "level 1", platform: "level + check" } },
  { cue: 58, layout: PERSON, edges: [...PERSON_EDGES], badges: { aziz: "level 2", webLaptop: "level 1", trusted: "level 2" } },
  { cue: 59, layout: PERSON, edges: [...PERSON_EDGES], accent: ["webLaptop"], badges: { aziz: "same person", webLaptop: "the session decides" } },
  // The two standard names.
  { cue: 60, layout: STD, accent: ["oauth", "oidc"] },
  { cue: 61, layout: STD, accent: ["oauth"], badges: { oauth: "token: what it allows" } },
  { cue: 62, layout: STD, edges: [{ from: "oidc", to: "oauth", label: "on top" }], accent: ["oidc"], badges: { oidc: "who logged in, how" } },
  { cue: 63, layout: TOKEN, edges: [...TOKEN_EDGES], crossed: ["token"], badges: { token: "own format" } },
  { cue: 64, layout: TOKEN, edges: [...TOKEN_EDGES], accent: ["keycloak", "token"], packets: [{ from: "keycloak", to: "webLaptop", label: "level 2" }], badges: { token: "standard · level" } },
  { cue: 65, layout: TOKEN, edges: [...TOKEN_EDGES], accent: ["webLaptop"], badges: { token: "level 2", webLaptop: "reads, decides" } },
  // Recap.
  { cue: 66, layout: WORDS, accent: ["authn"], badges: { authn: "the owner?" } },
  { cue: 67, layout: WORDS, accent: ["proofing"], badges: { authn: "the owner?", proofing: "the real person?" } },
  { cue: 68, layout: WORDS, accent: ["authz"], badges: { authn: "the owner?", proofing: "the real person?", authz: "may do what?" } },
  { cue: 69, layout: PERSON, edges: [...PERSON_EDGES], badges: { aziz: "person: level", webLaptop: "own level", trusted: "own level" } },
  { cue: 70, layout: { ...LOGIN, order: [0, 2.1] }, edges: [...LOGIN_EDGES, { from: "webLaptop", to: "order" }], danger: ["order"], badges: { platform: "password ✓", order: "why closed?" } },
  { cue: 71, layout: WORDS, accent: ["authn"], badges: { authn: "password: only this" } },
];
