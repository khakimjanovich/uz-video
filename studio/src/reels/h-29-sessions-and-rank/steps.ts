import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 29: session rank, seniority and probation. The copy shop (cues 0–5); the bridge (6–7, map); rules that
// fail (8–16); rank (17–20); the rule and the copy shop again (21–36); password change and notifications (37–42);
// probation (43–53); the close (54–64).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 6, part: 7, rows: [5, 7], current: ["keycloak", "mobile", "sideapps"], dot: "keycloak", units: { heeyid: "lesson 21: tokens and level" } },
  { cue: 7, part: 7, current: ["keycloak", "postgres"], dot: "postgres", units: { heeyid: "+ start time · + rank" } },
  { cue: 64, part: 7, rows: [7], dot: "off", current: ["mobile", "custgw"], units: { heeyid: "next: the password reset" } },
];

const SHOP = { marketWeb: [0, 0.4], trusted: [0, 1.7], platform: [1.6, 1], someone: [3, 0.4] } as const;
const SHOP_EDGES = [{ from: "marketWeb", to: "platform" }, { from: "trusted", to: "platform" }, { from: "someone", to: "marketWeb" }] as const;
const RANKS = { trusted: [0, 1], marketWeb: [1.5, 0.4], marketplace: [1.5, 1.7], platform: [3, 1] } as const;
const PROB = { keycloak: [0, 1], mobileBank: [1.6, 0.4], marketplace: [1.6, 1.7], operator: [3, 1] } as const;
const PROB_EDGES = [{ from: "keycloak", to: "mobileBank" }, { from: "keycloak", to: "marketplace" }, { from: "operator", to: "keycloak" }] as const;
const TWO = { marketplace: [0.5, 1], marketWeb: [2.5, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The copy shop and the new phone.
  { cue: 0, layout: { aziz: [0, 1], marketWeb: [1.6, 1] }, edges: [{ from: "aziz", to: "marketWeb" }], accent: ["marketWeb"], badges: { marketWeb: "copy shop" } },
  { cue: 1, layout: { aziz: [0, 1], marketWeb: [1.6, 1] }, edges: [{ from: "aziz", to: "marketWeb" }], danger: ["marketWeb"], badges: { marketWeb: "never logged out" } },
  { cue: 2, layout: SHOP, edges: [{ from: "marketWeb", to: "platform" }, { from: "trusted", to: "platform" }], accent: ["trusted"], badges: { trusted: "new phone · TAF green" } },
  { cue: 3, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], packets: [{ from: "marketWeb", to: "platform", label: "End: mobile bank" }] },
  { cue: 4, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], badges: { marketWeb: "session 1", trusted: "session 2" } },
  { cue: 5, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], badges: { platform: "who wins?" } },
  // The rules that fail.
  { cue: 9, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], badges: { platform: "rule 1: anyone ends anyone" } },
  { cue: 10, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], crossed: ["trusted"], shake: { trusted: 0.3 }, badges: { trusted: "owner out" } },
  { cue: 11, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], badges: { platform: "rule 2: older wins" } },
  { cue: 12, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], badges: { marketWeb: "3 months old", trusted: "1 week old" } },
  { cue: 13, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], crossed: ["trusted"], badges: { trusted: "owner out" } },
  { cue: 14, layout: SHOP, edges: [...SHOP_EDGES], danger: ["platform"], badges: { platform: "age is not enough" } },
  { cue: 15, layout: SHOP, edges: [...SHOP_EDGES], accent: ["platform"], badges: { platform: "how strong a check?" } },
  // Rank.
  { cue: 16, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], accent: ["platform"], badges: { platform: "rank" } },
  { cue: 17, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], accent: ["trusted"], badges: { trusted: "master app · green → rank 2" } },
  { cue: 18, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], accent: ["trusted"], badges: { trusted: "yellow + MyID → rank 2" } },
  { cue: 19, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], badges: { trusted: "not scored → rank 1, until green" } },
  { cue: 20, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], accent: ["trusted"], badges: { trusted: "rank 2", marketWeb: "rank 1", marketplace: "rank 1" } },
  // The rule.
  { cue: 22, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], badges: { platform: "ends only a lower rank" } },
  { cue: 23, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], badges: { platform: "or same rank, younger" } },
  { cue: 24, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], badges: { marketWeb: "rank 1", trusted: "rank 2" } },
  { cue: 27, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], packets: [{ from: "marketWeb", to: "platform", label: "End", stopAt: 0.6 }], badges: { platform: "refused · audit · antifraud", trusted: "rank 2" } },
  { cue: 28, layout: SHOP, edges: [...SHOP_EDGES], accent: ["trusted"], badges: { trusted: "list of sessions" } },
  { cue: 29, layout: SHOP, edges: [...SHOP_EDGES], accent: ["trusted"], badges: { trusted: "copy shop · marketplace · 3 months" } },
  { cue: 30, layout: SHOP, edges: [...SHOP_EDGES], accent: ["trusted"], crossed: ["marketWeb"], packets: [{ from: "trusted", to: "platform", label: "End" }], badges: { marketWeb: "ended" } },
  { cue: 31, layout: TWO, edges: [{ from: "marketplace", to: "marketWeb" }], badges: { marketplace: "rank 1 · older", marketWeb: "rank 1 · younger" } },
  { cue: 32, layout: TWO, edges: [{ from: "marketplace", to: "marketWeb" }], crossed: ["marketWeb"], packets: [{ from: "marketplace", to: "marketWeb", label: "End" }], badges: { marketplace: "rank 1 · older", marketWeb: "ended" } },
  { cue: 33, layout: SHOP, edges: [...SHOP_EDGES], accent: ["trusted"] },
  { cue: 34, layout: SHOP, edges: [...SHOP_EDGES], accent: ["trusted"], badges: { trusted: "strongest check" } },
  { cue: 35, layout: SHOP, edges: [...SHOP_EDGES], danger: ["someone"], badges: { trusted: "strongest check", marketWeb: "oldest forgotten door" } },
  { cue: 36, layout: SHOP, edges: [...SHOP_EDGES], accent: ["trusted"], badges: { platform: "rank first, age breaks a tie" } },
  // A password change ends same or lower ranks; each new session notifies.
  { cue: 37, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], accent: ["trusted"] },
  { cue: 38, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], accent: ["trusted"], crossed: ["marketWeb", "marketplace"], packets: [{ from: "trusted", to: "platform", label: "new password" }], badges: { trusted: "rank 2", platform: "same or lower: end" } },
  { cue: 39, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], badges: { platform: "age: only from the list" } },
  { cue: 41, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], packets: [{ from: "platform", to: "trusted", label: "new session" }, { from: "platform", to: "marketWeb", label: "new session", delay: 30 }], badges: { platform: "push + SMS" } },
  // Probation: the token carries the facts, each app blocks its own actions.
  { cue: 43, layout: PROB, edges: [...PROB_EDGES], accent: ["keycloak"], badges: { keycloak: "probation" } },
  { cue: 44, layout: PROB, edges: [...PROB_EDGES], danger: ["keycloak"], badges: { keycloak: "new = riskiest" } },
  { cue: 46, layout: PROB, edges: [...PROB_EDGES], badges: { keycloak: "new session · new phone · reset" } },
  { cue: 48, layout: PROB, edges: [...PROB_EDGES], accent: ["operator"], badges: { operator: "actions + period, per app" } },
  { cue: 49, layout: PROB, edges: [...PROB_EDGES], crossed: ["keycloak"], badges: { keycloak: "does not block" } },
  { cue: 51, layout: PROB, edges: [...PROB_EDGES], accent: ["keycloak"], packets: [{ from: "keycloak", to: "mobileBank", label: "start · probation end · rank · level" }, { from: "keycloak", to: "marketplace", label: "start · probation end · rank · level", delay: 30 }] },
  { cue: 52, layout: PROB, edges: [...PROB_EDGES], accent: ["mobileBank", "marketplace"], badges: { mobileBank: "blocks its own", marketplace: "blocks its own" } },
  // Recap and the next threat.
  { cue: 54, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], badges: { trusted: "start · rank 2", marketWeb: "start · rank 1", marketplace: "start · rank 1" } },
  { cue: 56, layout: RANKS, edges: [{ from: "trusted", to: "platform" }, { from: "marketWeb", to: "platform" }, { from: "marketplace", to: "platform" }], badges: { platform: "lower, or younger equal" } },
  { cue: 58, layout: PROB, edges: [...PROB_EDGES], accent: ["mobileBank", "marketplace"], badges: { keycloak: "probation" } },
  { cue: 59, layout: { stranger: [0, 1], newPhone: [1.5, 1], platform: [3, 1] }, edges: [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "platform" }], danger: ["stranger"], badges: { stranger: "new SIM" } },
  { cue: 61, layout: { stranger: [0, 1], newPhone: [1.5, 1], platform: [3, 1] }, edges: [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "platform" }], danger: ["stranger"], packets: [{ from: "newPhone", to: "platform", label: "forgot password" }] },
  { cue: 62, layout: { stranger: [0, 0.4], newPhone: [1.5, 0.4], platform: [3, 1], trusted: [1.5, 1.7] }, edges: [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "platform" }, { from: "trusted", to: "platform" }], danger: ["stranger"], badges: { trusted: "active session" } },
  { cue: 63, layout: { stranger: [0, 0.4], newPhone: [1.5, 0.4], platform: [3, 1], trusted: [1.5, 1.7] }, edges: [{ from: "stranger", to: "newPhone" }, { from: "newPhone", to: "platform" }, { from: "trusted", to: "platform" }], danger: ["stranger"], badges: { platform: "reset at once?" } },
];
