import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 5: adapters. Suppose MyID goes quiet (0–4); the bridge (5–6); the core and the four adapters (7–17);
// simulators (18–26); timeout, breaker, test call (27–35); one fixed behaviour for each outage (36–46);
// back to Aziz (47–53); two more rules (54–58); the check (59–60); the summary and the way to the keys (61–66).
const OUTSIDE: HeeyMapId[] = ["taf", "sms", "myid", "push"];

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 2, rows: [2], current: OUTSIDE, units: { heeyid: "the outside services" } },
  { cue: 14, part: 2, current: ["adapters", ...OUTSIDE], units: { heeyid: "four adapters" } },
  { cue: 65, part: 2, current: ["adapters", "vault"], units: { heeyid: "secrets of the adapters" } },
  { cue: 66, part: 2, rows: [2], current: ["vault"], dot: "off", units: { heeyid: "where the keys live" } },
];

type Layout = Partial<Record<HeeyId, readonly [number, number]>>;
const SPIN = { aziz: [0, 1], mobileBank: [1.5, 1], myid: [3, 1] } as const;
const SPIN_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }] as const;
const OUT = { platform: [0, 1], taf: [1.5, 1.9], myid: [3, 0.2], sms: [3, 1], push: [3, 1.8] } as const;
const OUT_EDGES = [{ from: "platform", to: "taf" }, { from: "platform", to: "myid" }, { from: "platform", to: "sms" }, { from: "platform", to: "push" }] as const;
const CHAIN = { domain: [0, 1], adapter: [1.5, 1], myid: [3, 1] } as const;
const CHAIN_EDGES = [{ from: "domain", to: "adapter" }, { from: "adapter", to: "myid" }] as const;
const FOUR = { adapter: [0.3, 1], myid: [2, 0.3], taf: [3, 0.3], sms: [2, 1.7], push: [3, 1.7] } as const;
const FOUR_EDGES = [{ from: "adapter", to: "myid" }, { from: "adapter", to: "taf" }, { from: "adapter", to: "sms" }, { from: "adapter", to: "push" }] as const;
const SIM = { domain: [0, 1], adapter: [1.5, 1], myid: [3, 0.3], simulator: [3, 1.7] } as const;
const SIM_EDGES = [{ from: "domain", to: "adapter" }, { from: "adapter", to: "myid" }, { from: "adapter", to: "simulator" }] as const;
const TESTS = { tests: [0, 1], adapter: [1.5, 1], simulator: [3, 1] } as const;
const TESTS_EDGES = [{ from: "tests", to: "adapter" }, { from: "adapter", to: "simulator" }] as const;
const WALL = { adapter: [0, 1], breaker: [1.5, 1], myid: [3, 1] } as const;
const WALL_EDGES = [{ from: "adapter", to: "breaker" }, { from: "breaker", to: "myid" }] as const;
const WALL_OPEN = [{ from: "adapter", to: "breaker" }, { from: "breaker", to: "myid", broken: true }] as const;
const RULE = { domain: [0, 1], adapter: [1.5, 1], myid: [3, 1] } as const;
const RULE_EDGES = [{ from: "domain", to: "adapter" }, { from: "adapter", to: "myid", broken: true }] as const;
const DOWN = (a: HeeyId, b: HeeyId): Layout => ({ [a]: [0.5, 1], [b]: [2.5, 1] });
const TAF = { platform: [0, 1], taf: [1.5, 0.3], sms: [3, 1.5] } as const;
const TAF_DOWN = [{ from: "platform", to: "taf", broken: true }, { from: "platform", to: "sms" }] as const;
const KEYS = { vault: [0.3, 1], myid: [2, 0.3], taf: [3, 0.3], sms: [2, 1.7], push: [3, 1.7] } as const;
const KEYS_EDGES = [{ from: "vault", to: "myid" }, { from: "vault", to: "taf" }, { from: "vault", to: "sms" }, { from: "vault", to: "push" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Suppose MyID goes quiet.
  { cue: 0, layout: SPIN, edges: [...SPIN_EDGES], accent: ["aziz"], badges: { mobileBank: "MyID step" } },
  { cue: 1, layout: SPIN, edges: [...SPIN_EDGES], packets: [{ from: "mobileBank", to: "myid", label: "open MyID check" }] },
  { cue: 2, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], packets: [{ from: "mobileBank", to: "myid", label: "open MyID check", stopAt: 0.6 }], badges: { myid: "slow… silent" } },
  { cue: 3, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], badges: { mobileBank: "spinner" } },
  { cue: 4, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], badges: { aziz: "and me?", mobileBank: "spinner" } },
  // The bridge: the outside services, the configuration.
  { cue: 5, layout: OUT, edges: [...OUT_EDGES], accent: ["myid", "sms", "push", "taf"] },
  { cue: 6, layout: OUT, edges: [...OUT_EDGES], accent: ["platform"], badges: { platform: "how it talks" } },
  // The core, ports, adapters.
  { cue: 7, layout: { domain: [1.5, 1] }, accent: ["domain"] },
  { cue: 8, layout: { domain: [1.5, 1] }, badges: { domain: "registration · proofing · devices · login" } },
  { cue: 9, layout: { domain: [1.5, 1] }, badges: { domain: "no input, no output" } },
  { cue: 10, layout: { domain: [1.5, 1] }, badges: { domain: "no connection" } },
  { cue: 11, layout: { domain: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "domain", to: "myid", broken: true }], crossed: ["myid"], badges: { domain: "no direct call" } },
  { cue: 12, layout: { domain: [1.5, 1] }, accent: ["domain"], badges: { domain: "open proofing session · send a code" } },
  { cue: 13, layout: CHAIN, edges: [...CHAIN_EDGES], accent: ["adapter"], packets: [{ from: "domain", to: "adapter", label: "open proofing session" }, { from: "adapter", to: "myid", label: "HTTPS", delay: 70 }] },
  { cue: 14, layout: FOUR, edges: [...FOUR_EDGES], accent: ["adapter"], badges: { adapter: "four adapters" } },
  { cue: 15, layout: FOUR, edges: [...FOUR_EDGES], accent: ["taf"], badges: { taf: "agent in the bank" } },
  { cue: 16, layout: FOUR, edges: [...FOUR_EDGES], accent: ["myid", "sms", "push"], badges: { adapter: "egress proxy" } },
  { cue: 17, layout: { customerGw: [0, 0.4], workers: [0, 1.7], adapter: [1.5, 1], myid: [3, 1] }, edges: [{ from: "customerGw", to: "adapter" }, { from: "workers", to: "adapter" }, { from: "adapter", to: "myid" }], badges: { adapter: "own unit" } },
  // Simulators.
  { cue: 18, layout: TESTS, edges: [...TESTS_EDGES], accent: ["tests"] },
  { cue: 19, layout: { domain: [0.5, 1], adapter: [2.5, 1] }, edges: [{ from: "domain", to: "adapter" }], accent: ["adapter"], badges: { adapter: "one real adapter" } },
  { cue: 20, layout: SIM, edges: [...SIM_EDGES], accent: ["simulator"], crossed: ["myid"] },
  { cue: 21, layout: SIM, edges: [...SIM_EDGES], crossed: ["myid"], badges: { simulator: "same API" } },
  { cue: 22, layout: SIM, edges: [...SIM_EDGES], crossed: ["myid"], packets: [{ from: "simulator", to: "adapter", label: "timeout" }], badges: { simulator: "success · failures · timeout · down" } },
  { cue: 23, layout: TESTS, edges: [...TESTS_EDGES], accent: ["tests"], packets: [{ from: "tests", to: "adapter", label: "acceptance" }], badges: { tests: "no internet" } },
  { cue: 24, layout: { tests: [0, 1], adapter: [1.5, 1], myidTest: [3, 1] }, edges: [{ from: "tests", to: "adapter" }, { from: "adapter", to: "myidTest" }], accent: ["myidTest"], badges: { myidTest: "each night" } },
  { cue: 25, layout: { adapter: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "adapter", to: "myid" }], badges: { myid: "good days only" } },
  { cue: 26, layout: { adapter: [0.5, 1], simulator: [2.5, 1] }, edges: [{ from: "adapter", to: "simulator" }], accent: ["simulator"], packets: [{ from: "simulator", to: "adapter", label: "down" }], badges: { simulator: "the bad days too" } },
  // Timeout, breaker, test call.
  { cue: 27, layout: WALL, edges: [...WALL_EDGES] },
  { cue: 28, layout: WALL, edges: [...WALL_EDGES], accent: ["adapter"], badges: { adapter: "timeout" } },
  { cue: 29, layout: WALL, edges: [...WALL_EDGES], accent: ["breaker"] },
  { cue: 30, layout: WALL, edges: [...WALL_OPEN], danger: ["breaker"], badges: { breaker: "open" } },
  { cue: 31, layout: WALL, edges: [...WALL_OPEN], danger: ["breaker"], packets: [{ from: "adapter", to: "breaker", label: "call", stopAt: 0.9 }], badges: { breaker: "fail at once" } },
  { cue: 32, layout: WALL, edges: [...WALL_EDGES], accent: ["breaker"], packets: [{ from: "breaker", to: "myid", label: "test call" }], badges: { breaker: "closes" } },
  { cue: 33, layout: { ...WALL, platformTeam: [1.5, 2.1] }, edges: [...WALL_OPEN, { from: "breaker", to: "platformTeam" }], danger: ["breaker"], badges: { platformTeam: "alert: dependency down" } },
  { cue: 34, layout: { tofu: [0, 1], adapter: [1.5, 1], breaker: [3, 1] }, edges: [{ from: "tofu", to: "adapter", label: "timeout" }, { from: "adapter", to: "breaker" }], accent: ["tofu"], badges: { tofu: "installation settings" } },
  { cue: 35, layout: { panel: [0, 0.3], tofu: [0, 1.7], adapter: [1.5, 1], breaker: [3, 1] }, edges: [{ from: "panel", to: "adapter", broken: true }, { from: "tofu", to: "adapter" }, { from: "adapter", to: "breaker" }], crossed: ["panel"], badges: { tofu: "new deployment" } },
  // One fixed behaviour for each outage.
  { cue: 36, layout: WALL, edges: [...WALL_EDGES], accent: ["adapter"], badges: { adapter: "one fixed behaviour" } },
  { cue: 37, layout: RULE, edges: [...RULE_EDGES], badges: { adapter: "no bypass" } },
  { cue: 38, layout: RULE, edges: [...RULE_EDGES], packets: [{ from: "adapter", to: "domain", label: "plain answer" }], badges: { domain: "no raw error" } },
  { cue: 39, layout: DOWN("aziz", "myid"), edges: [{ from: "aziz", to: "myid", broken: true }], danger: ["myid"], badges: { aziz: "temporarily not available" } },
  { cue: 40, layout: DOWN("aziz", "myid"), edges: [{ from: "aziz", to: "myid", broken: true }], danger: ["myid"], badges: { aziz: "level kept · not counted" } },
  { cue: 41, layout: DOWN("aziz", "myid"), edges: [{ from: "aziz", to: "myid", broken: true }], danger: ["myid"], badges: { aziz: "starts again", myid: "nothing later" } },
  { cue: 42, layout: TAF, edges: [...TAF_DOWN], danger: ["taf"], packets: [{ from: "platform", to: "sms", label: "code" }], badges: { platform: "not scored" } },
  { cue: 43, layout: TAF, edges: [{ from: "platform", to: "taf" }, { from: "platform", to: "sms", broken: true }], crossed: ["sms"], badges: { taf: "other trusted bank", sms: "no SMS" } },
  { cue: 44, layout: DOWN("platform", "sms"), edges: [{ from: "platform", to: "sms", broken: true }], danger: ["sms"], badges: { platform: "code cannot go" } },
  { cue: 45, layout: { platform: [0, 1], kafka: [1.5, 1], sms: [3, 1] }, edges: [{ from: "platform", to: "kafka" }, { from: "kafka", to: "sms" }], danger: ["sms"], packets: [{ from: "platform", to: "kafka", label: "notification" }], badges: { kafka: "waits, sends again" } },
  { cue: 46, layout: { platform: [0, 1], push: [1.5, 0.3], sms: [3, 1.5] }, edges: [{ from: "platform", to: "push", broken: true }, { from: "platform", to: "sms" }], danger: ["push"], packets: [{ from: "platform", to: "sms", label: "notification" }], badges: { platform: "SMS only" } },
  // Back to Aziz.
  { cue: 47, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], badges: { mobileBank: "spinner" } },
  { cue: 48, layout: { mobileBank: [0, 1], adapter: [1.5, 1], myid: [3, 1] }, edges: [{ from: "mobileBank", to: "adapter" }, { from: "adapter", to: "myid", broken: true }], danger: ["myid"], packets: [{ from: "adapter", to: "mobileBank", label: "provider not available" }] },
  { cue: 49, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], accent: ["aziz"], badges: { aziz: "level kept", mobileBank: "short message" } },
  { cue: 50, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], badges: { aziz: "not counted" } },
  { cue: 51, layout: WALL, edges: [...WALL_OPEN], danger: ["breaker"], shake: { breaker: 0.7 }, badges: { breaker: "open" } },
  { cue: 52, layout: { mobileBank: [0, 1], breaker: [1.5, 1], myid: [3, 1] }, edges: [{ from: "mobileBank", to: "breaker" }, { from: "breaker", to: "myid", broken: true }], danger: ["breaker"], packets: [{ from: "breaker", to: "mobileBank", label: "at once" }], badges: { mobileBank: "no spinner" } },
  { cue: 53, layout: WALL, edges: [...WALL_EDGES], accent: ["myid"], packets: [{ from: "breaker", to: "myid", label: "test call ✓" }], badges: { breaker: "closed" } },
  // Two more rules.
  { cue: 54, layout: { adapter: [1.5, 1] }, accent: ["adapter"], badges: { adapter: "two rules" } },
  { cue: 55, layout: { adapter: [0.5, 1], log: [2.5, 1] }, edges: [{ from: "adapter", to: "log" }], packets: [{ from: "adapter", to: "log", label: "body", stopAt: 0.6 }], badges: { log: "no bodies" } },
  { cue: 56, layout: { adapter: [0.5, 1], log: [2.5, 1] }, edges: [{ from: "adapter", to: "log" }], accent: ["log"], packets: [{ from: "adapter", to: "log", label: "ref · outcome · time" }] },
  { cue: 57, layout: { tofu: [0, 0.4], vault: [0, 1.7], adapter: [1.5, 1], code: [3, 1] }, edges: [{ from: "tofu", to: "adapter", label: "hosts" }, { from: "vault", to: "adapter", label: "credentials" }], crossed: ["code"], badges: { code: "no hosts, no secrets" } },
  { cue: 58, layout: { vault: [0.5, 1], adapter: [2.5, 1] }, edges: [{ from: "vault", to: "adapter", label: "its own credential" }], accent: ["adapter"] },
  // The check.
  { cue: 59, layout: TAF, edges: [...TAF_DOWN], danger: ["taf"], badges: { platform: "the code?" } },
  { cue: 60, layout: TAF, edges: [...TAF_DOWN], danger: ["taf"], accent: ["sms"], packets: [{ from: "platform", to: "sms", label: "code" }], badges: { platform: "not scored" } },
  // The summary and the way to the keys.
  { cue: 61, layout: { domain: [1.5, 1] }, accent: ["domain"], badges: { domain: "no input, no output" } },
  { cue: 62, layout: SIM, edges: [...SIM_EDGES], accent: ["adapter", "simulator"] },
  { cue: 63, layout: WALL, edges: [...WALL_EDGES], accent: ["breaker"], badges: { adapter: "timeout", breaker: "one behaviour each" } },
  { cue: 64, layout: SPIN, edges: [...SPIN_EDGES], accent: ["aziz"], badges: { aziz: "seconds, not forever" } },
  { cue: 65, layout: KEYS, edges: [...KEYS_EDGES], accent: ["vault"], badges: { myid: "credential", taf: "client secret", sms: "vendor login", push: "credential" } },
  { cue: 66, layout: { vault: [1.5, 1] }, accent: ["vault"], badges: { vault: "Lesson 6" } },
];
