import { BuildMapStep, DiagramFrame, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 3: the perimeter. The dark office and the bridge (0–6); inside the bank, no vendor (7–15); the egress
// proxy and the three outside names, TAF inside (16–30); three networks (31–36); two zones (37–46);
// eight o'clock again (47–50); the check (51–52); the summary and the way to configuration (53–58).
const INSIDE: HeeyMapId[] = ["edge", "custgw", "keycloak", "admingw", "workers", "postgres", "valkey", "kafka", "vault", "adapters"];
const STORES: HeeyMapId[] = ["postgres", "valkey", "kafka", "vault"];
const OUTSIDE: HeeyMapId[] = ["myid", "sms", "push"];
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 2, current: ["customer", "mobile"], units: UNIT },
  { cue: 5, part: 2, rows: [2], current: ["perimeter"], units: UNIT },
  { cue: 7, part: 2, current: ["perimeter"], units: UNIT },
  { cue: 8, part: 2, current: ["perimeter", ...INSIDE], units: { heeyid: "the bank runs it" } },
  // The edge: one gate out, three names.
  { cue: 16, part: 2, current: ["perimeter", "edge"], units: UNIT },
  { cue: 19, part: 2, current: ["edge", ...OUTSIDE], units: UNIT },
  { cue: 20, part: 2, current: ["adapters", "myid"], units: { heeyid: "1 · MyID, outside" } },
  { cue: 21, part: 2, current: ["adapters", "myid", "vault"], units: { heeyid: "credential from Vault" } },
  { cue: 22, part: 2, current: ["adapters", "sms"], units: { heeyid: "2 · SMS vendor, outside" } },
  { cue: 23, part: 2, current: ["edge", "adapters", "sms"], units: { heeyid: "delivery reports come in" } },
  { cue: 24, part: 2, current: ["adapters", "push"], units: { heeyid: "3 · push service, outside" } },
  { cue: 27, part: 2, current: ["adapters", "taf"], units: UNIT },
  { cue: 28, part: 2, current: ["adapters", "taf"], units: { heeyid: "TAF agent: inside the bank" } },
  // Three networks inside.
  { cue: 31, part: 2, current: ["perimeter"], units: UNIT },
  { cue: 32, part: 2, current: ["edge"], units: UNIT },
  { cue: 33, part: 2, current: ["custgw", "keycloak", "admingw", "workers", "adapters"], units: UNIT },
  { cue: 34, part: 2, current: STORES, units: UNIT },
  // Eight o'clock again.
  { cue: 47, part: 2, current: ["customer", "mobile"], dot: "mobile", units: UNIT },
  { cue: 48, part: 2, current: ["mobile", "edge", "custgw", "postgres", "valkey"], dot: "custgw", units: UNIT },
  { cue: 49, part: 2, current: ["adapters", "taf"], dot: "taf", units: { heeyid: "TAF agent: inside the bank" } },
  // The summary.
  { cue: 53, part: 2, current: ["perimeter", ...INSIDE], units: { heeyid: "one installation, one bank" } },
];

const wall = (from: readonly [number, number], to: readonly [number, number], label = "the bank's perimeter"): DiagramFrame => ({ label, from, to, tone: "wall" });
const DARK = { vendor: [0, 0.4], aziz: [1.2, 1.6], mobileBank: [2.8, 1.6] } as const;
const ALONE = { platform: [1, 1], vendor: [3, 1] } as const;
const ALONE_WALL = [wall([1, 1], [1, 1])];
const OUT = { platform: [0, 1], egress: [1.3, 0.5], edge: [1.3, 1.6], myid: [3, 0.1], smsVendor: [3, 1], push: [3, 1.9] } as const;
const OUT_WALL = [wall([0, 0.5], [1.3, 1.6])];
const OUT_EDGES = [{ from: "platform", to: "egress" }, { from: "egress", to: "myid" }, { from: "egress", to: "smsVendor" }, { from: "egress", to: "push" }] as const;
const PUSH = { platform: [0, 1.4], push: [1.5, 0.5], trusted: [3, 1.4] } as const;
const PUSH_EDGES = [{ from: "platform", to: "push" }, { from: "push", to: "trusted" }] as const;
const PUSH_WALL = [wall([0, 1.4], [0, 1.4])];
const ZONES = { edge: [0, 1.4], platform: [1.5, 0.5], stores: [3, 1.4] } as const;
const ZONES_WALL = [wall([0, 0.5], [3, 1.4], "installation")];
const TWO = { stage: [0.5, 0.5], production: [2.5, 0.5], myidTest: [0.5, 1.8], myid: [2.5, 1.8] } as const;
const TWO_EDGES = [{ from: "stage", to: "myidTest" }, { from: "production", to: "myid" }] as const;
const TWO_FRAMES = [wall([0.5, 0.5], [0.5, 0.5], "test zone"), wall([2.5, 0.5], [2.5, 0.5], "production zone")];
const HOSTS = { stage: "one host · Compose", production: "one host · Compose" };
const START = { config: [0.5, 1], platform: [2.5, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The dark office.
  { cue: 0, layout: { vendor: [1.5, 1] }, accent: ["vendor"] },
  { cue: 1, layout: { vendor: [1.5, 1] }, crossed: ["vendor"], badges: { vendor: "closed" } },
  { cue: 2, layout: DARK, edges: [{ from: "aziz", to: "mobileBank" }], crossed: ["vendor"], packets: [{ from: "aziz", to: "mobileBank", label: "log in" }] },
  { cue: 3, layout: DARK, edges: [{ from: "aziz", to: "mobileBank" }], crossed: ["vendor"], badges: { mobileBank: "works?" } },
  { cue: 6, layout: ALONE, frames: ALONE_WALL, crossed: ["vendor"], accent: ["platform"], badges: { platform: "works ✓" } },
  // One bank, one installation; a second bank, a second installation.
  { cue: 9, layout: { platform: [1.5, 1] }, frames: [wall([1.5, 1], [1.5, 1])], accent: ["platform"], badges: { platform: "one installation" } },
  { cue: 10, layout: { platform: [0.7, 1], platform2: [2.3, 1] }, frames: [wall([0.7, 1], [0.7, 1], "first bank"), wall([2.3, 1], [2.3, 1], "second bank")], accent: ["platform2"] },
  // No call to the vendor.
  { cue: 11, layout: ALONE, frames: ALONE_WALL, edges: [{ from: "platform", to: "vendor", broken: true }], crossed: ["vendor"] },
  { cue: 12, layout: ALONE, frames: ALONE_WALL, edges: [{ from: "platform", to: "vendor", broken: true }], crossed: ["vendor"], badges: { vendor: "no switch · no data" } },
  { cue: 13, layout: ALONE, frames: ALONE_WALL, crossed: ["vendor"], accent: ["platform"], badges: { platform: "works alone" } },
  { cue: 15, layout: ALONE, frames: [wall([1, 1], [1, 1], "Republic of Uzbekistan")], crossed: ["vendor"], badges: { platform: "personal data stays" } },
  // One gate out, three names outside.
  { cue: 17, layout: { platform: [0, 1], egress: [1.3, 0.5], edge: [1.3, 1.6] }, frames: OUT_WALL, edges: [{ from: "platform", to: "egress" }], accent: ["egress"], packets: [{ from: "platform", to: "egress", label: "call out" }] },
  { cue: 18, layout: { platform: [0, 1], egress: [1.3, 0.5], edge: [1.3, 1.6] }, frames: OUT_WALL, edges: [{ from: "platform", to: "egress" }], badges: { egress: "host names from configuration" } },
  { cue: 25, layout: PUSH, frames: PUSH_WALL, edges: [...PUSH_EDGES], accent: ["push"], packets: [{ from: "platform", to: "trusted", label: "type + ref" }], badges: { push: "no personal data" } },
  { cue: 26, layout: PUSH, frames: PUSH_WALL, edges: [...PUSH_EDGES, { from: "trusted", to: "platform", label: "own session" }], accent: ["trusted"], packets: [{ from: "trusted", to: "platform", label: "get text" }] },
  // Three names, one gate.
  { cue: 30, layout: OUT, frames: OUT_WALL, edges: [...OUT_EDGES], accent: ["egress"], badges: { egress: "three names" } },
  // Three networks: the data network takes nothing from the edge.
  { cue: 35, layout: ZONES, frames: ZONES_WALL, edges: [{ from: "edge", to: "platform" }, { from: "platform", to: "stores" }, { from: "edge", to: "stores", broken: true }], badges: { stores: "no edge connection" } },
  { cue: 36, layout: ZONES, frames: ZONES_WALL, edges: [{ from: "edge", to: "platform" }, { from: "platform", to: "stores" }], accent: ["platform"], packets: [{ from: "edge", to: "platform", label: "request" }, { from: "platform", to: "stores", label: "read", delay: 50 }], badges: { platform: "gateway first" } },
  // Two zones: stage and production.
  { cue: 37, layout: { stage: [0.5, 0.5], production: [2.5, 0.5] }, frames: TWO_FRAMES },
  { cue: 38, layout: { stage: [0.5, 0.5], production: [2.5, 0.5] }, frames: TWO_FRAMES, accent: ["stage", "production"] },
  { cue: 39, layout: { stage: [0.5, 0.5], production: [2.5, 0.5] }, frames: TWO_FRAMES, badges: HOSTS },
  { cue: 40, layout: { stage: [0.5, 0.5], production: [2.5, 0.5] }, frames: TWO_FRAMES, edges: [{ from: "stage", to: "production", label: "no route", broken: true }], badges: { stage: "same units", production: "same units" } },
  { cue: 41, layout: TWO, frames: TWO_FRAMES, edges: [{ from: "stage", to: "myidTest" }], accent: ["myidTest"] },
  { cue: 42, layout: TWO, frames: TWO_FRAMES, edges: [...TWO_EDGES], accent: ["myid"], badges: { production: "own credential" } },
  { cue: 43, layout: TWO, frames: TWO_FRAMES, edges: [...TWO_EDGES, { from: "stage", to: "production", label: "configuration" }], packets: [{ from: "stage", to: "production", label: "config" }], badges: { production: "second person ✓" } },
  { cue: 44, layout: TWO, frames: TWO_FRAMES, edges: [...TWO_EDGES, { from: "stage", to: "production", label: "configuration" }], badges: { stage: "data stays", production: "data stays" } },
  { cue: 45, layout: TWO, frames: TWO_FRAMES, edges: [...TWO_EDGES], accent: ["production"] },
  { cue: 46, layout: { ...TWO, myidTest: [1.5, 1.8] }, frames: TWO_FRAMES, edges: [{ from: "production", to: "myidTest", broken: true }, { from: "production", to: "myid" }], danger: ["production"], badges: { production: "test host? no start" } },
  // So the dark office does not matter.
  { cue: 50, layout: ALONE, frames: ALONE_WALL, crossed: ["vendor"], accent: ["platform"], badges: { platform: "works ✓" } },
  // The check: what may a push carry?
  { cue: 51, layout: PUSH, frames: PUSH_WALL, edges: [...PUSH_EDGES], accent: ["push"], badges: { push: "carries what?" } },
  { cue: 52, layout: PUSH, frames: PUSH_WALL, edges: [...PUSH_EDGES], accent: ["push"], packets: [{ from: "platform", to: "trusted", label: "type + ref" }], badges: { push: "no personal data" } },
  // The summary.
  { cue: 54, layout: ALONE, frames: ALONE_WALL, edges: [{ from: "platform", to: "vendor", broken: true }], crossed: ["vendor"] },
  { cue: 55, layout: OUT, frames: OUT_WALL, edges: [...OUT_EDGES], badges: { egress: "three names" } },
  { cue: 56, layout: TWO, frames: TWO_FRAMES, edges: [...TWO_EDGES], badges: { stage: "test", production: "real" } },
  // The way to lesson four: the configuration the installation starts from.
  { cue: 57, layout: START, frames: [wall([0.5, 1], [2.5, 1])], edges: [{ from: "config", to: "platform", label: "start" }], accent: ["config"], badges: { config: "MyID host: one value" } },
  { cue: 58, layout: START, frames: [wall([0.5, 1], [2.5, 1])], edges: [{ from: "config", to: "platform", label: "start", broken: true }], danger: ["config"], badges: { config: "value missing", platform: "no start" } },
];
