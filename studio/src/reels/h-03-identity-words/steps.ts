import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 2: the words. The transfer that does not move (0–8); authentication (9–15); proofing (16–23);
// authorisation (24–29); levels (30–35); person level, session level and the trusted phone (36–46);
// the tokens and the two standards (47–52); the check, the summary and the way to the perimeter (53–59).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 59, part: 2, rows: [2], current: ["perimeter"], dot: "off", units: { heeyid: "where it runs" } },
];

const START = { aziz: [0, 1], mobileBank: [1.5, 1], transfer: [3, 1] } as const;
const START_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "transfer" }] as const;
const WORDS = { authn: [0, 1], proofing: [1.5, 1], authz: [3, 1] } as const;
const KNOWS = { aziz: [0, 1], mobileBank: [1.5, 0.4], azizPhone: [1.5, 1.6], authn: [3, 1] } as const;
const KNOWS_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "aziz", to: "azizPhone" }, { from: "mobileBank", to: "authn" }, { from: "azizPhone", to: "authn" }] as const;
const MYID = { aziz: [0, 1], mobileBank: [1.5, 1], myid: [3, 1] } as const;
const MYID_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }] as const;
const PAIR = { authn: [0.5, 1], proofing: [2.5, 1] } as const;
const RULE = { mobileBank: [0, 1], authz: [1.5, 1], transfer: [3, 1] } as const;
const RULE_EDGES = [{ from: "mobileBank", to: "authz" }, { from: "authz", to: "transfer" }] as const;
const LEVELS = { level0: [0, 1], level1: [1.5, 1], level2: [3, 1] } as const;
const LEVEL_EDGES = [{ from: "level0", to: "level1", label: "code" }, { from: "level1", to: "level2", label: "MyID" }] as const;
const PHONE = { aziz: [0, 1], trusted: [1.5, 1], transfer: [3, 1] } as const;
const PHONE_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "transfer" }] as const;
const STEPUP = { consent: [0, 1], myid: [1.5, 1], azizPhone: [3, 1] } as const;
const STEPUP_EDGES = [{ from: "consent", to: "myid" }, { from: "myid", to: "azizPhone", label: "phone check" }] as const;
const TOKEN = { keycloak: [0, 1], token: [1.5, 1], mobileBank: [3, 1] } as const;
const TOKEN_EDGES = [{ from: "keycloak", to: "token" }, { from: "token", to: "mobileBank" }] as const;
const STD = { oauth: [0.5, 1], oidc: [2.5, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The transfer that does not move.
  { cue: 0, layout: { aziz: [0, 1], mobileBank: [1.5, 1] }, edges: [{ from: "aziz", to: "mobileBank" }], packets: [{ from: "aziz", to: "mobileBank", label: "password + code" }], accent: ["mobileBank"] },
  { cue: 1, layout: { aziz: [0, 1], mobileBank: [1.5, 1] }, edges: [{ from: "aziz", to: "mobileBank" }], badges: { mobileBank: "password ✓ · code ✓" } },
  { cue: 2, layout: { aziz: [0, 1], mobileBank: [1.5, 1] }, edges: [{ from: "aziz", to: "mobileBank" }], accent: ["mobileBank"], badges: { mobileBank: "open" } },
  { cue: 3, layout: START, edges: [...START_EDGES], accent: ["transfer"], packets: [{ from: "mobileBank", to: "transfer", label: "send money" }] },
  { cue: 4, layout: START, edges: [START_EDGES[0], { from: "mobileBank", to: "transfer", broken: true }], danger: ["transfer"], badges: { transfer: "does not move" } },
  { cue: 5, layout: START, edges: [START_EDGES[0], { from: "mobileBank", to: "transfer", broken: true }], danger: ["transfer"], badges: { mobileBank: "password ✓ · code ✓", transfer: "why not?" } },
  { cue: 6, layout: START, edges: [...START_EDGES], badges: { aziz: "lesson 1", transfer: "Saturday" } },
  // Three words.
  { cue: 7, layout: WORDS, accent: ["authn", "proofing", "authz"] },
  { cue: 8, layout: WORDS, badges: { authn: "?", proofing: "?", authz: "?" } },
  // Authentication.
  { cue: 9, layout: WORDS, accent: ["authn"] },
  { cue: 10, layout: WORDS, accent: ["authn"], badges: { authn: "the owner?" } },
  { cue: 11, layout: KNOWS, edges: [...KNOWS_EDGES], accent: ["authn"], badges: { mobileBank: "knows: password", azizPhone: "has: phone, code" } },
  { cue: 12, layout: WORDS, accent: ["authn"], badges: { authn: "owner ✓" } },
  { cue: 13, layout: WORDS, badges: { authn: "owner ✓", proofing: "state records ?" } },
  { cue: 14, layout: WORDS, accent: ["authn"], badges: { authn: "who registered" } },
  { cue: 15, layout: { otherPerson: [0, 1], platform: [2, 1] }, edges: [{ from: "otherPerson", to: "platform" }], danger: ["otherPerson"], packets: [{ from: "otherPerson", to: "platform", label: "own phone + password" }], badges: { platform: "authenticated ✓" } },
  // Identity proofing.
  { cue: 16, layout: WORDS, accent: ["proofing"] },
  { cue: 17, layout: WORDS, accent: ["proofing"], badges: { proofing: "the real person?" } },
  { cue: 18, layout: MYID, edges: [...MYID_EDGES], accent: ["myid"], badges: { mobileBank: "only here" } },
  { cue: 19, layout: MYID, edges: [...MYID_EDGES], accent: ["myid"], packets: [{ from: "mobileBank", to: "myid", label: "face" }, { from: "mobileBank", to: "myid", label: "passport", delay: 40 }], badges: { myid: "vs state records" } },
  { cue: 20, layout: PAIR, badges: { proofing: "slow · one time" } },
  { cue: 21, layout: PAIR, badges: { authn: "fast · every login", proofing: "slow · one time" } },
  { cue: 22, layout: PAIR, edges: [{ from: "authn", to: "proofing", label: "proof of a person?", broken: true }], danger: ["authn"] },
  { cue: 23, layout: PAIR, edges: [{ from: "authn", to: "proofing", label: "not the same", broken: true }], badges: { authn: "holds the account", proofing: "who you are" } },
  // Authorisation.
  { cue: 24, layout: WORDS, accent: ["authz"] },
  { cue: 25, layout: WORDS, accent: ["authz"], badges: { authz: "may do what, now?" } },
  { cue: 26, layout: RULE, edges: [...RULE_EDGES], accent: ["authz"], badges: { authz: "money: level 2" } },
  { cue: 27, layout: RULE, edges: [...RULE_EDGES], accent: ["transfer"], badges: { authz: "money: level 2", transfer: "cards · accounts · transfers" } },
  { cue: 28, layout: RULE, edges: [...RULE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "own data: level 1", transfer: "level 2" } },
  { cue: 29, layout: RULE, edges: [RULE_EDGES[0], { from: "authz", to: "transfer", broken: true }], danger: ["transfer"], badges: { mobileBank: "level 1", transfer: "needs level 2" } },
  // The levels.
  { cue: 30, layout: LEVELS, accent: ["level0", "level1", "level2"] },
  { cue: 31, layout: { level0: [0, 1] }, accent: ["level0"] },
  { cue: 32, layout: { level0: [0, 1], level1: [1.5, 1] }, edges: [LEVEL_EDGES[0]], accent: ["level1"] },
  { cue: 33, layout: LEVELS, edges: [...LEVEL_EDGES], accent: ["level2"], badges: { level2: "person + his number" } },
  { cue: 34, layout: LEVELS, edges: [...LEVEL_EDGES], badges: { level1: "only a code", level2: "only MyID" } },
  { cue: 35, layout: { ...LEVELS, caseOperator: [1.5, 2.1] }, edges: [...LEVEL_EDGES, { from: "caseOperator", to: "level2", broken: true }], crossed: ["caseOperator"], badges: { level2: "only MyID" } },
  // A person level, a session level, and the one trusted phone.
  { cue: 36, layout: PHONE, edges: [...PHONE_EDGES], badges: { aziz: "person: level", trusted: "session: level" } },
  { cue: 37, layout: PHONE, edges: [...PHONE_EDGES], accent: ["trusted"], badges: { trusted: "level 2 only here" } },
  { cue: 38, layout: { ...PHONE, myid: [0.75, 2.1], taf: [2.25, 2.1] }, edges: [...PHONE_EDGES, { from: "myid", to: "trusted", label: "face" }, { from: "taf", to: "trusted", label: "SIM" }], accent: ["trusted"], badges: { trusted: "MyID + SIM" } },
  { cue: 39, layout: PHONE, edges: [...PHONE_EDGES], accent: ["trusted", "transfer"], packets: [{ from: "trusted", to: "transfer", label: "money" }], badges: { trusted: "money phone" } },
  { cue: 40, layout: START, edges: [START_EDGES[0], { from: "mobileBank", to: "transfer", broken: true }], danger: ["transfer"], badges: { aziz: "level 1", mobileBank: "no trusted phone" } },
  { cue: 41, layout: START, edges: [START_EDGES[0], { from: "mobileBank", to: "transfer", broken: true }], badges: { aziz: "level 1", transfer: "not refused" } },
  { cue: 42, layout: START, edges: [START_EDGES[0], { from: "mobileBank", to: "transfer", broken: true }], packets: [{ from: "transfer", to: "mobileBank", label: "level 2 + the check" }], badges: { aziz: "level 1" } },
  { cue: 43, layout: STEPUP, edges: [...STEPUP_EDGES], accent: ["consent", "myid", "azizPhone"] },
  { cue: 44, layout: STEPUP, edges: [...STEPUP_EDGES], badges: { consent: "✓", myid: "✓", azizPhone: "his number ✓" } },
  { cue: 45, layout: PHONE, edges: [...PHONE_EDGES], accent: ["trusted", "transfer"], packets: [{ from: "trusted", to: "transfer", label: "money" }], badges: { aziz: "level 2", transfer: "sent" } },
  { cue: 46, layout: PHONE, edges: [...PHONE_EDGES], badges: { aziz: "same person", trusted: "level + phone" } },
  // The tokens and the two standards.
  { cue: 47, layout: TOKEN, edges: [...TOKEN_EDGES], accent: ["keycloak", "token"], packets: [{ from: "keycloak", to: "mobileBank", label: "level 2" }], badges: { token: "session level" } },
  { cue: 48, layout: TOKEN, edges: [...TOKEN_EDGES], badges: { token: "no own format" } },
  { cue: 49, layout: STD, accent: ["oauth", "oidc"], badges: { oauth: "open", oidc: "open" } },
  { cue: 50, layout: STD, accent: ["oauth"], badges: { oauth: "get a token, what it allows" } },
  { cue: 51, layout: STD, edges: [{ from: "oidc", to: "oauth", label: "on top" }], accent: ["oidc"], badges: { oidc: "who logged in, how" } },
  { cue: 52, layout: TOKEN, edges: [...TOKEN_EDGES], accent: ["mobileBank"], badges: { token: "level 2", mobileBank: "reads, decides" } },
  // The check and the summary.
  { cue: 53, layout: START, edges: [START_EDGES[0], { from: "mobileBank", to: "transfer", broken: true }], danger: ["transfer"], badges: { mobileBank: "password ✓ · code ✓", transfer: "why not?" } },
  { cue: 54, layout: WORDS, accent: ["authn"], badges: { authn: "only this ✓", authz: "money: level 2" } },
  { cue: 55, layout: WORDS, accent: ["authn"], badges: { authn: "the owner" } },
  { cue: 56, layout: WORDS, accent: ["proofing"], badges: { authn: "the owner", proofing: "the real person" } },
  { cue: 57, layout: WORDS, accent: ["authz"], badges: { authn: "the owner", proofing: "the real person", authz: "may do what" } },
  { cue: 58, layout: PHONE, edges: [...PHONE_EDGES], accent: ["trusted"], badges: { aziz: "level 2", trusted: "money phone" } },
];
