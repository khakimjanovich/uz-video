import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 21: the audit trail and retention, months after the lost phone. The letter and the question (0–4); the
// bridge (5–8); one event and what it never holds (9–17); the outbox and the two readers (18–22); add only (23–27);
// the HMAC chain and the daily check (28–38); the answer to the letter (39–48); retention (49–58); the check
// (59–61); summary and hand-off (62–67).
const UNIT = { heeyid: "audit trail" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 0, part: 6, rows: [6], current: ["customer", "staff"], dot: "staff" },
  { cue: 5, part: 6, rows: [6], current: ["staff", "admingw"], dot: "admingw", units: { heeyid: "lesson 19: block, unblock" } },
  { cue: 6, part: 6, rows: [6], current: ["kafka", "adapters", "sms", "push"], dot: "push", units: { heeyid: "lesson 20: messages" } },
  { cue: 8, part: 6, rows: [6], current: ["postgres", "kafka"], dot: "postgres", units: UNIT },
  { cue: 18, part: 6, rows: [6], current: ["custgw", "admingw", "kafka"], dot: "kafka", units: { heeyid: "outbox → Kafka" } },
  { cue: 20, part: 6, rows: [6], current: ["kafka", "perimeter"], dot: "kafka", units: { heeyid: "feed → bank monitoring" } },
  { cue: 22, part: 6, rows: [6], current: ["kafka", "workers", "postgres"], dot: "postgres", units: UNIT },
  { cue: 31, part: 6, rows: [6], current: ["workers", "vault"], dot: "vault", units: { heeyid: "audit key" } },
  { cue: 37, part: 6, rows: [6], current: ["workers", "postgres"], dot: "workers", units: { heeyid: "daily check" } },
  { cue: 39, part: 6, rows: [6], current: ["customer", "staff"], dot: "staff", units: UNIT },
  { cue: 49, part: 6, rows: [6], current: ["workers", "postgres"], dot: "workers", units: { heeyid: "retention job" } },
  { cue: 59, part: 6, rows: [6], current: ["workers", "postgres"], dot: "postgres", units: UNIT },
  { cue: 62, part: 6, rows: [6], dot: "off", units: UNIT },
  { cue: 66, part: 6, rows: [6], current: ["perimeter"], dot: "off", units: { heeyid: "lesson 22: installing" } },
];

const LETTER = { aziz: [0.5, 1], platform: [2.5, 1] } as const;
const LETTER_EDGES = [{ from: "aziz", to: "platform" }] as const;
const ONE = { ev2: [1.5, 1] } as const;
const ROAD = { platform: [0, 1], outbox: [1, 1], kafka: [2, 1], monitoring: [3, 0.3], auditTrail: [3, 1.7] } as const;
const ROAD_IN = [{ from: "platform", to: "outbox" }, { from: "outbox", to: "kafka" }] as const;
const ROAD_EDGES = [...ROAD_IN, { from: "kafka", to: "monitoring" }, { from: "kafka", to: "auditTrail" }] as const;
const CHAIN = { ev1: [0, 1], ev2: [1.5, 1], ev3: [3, 1] } as const;
const CHAIN_EDGES = [{ from: "ev1", to: "ev2" }, { from: "ev2", to: "ev3" }] as const;
const DB = { ...CHAIN, postgres: [1.5, 0.1] } as const;
const KEYED = { ...CHAIN, vault: [1.5, 2] } as const;
const KEYED_EDGES = [...CHAIN_EDGES, { from: "vault", to: "ev2" }] as const;
const CHECKED = { ...CHAIN, workers: [0.75, 2], platformTeam: [2.25, 2] } as const;
const CHECKED_EDGES = [...CHAIN_EDGES, { from: "workers", to: "platformTeam" }] as const;
const LOOKUP = { monitoring: [0, 1], ev1: [1.5, 0.1], ev2: [1.5, 1], ev3: [1.5, 1.9], staff: [3, 0.4], trusted: [3, 1.6] } as const;
const LOOKUP_EDGES = [{ from: "monitoring", to: "ev1" }, { from: "monitoring", to: "ev2" }, { from: "monitoring", to: "ev3" }] as const;
const WEEKEND = { ev1: [1.5, 0.1], ev2: [1.5, 1], ev3: [1.5, 1.9] } as const;
const FRI = { ev1: "Fri · blocked · operator" };
const SAT = { ev2: "Sat · access refused" };
const SUN = { ev3: "Sun · unblock · second operator" };
const CLOCKS = { otc: [0, 0.3], registrationRec: [1.5, 0.3], identity: [3, 0.3], auditTrail: [0, 1.7], versions: [1.5, 1.7], workers: [3, 1.7] } as const;
const CLOCK_BADGES = [
  { otc: "until used or expired" },
  { registrationRec: "until its time runs out" },
  { identity: "while a customer" },
  { identity: "after closure: keeping time" },
  { auditTrail: "regulation · whole days" },
  { versions: "life of the installation" },
  { workers: "database + backups" },
];
const clocks = (n: number) => Object.assign({}, ...CLOCK_BADGES.slice(0, n));

export const diagram: DiagramStep<HeeyId>[] = [
  // A letter, months later.
  { cue: 0, layout: LETTER, edges: [...LETTER_EDGES], packets: [{ from: "aziz", to: "platform", label: "a letter" }] },
  { cue: 2, layout: LETTER, edges: [...LETTER_EDGES], badges: { aziz: "phone gone: Fri → Sun" } },
  { cue: 3, layout: LETTER, edges: [...LETTER_EDGES], badges: { aziz: "did anyone use it?" } },
  { cue: 4, layout: LETTER, edges: [...LETTER_EDGES], accent: ["platform"], badges: { platform: "an answer, with proof" } },
  // Bridge: lessons 19 and 20, and the record that stays.
  { cue: 5, layout: { staff: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "staff", to: "platform" }], badges: { staff: "block: one · unblock: two" } },
  { cue: 6, layout: { platform: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "platform", to: "trusted" }], packets: [{ from: "platform", to: "trusted", label: "account blocked" }] },
  { cue: 7, layout: { platform: [0.5, 1], auditTrail: [2.5, 1] }, edges: [{ from: "platform", to: "auditTrail" }], packets: [{ from: "platform", to: "auditTrail", label: "a record" }] },
  { cue: 8, layout: { auditTrail: [1.5, 1] }, accent: ["auditTrail"] },
  // One event: what it holds, and what it never holds.
  { cue: 9, layout: ONE, accent: ["ev2"] },
  { cue: 10, layout: ONE, badges: { ev2: "what · app · time" } },
  { cue: 11, layout: ONE, badges: { ev2: "customer · staff · platform" } },
  { cue: 12, layout: ONE, badges: { ev2: "device · address · result · reason" } },
  { cue: 13, layout: ONE, badges: { ev2: "registration … messages" } },
  { cue: 14, layout: ONE, danger: ["ev2"], badges: { ev2: "never a secret" } },
  { cue: 15, layout: ONE, danger: ["ev2"], badges: { ev2: "no code · password · image · address" } },
  { cue: 16, layout: ONE, accent: ["ev2"], badges: { ev2: "personal number: 12••••••••34" } },
  { cue: 17, layout: { ev2: [0.5, 1], monitoring: [2.5, 1] }, edges: [{ from: "ev2", to: "monitoring" }], packets: [{ from: "ev2", to: "monitoring", label: "safe to travel" }] },
  // The road: outbox, Kafka, two readers.
  { cue: 18, layout: ROAD, edges: [ROAD_IN[0]], accent: ["outbox"], packets: [{ from: "platform", to: "outbox", label: "same step" }] },
  { cue: 19, layout: ROAD, edges: [...ROAD_EDGES], accent: ["kafka"] },
  { cue: 20, layout: ROAD, edges: [...ROAD_EDGES], accent: ["monitoring"], packets: [{ from: "kafka", to: "monitoring", label: "within seconds" }] },
  { cue: 21, layout: ROAD, edges: [...ROAD_IN, { from: "kafka", to: "monitoring", broken: true }, { from: "kafka", to: "auditTrail" }], badges: { kafka: "waits · then in order" } },
  { cue: 22, layout: ROAD, edges: [...ROAD_EDGES], accent: ["auditTrail"], packets: [{ from: "kafka", to: "auditTrail", label: "audit module" }] },
  // Add only.
  { cue: 23, layout: CHAIN, edges: [...CHAIN_EDGES], accent: ["ev3"], badges: { ev3: "added" } },
  { cue: 24, layout: CHAIN, edges: [...CHAIN_EDGES], badges: { ev2: "no change · no delete" } },
  { cue: 25, layout: DB, edges: [...CHAIN_EDGES], accent: ["postgres"], badges: { postgres: "refuses change · delete" } },
  { cue: 26, layout: DB, edges: [...CHAIN_EDGES], danger: ["postgres"], badges: { postgres: "full access: refusal off?" } },
  { cue: 27, layout: CHAIN, edges: [...CHAIN_EDGES], accent: ["ev1", "ev2", "ev3"] },
  // The HMAC chain.
  { cue: 28, layout: CHAIN, edges: [...CHAIN_EDGES], badges: { ev1: "No. 41", ev2: "No. 42", ev3: "No. 43" } },
  { cue: 29, layout: CHAIN, edges: [...CHAIN_EDGES], accent: ["ev2"], badges: { ev2: "HMAC seal" } },
  { cue: 30, layout: CHAIN, edges: [...CHAIN_EDGES], accent: ["ev2"], badges: { ev2: "number · seal of 41 · event" } },
  { cue: 31, layout: KEYED, edges: [...KEYED_EDGES], accent: ["vault"], badges: { vault: "audit key" } },
  { cue: 32, layout: KEYED, edges: [...KEYED_EDGES], badges: { vault: "audit module only" } },
  { cue: 33, layout: KEYED, edges: [...KEYED_EDGES], accent: ["ev1", "ev2", "ev3"], badges: { ev3: "holds the seal of 42" } },
  { cue: 34, layout: CHAIN, edges: [...CHAIN_EDGES], danger: ["ev1"], shake: { ev1: 0.2 }, badges: { ev1: "changed: seal ✕" } },
  { cue: 35, layout: CHAIN, edges: [...CHAIN_EDGES], danger: ["ev1", "ev2", "ev3"], badges: { ev1: "seal fixed", ev2: "seal ✕", ev3: "seal ✕" } },
  { cue: 36, layout: KEYED, edges: [...KEYED_EDGES], accent: ["vault"], badges: { vault: "no key: no fit" } },
  { cue: 37, layout: CHECKED, edges: [...CHAIN_EDGES], accent: ["workers"], badges: { workers: "each day" } },
  { cue: 38, layout: CHECKED, edges: [...CHECKED_EDGES], accent: ["platformTeam"], packets: [{ from: "workers", to: "platformTeam", label: "alert" }] },
  // The answer to the letter.
  { cue: 39, layout: LETTER, edges: [...LETTER_EDGES], badges: { aziz: "the letter" } },
  { cue: 40, layout: LOOKUP, edges: [...LOOKUP_EDGES], accent: ["monitoring"], badges: { monitoring: "Fri → Sun" } },
  { cue: 41, layout: LOOKUP, edges: [...LOOKUP_EDGES], accent: ["ev1"], badges: { ...FRI, staff: "reason: phone lost" } },
  { cue: 42, layout: LOOKUP, edges: [...LOOKUP_EDGES], crossed: ["trusted"], badges: { ...FRI, trusted: "access ended" } },
  { cue: 43, layout: LOOKUP, edges: [...LOOKUP_EDGES, { from: "trusted", to: "ev2" }], crossed: ["trusted"], accent: ["ev2"], packets: [{ from: "trusted", to: "ev2", label: "access?", stopAt: 0.6 }], badges: { ...FRI, ...SAT } },
  { cue: 44, layout: WEEKEND, accent: ["ev2"], badges: { ...FRI, ...SAT } },
  { cue: 45, layout: LOOKUP, edges: [...LOOKUP_EDGES], accent: ["ev3", "staff"], badges: { ...FRI, ...SAT, ...SUN, staff: "asks · second approves" } },
  { cue: 46, layout: LOOKUP, edges: [...LOOKUP_EDGES], accent: ["trusted"], badges: { ...FRI, ...SAT, ...SUN, trusted: "account unblocked" } },
  { cue: 47, layout: { ...WEEKEND, workers: [3, 1] }, accent: ["workers"], badges: { ...FRI, ...SAT, ...SUN, workers: "no break ✓" } },
  { cue: 48, layout: LETTER, edges: [...LETTER_EDGES], accent: ["aziz"], packets: [{ from: "platform", to: "aziz", label: "nobody used it" }] },
  // Retention: a keeping time for each kind of data.
  { cue: 49, layout: CLOCKS, accent: ["otc", "registrationRec", "identity", "auditTrail", "versions"] },
  { cue: 50, layout: CLOCKS, accent: ["workers"], badges: { workers: "keeping times: the bank" } },
  { cue: 51, layout: CLOCKS, accent: ["otc"], badges: clocks(1) },
  { cue: 52, layout: CLOCKS, accent: ["registrationRec"], badges: clocks(2) },
  { cue: 53, layout: CLOCKS, accent: ["identity"], badges: clocks(3) },
  { cue: 54, layout: CLOCKS, accent: ["identity"], badges: clocks(4) },
  { cue: 55, layout: CLOCKS, accent: ["auditTrail"], badges: clocks(5) },
  { cue: 56, layout: CLOCKS, accent: ["versions"], badges: clocks(6) },
  { cue: 57, layout: CLOCKS, accent: ["workers"], badges: clocks(7) },
  { cue: 58, layout: CLOCKS, accent: ["auditTrail"], crossed: ["otc", "registrationRec"], badges: { auditTrail: "events stay · masked" } },
  // The check.
  { cue: 59, layout: CHAIN, edges: [...CHAIN_EDGES] },
  { cue: 60, layout: CHAIN, edges: [...CHAIN_EDGES], crossed: ["ev2"], badges: { ev2: "deleted at night" } },
  { cue: 61, layout: { ev1: [0, 1], ev3: [3, 1], workers: [0.75, 2], platformTeam: [2.25, 2] }, edges: [{ from: "ev1", to: "ev3", broken: true }, { from: "workers", to: "platformTeam" }], danger: ["ev3"], packets: [{ from: "workers", to: "platformTeam", label: "alert" }], badges: { ev3: "seal does not fit" } },
  // Summary and hand-off.
  { cue: 62, layout: ONE, accent: ["ev2"], badges: { ev2: "no secret inside" } },
  { cue: 63, layout: ROAD, edges: [...ROAD_EDGES], accent: ["monitoring"] },
  { cue: 64, layout: KEYED, edges: [...KEYED_EDGES], accent: ["ev1", "ev2", "ev3"] },
  { cue: 65, layout: CLOCKS, accent: ["auditTrail", "workers"], crossed: ["otc", "registrationRec"] },
  { cue: 66, layout: { platform: [1.5, 1] }, accent: ["platform"] },
];
