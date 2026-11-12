import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 4: configuration. The missing line (0–4); no default in the code (5–9); OpenTofu and version 0
// (10–16); the go-live gate (17–19); policies and installation settings (20–24); a change in the
// configuration, never in the panel (25–32); the close, the check and the way to adapters (33–46).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 2, rows: [2], current: ["admingw", "postgres"], units: { heeyid: "where do the values come from?" } },
  { cue: 26, part: 2, current: ["staff"], units: { heeyid: "the panel: no policy change" } },
  { cue: 45, part: 2, current: ["adapters", "myid", "taf", "sms"], units: { heeyid: "timeouts" } },
  { cue: 46, part: 2, rows: [2], dot: "off" },
];

const SETUP = { platformTeam: [0, 1], setup: [1.5, 1], platform: [3, 1] } as const;
const SETUP_EDGES = [{ from: "platformTeam", to: "setup" }, { from: "setup", to: "platform" }] as const;
const TOFU = { tofu: [0, 0.4], code: [0, 1.7], setup: [1.5, 1], policies: [3, 0.4], texts: [3, 1.7] } as const;
const TOFU_EDGES = [{ from: "tofu", to: "setup" }, { from: "setup", to: "policies" }, { from: "setup", to: "texts" }] as const;
const KINDS = { policies: [0.5, 0.5], installSettings: [2.5, 0.5], panel: [1.5, 1.9] } as const;
const NO_PANEL = [{ from: "panel", to: "policies", broken: true }, { from: "panel", to: "installSettings", broken: true }] as const;
const CHANGE = { platformTeam: [0, 1], tofu: [1.5, 1], policies: [3, 1] } as const;
const CHANGE_EDGES = [{ from: "platformTeam", to: "tofu" }, { from: "tofu", to: "policies" }] as const;
const VERSIONS = { tofu: [0.5, 1], policies: [2.5, 1] } as const;
const VERSION_EDGES = [{ from: "tofu", to: "policies" }] as const;
const WAIT = { platform: [0, 1], myid: [2, 0.4], taf: [2, 1.6] } as const;
const WAIT_EDGES = [{ from: "platform", to: "myid" }, { from: "platform", to: "taf" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The missing line.
  { cue: 0, layout: SETUP, edges: [...SETUP_EDGES], accent: ["platformTeam"] },
  { cue: 1, layout: SETUP, edges: [...SETUP_EDGES], danger: ["setup"], badges: { setup: "code lifetime: ?" } },
  { cue: 2, layout: SETUP, edges: [...SETUP_EDGES], danger: ["setup"], badges: { setup: "guess or stop?" } },
  // Many systems guess; heeyID has no default in the code.
  { cue: 5, layout: { code: [0.5, 1], setup: [2.5, 1] }, edges: [{ from: "code", to: "setup" }], badges: { code: "a hidden constant" } },
  { cue: 6, layout: { code: [0.5, 1], setup: [2.5, 1] }, edges: [{ from: "code", to: "setup" }], packets: [{ from: "code", to: "setup", label: "quiet default" }], danger: ["code"] },
  { cue: 7, layout: { code: [1.5, 1] }, crossed: ["code"], badges: { code: "no default value" } },
  { cue: 8, layout: { code: [1.5, 1] }, crossed: ["code"], badges: { code: "nobody signed it" } },
  // OpenTofu: the only home of the defaults; setup writes version 0.
  { cue: 10, layout: TOFU, edges: [...TOFU_EDGES], crossed: ["code"], accent: ["tofu"] },
  { cue: 11, layout: TOFU, edges: [...TOFU_EDGES], crossed: ["code"], badges: { tofu: "installation as code" } },
  { cue: 12, layout: TOFU, edges: [...TOFU_EDGES], crossed: ["code"], badges: { tofu: "policies + texts" }, accent: ["policies", "texts"] },
  { cue: 13, layout: TOFU, edges: [...TOFU_EDGES], crossed: ["code"], packets: [{ from: "tofu", to: "setup", label: "catalogue" }, { from: "setup", to: "policies", label: "version 0", delay: 50 }] },
  { cue: 14, layout: TOFU, edges: [...TOFU_EDGES], crossed: ["code"], badges: { policies: "v0 · product · default" } },
  { cue: 15, layout: TOFU, edges: [...TOFU_EDGES], crossed: ["code"], danger: ["setup"], shake: { setup: 0.3 }, badges: { setup: "stop: code lifetime missing" } },
  { cue: 16, layout: SETUP, edges: [...SETUP_EDGES], accent: ["platformTeam"], badges: { platformTeam: "first minute" } },
  // The go-live gate.
  { cue: 17, layout: { apps: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "apps", to: "platform" }], accent: ["apps"] },
  { cue: 18, layout: { apps: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "apps", to: "platform" }], badges: { apps: "one app + level?" } },
  { cue: 19, layout: { aziz: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "aziz", to: "platform", broken: true }], danger: ["platform"], badges: { platform: "not available" } },
  // Two kinds of values.
  { cue: 20, layout: KINDS, accent: ["policies", "installSettings"] },
  { cue: 21, layout: KINDS, accent: ["policies"], badges: { policies: "lifetimes · limits · waits" } },
  { cue: 22, layout: KINDS, accent: ["installSettings"], badges: { policies: "lifetimes · limits · waits", installSettings: "hosts · zone · timeouts" } },
  { cue: 23, layout: KINDS, accent: ["policies"], badges: { policies: "versions · default mark" } },
  { cue: 24, layout: KINDS, accent: ["installSettings"], badges: { installSettings: "change = deployment" } },
  // A change: only in the configuration, never in the panel.
  { cue: 25, layout: { platformTeam: [0.5, 1], policies: [2.5, 1] }, edges: [{ from: "platformTeam", to: "policies" }], accent: ["platformTeam"], badges: { policies: "shorter code life?" } },
  { cue: 26, layout: KINDS, edges: [...NO_PANEL], danger: ["panel"], badges: { policies: "panel ✕", installSettings: "panel ✕" } },
  { cue: 27, layout: CHANGE, edges: [...CHANGE_EDGES], accent: ["tofu"], packets: [{ from: "platformTeam", to: "tofu", label: "one line" }] },
  { cue: 28, layout: CHANGE, edges: [...CHANGE_EDGES], packets: [{ from: "tofu", to: "policies", label: "new value" }], badges: { policies: "checked first" } },
  { cue: 29, layout: CHANGE, edges: [{ from: "platformTeam", to: "tofu" }, { from: "tofu", to: "policies", broken: true }], packets: [{ from: "tofu", to: "policies", label: "0 · −5 · wrong unit", stopAt: 0.6 }], badges: { policies: "refused" } },
  { cue: 30, layout: CHANGE, edges: [...CHANGE_EDGES], badges: { policies: "no typo policies" } },
  { cue: 31, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["policies"], packets: [{ from: "tofu", to: "policies", label: "valid" }], badges: { policies: "v1 · v0 in history" } },
  { cue: 32, layout: { tofu: [0.5, 1], texts: [2.5, 1] }, edges: [{ from: "tofu", to: "texts" }], accent: ["texts"], badges: { texts: "new version" } },
  // Back to the missing line.
  { cue: 33, layout: SETUP, edges: [...SETUP_EDGES], danger: ["setup"], badges: { setup: "stopped" } },
  { cue: 34, layout: SETUP, edges: [...SETUP_EDGES], accent: ["platform"], packets: [{ from: "setup", to: "platform", label: "version 0 ✓" }] },
  { cue: 35, layout: VERSIONS, edges: [...VERSION_EDGES], badges: { policies: "v1 · time · source" } },
  { cue: 36, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["policies"], badges: { policies: "source · version · owner" } },
  { cue: 37, layout: VERSIONS, edges: [...VERSION_EDGES], badges: { policies: "the configured time" } },
  // The check.
  { cue: 39, layout: WAIT, edges: [...WAIT_EDGES], accent: ["taf"], badges: { taf: "wait longer?" } },
  { cue: 40, layout: KINDS, edges: [...NO_PANEL], accent: ["installSettings"], badges: { installSettings: "timeout · new deployment" } },
  // Summary.
  { cue: 41, layout: { code: [1.5, 1] }, crossed: ["code"], badges: { code: "no default value" } },
  { cue: 42, layout: TOFU, edges: [...TOFU_EDGES], crossed: ["code"], badges: { policies: "version 0" } },
  { cue: 43, layout: SETUP, edges: [...SETUP_EDGES], danger: ["setup"], badges: { setup: "missing or wrong: stop" } },
  { cue: 44, layout: KINDS, edges: [...NO_PANEL], badges: { policies: "configuration only", installSettings: "configuration only" } },
  // The way to adapters.
  { cue: 45, layout: WAIT, edges: [...WAIT_EDGES], badges: { myid: "timeout", taf: "timeout" } },
  { cue: 46, layout: WAIT, edges: [...WAIT_EDGES], danger: ["myid"], packets: [{ from: "platform", to: "myid", label: "waiting…", stopAt: 0.6 }], badges: { myid: "slow? down?" } },
];
