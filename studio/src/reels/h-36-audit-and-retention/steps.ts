import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 36: audit and retention. Aziz's letter (0–6); one event, and what it never holds (7–16); the chain
// that nobody can rewrite (17–26); who reads the stream (27–31); the answer to the letter (32–37); a clock
// for every record (38–47); the close and the open question (48–52).
const UNIT = { heeyid: "in the bank" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 6, rows: [6], current: ["kafka", "workers"], dot: "kafka", units: { heeyid: "lesson 35: the outbox" } },
  { cue: 6, part: 6, rows: [6], current: ["postgres", "kafka", "vault", "workers"], dot: "postgres", units: { heeyid: "audit events" } },
  { cue: 27, part: 6, rows: [6], current: ["kafka", "perimeter"], dot: "kafka", units: { heeyid: "audit topic → the bank's monitoring" } },
  { cue: 38, part: 6, rows: [6], current: ["postgres", "workers"], dot: "workers", units: { heeyid: "retention: the deletion job" } },
  { cue: 52, part: 6, rows: [6], dot: "off", units: UNIT },
];

const LETTER = { aziz: [0.5, 1], platform: [2.5, 1] } as const;
const ONE = { ev2: [1.5, 1] } as const;
const CHAIN = { ev1: [0, 1], ev2: [1, 1], ev3: [2, 1] } as const;
const CHAIN_EDGES = [{ from: "ev1", to: "ev2" }, { from: "ev2", to: "ev3" }] as const;
const KEYED = { ...CHAIN, vault: [1, 2], postgres: [1, 0], workers: [3, 1] } as const;
const KEYED_EDGES = [...CHAIN_EDGES, { from: "vault", to: "ev2" }, { from: "ev3", to: "workers" }] as const;
const FEED = { platform: [0, 1], kafka: [1.5, 1], monitoring: [3, 0.3], antifraud: [3, 1.7] } as const;
const NIGHT = { marketplace: [0, 0.3], platform: [1.5, 0.3], trusted: [3, 0.3], phoneThief: [3, 1.7], operator: [1.5, 1.7] } as const;
const NIGHT_EDGES = [{ from: "marketplace", to: "platform" }, { from: "platform", to: "trusted" }, { from: "phoneThief", to: "trusted" }] as const;
const CLOCKS = { otc: [0, 0.3], registrationRec: [1.5, 0.3], identityOld: [3, 0.3], identity: [0, 1.7], auditTrail: [1.5, 1.7], versions: [3, 1.7] } as const;
const CLOCK_BADGES = [
  { otc: "until used or expired" },
  { registrationRec: "registration-expiry period" },
  { identityOld: "identity retention, from replacement" },
  { identity: "life, then identity retention" },
  { auditTrail: "audit retention · full days" },
  { versions: "life of the installation" },
];
const clocks = (n: number) => Object.assign({}, ...CLOCK_BADGES.slice(0, n));

export const diagram: DiagramStep<HeeyId>[] = [
  // Six months later: a letter.
  { cue: 0, layout: LETTER, edges: [{ from: "aziz", to: "platform" }], packets: [{ from: "aziz", to: "platform", label: "a letter" }] },
  { cue: 1, layout: LETTER, edges: [{ from: "aziz", to: "platform" }], badges: { aziz: "laptop approved? not me" } },
  { cue: 3, layout: LETTER, edges: [{ from: "aziz", to: "platform" }], accent: ["platform"], badges: { platform: "the truth, provable" } },
  { cue: 4, layout: { auditTrail: [1.5, 1] }, accent: ["auditTrail"], badges: { auditTrail: "who can rewrite it?" } },
  // One event: what it holds, and what it never holds.
  { cue: 7, layout: ONE, accent: ["ev2"] },
  { cue: 8, layout: ONE, badges: { ev2: "type · app · time · actor" } },
  { cue: 9, layout: ONE, badges: { ev2: "device · address · session" } },
  { cue: 10, layout: ONE, badges: { ev2: "result · reason · reader · purpose" } },
  { cue: 11, layout: ONE, badges: { ev2: "registration … resets" } },
  { cue: 12, layout: ONE, danger: ["ev2"], badges: { ev2: "never inside:" } },
  { cue: 13, layout: ONE, badges: { ev2: "no images · documents · addresses" } },
  { cue: 14, layout: ONE, badges: { ev2: "no codes · passwords · grants" } },
  { cue: 15, layout: ONE, accent: ["ev2"], badges: { ev2: "ID number: first 2 · last 2" } },
  { cue: 16, layout: { ev2: [0.5, 1], monitoring: [2.5, 1] }, edges: [{ from: "ev2", to: "monitoring" }], packets: [{ from: "ev2", to: "monitoring", label: "safe to travel" }] },
  // Nobody can change it: append only, and an HMAC chain.
  { cue: 18, layout: CHAIN, edges: [...CHAIN_EDGES], accent: ["ev3"], badges: { ev3: "added only" } },
  { cue: 19, layout: CHAIN, edges: [...CHAIN_EDGES], badges: { ev2: "no change · no delete" } },
  { cue: 20, layout: { ...CHAIN, postgres: [1, 0] }, edges: [...CHAIN_EDGES], accent: ["postgres"], badges: { postgres: "app role: no UPDATE · no DELETE" } },
  { cue: 21, layout: CHAIN, edges: [...CHAIN_EDGES], badges: { ev1: "direct database access?" } },
  { cue: 22, layout: CHAIN, edges: [...CHAIN_EDGES], accent: ["ev2"], badges: { ev2: "HMAC(sequence, previous, event)" } },
  { cue: 23, layout: { ...CHAIN, vault: [1, 2] }, edges: [...CHAIN_EDGES, { from: "vault", to: "ev2" }], accent: ["vault"], badges: { vault: "audit key" } },
  { cue: 24, layout: CHAIN, edges: [...CHAIN_EDGES], danger: ["ev1", "ev2", "ev3"], shake: { ev1: 0.2 }, badges: { ev1: "edited", ev3: "no match" } },
  { cue: 25, layout: KEYED, edges: [...KEYED_EDGES], accent: ["workers"], packets: [{ from: "workers", to: "ev3", label: "verify" }], badges: { workers: "each day: alert at a break" } },
  { cue: 26, layout: KEYED, edges: [...KEYED_EDGES], accent: ["ev1", "ev2", "ev3"], badges: { ev3: "the bank can check" } },
  // Who reads it: monitoring, antifraud, Compliance.
  { cue: 28, layout: FEED, edges: [{ from: "platform", to: "kafka" }, { from: "kafka", to: "monitoring" }], accent: ["monitoring"], packets: [{ from: "kafka", to: "monitoring", label: "audit · within seconds" }] },
  { cue: 29, layout: FEED, edges: [{ from: "platform", to: "kafka" }, { from: "kafka", to: "monitoring", broken: true }], badges: { kafka: "kept · sent later in order" } },
  { cue: 30, layout: FEED, edges: [{ from: "platform", to: "kafka" }, { from: "kafka", to: "monitoring" }, { from: "kafka", to: "antifraud" }], accent: ["antifraud"], packets: [{ from: "kafka", to: "antifraud", label: "risk: references only" }] },
  { cue: 31, layout: { compliance: [0.5, 1], auditTrail: [2.5, 1] }, edges: [{ from: "auditTrail", to: "compliance" }], accent: ["compliance"], packets: [{ from: "auditTrail", to: "compliance", label: "period · customer · type" }] },
  // The answer to the letter.
  { cue: 33, layout: { compliance: [0.5, 1], auditTrail: [2.5, 1] }, edges: [{ from: "auditTrail", to: "compliance" }], badges: { compliance: "that Friday" } },
  { cue: 34, layout: NIGHT, edges: [...NIGHT_EDGES], packets: [{ from: "marketplace", to: "platform", label: "web login" }, { from: "platform", to: "trusted", label: "approval request", delay: 45 }], badges: { platform: "password ✓" } },
  { cue: 35, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["phoneThief"], packets: [{ from: "trusted", to: "platform", label: "Approve" }], badges: { trusted: "after the theft" } },
  { cue: 36, layout: NIGHT, edges: [...NIGHT_EDGES, { from: "operator", to: "platform" }], crossed: ["trusted"], packets: [{ from: "operator", to: "platform", label: "block" }], badges: { trusted: "revoked later" } },
  { cue: 37, layout: NIGHT, edges: [...NIGHT_EDGES, { from: "operator", to: "platform" }], crossed: ["trusted"], accent: ["platform"], badges: { trusted: "the stolen phone", platform: "chain verifies ✓" } },
  // A clock for every record.
  { cue: 39, layout: CLOCKS, accent: ["otc", "registrationRec", "identityOld", "identity", "auditTrail", "versions"] },
  { cue: 40, layout: CLOCKS, accent: ["otc"], badges: clocks(1) },
  { cue: 41, layout: CLOCKS, accent: ["registrationRec"], badges: clocks(2) },
  { cue: 42, layout: CLOCKS, accent: ["identityOld"], badges: clocks(3) },
  { cue: 43, layout: CLOCKS, accent: ["identity"], badges: clocks(4) },
  { cue: 44, layout: CLOCKS, accent: ["auditTrail"], badges: clocks(5) },
  { cue: 45, layout: CLOCKS, accent: ["versions"], badges: clocks(6) },
  { cue: 46, layout: { ...CLOCKS, workers: [1.5, 1] }, accent: ["workers"], badges: { ...clocks(6), workers: "active store + backups" } },
  { cue: 47, layout: { ...CLOCKS, workers: [1.5, 1] }, accent: ["workers"], badges: { ...clocks(6), workers: "monthly deletion report" } },
  // Recap and the open question.
  { cue: 48, layout: ONE, accent: ["ev2"], badges: { ev2: "no secret inside" } },
  { cue: 49, layout: KEYED, edges: [...KEYED_EDGES], accent: ["vault"] },
  { cue: 50, layout: { compliance: [0.5, 0.3], operator: [0.5, 1.7], platform: [2.5, 1] }, edges: [{ from: "compliance", to: "platform" }, { from: "operator", to: "platform" }] },
  { cue: 51, layout: { compliance: [0.5, 0.3], operator: [0.5, 1.7], platform: [2.5, 1] }, edges: [{ from: "compliance", to: "platform" }, { from: "operator", to: "platform" }], badges: { compliance: "who?", operator: "who checks?" } },
];
