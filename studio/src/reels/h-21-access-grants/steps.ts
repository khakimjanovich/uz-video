import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 21: access grants. The question (cues 0–5); what a grant is (6–9); the gateway decides, Keycloak
// issues (10–20); what the token says (21–29); renewal and the revocation list (30–49); how a grant ends
// (50–60); the close (61–70).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 5, rows: [5], current: ["mobile", "custgw", "keycloak"], units: UNIT },
  { cue: 10, part: 5, current: ["custgw", "keycloak"], dot: "custgw", units: { heeyid: "gateway decides, Keycloak issues" } },
  { cue: 37, part: 5, current: ["custgw", "valkey"], dot: "valkey", units: { heeyid: "revocation list" } },
  { cue: 53, part: 5, current: ["staff", "admingw", "valkey"], dot: "admingw", units: { heeyid: "operator revokes" } },
  { cue: 70, part: 5, rows: [5], dot: "off", units: UNIT },
];

const DAY = { aziz: [0, 1], trusted: [1.5, 1], mobileBank: [3, 1] } as const;
const DAY_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "mobileBank" }] as const;
const ISSUE = { trusted: [0, 1], platform: [1.5, 1], keycloak: [3, 1] } as const;
const ISSUE_EDGES = [{ from: "trusted", to: "platform" }, { from: "platform", to: "keycloak" }] as const;
const APPS = { trusted: [0, 1], mobileBank: [2, 0.4], marketplace: [2, 1.7], platform: [3, 1] } as const;
const APP_EDGES = [{ from: "trusted", to: "mobileBank" }, { from: "trusted", to: "marketplace" }] as const;
const LOST = { trusted: [0, 0.4], tablet: [0, 1.7], platform: [1.7, 1], keycloak: [3, 1] } as const;
const LOST_EDGES = [{ from: "trusted", to: "platform" }, { from: "tablet", to: "platform" }, { from: "platform", to: "keycloak" }] as const;
const TOKENS = [{ from: "keycloak", to: "platform", label: "tokens" }, { from: "platform", to: "trusted", label: "tokens", delay: 50 }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Breakfast, lunch, night, and no password.
  { cue: 0, layout: DAY, edges: [...DAY_EDGES], accent: ["mobileBank"], badges: { aziz: "breakfast" } },
  { cue: 1, layout: DAY, edges: [...DAY_EDGES], badges: { aziz: "lunch · night" } },
  { cue: 2, layout: DAY, edges: [...DAY_EDGES], badges: { trusted: "no password" } },
  { cue: 3, layout: DAY, edges: [...DAY_EDGES], badges: { mobileBank: "what lets him in?" } },
  // One grant: one app account, one device, one customer.
  { cue: 6, layout: DAY, edges: [...DAY_EDGES], accent: ["mobileBank"], badges: { mobileBank: "access grant = session" } },
  { cue: 7, layout: DAY, edges: [...DAY_EDGES], badges: { aziz: "one customer", trusted: "one device", mobileBank: "one app account" } },
  { cue: 8, layout: DAY, edges: [...DAY_EDGES], badges: { aziz: "registration: level 1" } },
  { cue: 9, layout: DAY, edges: [...DAY_EDGES], badges: { mobileBank: "new grant each login" } },
  // The gateway decides; Keycloak issues.
  { cue: 11, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["platform"], badges: { platform: "decides" } },
  { cue: 12, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "password · code · verdict · binding" } },
  { cue: 13, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["keycloak"], badges: { platform: "decides", keycloak: "issues" } },
  { cue: 14, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [{ from: "platform", to: "keycloak", label: "signed note" }], badges: { platform: "decides", keycloak: "issues" } },
  { cue: 15, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { keycloak: "device · customer · level" } },
  { cue: 16, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { keycloak: "short · one use" } },
  { cue: 17, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [...TOKENS], badges: { trusted: "access + refresh" } },
  { cue: 19, layout: { ...ISSUE, taf: [1.5, 0], myid: [1.5, 2] }, edges: [...ISSUE_EDGES, { from: "platform", to: "taf" }, { from: "platform", to: "myid" }], badges: { keycloak: "knows no rules" } },
  { cue: 20, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["platform"], badges: { platform: "all bank rules" } },
  // The token names its app and its level.
  { cue: 21, layout: APPS, edges: [...APP_EDGES], accent: ["trusted"], badges: { trusted: "access token" } },
  { cue: 22, layout: APPS, edges: [...APP_EDGES], badges: { mobileBank: "own app only" } },
  { cue: 23, layout: APPS, edges: [...APP_EDGES, { from: "trusted", to: "marketplace", broken: true }], danger: ["marketplace"], packets: [{ from: "trusted", to: "marketplace", label: "mobile bank token", stopAt: 0.5 }] },
  { cue: 24, layout: APPS, edges: [...APP_EDGES], badges: { trusted: "level 1 or 2" } },
  { cue: 25, layout: APPS, edges: [...APP_EDGES], badges: { trusted: "2 = level 2 + Trusted" } },
  { cue: 26, layout: APPS, edges: [...APP_EDGES], badges: { trusted: "level 1" } },
  { cue: 27, layout: { ...APPS, myid: [3, 0] }, edges: [...APP_EDGES, { from: "trusted", to: "myid" }], accent: ["trusted"], packets: [{ from: "platform", to: "trusted", label: "new token: level 2" }], badges: { trusted: "level 2" } },
  { cue: 29, layout: APPS, edges: [...APP_EDGES], accent: ["mobileBank", "marketplace"], badges: { trusted: "level 2", mobileBank: "reads the level" } },
  // Renewal: no password, same device, same app.
  { cue: 30, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "breakfast" } },
  { cue: 31, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "access token: short" } },
  { cue: 33, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [{ from: "trusted", to: "platform", label: "refresh token + device id" }] },
  { cue: 34, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["platform"], badges: { platform: "renewal" } },
  { cue: 35, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "same device · same app" } },
  { cue: 36, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "1. binding check" } },
  { cue: 38, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "2. revocation list" } },
  { cue: 39, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [...TOKENS], badges: { trusted: "fresh tokens" } },
  { cue: 40, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "old refresh: used up" } },
  { cue: 41, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [{ from: "trusted", to: "platform", label: "old refresh token", stopAt: 0.6 }], badges: { keycloak: "reuse seen" } },
  { cue: 42, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["trusted"], badges: { trusted: "no password" } },
  { cue: 43, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "renewal ≠ login" } },
  { cue: 46, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["trusted"], badges: { trusted: "idle: app PIN" } },
  { cue: 47, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "grant continues" } },
  { cue: 49, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "lifetime · idle: policy" } },
  // The lost tablet: revoked, refused at the next request.
  { cue: 50, layout: LOST, edges: [...LOST_EDGES], accent: ["tablet"] },
  { cue: 52, layout: LOST, edges: [...LOST_EDGES], danger: ["tablet"], badges: { tablet: "lost" } },
  { cue: 54, layout: LOST, edges: [...LOST_EDGES], crossed: ["tablet"], badges: { tablet: "revoked", platform: "next request" } },
  { cue: 55, layout: LOST, edges: [...LOST_EDGES], crossed: ["tablet"], packets: [{ from: "tablet", to: "platform", label: "request", stopAt: 0.5 }], badges: { tablet: "refused" } },
  { cue: 56, layout: LOST, edges: [...LOST_EDGES], crossed: ["tablet"], packets: [{ from: "tablet", to: "platform", label: "renew", stopAt: 0.5 }], badges: { platform: "revocation list: no" } },
  { cue: 57, layout: LOST, edges: [...LOST_EDGES], crossed: ["tablet"], badges: { platform: "block · mismatch · reset · expiry" } },
  { cue: 58, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { platform: "grant ended" } },
  { cue: 59, layout: ISSUE, edges: [...ISSUE_EDGES], packets: [{ from: "trusted", to: "platform", label: "renew", stopAt: 0.5 }] },
  { cue: 60, layout: ISSUE, edges: [...ISSUE_EDGES], danger: ["trusted"], badges: { trusted: "log in again" } },
  // Recap and the open question.
  { cue: 62, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["platform", "keycloak"], badges: { platform: "decides", keycloak: "issues" } },
  { cue: 63, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "app · level" } },
  { cue: 64, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { trusted: "renewal: no password" } },
  { cue: 65, layout: LOST, edges: [...LOST_EDGES], crossed: ["tablet"], badges: { tablet: "next request: stop" } },
  { cue: 66, layout: { aziz: [0, 1], marketplace: [1.5, 1], credit: [3, 1] }, edges: [{ from: "aziz", to: "marketplace" }], accent: ["marketplace"], badges: { aziz: "level 1" } },
  { cue: 67, layout: { aziz: [0, 1], marketplace: [1.5, 1] }, edges: [{ from: "aziz", to: "marketplace" }], badges: { aziz: "level 1", marketplace: "My orders: level 2" } },
  { cue: 68, layout: { aziz: [0, 1], marketplace: [1.5, 1] }, edges: [{ from: "aziz", to: "marketplace" }], danger: ["marketplace"], badges: { marketplace: "refuse?" } },
];
