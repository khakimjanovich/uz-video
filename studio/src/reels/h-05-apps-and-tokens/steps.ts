import { BuildMapStep, DiagramFrame, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 5: apps and tokens. The leak (0–6); realm, clients and the two names (7–15); the rule at each
// backend (16–20); heeyID's door (21–30); deeper than the door (31–36); the leak, measured (37–43);
// proof at each release and new apps (44–50); recap and the way to configuration (51–57).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 2, current: ["perimeter", "keycloak"], units: { heeyid: "one Keycloak" } },
  { cue: 6, part: 2, rows: [2], current: ["keycloak", "mobile", "sideapps"], units: { heeyid: "apps kept apart" } },
  { cue: 55, part: 2, current: ["keycloak", "custgw", "valkey"], units: { heeyid: "lifetimes · levels · limits" } },
  { cue: 56, part: 2, current: ["staff", "admingw"], units: { heeyid: "who sets them?" } },
  { cue: 57, part: 2, rows: [2], dot: "off" },
];

const realm = (from: readonly [number, number], to: readonly [number, number]): DiagramFrame => ({ label: "one realm", from, to });
const LEAK = { debugLog: [0, 1], logReader: [1.5, 1], mobileApi: [3, 1] } as const;
const LEAK_EDGES = [{ from: "debugLog", to: "logReader" }, { from: "logReader", to: "mobileApi" }] as const;
const CLIENTS = { keycloak: [1.5, 0.3], mobileBank: [0, 1.8], marketplace: [1, 1.8], webLaptop: [2, 1.8], credit: [3, 1.8] } as const;
const CLIENT_EDGES = [{ from: "keycloak", to: "mobileBank" }, { from: "keycloak", to: "marketplace" }, { from: "keycloak", to: "webLaptop" }, { from: "keycloak", to: "credit" }] as const;
const ISSUE = { keycloak: [0, 1], token: [1.5, 1], marketplace: [3, 1] } as const;
const ISSUE_EDGES = [{ from: "keycloak", to: "token" }, { from: "token", to: "marketplace" }] as const;
const NAMES = { token: "aud + azp: marketplace" };
const RULE = { token: [0, 1], mobileApi: [2.5, 0.3], marketApi: [2.5, 1.7] } as const;
const DOOR = { edge: [0, 1], guard: [1.5, 1], platform: [3, 1] } as const;
const DOOR_EDGES = [{ from: "edge", to: "guard" }, { from: "guard", to: "platform" }] as const;
const FAKE = { caller: [0, 1], guard: [1.5, 1], platform: [3, 1] } as const;
const FAKE_EDGES = [{ from: "caller", to: "guard" }, { from: "guard", to: "platform" }] as const;
const DEEP = { platform: [0.5, 1], stores: [2.5, 1] } as const;
const MEASURED = { debugLog: [0, 0.6], logReader: [1.5, 0.6], marketApi: [3, 0.6], trusted: [1.5, 1.9] } as const;
const MEASURED_EDGES = [{ from: "debugLog", to: "logReader" }, { from: "logReader", to: "marketApi" }] as const;
const NEW = { keycloak: [1.5, 0.3], mobileBank: [0, 1.8], marketplace: [1, 1.8], credit: [2, 1.8], newApp: [3, 1.8] } as const;
const NEW_EDGES = [{ from: "keycloak", to: "mobileBank" }, { from: "keycloak", to: "marketplace" }, { from: "keycloak", to: "credit" }, { from: "keycloak", to: "newApp" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The leak.
  { cue: 0, layout: { marketplace: [0.5, 1], debugLog: [2.5, 1] }, edges: [{ from: "marketplace", to: "debugLog" }], accent: ["debugLog"] },
  { cue: 1, layout: { marketplace: [0.5, 1], debugLog: [2.5, 1] }, edges: [{ from: "marketplace", to: "debugLog" }], packets: [{ from: "marketplace", to: "debugLog", label: "tokens" }], badges: { debugLog: "two days" } },
  { cue: 2, layout: LEAK, edges: [...LEAK_EDGES], danger: ["logReader"], packets: [{ from: "logReader", to: "mobileApi", label: "Aziz's token" }] },
  { cue: 3, layout: LEAK, edges: [...LEAK_EDGES], danger: ["logReader"], badges: { logReader: "real · signed · fresh" } },
  { cue: 4, layout: LEAK, edges: [...LEAK_EDGES], danger: ["logReader"], packets: [{ from: "logReader", to: "mobileApi", label: "move money", stopAt: 0.6 }], badges: { mobileApi: "refused: why?" } },
  // Realm and clients.
  { cue: 7, layout: { keycloak: [1.5, 1] }, frames: [realm([1.5, 1], [1.5, 1])], accent: ["keycloak"] },
  { cue: 9, layout: { keycloak: [1.5, 1] }, frames: [realm([1.5, 1], [1.5, 1])], badges: { keycloak: "one bank, one realm" } },
  { cue: 10, layout: CLIENTS, frames: [realm([0, 0.3], [3, 1.8])], edges: [...CLIENT_EDGES], accent: ["mobileBank", "marketplace", "webLaptop", "credit"], badges: { mobileBank: "client", marketplace: "client", webLaptop: "client", credit: "client" } },
  // The two names.
  { cue: 11, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["token"], packets: [{ from: "keycloak", to: "token", label: "issue" }] },
  { cue: 12, layout: ISSUE, edges: [...ISSUE_EDGES], badges: { token: "aud: marketplace" } },
  { cue: 13, layout: ISSUE, edges: [...ISSUE_EDGES], badges: NAMES },
  { cue: 14, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["token"], badges: { token: "one app, two times" } },
  { cue: 15, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["token"], badges: { token: "signed: marketplace only" } },
  // The rule at each backend.
  { cue: 17, layout: RULE, edges: [{ from: "token", to: "mobileApi" }, { from: "token", to: "marketApi" }], badges: NAMES },
  { cue: 18, layout: RULE, edges: [{ from: "token", to: "mobileApi", broken: true }, { from: "token", to: "marketApi" }], danger: ["mobileApi"], packets: [{ from: "token", to: "mobileApi", label: "marketplace", stopAt: 0.6 }], badges: NAMES },
  { cue: 19, layout: RULE, edges: [{ from: "token", to: "mobileApi", broken: true }, { from: "token", to: "marketApi" }], badges: { mobileApi: "E-APP-02: log in again" } },
  { cue: 20, layout: RULE, edges: [{ from: "token", to: "mobileApi", broken: true }, { from: "token", to: "marketApi" }], accent: ["marketApi"], badges: { marketApi: "only here ✓" } },
  // heeyID's own door: the request guard.
  { cue: 21, layout: DOOR, edges: [...DOOR_EDGES], accent: ["guard"] },
  { cue: 22, layout: DOOR, edges: [...DOOR_EDGES], packets: [{ from: "edge", to: "guard", label: "token" }], badges: { guard: "first" } },
  { cue: 23, layout: DOOR, edges: [...DOOR_EDGES], badges: { guard: "aud · azp ✓" } },
  { cue: 24, layout: DOOR, edges: [...DOOR_EDGES], packets: [{ from: "guard", to: "platform", label: "request" }], badges: { guard: "device binding ✓" } },
  { cue: 25, layout: FAKE, edges: [...FAKE_EDGES], danger: ["caller"], packets: [{ from: "caller", to: "guard", label: "header: mobile bank", stopAt: 0.7 }] },
  { cue: 26, layout: FAKE, edges: [...FAKE_EDGES], danger: ["caller"], badges: { caller: "anyone can write it" } },
  { cue: 27, layout: FAKE, edges: [...FAKE_EDGES], accent: ["guard"], badges: { caller: "wants to be", guard: "signed: is" } },
  { cue: 28, layout: DOOR, edges: [...DOOR_EDGES], badges: { guard: "app = verified token" } },
  { cue: 29, layout: { mobileBank: [0, 1], guard: [1.5, 1], apps: [3, 1] }, edges: [{ from: "mobileBank", to: "guard" }, { from: "guard", to: "apps" }], badges: { mobileBank: "no token yet" } },
  { cue: 30, layout: { mobileBank: [0, 1], guard: [1.5, 1], apps: [3, 1] }, edges: [{ from: "mobileBank", to: "guard" }, { from: "guard", to: "apps" }], accent: ["apps"], packets: [{ from: "mobileBank", to: "guard", label: "app id of the build" }, { from: "guard", to: "apps", label: "known?", delay: 50 }] },
  // Deeper than the door.
  { cue: 32, layout: DEEP, edges: [{ from: "platform", to: "stores" }], badges: { stores: "each row: its app" } },
  { cue: 33, layout: DEEP, edges: [{ from: "platform", to: "stores" }], accent: ["stores"], packets: [{ from: "platform", to: "stores", label: "query + app filter" }], badges: { platform: "added by the repository" } },
  { cue: 34, layout: DEEP, edges: [{ from: "platform", to: "stores" }], badges: { platform: "a bug cannot cross" } },
  { cue: 35, layout: DEEP, edges: [{ from: "platform", to: "stores" }], badges: { stores: "cache · events: app" } },
  { cue: 36, layout: { marketplace: [0, 1], platform: [1.5, 1], mobileBank: [3, 1] }, edges: [{ from: "marketplace", to: "platform" }, { from: "platform", to: "mobileBank" }], packets: [{ from: "marketplace", to: "platform", label: "address?" }, { from: "platform", to: "mobileBank", label: "share?", delay: 50 }], badges: { mobileBank: "Aziz answers" } },
  // The leak, measured.
  { cue: 37, layout: MEASURED, edges: [...MEASURED_EDGES], danger: ["logReader"] },
  { cue: 39, layout: MEASURED, edges: [...MEASURED_EDGES], danger: ["logReader"], packets: [{ from: "logReader", to: "marketApi", label: "token" }], badges: { marketApi: "marketplace only" } },
  { cue: 40, layout: MEASURED, edges: [...MEASURED_EDGES], badges: { marketApi: "marketplace only", logReader: "short, configured life" } },
  { cue: 41, layout: MEASURED, edges: [...MEASURED_EDGES], badges: { marketApi: "marketplace only", logReader: "refresh: rotated, reuse found" } },
  { cue: 42, layout: MEASURED, edges: [...MEASURED_EDGES, { from: "marketApi", to: "trusted", label: "bound" }], accent: ["trusted"], badges: { trusted: "Aziz's device" } },
  { cue: 43, layout: MEASURED, edges: [...MEASURED_EDGES, { from: "marketApi", to: "trusted", label: "bound" }], badges: { marketApi: "an incident", logReader: "no way to money" } },
  // Proof at each release.
  { cue: 45, layout: { tests: [0.5, 1], mobileApi: [2.5, 1] }, edges: [{ from: "tests", to: "mobileApi" }], accent: ["tests"], packets: [{ from: "tests", to: "mobileApi", label: "marketplace token" }], badges: { mobileApi: "E-APP-02 ✓" } },
  { cue: 46, layout: { tests: [0.5, 1], mobileApi: [2.5, 1] }, edges: [{ from: "tests", to: "mobileApi" }], danger: ["tests"], badges: { tests: "check missing: release stops" } },
  // New apps: one more client, each with its own level.
  { cue: 48, layout: NEW, frames: [realm([0, 0.3], [3, 1.8])], edges: [...NEW_EDGES], accent: ["newApp"], badges: { newApp: "+ one row" } },
  { cue: 49, layout: NEW, frames: [realm([0, 0.3], [3, 1.8])], edges: [...NEW_EDGES], badges: { mobileBank: "own level", marketplace: "own level", credit: "own level", newApp: "own level" } },
  { cue: 50, layout: NEW, frames: [realm([0, 0.3], [3, 1.8])], edges: [...NEW_EDGES], accent: ["credit"], badges: { credit: "level 2", newApp: "level 1" } },
  // Recap.
  { cue: 51, layout: CLIENTS, frames: [realm([0, 0.3], [3, 1.8])], edges: [...CLIENT_EDGES], accent: ["keycloak"] },
  { cue: 52, layout: ISSUE, edges: [...ISSUE_EDGES], accent: ["token"], badges: NAMES },
  { cue: 53, layout: DOOR, edges: [...DOOR_EDGES], accent: ["guard"], badges: { guard: "door + every query" } },
  { cue: 54, layout: MEASURED, edges: [...MEASURED_EDGES], accent: ["marketApi"], badges: { marketApi: "stays here" } },
];
