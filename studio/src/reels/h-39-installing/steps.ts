import { BuildMapStep, DiagramFrame, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 39: installing heeyID, and the course recap. A new bank (0–6); the configuration (7–10); the units
// (11–16); the go-live gate and the two zones (17–21); Compose on a laptop (22–25); the definition of done
// (26–34); the road with Aziz (35–45). No open question: this is the last lesson.
const UNIT = { heeyid: "in the bank" };
const ALL: HeeyMapId[] = ["customer", "mobile", "sideapps", "staff", "edge", "custgw", "keycloak", "admingw", "workers", "postgres", "valkey", "kafka", "vault", "adapters", "taf", "sms", "lookup", "myid", "push", "perimeter"];

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 3, part: 9, rows: [2, 9], current: ["perimeter", "myid"], dot: "off", units: { heeyid: "lesson 6: OpenTofu · lesson 38: two zones" } },
  { cue: 4, part: 9, rows: [1, 2, 3, 4, 5, 6, 7, 8, 9], current: ALL, dot: "off", units: { heeyid: "install it" } },
  { cue: 5, part: 9, rows: [9], current: ["perimeter"], dot: "off", units: { heeyid: "one installation, one bank" } },
  { cue: 6, part: 9, rows: [9], current: ["perimeter", "myid", "push"], dot: "off", units: { heeyid: "no call to the vendor" } },
  // The road, module by module.
  { cue: 35, part: 9, rows: [1, 2, 3, 4, 5, 6, 7, 8, 9], built: ALL, dot: "customer", units: UNIT },
  { cue: 36, part: 3, rows: [3], current: ["customer", "mobile", "custgw", "taf"], dot: "taf", units: { heeyid: "level 1" } },
  { cue: 37, part: 4, rows: [4], current: ["mobile", "myid"], dot: "myid", units: { heeyid: "level 2, once" } },
  { cue: 38, part: 4, rows: [4, 5], current: ["lookup", "postgres", "mobile"], dot: "lookup", units: { heeyid: "linked · trusted device" } },
  { cue: 39, part: 6, rows: [6], current: ["sideapps", "mobile"], dot: "sideapps", units: { heeyid: "approval, not a face" } },
  { cue: 40, part: 7, rows: [5, 7], current: ["mobile", "taf", "valkey"], dot: "mobile", units: { heeyid: "rank · This was not me" } },
  { cue: 41, part: 8, rows: [8], current: ["workers", "kafka", "postgres", "vault"], dot: "kafka", units: { heeyid: "refresh · block · messages · chain" } },
  { cue: 42, part: 9, rows: [9], current: ["staff", "admingw", "perimeter"], dot: "admingw", units: { heeyid: "roles · two people · two zones" } },
  { cue: 43, part: 9, rows: [1, 2, 3, 4, 5, 6, 7, 8, 9], current: ALL, dot: "off", units: { heeyid: "one installation, one bank" } },
];

const CONFIG = { tofu: [0, 1], platform: [1.5, 1], versions: [3, 1] } as const;
const CONFIG_EDGES = [{ from: "tofu", to: "platform" }, { from: "platform", to: "versions" }] as const;
const UNITS = { helm: [0, 1], keycloak: [1.3, 0.2], platform: [1.3, 1], workers: [1.3, 1.8], postgres: [2.7, 0], valkey: [2.7, 0.67], kafka: [2.7, 1.33], vault: [2.7, 2] } as const;
const UNITS_EDGES = [{ from: "helm", to: "keycloak" }, { from: "helm", to: "platform" }, { from: "helm", to: "workers" }, { from: "platform", to: "postgres" }, { from: "platform", to: "valkey" }, { from: "platform", to: "kafka" }, { from: "platform", to: "vault" }] as const;
const GATE = { platform: [0, 1], goLive: [1.5, 1], mobileBank: [3, 1] } as const;
const GATE_EDGES = [{ from: "platform", to: "goLive" }, { from: "goLive", to: "mobileBank" }] as const;
const ZONES = { stage: [0.5, 0.4], myidTest: [0.5, 1.6], production: [2.5, 0.4], myid: [2.5, 1.6] } as const;
const ZONE_FRAMES: DiagramFrame[] = [
  { label: "Test zone", from: [0.5, 0.4], to: [0.5, 1.6] },
  { label: "Production zone", from: [2.5, 0.4], to: [2.5, 1.6], tone: "wall" },
];
const LAPTOP = { compose: [0, 1], postgres: [1.5, 0.2], kafka: [1.5, 1], keycloak: [1.5, 1.8], simulators: [3, 1] } as const;
const LAPTOP_EDGES = [{ from: "compose", to: "postgres" }, { from: "compose", to: "kafka" }, { from: "compose", to: "keycloak" }, { from: "compose", to: "simulators" }] as const;
const DONE = { goLive: [1.5, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Monday: a new bank, two empty clusters.
  { cue: 0, layout: { platform: [1.5, 1] }, accent: ["platform"], badges: { platform: "new bank" } },
  { cue: 1, layout: { cluster: [0.5, 1], production: [2.5, 1] }, badges: { cluster: "test zone", production: "production zone" } },
  { cue: 2, layout: { aziz: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "aziz", to: "platform", label: "first phone number" }] },
  // The configuration: OpenTofu, version zero, no default in the code.
  { cue: 7, layout: CONFIG, edges: [...CONFIG_EDGES], accent: ["tofu"] },
  { cue: 8, layout: CONFIG, edges: [...CONFIG_EDGES], accent: ["tofu"], badges: { tofu: "deploy values · policy defaults · texts" } },
  { cue: 9, layout: CONFIG, edges: [...CONFIG_EDGES], accent: ["versions"], packets: [{ from: "platform", to: "versions", label: "version 0" }], badges: { versions: "product default" } },
  { cue: 10, layout: CONFIG, edges: [{ from: "tofu", to: "platform", broken: true }, { from: "platform", to: "versions" }], danger: ["platform"], badges: { platform: "value missing: stop" } },
  // The units.
  { cue: 12, layout: { helm: [1.5, 1] }, accent: ["helm"], badges: { helm: "images + chart" } },
  { cue: 13, layout: UNITS, edges: [...UNITS_EDGES.slice(0, 3)], accent: ["keycloak", "platform", "workers"], badges: { platform: "gateways · adapters" } },
  { cue: 14, layout: UNITS, edges: [...UNITS_EDGES], accent: ["postgres", "valkey", "kafka", "vault"], badges: { kafka: "new for this zone" } },
  { cue: 15, layout: UNITS, edges: [...UNITS_EDGES], accent: ["vault"], badges: { vault: "bank security: unseal keys" } },
  { cue: 16, layout: UNITS, edges: [...UNITS_EDGES], accent: ["keycloak"], badges: { keycloak: "one realm · a client per app" } },
  // The gate, and stage before production.
  { cue: 17, layout: GATE, edges: [...GATE_EDGES], accent: ["goLive"] },
  { cue: 18, layout: GATE, edges: [...GATE_EDGES], badges: { mobileBank: "active · required level" } },
  { cue: 19, layout: GATE, edges: [...GATE_EDGES], badges: { goLive: "defaults still in use" } },
  { cue: 20, layout: ZONES, edges: [{ from: "stage", to: "myidTest" }], frames: ZONE_FRAMES, accent: ["stage"] },
  { cue: 21, layout: { ...ZONES, helm: [1.5, 0.4] }, edges: [{ from: "stage", to: "myidTest" }, { from: "stage", to: "helm" }, { from: "helm", to: "production" }, { from: "production", to: "myid" }], frames: ZONE_FRAMES, accent: ["production"], badges: { helm: "second person approves" } },
  // Compose on a laptop.
  { cue: 22, layout: { compose: [1.5, 1] }, accent: ["compose"] },
  { cue: 23, layout: LAPTOP, edges: [...LAPTOP_EDGES.slice(0, 3)], badges: { keycloak: "a client per app" } },
  { cue: 24, layout: LAPTOP, edges: [...LAPTOP_EDGES], accent: ["simulators"], badges: { postgres: "seed: default catalogue" } },
  { cue: 25, layout: LAPTOP, edges: [...LAPTOP_EDGES], badges: { compose: "acceptance · no internet" } },
  // The definition of done, line by line.
  { cue: 26, layout: DONE, accent: ["goLive"], badges: { goLive: "done?" } },
  { cue: 27, layout: DONE, badges: { goLive: "each line checkable" } },
  { cue: 28, layout: DONE, badges: { goLive: "decisions accepted ✓" } },
  { cue: 29, layout: DONE, badges: { goLive: "API contracts ✓" } },
  { cue: 30, layout: DONE, badges: { goLive: "failure paths · app separation ✓" } },
  { cue: 31, layout: { platform: [0.5, 1], monitoring: [2.5, 1] }, edges: [{ from: "platform", to: "monitoring" }], packets: [{ from: "platform", to: "monitoring", label: "audit events" }], badges: { monitoring: "simulator reads ✓" } },
  { cue: 32, layout: DONE, badges: { goLive: "security review · penetration test ✓" } },
  { cue: 33, layout: DONE, badges: { goLive: "guide · runbooks · decisions ✓" } },
  { cue: 34, layout: { trusted: [0.5, 1], myidTest: [2.5, 1] }, edges: [{ from: "trusted", to: "myidTest" }], accent: ["trusted"], badges: { trusted: "real phones · sign-off ✓" } },
  // The last two sentences: the course in one line.
  { cue: 44, layout: { aziz: [0, 1], trusted: [1.5, 1], platform: [3, 1] }, edges: [{ from: "aziz", to: "trusted" }, { from: "trusted", to: "platform" }], accent: ["trusted"], badges: { aziz: "prove once", trusted: "then bind" } },
];
