import { BuildMapStep, DiagramFrame, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 4: the perimeter. The dark office (0–6); inside the bank, no vendor (7–15); the short list of
// outside names (16–30); zones inside (31–36); stage and production (37–45); eight o'clock again (46–50);
// recap and the way to tokens (51–57).
const INSIDE: HeeyMapId[] = ["edge", "custgw", "keycloak", "admingw", "workers", "postgres", "valkey", "kafka", "vault", "adapters"];
const STORES: HeeyMapId[] = ["postgres", "valkey", "kafka", "vault"];
const OUTSIDE: HeeyMapId[] = ["taf", "sms", "lookup", "myid", "push"];
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 2, current: ["myid", "taf", "lookup"], units: UNIT },
  { cue: 5, part: 2, rows: [2], current: ["perimeter"], units: UNIT },
  { cue: 7, part: 2, current: ["perimeter"], units: UNIT },
  { cue: 8, part: 2, current: ["perimeter", ...INSIDE], units: { heeyid: "the bank runs it" } },
  { cue: 9, part: 2, current: ["perimeter", "mobile", "sideapps", "staff"], units: { heeyid: "one installation, one bank" } },
  // The short list of names outside.
  { cue: 16, part: 2, current: ["perimeter", "edge"], units: UNIT },
  { cue: 18, part: 2, current: ["adapters"], units: { heeyid: "configured hosts only" } },
  { cue: 19, part: 2, current: ["adapters", "sms", "lookup"], units: { heeyid: "1 · the bank's services" } },
  { cue: 20, part: 2, current: ["adapters", "taf"], units: { heeyid: "2 · TAF" } },
  { cue: 21, part: 2, current: ["taf"], units: { heeyid: "TAF agent: inside the bank" } },
  { cue: 23, part: 2, current: ["adapters", "myid"], units: { heeyid: "3 · MyID, outside" } },
  { cue: 24, part: 2, current: ["adapters", "myid", "vault"], units: { heeyid: "pinned · credential from Vault" } },
  { cue: 29, part: 2, current: ["adapters", ...OUTSIDE], units: UNIT },
  { cue: 30, part: 2, current: ["edge", "myid", "push", "taf", "sms", "lookup"], units: { heeyid: "egress: only these names" } },
  // Zones inside.
  { cue: 31, part: 2, current: ["perimeter"], units: UNIT },
  { cue: 32, part: 2, current: ["edge"], units: UNIT },
  { cue: 33, part: 2, current: ["custgw", "keycloak", "admingw", "workers"], units: UNIT },
  { cue: 34, part: 2, current: STORES, units: UNIT },
  // Eight o'clock again.
  { cue: 46, part: 2, current: ["customer", "mobile"], dot: "mobile", units: UNIT },
  { cue: 47, part: 2, current: ["mobile", "edge", "custgw", "postgres", "valkey"], dot: "custgw", units: UNIT },
  { cue: 48, part: 2, current: ["adapters", "taf"], dot: "taf", units: { heeyid: "TAF agent: inside the bank" } },
  { cue: 49, part: 2, current: ["perimeter", "customer", "mobile", ...INSIDE, "taf"], dot: "mobile", units: UNIT },
  // Recap.
  { cue: 51, part: 2, current: ["perimeter", ...INSIDE], dot: "off", units: { heeyid: "one installation, one bank" } },
  { cue: 53, part: 2, current: OUTSIDE, units: UNIT },
  { cue: 55, part: 2, current: ["keycloak", "mobile", "sideapps"], units: { heeyid: "one Keycloak, many apps" } },
  { cue: 57, part: 2, rows: [2], dot: "off", units: UNIT },
];

const wall = (from: readonly [number, number], to: readonly [number, number], label = "the bank's perimeter"): DiagramFrame => ({ label, from, to, tone: "wall" });
const DARK = { vendor: [0, 0.4], aziz: [1.2, 1.6], mobileBank: [2.8, 1.6] } as const;
const ALONE = { platform: [1, 1], vendor: [3, 1] } as const;
const PUSH = { platform: [0, 1.4], push: [1.5, 0.5], trusted: [3, 1.4] } as const;
const ZONES = { edge: [0, 1.4], platform: [1.5, 0.5], stores: [3, 1.4] } as const;
const TWO = { stage: [0.5, 0.5], production: [2.5, 0.5], myidTest: [0.5, 1.8], myid: [2.5, 1.8] } as const;
const TWO_EDGES = [{ from: "stage", to: "myidTest" }, { from: "production", to: "myid" }] as const;
const TWO_FRAMES = [wall([0.5, 0.5], [0.5, 0.5], "test zone"), wall([2.5, 0.5], [2.5, 0.5], "production zone")];

export const diagram: DiagramStep<HeeyId>[] = [
  // The dark office.
  { cue: 0, layout: { vendor: [1.5, 1] }, accent: ["vendor"] },
  { cue: 1, layout: { vendor: [1.5, 1] }, crossed: ["vendor"], badges: { vendor: "closed" } },
  { cue: 2, layout: DARK, edges: [{ from: "aziz", to: "mobileBank" }], crossed: ["vendor"], packets: [{ from: "aziz", to: "mobileBank", label: "log in" }] },
  { cue: 3, layout: DARK, edges: [{ from: "aziz", to: "mobileBank" }], crossed: ["vendor"], badges: { mobileBank: "works?" } },
  { cue: 6, layout: ALONE, frames: [wall([1, 1], [1, 1])], crossed: ["vendor"], accent: ["platform"], badges: { platform: "works ✓" } },
  // One bank, one installation; a second bank, a second installation.
  { cue: 10, layout: { platform: [0.7, 1], platform2: [2.3, 1] }, frames: [wall([0.7, 1], [0.7, 1], "first bank"), wall([2.3, 1], [2.3, 1], "second bank")], accent: ["platform2"] },
  // No call to the vendor.
  { cue: 11, layout: ALONE, frames: [wall([1, 1], [1, 1])], edges: [{ from: "platform", to: "vendor", broken: true }], crossed: ["vendor"] },
  { cue: 12, layout: ALONE, frames: [wall([1, 1], [1, 1])], edges: [{ from: "platform", to: "vendor", broken: true }], crossed: ["vendor"], badges: { vendor: "no control · no data" } },
  { cue: 13, layout: ALONE, frames: [wall([1, 1], [1, 1])], crossed: ["vendor"], accent: ["platform"], badges: { platform: "works alone" } },
  { cue: 15, layout: ALONE, frames: [wall([1, 1], [1, 1], "Republic of Uzbekistan")], crossed: ["vendor"], badges: { platform: "personal data stays" } },
  // The push service: outside, so type and reference only.
  { cue: 25, layout: PUSH, frames: [wall([0, 1.4], [0, 1.4])], edges: [{ from: "platform", to: "push" }, { from: "push", to: "trusted" }], accent: ["push"], packets: [{ from: "platform", to: "push", label: "wake up" }] },
  { cue: 26, layout: PUSH, frames: [wall([0, 1.4], [0, 1.4])], edges: [{ from: "platform", to: "push" }, { from: "push", to: "trusted" }], packets: [{ from: "platform", to: "trusted", label: "type + ref" }] },
  { cue: 27, layout: PUSH, frames: [wall([0, 1.4], [0, 1.4])], edges: [{ from: "platform", to: "push" }, { from: "push", to: "trusted" }], badges: { push: "no code · no text · no data" } },
  { cue: 28, layout: PUSH, frames: [wall([0, 1.4], [0, 1.4])], edges: [{ from: "platform", to: "push" }, { from: "push", to: "trusted" }, { from: "trusted", to: "platform", label: "own session" }], accent: ["trusted"], packets: [{ from: "trusted", to: "platform", label: "get text" }] },
  // Zones: the data zone takes nothing from the edge.
  { cue: 35, layout: ZONES, frames: [wall([0, 0.5], [3, 1.4], "installation")], edges: [{ from: "edge", to: "platform" }, { from: "platform", to: "stores" }, { from: "edge", to: "stores", broken: true }], badges: { stores: "no edge connection" } },
  { cue: 36, layout: ZONES, frames: [wall([0, 0.5], [3, 1.4], "installation")], edges: [{ from: "edge", to: "platform" }, { from: "platform", to: "stores" }], accent: ["platform"], packets: [{ from: "edge", to: "platform", label: "request" }, { from: "platform", to: "stores", label: "read", delay: 50 }], badges: { platform: "gateway first" } },
  // Stage and production.
  { cue: 37, layout: { stage: [0.5, 0.5], production: [2.5, 0.5] }, frames: TWO_FRAMES, accent: ["stage", "production"] },
  { cue: 39, layout: { stage: [0.5, 0.5], production: [2.5, 0.5] }, frames: TWO_FRAMES, edges: [{ from: "stage", to: "production", label: "no route", broken: true }], badges: { stage: "same units", production: "same units" } },
  { cue: 40, layout: TWO, frames: TWO_FRAMES, edges: [{ from: "stage", to: "myidTest" }], accent: ["myidTest"] },
  { cue: 41, layout: TWO, frames: TWO_FRAMES, edges: [...TWO_EDGES], accent: ["myid"], badges: { production: "own credential" } },
  { cue: 42, layout: TWO, frames: TWO_FRAMES, edges: [...TWO_EDGES, { from: "stage", to: "production", label: "configuration" }], packets: [{ from: "stage", to: "production", label: "config" }], badges: { production: "second person ✓" } },
  { cue: 43, layout: TWO, frames: TWO_FRAMES, edges: [...TWO_EDGES, { from: "stage", to: "production", label: "configuration" }], badges: { stage: "data stays", production: "data stays" } },
  { cue: 44, layout: TWO, frames: TWO_FRAMES, edges: [...TWO_EDGES], accent: ["production"] },
  { cue: 45, layout: { ...TWO, myidTest: [1.5, 1.8] }, frames: TWO_FRAMES, edges: [{ from: "production", to: "myidTest", broken: true }, { from: "production", to: "myid" }], danger: ["production"], badges: { production: "test host? no start" } },
  // So the dark office does not matter.
  { cue: 50, layout: ALONE, frames: [wall([1, 1], [1, 1])], crossed: ["vendor"], accent: ["platform"], badges: { platform: "works ✓" } },
  { cue: 52, layout: ALONE, frames: [wall([1, 1], [1, 1])], edges: [{ from: "platform", to: "vendor", broken: true }], crossed: ["vendor"] },
  { cue: 54, layout: TWO, frames: TWO_FRAMES, edges: [...TWO_EDGES], badges: { stage: "test", production: "real" } },
  // The open question: a leaked marketplace token at the mobile bank's door.
  { cue: 56, layout: { marketplace: [0, 1], token: [1.5, 1], mobileApi: [3, 1] }, edges: [{ from: "marketplace", to: "token" }, { from: "token", to: "mobileApi" }], danger: ["token"], packets: [{ from: "token", to: "mobileApi", label: "marketplace token", stopAt: 0.6 }], badges: { mobileApi: "what stops it?" } },
];
