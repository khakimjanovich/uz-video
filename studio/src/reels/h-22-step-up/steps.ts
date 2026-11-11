import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 22: step-up. The question (cues 0–5); the required level of each app (6–14); the rule for personal
// data (15–19); never refuse: the step-up answer (20–29); side app to master app (30–36); the checks (37–47);
// only MyID gives the level; person and session level (48–62); the close (63–71).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 5, rows: [5], current: ["sideapps", "custgw", "keycloak"], units: UNIT },
  { cue: 6, part: 5, current: ["mobile", "sideapps", "custgw", "postgres"], dot: "postgres", units: { heeyid: "app catalogue: required level" } },
  { cue: 34, part: 5, current: ["mobile", "adapters", "myid"], dot: "myid", units: { heeyid: "MyID: master app only" } },
  { cue: 71, part: 5, rows: [5], dot: "off", units: UNIT },
];

const ORDERS = { aziz: [0, 1], marketplace: [1.5, 1], platform: [3, 1] } as const;
const ORDER_EDGES = [{ from: "aziz", to: "marketplace" }, { from: "marketplace", to: "platform" }] as const;
const APPS = { mobileBank: [0, 1], marketplace: [1, 1], credit: [2, 1], platform: [3, 1] } as const;
const SIDE = { aziz: [0, 1], marketplace: [1.3, 0.3], mobileBank: [1.3, 1.8], platform: [3, 0.3], myid: [3, 1.8] } as const;
const SIDE_EDGES = [
  { from: "aziz", to: "marketplace" }, { from: "marketplace", to: "platform" }, { from: "marketplace", to: "mobileBank" },
  { from: "mobileBank", to: "myid" },
] as const;
const CHECKS = { aziz: [0, 1], mobileBank: [1.5, 1], myid: [3, 0.3], platform: [3, 1.8] } as const;
const CHECK_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }, { from: "mobileBank", to: "platform" }] as const;
const LEVELS = { aziz: [0, 1], mobileBank: [2, 0.2], newPhone: [2, 1], marketplace: [2, 1.8] } as const;
const LEVEL_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "aziz", to: "newPhone" }, { from: "aziz", to: "marketplace" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // My orders needs level 2; Aziz is at level 1.
  { cue: 0, layout: ORDERS, edges: [...ORDER_EDGES], accent: ["marketplace"], badges: { marketplace: "My orders" } },
  { cue: 1, layout: ORDERS, edges: [...ORDER_EDGES], badges: { marketplace: "the kettle" } },
  { cue: 2, layout: ORDERS, edges: [...ORDER_EDGES], badges: { aziz: "level 1", marketplace: "personal data" } },
  { cue: 3, layout: ORDERS, edges: [...ORDER_EDGES], danger: ["marketplace"], badges: { aziz: "level 1", marketplace: "say no?" } },
  // Each app has a required level.
  { cue: 7, layout: APPS, accent: ["mobileBank", "marketplace", "credit"], badges: { platform: "name · kind · level" } },
  { cue: 8, layout: APPS, badges: { mobileBank: "app 1" } },
  { cue: 9, layout: APPS, badges: { mobileBank: "app 1", marketplace: "app + web" } },
  { cue: 10, layout: APPS, badges: { mobileBank: "app 1", marketplace: "app + web", credit: "one more" } },
  { cue: 11, layout: APPS, accent: ["platform"], badges: { mobileBank: "level ?", marketplace: "level ?", credit: "level ?" } },
  { cue: 12, layout: APPS, badges: { platform: "no level: no start" } },
  { cue: 13, layout: APPS, accent: ["marketplace"], badges: { marketplace: "required: 1" } },
  { cue: 14, layout: ORDERS, edges: [...ORDER_EDGES], accent: ["marketplace"], badges: { aziz: "level 1", marketplace: "browse ✓" } },
  // The rule for personal data.
  { cue: 15, layout: ORDERS, edges: [...ORDER_EDGES], accent: ["marketplace"] },
  { cue: 16, layout: ORDERS, edges: [...ORDER_EDGES], badges: { marketplace: "orders · addresses · cards: 2" } },
  { cue: 18, layout: ORDERS, edges: [...ORDER_EDGES], packets: [{ from: "platform", to: "marketplace", label: "summary: level 1" }] },
  { cue: 19, layout: ORDERS, edges: [...ORDER_EDGES], badges: { aziz: "level 1", marketplace: "needs 2" } },
  // Never refuse: the answer is the way up.
  { cue: 21, layout: ORDERS, edges: [...ORDER_EDGES], danger: ["marketplace"], crossed: ["marketplace"], badges: { marketplace: "error?" } },
  { cue: 22, layout: ORDERS, edges: [...ORDER_EDGES], accent: ["platform"], badges: { platform: "never refuses" } },
  { cue: 23, layout: ORDERS, edges: [...ORDER_EDGES], packets: [{ from: "marketplace", to: "platform", label: "step-up" }] },
  { cue: 25, layout: ORDERS, edges: [...ORDER_EDGES], badges: { platform: "current: 1" } },
  { cue: 26, layout: ORDERS, edges: [...ORDER_EDGES], badges: { platform: "required: 2" } },
  { cue: 27, layout: ORDERS, edges: [...ORDER_EDGES], badges: { platform: "consent · MyID · phone" } },
  { cue: 28, layout: ORDERS, edges: [...ORDER_EDGES], accent: ["aziz"], packets: [{ from: "platform", to: "marketplace", label: "the way up" }] },
  // The side app sends Aziz to the master app.
  { cue: 30, layout: SIDE, edges: [...SIDE_EDGES], accent: ["marketplace"], badges: { marketplace: "side app" } },
  { cue: 31, layout: SIDE, edges: [...SIDE_EDGES], badges: { marketplace: "no MyID" } },
  { cue: 32, layout: SIDE, edges: [...SIDE_EDGES], packets: [{ from: "platform", to: "marketplace", label: "continue in the mobile bank" }] },
  { cue: 33, layout: SIDE, edges: [...SIDE_EDGES, { from: "marketplace", to: "myid", broken: true }], danger: ["marketplace"], packets: [{ from: "marketplace", to: "myid", label: "proofing", stopAt: 0.5 }] },
  { cue: 35, layout: SIDE, edges: [...SIDE_EDGES], accent: ["mobileBank"], badges: { marketplace: "one button" } },
  { cue: 36, layout: SIDE, edges: [...SIDE_EDGES], accent: ["mobileBank"], packets: [{ from: "marketplace", to: "mobileBank", label: "open" }] },
  // The checks, in the master app.
  { cue: 37, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["mobileBank"] },
  { cue: 38, layout: CHECKS, edges: [...CHECK_EDGES], badges: { mobileBank: "1. consent" } },
  { cue: 40, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["myid"], packets: [{ from: "mobileBank", to: "myid", label: "face · passport" }], badges: { mobileBank: "2. MyID" } },
  { cue: 41, layout: CHECKS, edges: [...CHECK_EDGES], badges: { mobileBank: "3. confirm data" } },
  { cue: 42, layout: CHECKS, edges: [...CHECK_EDGES], badges: { mobileBank: "4. phone check" } },
  { cue: 43, layout: CHECKS, edges: [...CHECK_EDGES], badges: { platform: "Confirmed" } },
  { cue: 45, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["aziz"], badges: { aziz: "level 2" } },
  { cue: 46, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["mobileBank"], badges: { aziz: "level 2", mobileBank: "phone: Trusted" } },
  { cue: 47, layout: CHECKS, edges: [...CHECK_EDGES], packets: [{ from: "platform", to: "mobileBank", label: "new token: level 2" }], badges: { aziz: "level 2" } },
  // Only MyID gives level 2.
  { cue: 49, layout: APPS, crossed: ["mobileBank", "marketplace", "credit"], badges: { platform: "app ✕" } },
  { cue: 50, layout: APPS, crossed: ["mobileBank", "marketplace", "credit"], badges: { platform: "approval ✕ · operator ✕" } },
  { cue: 51, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["myid"], badges: { myid: "only MyID" } },
  { cue: 53, layout: LEVELS, edges: [...LEVEL_EDGES], accent: ["aziz"], badges: { aziz: "person: level 2" } },
  // The session level is a different thing.
  { cue: 54, layout: LEVELS, edges: [...LEVEL_EDGES], badges: { aziz: "person: level 2", mobileBank: "session ?", newPhone: "session ?", marketplace: "session ?" } },
  { cue: 55, layout: LEVELS, edges: [...LEVEL_EDGES], accent: ["mobileBank"], badges: { aziz: "person: level 2", mobileBank: "trusted phone: 2" } },
  { cue: 56, layout: LEVELS, edges: [...LEVEL_EDGES], badges: { aziz: "person: level 2", mobileBank: "trusted phone: 2", newPhone: "other phone: 1" } },
  { cue: 57, layout: LEVELS, edges: [...LEVEL_EDGES], badges: { aziz: "person: level 2", mobileBank: "trusted phone: 2", newPhone: "other phone: 1", marketplace: "2 after approval" } },
  { cue: 59, layout: LEVELS, edges: [...LEVEL_EDGES], accent: ["marketplace"], badges: { aziz: "person: level 2", marketplace: "approval → 2" } },
  { cue: 61, layout: { mobileBank: [0, 1], myid: [0, 0], marketplace: [2, 0.4], credit: [2, 1.6] }, edges: [{ from: "mobileBank", to: "myid" }, { from: "mobileBank", to: "marketplace" }, { from: "mobileBank", to: "credit" }], accent: ["mobileBank"], badges: { mobileBank: "proves once" } },
  { cue: 62, layout: { mobileBank: [0, 1], myid: [0, 0], marketplace: [2, 0.4], credit: [2, 1.6] }, edges: [{ from: "mobileBank", to: "myid" }, { from: "mobileBank", to: "marketplace" }, { from: "mobileBank", to: "credit" }], badges: { marketplace: "borrows", credit: "borrows" } },
  // Recap and the open question.
  { cue: 64, layout: APPS, accent: ["mobileBank", "marketplace", "credit"], badges: { mobileBank: "required level", marketplace: "required level", credit: "required level" } },
  { cue: 65, layout: ORDERS, edges: [...ORDER_EDGES], badges: { platform: "never refuses" } },
  { cue: 66, layout: ORDERS, edges: [...ORDER_EDGES], badges: { platform: "level + checks" } },
  { cue: 67, layout: CHECKS, edges: [...CHECK_EDGES], accent: ["mobileBank"], badges: { mobileBank: "master app only" } },
  { cue: 68, layout: { aziz: [0, 1], trusted: [1.5, 1], mobileBank: [3, 1] }, edges: [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "mobileBank" }], badges: { trusted: "log out" } },
  { cue: 69, layout: { aziz: [0, 1], trusted: [1.5, 1], mobileBank: [3, 1] }, edges: [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "mobileBank" }], danger: ["mobileBank"], badges: { trusted: "same phone", mobileBank: "no session" } },
];
