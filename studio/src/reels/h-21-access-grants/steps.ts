import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 17: access grants, week 2, Sunday. The question and the bridge (0–5); what a grant is (6–9); the gateway
// decides, Keycloak issues (10–20); the token names its app (21–26); the level and the money phone (27–33);
// renewal (34–46); inactivity and the app PIN (47–50); how a grant ends (51–58); the check (59–61);
// summary and hand-off (62–66).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 5, rows: [5], current: ["customer", "mobile", "custgw"], units: UNIT },
  { cue: 10, part: 5, current: ["custgw", "keycloak"], dot: "custgw", units: { heeyid: "gateway decides, Keycloak issues" } },
  { cue: 21, part: 5, current: ["mobile", "keycloak"], dot: "keycloak", units: { heeyid: "the token: app · level" } },
  { cue: 34, part: 5, current: ["mobile", "custgw", "keycloak"], dot: "custgw", units: { heeyid: "renewal" } },
  { cue: 41, part: 5, current: ["custgw", "valkey"], dot: "valkey", units: { heeyid: "ended grants" } },
  { cue: 51, part: 5, current: ["custgw", "valkey"], dot: "custgw", units: { heeyid: "how a grant ends" } },
  { cue: 53, part: 5, current: ["staff", "admingw", "valkey"], dot: "admingw", units: { heeyid: "block: lesson 19" } },
  { cue: 62, part: 5, rows: [5], dot: "off", units: UNIT },
];

const DAY = { aziz: [0, 1], trusted: [1.5, 1], mobileBank: [3, 1] } as const;
const DAY_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "mobileBank" }] as const;
const ISSUE = { trusted: [0, 1], platform: [1.5, 1], keycloak: [3, 1] } as const;
const ISSUE_EDGES = [{ from: "trusted", to: "platform" }, { from: "platform", to: "keycloak" }] as const;
const TOKENS = [{ from: "keycloak", to: "platform", label: "tokens" }, { from: "platform", to: "trusted", label: "tokens", delay: 50 }] as const;
const APP = { token: [0, 0.4], caller: [0, 1.7], mobileApi: [2.5, 1] } as const;
const APP_EDGES = [{ from: "token", to: "mobileApi" }, { from: "caller", to: "mobileApi" }] as const;
const LEVEL = { trusted: [0, 1], platform: [1.5, 1], myid: [3, 0.3], keycloak: [3, 1.7] } as const;
const LEVEL_EDGES = [{ from: "trusted", to: "platform" }, { from: "platform", to: "myid" }, { from: "platform", to: "keycloak" }] as const;
const READ = { trusted: [0, 1], mobileApi: [2.5, 1] } as const;
const READ_EDGES = [{ from: "trusted", to: "mobileApi" }] as const;
const BLOCK = { trusted: [0, 1], platform: [1.5, 1], operator: [3, 1] } as const;
const BLOCK_EDGES = [{ from: "trusted", to: "platform" }, { from: "operator", to: "platform" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Sunday, week 2: breakfast, lunch, night, and no password.
  { cue: 0, layout: DAY, edges: [...DAY_EDGES], accent: ["mobileBank"], badges: { aziz: "Sunday · breakfast" } },
  { cue: 1, layout: DAY, edges: [...DAY_EDGES], badges: { aziz: "lunch · night" } },
  { cue: 2, layout: DAY, edges: [...DAY_EDGES], badges: { trusted: "no password" } },
  { cue: 3, layout: DAY, edges: [...DAY_EDGES], badges: { mobileBank: "what lets him in?" } },
  { cue: 4, layout: DAY, edges: [...DAY_EDGES], accent: ["trusted"], badges: { trusted: "money phone · app PIN" } },
  { cue: 5, layout: DAY, edges: [...DAY_EDGES], badges: { trusted: "between two logins?" } },
  // One grant: one app account, one device, one customer.
  { cue: 6, layout: DAY, edges: [...DAY_EDGES], accent: ["trusted"], badges: { trusted: "access grant" } },
  { cue: 7, layout: DAY, edges: [...DAY_EDGES], badges: { aziz: "one customer", trusted: "one device", mobileBank: "one app account" } },
  { cue: 8, layout: DAY, edges: [...DAY_EDGES], badges: { trusted: "registration day: level 1" } },
  { cue: 9, layout: DAY, edges: [...DAY_EDGES], badges: { mobileBank: "new grant each login" } },
  // The gateway decides; Keycloak issues.
  { cue: 10, layout: ISSUE, edges: [...ISSUE_EDGES] },
  { cue: 11, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["platform"], badges: { platform: "decides" } },
  { cue: 12, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "password · code · verdict · device" } },
  { cue: 13, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["keycloak"], badges: { platform: "decides", keycloak: "issues" } },
  { cue: 14, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "talks to the gateway only" } },
  { cue: 15, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [{ from: "platform", to: "keycloak", label: "signed note" }] },
  { cue: 16, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { keycloak: "device · customer · level" } },
  { cue: 17, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { keycloak: "short · one use" } },
  { cue: 18, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [...TOKENS], badges: { trusted: "access + refresh" } },
  { cue: 19, layout: { ...ISSUE, taf: [1.5, 0], myid: [1.5, 2] }, edges: [...ISSUE_EDGES, { from: "platform", to: "taf" }, { from: "platform", to: "myid" }], badges: { keycloak: "knows no TAF, no MyID" } },
  { cue: 20, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["platform"], badges: { platform: "all bank rules" } },
  // The token names its app.
  { cue: 21, layout: { token: [1.5, 1] }, accent: ["token"] },
  { cue: 22, layout: { token: [1.5, 1] }, badges: { token: "for whom · which app asked" } },
  { cue: 23, layout: { token: [1.5, 1] }, accent: ["token"], badges: { token: "mobile bank · mobile bank" } },
  { cue: 24, layout: APP, edges: [...APP_EDGES], accent: ["mobileApi"], packets: [{ from: "token", to: "mobileApi", label: "mobile bank ✓" }] },
  { cue: 25, layout: APP, edges: [{ from: "token", to: "mobileApi" }, { from: "caller", to: "mobileApi", broken: true }], danger: ["caller"], packets: [{ from: "caller", to: "mobileApi", label: "other app", stopAt: 0.6 }], badges: { mobileApi: "different app · log in again" } },
  { cue: 26, layout: APP, edges: [{ from: "token", to: "mobileApi" }, { from: "caller", to: "mobileApi", broken: true }], badges: { token: "signed: app", caller: "header: anyone" } },
  // The level and the money phone.
  { cue: 27, layout: { token: [1.5, 1] }, accent: ["token"], badges: { token: "level 1 or 2" } },
  { cue: 28, layout: LEVEL, edges: [...LEVEL_EDGES], badges: { platform: "2 = level 2 + trusted phone" } },
  { cue: 29, layout: LEVEL, edges: [...LEVEL_EDGES], badges: { trusted: "registration: level 1" } },
  { cue: 30, layout: LEVEL, edges: [...LEVEL_EDGES], accent: ["trusted"], packets: [{ from: "platform", to: "trusted", label: "new token: level 2" }], badges: { myid: "Saturday ✓" } },
  { cue: 31, layout: LEVEL, edges: [...LEVEL_EDGES], badges: { trusted: "at once" } },
  { cue: 32, layout: { token: [1.5, 1] }, accent: ["token"], badges: { token: "level 2 · money phone" } },
  { cue: 33, layout: READ, edges: [...READ_EDGES], accent: ["mobileApi"], packets: [{ from: "trusted", to: "mobileApi", label: "token" }], badges: { mobileApi: "reads level · money phone" } },
  // Renewal: no password, same device, same app.
  { cue: 34, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "breakfast" } },
  { cue: 35, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "access token: short" } },
  { cue: 36, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "nothing asked" } },
  { cue: 37, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [{ from: "trusted", to: "platform", label: "refresh token + device id" }] },
  { cue: 38, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["platform"], badges: { platform: "renewal" } },
  { cue: 39, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "same device · same app" } },
  { cue: 40, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "1. binding check" } },
  { cue: 41, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "2. list of ended grants" } },
  { cue: 42, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [...TOKENS], badges: { trusted: "fresh tokens" } },
  { cue: 43, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [{ from: "trusted", to: "platform", label: "old refresh token", stopAt: 0.6 }], badges: { keycloak: "reuse seen" } },
  { cue: 44, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["trusted"], badges: { trusted: "no password" } },
  { cue: 45, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "renewal ≠ login" } },
  { cue: 46, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "password lock: grant goes on" } },
  // Inactivity: the app PIN.
  { cue: 47, layout: DAY, edges: [...DAY_EDGES], badges: { mobileBank: "idle" } },
  { cue: 48, layout: DAY, edges: [...DAY_EDGES], accent: ["trusted"], badges: { trusted: "idle: app PIN" } },
  { cue: 49, layout: DAY, edges: [...DAY_EDGES], badges: { trusted: "grant goes on" } },
  { cue: 50, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "lifetime · idle: policy" } },
  // How a grant ends.
  { cue: 51, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["platform"] },
  { cue: 52, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "1. lifetime" } },
  { cue: 53, layout: BLOCK, edges: [...BLOCK_EDGES], accent: ["operator"], badges: { platform: "2. block", operator: "lesson 19" } },
  { cue: 54, layout: BLOCK, edges: [...BLOCK_EDGES], danger: ["trusted"], packets: [{ from: "trusted", to: "platform", label: "next request", stopAt: 0.5 }], badges: { trusted: "lost phone", platform: "ended at once" } },
  { cue: 55, layout: { newPhone: [0, 1], platform: [1.5, 1], keycloak: [3, 1] }, edges: [{ from: "newPhone", to: "platform", broken: true }, { from: "platform", to: "keycloak" }], crossed: ["newPhone"], badges: { platform: "3. binding mismatch", newPhone: "revoked" } },
  { cue: 56, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "4. closure" } },
  { cue: 57, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "grant ended" } },
  { cue: 58, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [{ from: "trusted", to: "platform", label: "renew", stopAt: 0.5 }], badges: { trusted: "log in again" } },
  // The check.
  { cue: 59, layout: DAY, edges: [...DAY_EDGES], accent: ["trusted"] },
  { cue: 60, layout: DAY, edges: [...DAY_EDGES], badges: { aziz: "lunch", trusted: "password? PIN? nothing?" } },
  { cue: 61, layout: DAY, edges: [...DAY_EDGES], accent: ["trusted"], badges: { trusted: "app PIN" } },
  // Summary and hand-off.
  { cue: 62, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["platform", "keycloak"], badges: { platform: "decides", keycloak: "issues" } },
  { cue: 63, layout: { token: [1.5, 1] }, accent: ["token"], badges: { token: "app · level" } },
  { cue: 64, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "renewal: no password" } },
  { cue: 65, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "ended: next request" } },
  { cue: 66, layout: DAY, edges: [...DAY_EDGES], accent: ["trusted"], badges: { aziz: "Monday: log out", trusted: "same phone" } },
];
