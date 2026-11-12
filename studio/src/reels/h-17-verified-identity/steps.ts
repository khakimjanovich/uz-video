import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 14: the verified identity. Aziz confirms his data after the lift (cues 0–3); the bridge (4–6);
// what the record holds (7–13); Vault in one line (14–15); one door and the short list (16–25);
// who never gets it (26–29); the trace (30–37); the check (38–40); the summary (41–43); the close (44–46).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 4, part: 4, rows: [4], current: ["custgw", "postgres", "myid"], dot: "postgres", units: { heeyid: "lesson 13: the MyID result" } },
  { cue: 6, part: 4, rows: [4], current: ["custgw", "postgres", "vault"], dot: "vault", units: { heeyid: "holds · opens · trace" } },
  { cue: 41, part: 4, rows: [4], current: ["custgw", "admingw", "postgres", "vault"], dot: "off", units: { heeyid: "one protected class" } },
  { cue: 46, part: 4, rows: [4], dot: "off", units: { heeyid: "in the bank" } },
];

const CONFIRM = { azizPhone: [0, 1], platform: [1.5, 1], identity: [3, 1] } as const;
const CONFIRM_EDGES = [{ from: "azizPhone", to: "platform" }, { from: "platform", to: "identity" }] as const;
const RESULT = { myid: [0, 1], platform: [1.5, 1], identity: [3, 1] } as const;
const RESULT_EDGES = [{ from: "myid", to: "platform" }, { from: "platform", to: "identity" }] as const;
const KEYS = { identity: [0, 1], platform: [1.5, 1], vault: [3, 1] } as const;
const KEY_EDGES = [{ from: "platform", to: "identity" }, { from: "platform", to: "vault" }] as const;
const DOOR = { caseOperator: [0, 0.3], mobileBank: [0, 1.7], platform: [1.5, 1], identity: [3, 1] } as const;
const DOOR_EDGES = [{ from: "caseOperator", to: "platform" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "identity" }] as const;
const RELEASE = { identity: [0, 1], platform: [1.4, 1], mobileBank: [3, 0], workers: [3, 1], caseOperator: [3, 2] } as const;
const RELEASE_EDGES = [{ from: "identity", to: "platform" }, { from: "platform", to: "mobileBank" }, { from: "platform", to: "workers" }, { from: "platform", to: "caseOperator" }] as const;
const NEVER = { platform: [0, 1], mobileBank: [1.8, 0], antifraud: [1.8, 2], audit: [3, 1] } as const;
const NEVER_EDGES = [{ from: "platform", to: "mobileBank" }, { from: "platform", to: "antifraud" }, { from: "platform", to: "audit" }] as const;
const TRACE = { caseOperator: [0, 1], platform: [1.5, 1], audit: [3, 1] } as const;
const TRACE_EDGES = [{ from: "caseOperator", to: "platform" }, { from: "platform", to: "audit" }] as const;
const TWO = { thief: [0, 0.3], caseOperator: [0, 1.7], identity: [1.5, 1], audit: [3, 1] } as const;
const TWO_EDGES = [{ from: "thief", to: "identity" }, { from: "caseOperator", to: "identity" }, { from: "identity", to: "audit" }] as const;
const CHECK = { mobileBank: [0.5, 1], identity: [2.5, 1] } as const;
const SUM = { vault: [0, 1], identity: [1.5, 1], audit: [3, 1] } as const;
const SUM_EDGES = [{ from: "vault", to: "identity" }, { from: "identity", to: "audit" }] as const;
const CLOSE = { identity: [0.5, 1], azizPhone: [2.5, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // After the lift: Aziz confirms, and his data is in the bank.
  { cue: 0, layout: CONFIRM, edges: [...CONFIRM_EDGES], accent: ["azizPhone"], packets: [{ from: "azizPhone", to: "platform", label: "Confirm" }] },
  { cue: 1, layout: CONFIRM, edges: [...CONFIRM_EDGES], badges: { azizPhone: "his data" } },
  { cue: 2, layout: RESULT, edges: [...RESULT_EDGES], packets: [{ from: "myid", to: "platform", label: "state records" }], badges: { identity: "in the bank" } },
  { cue: 3, layout: RESULT, edges: [...RESULT_EDGES], accent: ["identity"], badges: { identity: "read by whom?" } },
  { cue: 4, layout: RESULT, edges: [...RESULT_EDGES], packets: [{ from: "myid", to: "platform", label: "result for the code" }] },
  { cue: 5, layout: RESULT, edges: [...RESULT_EDGES], accent: ["identity"], badges: { identity: "kept" } },
  { cue: 6, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "holds · opens · trace" } },
  // What the record holds.
  { cue: 8, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "protected class" } },
  { cue: 9, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "names · birth · number · document · addresses" } },
  { cue: 10, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "+ MyID phone number · MyID identifier" } },
  { cue: 11, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "+ images, only if the bank says" } },
  { cue: 12, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "nothing else" } },
  { cue: 13, layout: { identity: [1, 1], azizPhone: [2.5, 1] }, badges: { azizPhone: "personal: other rules" } },
  // Vault, in one line (lesson 6).
  { cue: 14, layout: KEYS, edges: [...KEY_EDGES], accent: ["vault"], badges: { identity: "encrypted", vault: "opens it · lesson 6" } },
  { cue: 15, layout: KEYS, edges: [...KEY_EDGES], accent: ["platform"], badges: { platform: "no clear copy · no log" } },
  // One door, masked by default, and the short list.
  { cue: 16, layout: DOOR, edges: [...DOOR_EDGES], badges: { identity: "who may open it?" } },
  { cue: 17, layout: DOOR, edges: [...DOOR_EDGES], accent: ["platform"], badges: { platform: "one closed part" } },
  { cue: 18, layout: DOOR, edges: [...DOOR_EDGES], packets: [{ from: "caseOperator", to: "platform", label: "ask + purpose" }, { from: "mobileBank", to: "platform", label: "ask + purpose", delay: 35 }] },
  { cue: 19, layout: DOOR, edges: [...DOOR_EDGES], accent: ["platform"], badges: { platform: "masked by default" } },
  { cue: 20, layout: RELEASE, edges: [...RELEASE_EDGES], badges: { platform: "the short list" } },
  { cue: 21, layout: RELEASE, edges: [...RELEASE_EDGES], packets: [{ from: "platform", to: "identity", label: "keep a result" }] },
  { cue: 22, layout: RELEASE, edges: [...RELEASE_EDGES], accent: ["mobileBank"], packets: [{ from: "platform", to: "mobileBank", label: "confirmation" }], badges: { mobileBank: "session phone only" } },
  { cue: 23, layout: RELEASE, edges: [...RELEASE_EDGES], badges: { platform: "phone check" } },
  { cue: 24, layout: RELEASE, edges: [...RELEASE_EDGES], accent: ["workers"], packets: [{ from: "platform", to: "workers", label: "deletion job" }] },
  { cue: 25, layout: RELEASE, edges: [...RELEASE_EDGES], accent: ["caseOperator"], packets: [{ from: "platform", to: "caseOperator", label: "masked" }], badges: { caseOperator: "case · phone review" } },
  // Who never gets it.
  { cue: 26, layout: NEVER, edges: [...NEVER_EDGES], badges: { platform: "never to" } },
  { cue: 27, layout: NEVER, edges: [...NEVER_EDGES], accent: ["mobileBank"], badges: { mobileBank: "summary: level + name" } },
  { cue: 28, layout: NEVER, edges: [...NEVER_EDGES], accent: ["mobileBank"], badges: { mobileBank: "no number · no address · no image" } },
  { cue: 29, layout: NEVER, edges: [...NEVER_EDGES], badges: { antifraud: "no identity data", audit: "no identity data" } },
  // Every release leaves a trace.
  { cue: 30, layout: TRACE, edges: [...TRACE_EDGES], badges: { audit: "the trace" } },
  { cue: 31, layout: TRACE, edges: [...TRACE_EDGES], accent: ["audit"], badges: { audit: "reader + purpose" } },
  { cue: 32, layout: TRACE, edges: [...TRACE_EDGES], accent: ["caseOperator"], packets: [{ from: "caseOperator", to: "platform", label: "open case" }] },
  { cue: 33, layout: TRACE, edges: [...TRACE_EDGES], badges: { caseOperator: "masked values only" } },
  { cue: 34, layout: TRACE, edges: [...TRACE_EDGES], accent: ["audit"], packets: [{ from: "platform", to: "audit", label: "her · purpose · time" }] },
  { cue: 35, layout: TWO, edges: [...TWO_EDGES], danger: ["thief"], crossed: ["thief"], badges: { thief: "stopped by encryption" } },
  { cue: 36, layout: TWO, edges: [...TWO_EDGES], danger: ["thief"], crossed: ["thief"], accent: ["audit"], badges: { thief: "stopped by encryption", caseOperator: "seen by the audit" } },
  { cue: 37, layout: TRACE, edges: [...TRACE_EDGES], accent: ["audit"], badges: { audit: "who · when · why" } },
  // The check.
  { cue: 38, layout: CHECK, edges: [{ from: "identity", to: "mobileBank" }], badges: { mobileBank: "check" } },
  { cue: 39, layout: CHECK, edges: [{ from: "identity", to: "mobileBank" }], accent: ["mobileBank"], badges: { mobileBank: "his name on screen", identity: "full number?" } },
  { cue: 40, layout: CHECK, edges: [{ from: "identity", to: "mobileBank" }], accent: ["identity"], badges: { mobileBank: "level + name only", identity: "stays inside" } },
  // The summary.
  { cue: 41, layout: SUM, edges: [...SUM_EDGES], accent: ["identity"], badges: { identity: "protected class" } },
  { cue: 42, layout: SUM, edges: [...SUM_EDGES], accent: ["vault"], badges: { identity: "protected class", vault: "keys of the bank" } },
  { cue: 43, layout: SUM, edges: [...SUM_EDGES], accent: ["audit"], badges: { identity: "masked by default", audit: "every release" } },
  // The close.
  { cue: 44, layout: CLOSE, edges: [{ from: "identity", to: "azizPhone" }], accent: ["identity"], badges: { identity: "MyID phone number" } },
  { cue: 45, layout: CLOSE, edges: [{ from: "identity", to: "azizPhone" }], badges: { identity: "old university number", azizPhone: "his number now" } },
  { cue: 46, layout: CLOSE, edges: [{ from: "identity", to: "azizPhone" }], accent: ["azizPhone"], badges: { azizPhone: "who owns it?" } },
];
