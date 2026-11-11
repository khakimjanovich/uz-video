import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 6: configuration. The missing line (0–6); no default in the code (7–9); OpenTofu and version 0
// (10–16); the go-live gate (17–19); policies and installation keys (20–24); maker-checker (25–35);
// validation and the default mark (36–40); the close and the way to adapters (41–53).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 2, rows: [2], current: ["staff", "admingw", "postgres"], units: { heeyid: "who sets the values?" } },
  { cue: 23, part: 2, current: ["staff", "admingw"], units: { heeyid: "policies: in the panel" } },
  { cue: 51, part: 2, current: ["adapters", "myid", "taf", "sms"], units: { heeyid: "timeouts" } },
  { cue: 53, part: 2, rows: [2], dot: "off" },
];

const SETUP = { platformTeam: [0, 1], setup: [1.5, 1], platform: [3, 1] } as const;
const SETUP_EDGES = [{ from: "platformTeam", to: "setup" }, { from: "setup", to: "platform" }] as const;
const TOFU = { tofu: [0, 0.4], code: [0, 1.7], setup: [1.5, 1], policies: [3, 0.4], texts: [3, 1.7] } as const;
const TOFU_EDGES = [{ from: "tofu", to: "setup" }, { from: "setup", to: "policies" }, { from: "setup", to: "texts" }] as const;
const KINDS = { policies: [0.5, 0.5], installKeys: [2.5, 0.5], panel: [1.5, 1.9] } as const;
const MC = { maker: [0, 1], panel: [1.5, 1], checker: [3, 1] } as const;
const MC_EDGES = [{ from: "maker", to: "panel" }, { from: "panel", to: "checker" }] as const;
const VERSIONS = { maker: [0, 0.4], checker: [0, 1.7], policies: [2, 1] } as const;
const VERSION_EDGES = [{ from: "maker", to: "policies" }, { from: "checker", to: "policies" }] as const;

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
  { cue: 20, layout: KINDS, accent: ["policies", "installKeys"] },
  { cue: 21, layout: KINDS, accent: ["policies"], badges: { policies: "lifetimes · limits · waits" } },
  { cue: 22, layout: KINDS, accent: ["installKeys"], badges: { policies: "lifetimes · limits · waits", installKeys: "MyID host · zone · test flag" } },
  { cue: 23, layout: KINDS, edges: [{ from: "panel", to: "policies" }], badges: { policies: "panel ✓" } },
  { cue: 24, layout: KINDS, edges: [{ from: "panel", to: "policies" }, { from: "panel", to: "installKeys", broken: true }], badges: { policies: "panel ✓", installKeys: "panel ✕" } },
  // Maker-checker.
  { cue: 26, layout: { maker: [0.5, 1], policies: [2.5, 1] }, edges: [{ from: "maker", to: "policies" }], accent: ["maker"], badges: { maker: "Malika", policies: "shorter code life?" } },
  { cue: 27, layout: MC, edges: [...MC_EDGES], packets: [{ from: "maker", to: "panel", label: "proposal" }], badges: { maker: "Malika" } },
  { cue: 28, layout: MC, edges: [...MC_EDGES], badges: { maker: "Malika", panel: "current · new · reason" } },
  { cue: 29, layout: MC, edges: [...MC_EDGES], badges: { maker: "Malika", panel: "pending" } },
  { cue: 30, layout: MC, edges: [...MC_EDGES], accent: ["checker"], badges: { maker: "own approval ✕", panel: "pending" } },
  { cue: 31, layout: MC, edges: [...MC_EDGES], accent: ["maker", "checker"], badges: { maker: "makes", checker: "checks" } },
  { cue: 32, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["policies"], packets: [{ from: "checker", to: "policies", label: "approve" }], badges: { policies: "v1 · two names" } },
  { cue: 33, layout: VERSIONS, edges: [...VERSION_EDGES], badges: { policies: "rejected: kept + reason" } },
  { cue: 34, layout: VERSIONS, edges: [...VERSION_EDGES], packets: [{ from: "maker", to: "policies", label: "propose v0 again" }], badges: { policies: "earlier version" } },
  { cue: 35, layout: { maker: [0, 1], panel: [1.5, 1], texts: [3, 1] }, edges: [{ from: "maker", to: "panel" }, { from: "panel", to: "texts" }], accent: ["texts"], badges: { maker: "Compliance", texts: "same path" } },
  // Validation and the default mark.
  { cue: 36, layout: { panel: [0.5, 1], policies: [2.5, 1] }, edges: [{ from: "panel", to: "policies" }], accent: ["policies"] },
  { cue: 37, layout: { panel: [0.5, 1], policies: [2.5, 1] }, edges: [{ from: "panel", to: "policies", broken: true }], packets: [{ from: "panel", to: "policies", label: "0 · −5 · wrong unit", stopAt: 0.6 }], badges: { policies: "refused" } },
  { cue: 38, layout: { panel: [0.5, 1], policies: [2.5, 1] }, edges: [{ from: "panel", to: "policies" }], badges: { policies: "no typo policies" } },
  { cue: 39, layout: { panel: [0.5, 1], policies: [2.5, 1] }, edges: [{ from: "panel", to: "policies" }], accent: ["panel"], badges: { panel: "still default: marked" } },
  { cue: 40, layout: { panel: [0.5, 1], policies: [2.5, 1] }, edges: [{ from: "panel", to: "policies" }], badges: { panel: "bank's own vs product" } },
  // Back to the missing line.
  { cue: 41, layout: SETUP, edges: [...SETUP_EDGES], danger: ["setup"], badges: { setup: "stopped" } },
  { cue: 42, layout: SETUP, edges: [...SETUP_EDGES], accent: ["platform"], packets: [{ from: "setup", to: "platform", label: "version 0 ✓" }] },
  { cue: 43, layout: VERSIONS, edges: [...VERSION_EDGES], badges: { maker: "Malika", policies: "v1 · two names" } },
  { cue: 44, layout: VERSIONS, edges: [...VERSION_EDGES], accent: ["policies"], badges: { policies: "source · version · owner" } },
  { cue: 45, layout: VERSIONS, edges: [...VERSION_EDGES], badges: { policies: "the configured time" } },
  // Recap.
  { cue: 47, layout: { code: [1.5, 1] }, crossed: ["code"], badges: { code: "no default value" } },
  { cue: 48, layout: TOFU, edges: [...TOFU_EDGES], crossed: ["code"], badges: { policies: "version 0" } },
  { cue: 49, layout: SETUP, edges: [...SETUP_EDGES], danger: ["setup"], badges: { setup: "missing: stop" } },
  { cue: 50, layout: KINDS, edges: [{ from: "panel", to: "policies" }, { from: "panel", to: "installKeys", broken: true }], badges: { policies: "maker-checker", installKeys: "panel ✕" } },
  { cue: 52, layout: { platform: [0, 1], myid: [2, 0.4], taf: [2, 1.6] }, edges: [{ from: "platform", to: "myid" }, { from: "platform", to: "taf" }], danger: ["myid"], packets: [{ from: "platform", to: "myid", label: "waiting…", stopAt: 0.6 }], badges: { myid: "slow? down?" } },
];
