import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 7: adapters. The spinner (0–5); domain, ports, adapters (6–13); simulators (14–19); timeout,
// breaker, probe (20–28); the fixed behaviours (29–38); back to Aziz (39–45); two more rules (46–50);
// recap and the way to keys (51–58).
const OUTSIDE: HeeyMapId[] = ["taf", "sms", "lookup", "myid", "push"];

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 2, current: ["adapters", "myid", "taf", "sms"], units: { heeyid: "timeouts" } },
  { cue: 5, part: 2, rows: [2], current: ["adapters"], units: { heeyid: "walls around each call" } },
  { cue: 13, part: 2, current: ["adapters", ...OUTSIDE], units: { heeyid: "eight outgoing ports" } },
  { cue: 55, part: 2, current: ["adapters", "vault"], units: { heeyid: "secrets of the adapters" } },
  { cue: 57, part: 2, current: ["vault"], units: { heeyid: "where do keys live?" } },
  { cue: 58, part: 2, rows: [2], dot: "off" },
];

const SPIN = { aziz: [0, 1], mobileBank: [1.5, 1], myid: [3, 1] } as const;
const SPIN_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }] as const;
const CHAIN = { domain: [0, 1], port: [1, 1], adapter: [2, 1], myid: [3, 1] } as const;
const CHAIN_EDGES = [{ from: "domain", to: "port" }, { from: "port", to: "adapter" }, { from: "adapter", to: "myid" }] as const;
const SIM = { domain: [0, 1], port: [1, 1], adapter: [2, 0.3], simulator: [2, 1.9], myid: [3, 0.3], tests: [3, 1.9] } as const;
const SIM_EDGES = [{ from: "domain", to: "port" }, { from: "port", to: "adapter" }, { from: "port", to: "simulator" }, { from: "adapter", to: "myid" }, { from: "tests", to: "simulator" }] as const;
const WALL = { adapter: [0, 1], breaker: [1.5, 1], myid: [3, 1] } as const;
const WALL_EDGES = [{ from: "adapter", to: "breaker" }, { from: "breaker", to: "myid" }] as const;
const DOWN = (a: HeeyId, b: HeeyId) => ({ [a]: [0.5, 1], [b]: [2.5, 1] }) as Partial<Record<HeeyId, readonly [number, number]>>;

export const diagram: DiagramStep<HeeyId>[] = [
  // The spinner.
  { cue: 0, layout: SPIN, edges: [...SPIN_EDGES], accent: ["mobileBank"], badges: { mobileBank: "MyID check" } },
  { cue: 1, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], packets: [{ from: "mobileBank", to: "myid", label: "open session", stopAt: 0.6 }], badges: { myid: "slow… silent" } },
  { cue: 2, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], badges: { mobileBank: "spinner" } },
  { cue: 3, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], badges: { aziz: "and me?", mobileBank: "spinner" } },
  // Domain, ports, adapters.
  { cue: 6, layout: { domain: [1.5, 1] }, accent: ["domain"] },
  { cue: 7, layout: { domain: [1.5, 1] }, badges: { domain: "registration · proofing · login" } },
  { cue: 8, layout: { domain: [1.5, 1] }, badges: { domain: "no input, no output" } },
  { cue: 9, layout: { domain: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "domain", to: "myid", broken: true }], crossed: ["myid"], badges: { domain: "never calls out" } },
  { cue: 10, layout: { domain: [0.5, 1], port: [2, 1] }, edges: [{ from: "domain", to: "port" }], accent: ["port"] },
  { cue: 11, layout: { domain: [0.5, 1], port: [2, 1] }, edges: [{ from: "domain", to: "port" }], packets: [{ from: "domain", to: "port", label: "open proofing session" }], badges: { port: "domain words" } },
  { cue: 12, layout: CHAIN, edges: [...CHAIN_EDGES], accent: ["adapter"], packets: [{ from: "adapter", to: "myid", label: "HTTPS" }] },
  // Simulators.
  { cue: 14, layout: SIM, edges: [...SIM_EDGES], accent: ["simulator"] },
  { cue: 15, layout: SIM, edges: [...SIM_EDGES], badges: { simulator: "success · failures · timeout · down" } },
  { cue: 16, layout: SIM, edges: [...SIM_EDGES], accent: ["tests"], packets: [{ from: "tests", to: "simulator", label: "acceptance" }], badges: { tests: "no internet" } },
  { cue: 17, layout: SIM, edges: [...SIM_EDGES], badges: { myid: "nightly: test environment" } },
  { cue: 18, layout: SIM, edges: [...SIM_EDGES], accent: ["simulator"], badges: { simulator: "skipped, then missed" } },
  { cue: 19, layout: SIM, edges: [...SIM_EDGES], badges: { simulator: "the bad days too" } },
  // Timeout, breaker, probe.
  { cue: 21, layout: WALL, edges: [...WALL_EDGES], badges: { adapter: "timeout: policy" } },
  { cue: 22, layout: WALL, edges: [...WALL_EDGES], accent: ["breaker"] },
  { cue: 23, layout: WALL, edges: [{ from: "adapter", to: "breaker" }, { from: "breaker", to: "myid", broken: true }], danger: ["breaker"], packets: [{ from: "adapter", to: "breaker", label: "call", stopAt: 0.9 }], badges: { breaker: "open: fail at once" } },
  { cue: 24, layout: WALL, edges: [...WALL_EDGES], packets: [{ from: "breaker", to: "myid", label: "probe" }], accent: ["breaker"], badges: { breaker: "probe → close" } },
  { cue: 25, layout: { ...WALL, platformTeam: [1.5, 2.1] }, edges: [...WALL_EDGES, { from: "breaker", to: "platformTeam" }], danger: ["breaker"], badges: { platformTeam: "alert: dependency down" } },
  { cue: 26, layout: WALL, edges: [...WALL_EDGES], accent: ["adapter"], badges: { adapter: "one fixed behaviour" } },
  { cue: 27, layout: { domain: [0, 1], adapter: [1.5, 1], myid: [3, 1] }, edges: [{ from: "domain", to: "adapter" }, { from: "adapter", to: "myid", broken: true }], badges: { adapter: "no bypass" } },
  { cue: 28, layout: { domain: [0, 1], adapter: [1.5, 1], myid: [3, 1] }, edges: [{ from: "domain", to: "adapter" }, { from: "adapter", to: "myid", broken: true }], packets: [{ from: "adapter", to: "domain", label: "named outcome" }], badges: { domain: "no raw exception" } },
  // The fixed behaviours, one picture per dependency.
  { cue: 30, layout: DOWN("aziz", "myid"), edges: [{ from: "aziz", to: "myid", broken: true }], danger: ["myid"], badges: { aziz: "level kept" } },
  { cue: 31, layout: DOWN("aziz", "myid"), edges: [{ from: "aziz", to: "myid", broken: true }], danger: ["myid"], badges: { aziz: "attempt not counted", myid: "no later proofing" } },
  { cue: 32, layout: { platform: [0, 1], taf: [1.5, 0.4], sms: [3, 1.4] }, edges: [{ from: "platform", to: "taf", broken: true }, { from: "platform", to: "sms" }], danger: ["taf"], packets: [{ from: "platform", to: "sms", label: "code" }], badges: { platform: "not scored" } },
  { cue: 33, layout: { platform: [0, 1], taf: [1.5, 0.4], sms: [3, 1.4] }, edges: [{ from: "platform", to: "taf" }, { from: "platform", to: "sms", broken: true }], crossed: ["sms"], badges: { taf: "trusted bank: refused", sms: "no fallback" } },
  { cue: 34, layout: DOWN("platform", "sms"), edges: [{ from: "platform", to: "sms", broken: true }], danger: ["sms"], badges: { platform: "service not available" } },
  { cue: 35, layout: { platform: [0, 1], kafka: [1.5, 1], sms: [3, 1] }, edges: [{ from: "platform", to: "kafka" }, { from: "kafka", to: "sms" }], danger: ["sms"], packets: [{ from: "platform", to: "kafka", label: "notification" }], badges: { kafka: "waits, sends again" } },
  { cue: 36, layout: { platform: [0, 1.4], push: [1.5, 0.2], trusted: [3, 1.4] }, edges: [{ from: "platform", to: "push", broken: true }, { from: "trusted", to: "platform", label: "asks" }], danger: ["push"], packets: [{ from: "trusted", to: "platform", label: "pending request?" }], badges: { platform: "notifications: SMS" } },
  { cue: 37, layout: DOWN("platform", "records"), edges: [{ from: "platform", to: "records", broken: true }], danger: ["records"], badges: { platform: "link pending · step-up ✓", records: "worker retries" } },
  { cue: 38, layout: { platform: [0, 1], kafka: [1.5, 1], antifraud: [3, 1] }, edges: [{ from: "platform", to: "kafka" }, { from: "kafka", to: "antifraud", broken: true }], danger: ["antifraud"], badges: { kafka: "events wait", platform: "no journey waits" } },
  // Back to Aziz.
  { cue: 39, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], badges: { mobileBank: "spinner" } },
  { cue: 40, layout: { mobileBank: [0, 1], adapter: [1.5, 1], myid: [3, 1] }, edges: [{ from: "mobileBank", to: "adapter" }, { from: "adapter", to: "myid", broken: true }], danger: ["myid"], packets: [{ from: "adapter", to: "mobileBank", label: "provider not available" }] },
  { cue: 41, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], accent: ["aziz"], badges: { aziz: "level 1 kept", mobileBank: "plain message" } },
  { cue: 42, layout: SPIN, edges: [...SPIN_EDGES], danger: ["myid"], badges: { aziz: "not counted" } },
  { cue: 43, layout: WALL, edges: [{ from: "adapter", to: "breaker" }, { from: "breaker", to: "myid", broken: true }], danger: ["breaker"], shake: { breaker: 0.3 }, badges: { breaker: "open: answer at once" } },
  { cue: 44, layout: { panel: [0.5, 1], myid: [2.5, 1] }, edges: [{ from: "panel", to: "myid" }], danger: ["myid"], badges: { panel: "MyID: down" } },
  { cue: 45, layout: WALL, edges: [...WALL_EDGES], accent: ["myid"], packets: [{ from: "breaker", to: "myid", label: "probe ✓" }], badges: { breaker: "closed" } },
  // Two more rules.
  { cue: 47, layout: { adapter: [0.5, 1], log: [2.5, 1] }, edges: [{ from: "adapter", to: "log" }], packets: [{ from: "adapter", to: "log", label: "body", stopAt: 0.6 }], badges: { log: "no bodies" } },
  { cue: 48, layout: { adapter: [0.5, 1], log: [2.5, 1] }, edges: [{ from: "adapter", to: "log" }], accent: ["log"], packets: [{ from: "adapter", to: "log", label: "ref · outcome · time" }] },
  { cue: 49, layout: { tofu: [0, 0.4], vault: [0, 1.7], adapter: [1.5, 1], code: [3, 1] }, edges: [{ from: "tofu", to: "adapter", label: "hosts" }, { from: "vault", to: "adapter", label: "credentials" }], crossed: ["code"], badges: { code: "no hosts, no secrets" } },
  { cue: 50, layout: { platform: [0, 1], adapter: [1.5, 1], myid: [3, 0.4], push: [3, 1.6] }, edges: [{ from: "platform", to: "adapter" }, { from: "adapter", to: "myid" }, { from: "adapter", to: "push" }], accent: ["adapter"], badges: { adapter: "own services, own credentials" } },
  // Recap.
  { cue: 51, layout: { domain: [1.5, 1] }, accent: ["domain"], badges: { domain: "no input, no output" } },
  { cue: 52, layout: SIM, edges: [...SIM_EDGES], accent: ["adapter", "simulator"] },
  { cue: 53, layout: WALL, edges: [...WALL_EDGES], accent: ["breaker"], badges: { adapter: "timeout", breaker: "one behaviour each" } },
  { cue: 54, layout: SPIN, edges: [...SPIN_EDGES], accent: ["aziz"], badges: { aziz: "seconds, not forever" } },
  { cue: 56, layout: { platform: [0.5, 1], postgres: [2.5, 1] }, edges: [{ from: "platform", to: "postgres" }], badges: { postgres: "passports: encrypted" } },
];
