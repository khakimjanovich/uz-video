import { BuildMapStep, DiagramFrame, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 22: installing heeyID in a bank, the last lesson. A new bank, two empty hosts, the bridge (0–4); one host and
// the Compose stack (5–9); OpenTofu, Vault and the install script (10–14); the unseal keys (15–17); the go-live check
// (18–22); stage, the test identity, the two zones and their guards (23–35); the laptop (36–39); the done list (40–48);
// the check (49–51); Aziz's journey once more (52–60); the close and the next module (61–62).
const ALL: HeeyMapId[] = ["customer", "mobile", "staff", "edge", "custgw", "keycloak", "admingw", "workers", "postgres", "valkey", "kafka", "vault", "adapters", "taf", "sms", "myid", "push", "perimeter"];
const SIX = [1, 2, 3, 4, 5, 6];

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 3, part: 6, rows: [2, 6], current: ["vault", "kafka"], dot: "off", units: { heeyid: "lesson 4: configuration · lesson 21: audit" } },
  { cue: 4, part: 6, rows: SIX, current: ALL, dot: "off", units: { heeyid: "install it" } },
  { cue: 8, part: 6, rows: SIX, current: ["edge", "custgw", "keycloak", "admingw", "workers", "adapters"], dot: "off", units: { heeyid: "in front" } },
  { cue: 9, part: 6, rows: SIX, current: ["postgres", "valkey", "kafka", "vault"], dot: "off", units: { heeyid: "new for this zone" } },
  { cue: 15, part: 6, rows: [2], current: ["vault"], dot: "vault", units: { heeyid: "sealed · unseal keys" } },
  { cue: 18, part: 6, rows: SIX, current: ["mobile", "edge", "custgw"], dot: "custgw", units: { heeyid: "one active app" } },
  { cue: 23, part: 6, rows: [6], current: ["perimeter", "myid"], dot: "myid", units: { heeyid: "stage: MyID test" } },
  { cue: 31, part: 6, rows: [6], current: ["perimeter"], dot: "off", units: { heeyid: "no route between the zones" } },
  { cue: 36, part: 6, rows: [2], current: ["adapters", "taf", "sms", "myid", "push"], dot: "adapters", units: { heeyid: "simulators: lesson 5" } },
  // Aziz's journey once more, module by module.
  { cue: 52, part: 6, rows: SIX, built: ALL, dot: "customer", units: { heeyid: "the journey" } },
  { cue: 53, part: 3, rows: [3], current: ["customer", "mobile", "custgw", "taf"], dot: "taf", units: { heeyid: "level 1" } },
  { cue: 54, part: 4, rows: [4], current: ["customer", "mobile"], dot: "mobile", units: { heeyid: "money to his mother" } },
  { cue: 55, part: 4, rows: [4], current: ["mobile", "custgw", "myid", "taf"], dot: "myid", units: { heeyid: "level 2" } },
  { cue: 56, part: 5, rows: [5], current: ["mobile", "custgw"], dot: "mobile", units: { heeyid: "the money phone" } },
  { cue: 57, part: 5, rows: [5], current: ["mobile", "custgw", "keycloak"], dot: "keycloak", units: { heeyid: "same phone" } },
  { cue: 58, part: 6, rows: [6], current: ["staff", "admingw"], dot: "admingw", units: { heeyid: "block · unblock" } },
  { cue: 59, part: 6, rows: [6], current: ["workers", "kafka", "postgres"], dot: "kafka", units: { heeyid: "the audit" } },
  { cue: 60, part: 6, rows: SIX, current: ALL, dot: "off", units: { heeyid: "one installation, one bank" } },
];

const ZONE_FRAMES: DiagramFrame[] = [
  { label: "Test zone", from: [0.5, 0.4], to: [0.5, 1.6] },
  { label: "Production zone", from: [2.5, 0.4], to: [2.5, 1.6], tone: "wall" },
];
const EMPTY = { stage: [0.5, 1], production: [2.5, 1] } as const;
const UNITS = { stack: [0, 1], keycloak: [1.3, 0], platform: [1.3, 0.67], workers: [1.3, 1.33], adapter: [1.3, 2], postgres: [2.7, 0], valkey: [2.7, 0.67], kafka: [2.7, 1.33], vault: [2.7, 2] } as const;
const UNITS_FRONT = [{ from: "stack", to: "keycloak" }, { from: "stack", to: "platform" }, { from: "stack", to: "workers" }, { from: "stack", to: "adapter" }] as const;
const UNITS_EDGES = [...UNITS_FRONT, { from: "platform", to: "postgres" }, { from: "platform", to: "valkey" }, { from: "platform", to: "kafka" }, { from: "platform", to: "vault" }] as const;
const UNITS_BADGES = { platform: "two gateways", adapter: "MyID · TAF · SMS · push" };
const CONFIG = { tofu: [0, 1], vault: [1.5, 1], stack: [3, 1] } as const;
const CONFIG_EDGES = [{ from: "tofu", to: "vault" }, { from: "vault", to: "stack" }] as const;
const SEAL = { platformTeam: [0, 0.4], stack: [2, 0.4], securityTeam: [0, 1.6], vault: [2, 1.6] } as const;
const SEAL_EDGES = [{ from: "platformTeam", to: "stack" }, { from: "securityTeam", to: "vault" }] as const;
const GATE = { stack: [0, 1], goLive: [1.5, 1], mobileBank: [3, 1] } as const;
const GATE_EDGES = [{ from: "stack", to: "goLive" }, { from: "goLive", to: "mobileBank" }] as const;
const TEST = { aziz: [0, 1], testId: [1.5, 1], myidTest: [3, 1] } as const;
const TEST_EDGES = [{ from: "aziz", to: "testId" }, { from: "testId", to: "myidTest" }] as const;
const ZONES = { stage: [0.5, 0.4], myidTest: [0.5, 1.6], production: [2.5, 0.4], myid: [2.5, 1.6] } as const;
const ZONES_EDGES = [{ from: "stage", to: "myidTest" }, { from: "production", to: "myid" }] as const;
const LAPTOP = { compose: [0, 1], stack: [1.5, 1], simulators: [3, 1] } as const;
const LAPTOP_EDGES = [{ from: "compose", to: "stack" }, { from: "stack", to: "simulators" }] as const;
const DONE = { doneList: [1.5, 1] } as const;
const CHECK = { testId: [0.5, 1], production: [2.5, 1] } as const;
const CHECK_FRAMES: DiagramFrame[] = [{ label: "Production zone", from: [2.5, 1], to: [2.5, 1], tone: "wall" }];
const ROAD = { aziz: [0, 1], mobileBank: [1.5, 1], platform: [3, 1] } as const;
const ROAD_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }] as const;
const MONEY = { aziz: [0, 1], trusted: [1.5, 1], platform: [3, 1] } as const;
const MONEY_EDGES = [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Monday: a new bank, two empty hosts.
  { cue: 0, layout: { platformTeam: [1.5, 1] }, accent: ["platformTeam"], badges: { platformTeam: "new bank · Monday" } },
  { cue: 1, layout: EMPTY, frames: ZONE_FRAMES, badges: { stage: "empty Linux host", production: "empty Linux host" } },
  { cue: 2, layout: { aziz: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "aziz", to: "platform" }], packets: [{ from: "aziz", to: "platform", label: "first phone number", stopAt: 0.5 }], badges: { platform: "not installed" } },
  { cue: 3, layout: { tofu: [0.5, 1], auditTrail: [2.5, 1] }, badges: { tofu: "lesson 4", auditTrail: "lesson 21" } },
  { cue: 4, layout: { platform: [1.5, 1] }, accent: ["platform"], badges: { platform: "into the bank" } },
  // One host per zone, one Compose stack.
  { cue: 5, layout: { host: [1.5, 1] }, accent: ["host"], badges: { host: "own installation" } },
  { cue: 6, layout: { host: [0.5, 1], stack: [2.5, 1] }, edges: [{ from: "host", to: "stack" }], accent: ["stack"], badges: { stack: "one copy of each image" } },
  { cue: 7, layout: { host: [0.5, 1], stack: [2.5, 1] }, edges: [{ from: "host", to: "stack" }], accent: ["stack"], badges: { stack: "images + Compose" } },
  { cue: 8, layout: UNITS, edges: [...UNITS_FRONT], accent: ["keycloak", "platform", "workers", "adapter"], badges: UNITS_BADGES },
  { cue: 9, layout: UNITS, edges: [...UNITS_EDGES], accent: ["postgres", "valkey", "kafka", "vault"], badges: { ...UNITS_BADGES, postgres: "new for this zone" } },
  // OpenTofu writes into Vault; the install script starts the stack.
  { cue: 10, layout: CONFIG, edges: [...CONFIG_EDGES], accent: ["tofu"], badges: { tofu: "lesson 4" } },
  { cue: 11, layout: CONFIG, edges: [...CONFIG_EDGES], accent: ["tofu"], badges: { tofu: "deploy values · defaults" } },
  { cue: 12, layout: CONFIG, edges: [...CONFIG_EDGES], accent: ["vault"], packets: [{ from: "tofu", to: "vault", label: "settings · secrets" }] },
  { cue: 13, layout: CONFIG, edges: [...CONFIG_EDGES], accent: ["stack"], packets: [{ from: "vault", to: "stack", label: "install script" }], badges: { stack: "started" } },
  { cue: 14, layout: CONFIG, edges: [{ from: "tofu", to: "vault", broken: true }, { from: "vault", to: "stack" }], danger: ["stack"], badges: { stack: "value missing: stop" } },
  // Vault starts sealed; the bank's security team holds the unseal keys.
  { cue: 15, layout: SEAL, edges: [...SEAL_EDGES], danger: ["vault"], badges: { vault: "sealed" } },
  { cue: 16, layout: SEAL, edges: [...SEAL_EDGES], accent: ["securityTeam"], packets: [{ from: "securityTeam", to: "vault", label: "unseal keys" }], badges: { securityTeam: "keeps the unseal keys" } },
  { cue: 17, layout: SEAL, edges: [...SEAL_EDGES], accent: ["stack", "vault"], badges: { stack: "started", vault: "open" } },
  // The go-live check.
  { cue: 18, layout: GATE, edges: [...GATE_EDGES], accent: ["goLive"], badges: { goLive: "customers: not yet" } },
  { cue: 19, layout: GATE, edges: [...GATE_EDGES], accent: ["goLive"], badges: { goLive: "one active app · a level" } },
  { cue: 20, layout: GATE, edges: [...GATE_EDGES], accent: ["mobileBank"], badges: { mobileBank: "active · required level" } },
  { cue: 21, layout: GATE, edges: [...GATE_EDGES], packets: [{ from: "mobileBank", to: "goLive", label: "journey", stopAt: 0.5 }], badges: { goLive: "refused until then" } },
  { cue: 22, layout: { ...GATE, panel: [1.5, 2] }, edges: [...GATE_EDGES, { from: "goLive", to: "panel" }], accent: ["panel"], badges: { panel: "defaults still in use" } },
  // Stage first, and Aziz the test identity.
  { cue: 23, layout: ZONES, edges: [{ from: "stage", to: "myidTest" }], frames: ZONE_FRAMES, accent: ["stage"], badges: { stage: "first" } },
  { cue: 24, layout: TEST, edges: [...TEST_EDGES], accent: ["aziz"], badges: { aziz: "not a real person" } },
  { cue: 25, layout: TEST, edges: [...TEST_EDGES], accent: ["testId"], badges: { aziz: "test team: every day" } },
  { cue: 26, layout: TEST, edges: [...TEST_EDGES], accent: ["myidTest"], badges: { testId: "success · named failure" } },
  { cue: 27, layout: TEST, edges: [...TEST_EDGES], packets: [{ from: "testId", to: "myidTest", label: "acceptance tests" }], badges: { testId: "each night" } },
  // Two zones, no route; the guards of production.
  { cue: 28, layout: ZONES, edges: [...ZONES_EDGES], frames: ZONE_FRAMES, accent: ["stage"], badges: { stage: "test mark" } },
  { cue: 29, layout: ZONES, edges: [...ZONES_EDGES], frames: ZONE_FRAMES, badges: { stage: "not counted: limits · reports" } },
  { cue: 30, layout: ZONES, edges: [...ZONES_EDGES], frames: ZONE_FRAMES, accent: ["production", "myid"], badges: { production: "real people only" } },
  { cue: 31, layout: ZONES, edges: [...ZONES_EDGES, { from: "stage", to: "production", label: "no route", broken: true }], frames: ZONE_FRAMES },
  { cue: 32, layout: { ...ZONES, checker: [1.5, 1] }, edges: [...ZONES_EDGES, { from: "stage", to: "checker" }, { from: "checker", to: "production" }], frames: ZONE_FRAMES, accent: ["checker"], packets: [{ from: "stage", to: "checker", label: "configuration" }], badges: { checker: "second person" } },
  { cue: 33, layout: { ...ZONES, checker: [1.5, 1] }, edges: [...ZONES_EDGES, { from: "stage", to: "checker" }, { from: "checker", to: "production" }], frames: ZONE_FRAMES, badges: { stage: "customers · sessions · audit stay" } },
  { cue: 34, layout: ZONES, edges: [...ZONES_EDGES], frames: ZONE_FRAMES, accent: ["production"], badges: { production: "no test MyID · no test customers" } },
  { cue: 35, layout: { ...ZONES, testId: [1.5, 0.4] }, edges: [...ZONES_EDGES, { from: "testId", to: "production", broken: true }], frames: ZONE_FRAMES, packets: [{ from: "testId", to: "production", label: "test mark", stopAt: 0.6 }], badges: { production: "database refuses" } },
  // The same stack on a laptop.
  { cue: 36, layout: { compose: [1.5, 1] }, accent: ["compose"], badges: { compose: "a developer" } },
  { cue: 37, layout: LAPTOP, edges: [LAPTOP_EDGES[0]], accent: ["stack"], badges: { compose: "one command" } },
  { cue: 38, layout: LAPTOP, edges: [...LAPTOP_EDGES], accent: ["simulators"], badges: { simulators: "MyID · TAF · SMS · push" } },
  { cue: 39, layout: { ...LAPTOP, simulators: [3, 0.4], aziz: [3, 1.6] }, edges: [...LAPTOP_EDGES, { from: "simulators", to: "aziz" }], accent: ["aziz"], badges: { aziz: "never tired" } },
  // The done list, line by line.
  { cue: 40, layout: DONE, accent: ["doneList"], badges: { doneList: "each line checkable" } },
  { cue: 41, layout: DONE, badges: { doneList: "decisions accepted ✓" } },
  { cue: 42, layout: DONE, badges: { doneList: "contracts published ✓" } },
  { cue: 43, layout: DONE, badges: { doneList: "a test per failure path ✓" } },
  { cue: 44, layout: { platform: [0.5, 1], monitoring: [2.5, 1] }, edges: [{ from: "platform", to: "monitoring" }], packets: [{ from: "platform", to: "monitoring", label: "audit events" }], badges: { monitoring: "a stand-in reads ✓" } },
  { cue: 45, layout: DONE, badges: { doneList: "security review · penetration test ✓" } },
  { cue: 46, layout: DONE, badges: { doneList: "guides ✓" } },
  { cue: 47, layout: { tests: [0.5, 1], simulators: [2.5, 0.4], myidTest: [2.5, 1.6] }, edges: [{ from: "tests", to: "simulators" }, { from: "tests", to: "myidTest" }], accent: ["tests"], badges: { tests: "pass in stage ✓" } },
  { cue: 48, layout: { trusted: [0.5, 1], myidTest: [2.5, 1] }, edges: [{ from: "trusted", to: "myidTest" }], accent: ["trusted"], badges: { trusted: "real phones · sign-off ✓" } },
  // The check: a test identity tries production.
  { cue: 49, layout: CHECK, edges: [{ from: "testId", to: "production" }], frames: CHECK_FRAMES, packets: [{ from: "testId", to: "production", label: "test identity" }] },
  { cue: 50, layout: CHECK, edges: [{ from: "testId", to: "production" }], frames: CHECK_FRAMES, badges: { production: "what happens?" } },
  { cue: 51, layout: CHECK, edges: [{ from: "testId", to: "production", broken: true }], frames: CHECK_FRAMES, crossed: ["testId"], packets: [{ from: "testId", to: "production", label: "test mark", stopAt: 0.5 }], badges: { production: "real MyID · test mark refused" } },
  // Aziz's journey once more.
  { cue: 52, layout: ROAD, edges: [...ROAD_EDGES], accent: ["aziz"] },
  { cue: 53, layout: ROAD, edges: [...ROAD_EDGES], accent: ["aziz"], badges: { mobileBank: "code via TAF · password", aziz: "level 1" } },
  { cue: 54, layout: ROAD, edges: [...ROAD_EDGES], badges: { aziz: "level 1", mobileBank: "money to his mother" } },
  { cue: 55, layout: ROAD, edges: [...ROAD_EDGES], accent: ["aziz"], badges: { platform: "consent · MyID · TAF", aziz: "level 2" } },
  { cue: 56, layout: MONEY, edges: [...MONEY_EDGES], accent: ["trusted"], badges: { trusted: "money phone", aziz: "level 2" } },
  { cue: 57, layout: MONEY, edges: [...MONEY_EDGES], packets: [{ from: "trusted", to: "platform", label: "password · code" }], badges: { trusted: "same phone" } },
  { cue: 58, layout: { ...MONEY, caseOperator: [3, 0.2] }, edges: [...MONEY_EDGES, { from: "caseOperator", to: "platform" }], accent: ["caseOperator"], badges: { trusted: "blocked · unblocked", caseOperator: "one blocks · a second approves" } },
  { cue: 59, layout: { ...MONEY, auditTrail: [3, 0.2] }, edges: [...MONEY_EDGES, { from: "platform", to: "auditTrail" }], accent: ["auditTrail"], badges: { auditTrail: "his letter answered" } },
  { cue: 60, layout: MONEY, edges: [...MONEY_EDGES], accent: ["platform"], badges: { platform: "one bank · one host per zone" } },
  // The close: prove once, then bind; the next module adds a new phone.
  { cue: 61, layout: MONEY, edges: [...MONEY_EDGES], accent: ["trusted"], badges: { aziz: "prove once", trusted: "then bind" } },
  { cue: 62, layout: { ...MONEY, newPhone: [1.5, 2] }, edges: [...MONEY_EDGES], accent: ["newPhone"], badges: { newPhone: "next module" } },
];
