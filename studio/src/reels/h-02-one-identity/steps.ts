import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 2: one identity. Three doors, one Aziz (cues 0–5); the naive model and its break (6–17);
// one person, one login, app accounts and sessions (18–35); the operator (36–41); the check log (42–47);
// master app and side apps (48–55); one installation, one bank (56–58); the close (59–68).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 1, rows: [1], current: ["mobile", "sideapps", "custgw", "keycloak", "postgres"], units: UNIT },
  { cue: 5, part: 1, current: ["customer"], dot: "customer", units: { heeyid: "inside: the customer" } },
  { cue: 6, part: 1, dot: "off", units: UNIT },
  { cue: 18, part: 1, current: ["custgw", "postgres"], units: { heeyid: "one person" } },
  { cue: 34, part: 1, current: ["keycloak", "mobile", "sideapps"], units: { heeyid: "one client per app" } },
  { cue: 42, part: 1, current: ["sms", "taf", "myid"], units: { heeyid: "every check logged" } },
  { cue: 49, part: 1, current: ["mobile", "taf", "myid"], units: { heeyid: "master app: MyID and TAF" } },
  { cue: 53, part: 1, current: ["sideapps", "sms"], units: { heeyid: "side apps: approval or SMS" } },
  { cue: 56, part: 1, current: ["perimeter"], units: { heeyid: "one installation, one bank" } },
  { cue: 59, part: 1, rows: [1], dot: "off", units: UNIT },
];

const DOORS = { aziz: [0, 1], trusted: [1.2, 0.5], laptop: [1.2, 1.7], mobileBank: [2.7, 0.2], marketplace: [2.7, 1.4] } as const;
const DOOR_EDGES = [
  { from: "aziz", to: "trusted" }, { from: "aziz", to: "laptop" },
  { from: "trusted", to: "mobileBank" }, { from: "trusted", to: "marketplace" }, { from: "laptop", to: "marketplace" },
] as const;
const APPS = { mobileBank: [0, 1], marketplace: [1.5, 1], credit: [3, 1] } as const;
const OPS = { mobileBank: [0, 0.6], marketplace: [1.5, 0.6], credit: [3, 0.6], operator: [1.5, 1.9] } as const;
const ONE = { person: [0, 1], login: [1.5, 1] } as const;
const ACCOUNTS = { person: [0, 1], mobileBank: [2, 0], marketplace: [2, 1], credit: [2, 2] } as const;
const ACCOUNT_EDGES = [{ from: "person", to: "mobileBank" }, { from: "person", to: "marketplace" }, { from: "person", to: "credit" }] as const;
const SESSIONS = { trusted: [0, 0.5], laptop: [0, 1.7], mobileBank: [2, 0.2], marketplace: [2, 1.4], operator: [3.2, 1] } as const;
const SESSION_EDGES = [{ from: "trusted", to: "mobileBank" }, { from: "trusted", to: "marketplace" }, { from: "laptop", to: "marketplace" }] as const;
const COUNTS = { mobileBank: "1 session", marketplace: "2 sessions" };
const LOG = { login: [0.5, 1], checkLog: [2.5, 1] } as const;
const MASTER = { mobileBank: [0, 0.5], myid: [2, 0], taf: [2, 1.1], marketplace: [0, 1.9] } as const;
const MASTER_EDGES = [{ from: "mobileBank", to: "myid" }, { from: "mobileBank", to: "taf" }] as const;
const BANKS = { platform: [0.8, 1], secondBank: [2.8, 1] } as const;
const LAPTOP = { laptop: [0, 1], marketplace: [1.5, 1], person: [3, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Three doors into one bank, on two devices.
  { cue: 0, layout: { aziz: [0, 1], laptop: [1.5, 1], marketplace: [3, 1] }, edges: [{ from: "aziz", to: "laptop" }, { from: "laptop", to: "marketplace" }], accent: ["aziz"], badges: { marketplace: "kettle" } },
  { cue: 1, layout: DOORS, edges: [...DOOR_EDGES], accent: ["mobileBank", "marketplace"] },
  { cue: 2, layout: DOORS, edges: [...DOOR_EDGES], badges: { trusted: "phone", laptop: "laptop" } },
  { cue: 3, layout: DOORS, edges: [...DOOR_EDGES], accent: ["aziz"], badges: { aziz: "how many identities?" } },
  // The naive model: a customer, a password and a level in every app.
  { cue: 7, layout: APPS, accent: ["mobileBank", "marketplace", "credit"] },
  { cue: 8, layout: APPS, badges: { mobileBank: "Aziz #1" } },
  { cue: 9, layout: APPS, badges: { mobileBank: "Aziz #1", marketplace: "Aziz #2" } },
  { cue: 10, layout: APPS, badges: { mobileBank: "Aziz #1", marketplace: "Aziz #2", credit: "Aziz #3" } },
  { cue: 11, layout: APPS, badges: { mobileBank: "password · level", marketplace: "password · level", credit: "password · level" } },
  { cue: 12, layout: { ...APPS, myid: [0, 2.2] }, edges: [{ from: "mobileBank", to: "myid" }], accent: ["mobileBank"], badges: { mobileBank: "level 2", marketplace: "level 1", credit: "level 1" } },
  { cue: 13, layout: APPS, danger: ["marketplace"], badges: { mobileBank: "level 2", marketplace: "level 1: prove again", credit: "level 1" } },
  // The operator cannot end the sessions of one app.
  { cue: 14, layout: OPS, edges: [{ from: "operator", to: "marketplace" }], danger: ["marketplace"], badges: { marketplace: "strange login" } },
  { cue: 15, layout: OPS, edges: [{ from: "operator", to: "marketplace" }], accent: ["operator"], badges: { operator: "end marketplace only" } },
  { cue: 16, layout: OPS, edges: [{ from: "operator", to: "marketplace", broken: true, label: "which sessions?" }], danger: ["operator"] },
  { cue: 17, layout: APPS, danger: ["mobileBank", "marketplace", "credit"], badges: { mobileBank: "password 1", marketplace: "password 2", credit: "password 3" } },
  // One person, one phone number, one password.
  { cue: 19, layout: { person: [1.5, 1] }, accent: ["person"] },
  { cue: 20, layout: { person: [1.5, 1] }, badges: { person: "PINFL · level · identity" } },
  { cue: 21, layout: ONE, edges: [{ from: "person", to: "login" }], accent: ["login"] },
  { cue: 22, layout: { ...ONE, mobileBank: [3, 0.2], marketplace: [3, 1], credit: [3, 1.8] }, edges: [{ from: "person", to: "login" }, { from: "login", to: "mobileBank" }, { from: "login", to: "marketplace" }, { from: "login", to: "credit" }], badges: { login: "login for every app" } },
  { cue: 23, layout: ONE, edges: [{ from: "person", to: "login" }], accent: ["login"], badges: { login: "one password" } },
  { cue: 24, layout: { ...ONE, mobileBank: [3, 0.2], marketplace: [3, 1], credit: [3, 1.8] }, edges: [{ from: "person", to: "login" }, { from: "login", to: "mobileBank" }, { from: "login", to: "marketplace" }, { from: "login", to: "credit" }], crossed: ["mobileBank", "marketplace", "credit"], badges: { login: "change once" } },
  { cue: 25, layout: ONE, edges: [{ from: "person", to: "login" }], accent: ["person"], badges: { person: "level 2 in every app" } },
  // App accounts.
  { cue: 27, layout: ACCOUNTS, edges: [...ACCOUNT_EDGES], accent: ["marketplace"], badges: { marketplace: "app account" } },
  { cue: 28, layout: ACCOUNTS, edges: [...ACCOUNT_EDGES], packets: [{ from: "person", to: "marketplace", label: "first login" }], badges: { marketplace: "app account" } },
  { cue: 29, layout: ACCOUNTS, edges: [...ACCOUNT_EDGES], accent: ["mobileBank", "marketplace", "credit"], badges: { mobileBank: "account", marketplace: "account", credit: "account" } },
  // Sessions: one for each phone or browser.
  { cue: 30, layout: SESSIONS, edges: [...SESSION_EDGES], accent: ["trusted", "laptop"] },
  { cue: 31, layout: SESSIONS, edges: [...SESSION_EDGES], accent: ["mobileBank"], badges: { mobileBank: "1 session" } },
  { cue: 32, layout: SESSIONS, edges: [...SESSION_EDGES], accent: ["marketplace"], badges: COUNTS },
  { cue: 33, layout: SESSIONS, edges: [...SESSION_EDGES], badges: { ...COUNTS, laptop: "app · device" } },
  { cue: 34, layout: SESSIONS, edges: [...SESSION_EDGES, { from: "marketplace", to: "mobileBank", broken: true }], packets: [{ from: "marketplace", to: "mobileBank", label: "marketplace token", stopAt: 0.5 }], badges: COUNTS },
  // The operator's three choices.
  { cue: 36, layout: SESSIONS, edges: [...SESSION_EDGES], accent: ["operator"], badges: COUNTS },
  { cue: 38, layout: SESSIONS, edges: [...SESSION_EDGES], crossed: ["laptop"], badges: { ...COUNTS, operator: "one session" } },
  { cue: 39, layout: SESSIONS, edges: [{ from: "trusted", to: "mobileBank" }], crossed: ["laptop"], badges: { mobileBank: "1 session", marketplace: "0 sessions", operator: "one app" } },
  { cue: 40, layout: SESSIONS, crossed: ["trusted", "laptop"], badges: { mobileBank: "0 sessions", marketplace: "0 sessions", operator: "the person" } },
  { cue: 41, layout: ACCOUNTS, edges: [...ACCOUNT_EDGES], accent: ["person"], badges: { person: "level 2 stays" } },
  // The check log next to the phone number.
  { cue: 42, layout: LOG, edges: [{ from: "login", to: "checkLog" }], accent: ["checkLog"] },
  { cue: 43, layout: LOG, edges: [{ from: "login", to: "checkLog" }], packets: [{ from: "login", to: "checkLog", label: "SMS · marketplace · 9:15" }] },
  { cue: 44, layout: LOG, edges: [{ from: "login", to: "checkLog" }], packets: [{ from: "login", to: "checkLog", label: "TAF · mobile bank · 9:20" }] },
  { cue: 45, layout: LOG, edges: [{ from: "login", to: "checkLog" }], packets: [{ from: "login", to: "checkLog", label: "MyID · mobile bank · last week" }] },
  { cue: 46, layout: LOG, edges: [{ from: "login", to: "checkLog" }], accent: ["checkLog"], badges: { checkLog: "3 lines" } },
  // Master app and side apps.
  { cue: 49, layout: MASTER, edges: [...MASTER_EDGES], accent: ["mobileBank"], badges: { mobileBank: "master app" } },
  { cue: 50, layout: MASTER, edges: [...MASTER_EDGES], accent: ["myid", "taf"], badges: { mobileBank: "moves money" } },
  { cue: 51, layout: MASTER, edges: [...MASTER_EDGES], accent: ["marketplace"], badges: { mobileBank: "master app", marketplace: "side app" } },
  { cue: 52, layout: MASTER, edges: [...MASTER_EDGES, { from: "marketplace", to: "myid", broken: true }], badges: { marketplace: "no face check" } },
  { cue: 53, layout: MASTER, edges: [...MASTER_EDGES, { from: "marketplace", to: "mobileBank" }], packets: [{ from: "marketplace", to: "mobileBank", label: "phone + password" }], badges: { marketplace: "side app" } },
  { cue: 54, layout: MASTER, edges: [...MASTER_EDGES, { from: "marketplace", to: "mobileBank" }], accent: ["marketplace"], packets: [{ from: "mobileBank", to: "marketplace", label: "Approve" }], badges: { marketplace: "or SMS code" } },
  { cue: 55, layout: { marketplace: [1.5, 1] }, accent: ["marketplace"], badges: { marketplace: "no master-app account" } },
  // One installation, one bank.
  { cue: 56, layout: { platform: [1.5, 1] }, accent: ["platform"], badges: { platform: "one installation" } },
  { cue: 57, layout: { platform: [0.5, 1], keycloak: [2, 1], mobileBank: [3.2, 0.3], marketplace: [3.2, 1.7] }, edges: [{ from: "platform", to: "keycloak" }, { from: "keycloak", to: "mobileBank" }, { from: "keycloak", to: "marketplace" }], badges: { platform: "one bank", keycloak: "one realm", mobileBank: "client", marketplace: "client" } },
  { cue: 58, layout: BANKS, edges: [{ from: "platform", to: "secondBank", broken: true, label: "no read across" }], accent: ["secondBank"], badges: { platform: "bank 1" } },
  // The close: one identity, and the open question about levels.
  { cue: 59, layout: ONE, edges: [{ from: "person", to: "login" }], accent: ["person", "login"] },
  { cue: 60, layout: SESSIONS, edges: [...SESSION_EDGES], badges: COUNTS },
  { cue: 61, layout: MASTER, edges: [...MASTER_EDGES], accent: ["mobileBank"], badges: { mobileBank: "proves who he is" } },
  { cue: 62, layout: DOORS, edges: [...DOOR_EDGES], badges: { aziz: "how many identities?" } },
  { cue: 63, layout: ACCOUNTS, edges: [...ACCOUNT_EDGES], accent: ["person"], badges: { person: "one" } },
  { cue: 64, layout: LAPTOP, edges: [{ from: "laptop", to: "marketplace" }, { from: "person", to: "marketplace" }], accent: ["laptop"] },
  { cue: 65, layout: LAPTOP, edges: [{ from: "laptop", to: "marketplace" }, { from: "person", to: "marketplace" }], badges: { person: "level 2", laptop: "session: level 1" } },
  { cue: 67, layout: LAPTOP, edges: [{ from: "laptop", to: "marketplace" }, { from: "person", to: "marketplace" }], accent: ["laptop", "person"], badges: { person: "level 2", laptop: "level = ?" } },
];
