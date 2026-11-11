import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 17: the verified identity. The stolen disk (cues 0–2); the bridge (3–4); what is protected
// (5–11); keys (12–18); the blind index (19–23); one door and the release list (24–35); who never gets
// it (36–39); the trace (40–46); versions (47–50); the close (51–55).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 3, part: 4, rows: [4], current: ["custgw", "postgres", "myid"], dot: "postgres", units: { heeyid: "lesson 16: kept once" } },
  { cue: 4, part: 4, rows: [4], current: ["custgw", "postgres", "vault"], dot: "vault", units: { heeyid: "keys · readers · trace" } },
  { cue: 51, part: 4, rows: [4], current: ["custgw", "admingw", "postgres", "vault"], dot: "off", units: { heeyid: "one protected class" } },
  { cue: 55, part: 4, rows: [4], dot: "off", units: { heeyid: "in the bank" } },
];

const DISK = { thief: [0, 1], identity: [2.2, 1] } as const;
const KEYS = { identity: [0, 1], platform: [1.5, 1], vault: [3, 1] } as const;
const KEY_EDGES = [{ from: "platform", to: "identity" }, { from: "platform", to: "vault" }] as const;
const INDEX_EDGES = [...KEY_EDGES, { from: "identity", to: "vault" }] as const;
const DOOR = { caseOperator: [0, 0.3], records: [0, 1.7], platform: [1.5, 1], identity: [3, 1] } as const;
const DOOR_EDGES = [{ from: "caseOperator", to: "platform" }, { from: "records", to: "platform" }, { from: "platform", to: "identity" }] as const;
const RELEASE = { identity: [0, 1], platform: [1.4, 1], mobileBank: [3, 0], records: [3, 1], caseOperator: [3, 2] } as const;
const RELEASE_EDGES = [{ from: "identity", to: "platform" }, { from: "platform", to: "mobileBank" }, { from: "platform", to: "records" }, { from: "platform", to: "caseOperator" }] as const;
const NEVER = { platform: [0, 1], mobileBank: [1.8, 0], marketplace: [1.8, 2], audit: [3, 1] } as const;
const NEVER_EDGES = [{ from: "platform", to: "mobileBank" }, { from: "platform", to: "marketplace" }, { from: "platform", to: "audit" }] as const;
const TRACE = { caseOperator: [0, 1], platform: [1.5, 1], audit: [3, 1] } as const;
const TRACE_EDGES = [{ from: "caseOperator", to: "platform" }, { from: "platform", to: "audit" }] as const;
const HISTORY = { platform: [0.5, 1], identity: [2.5, 1] } as const;
const CLOSE = { identity: [0.5, 1], trusted: [2.5, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  { cue: 0, layout: DISK, edges: [{ from: "thief", to: "identity" }], danger: ["thief"], badges: { thief: "stolen disk" } },
  { cue: 1, layout: DISK, edges: [{ from: "thief", to: "identity" }], danger: ["thief"], packets: [{ from: "thief", to: "identity", label: "open the table" }] },
  { cue: 2, layout: DISK, edges: [{ from: "thief", to: "identity" }], danger: ["thief"], badges: { identity: "readable?" } },
  // What lives in the protected class.
  { cue: 5, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "protected class" } },
  { cue: 6, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "names · birth · number · document · addresses" } },
  { cue: 7, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "+ MyID phone number" } },
  { cue: 8, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "+ reusable identifier" } },
  { cue: 9, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "+ images, only if the bank says" } },
  { cue: 10, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "nothing else" } },
  { cue: 11, layout: { identity: [1, 1], trusted: [2.5, 1] }, badges: { trusted: "personal: other rules" } },
  // A key for each record, wrapped in the bank's Vault.
  { cue: 12, layout: KEYS, edges: [...KEY_EDGES], accent: ["vault"] },
  { cue: 13, layout: KEYS, edges: [...KEY_EDGES], accent: ["identity"], badges: { identity: "own data key" } },
  { cue: 14, layout: KEYS, edges: [...KEY_EDGES], accent: ["identity"], badges: { identity: "sealed · key wrapped" } },
  { cue: 15, layout: KEYS, edges: [...KEY_EDGES], accent: ["vault"], badges: { vault: "installation key stays" } },
  { cue: 16, layout: KEYS, edges: [...KEY_EDGES], packets: [{ from: "platform", to: "vault", label: "wrapped key" }, { from: "vault", to: "platform", label: "for one request", delay: 55 }] },
  { cue: 17, layout: KEYS, edges: [...KEY_EDGES], accent: ["platform"], badges: { platform: "no copy · no log" } },
  { cue: 18, layout: DISK, edges: [{ from: "thief", to: "identity" }], danger: ["thief"], crossed: ["thief"], badges: { identity: "ciphertext only" } },
  // The blind index.
  { cue: 19, layout: KEYS, edges: [...INDEX_EDGES], badges: { platform: "find by number?" } },
  { cue: 20, layout: KEYS, edges: [...INDEX_EDGES], accent: ["identity"], badges: { identity: "blind index" } },
  { cue: 21, layout: KEYS, edges: [...INDEX_EDGES], packets: [{ from: "vault", to: "identity", label: "index key" }], badges: { identity: "keyed digest" } },
  { cue: 22, layout: KEYS, edges: [...INDEX_EDGES], packets: [{ from: "platform", to: "identity", label: "same digest" }] },
  { cue: 23, layout: KEYS, edges: [...INDEX_EDGES], accent: ["identity"], badges: { identity: "fast · 1 per number" } },
  // One door, masked by default.
  { cue: 24, layout: DOOR, edges: [...DOOR_EDGES], accent: ["platform"], badges: { platform: "identity module only" } },
  { cue: 25, layout: DOOR, edges: [...DOOR_EDGES], packets: [{ from: "caseOperator", to: "platform", label: "ask" }, { from: "records", to: "platform", label: "ask", delay: 35 }] },
  { cue: 26, layout: DOOR, edges: [...DOOR_EDGES], accent: ["platform"], badges: { platform: "masked by default" } },
  { cue: 27, layout: RELEASE, edges: [...RELEASE_EDGES], badges: { platform: "the short list" } },
  { cue: 28, layout: RELEASE, edges: [...RELEASE_EDGES], packets: [{ from: "platform", to: "identity", label: "keep a result" }] },
  { cue: 29, layout: RELEASE, edges: [...RELEASE_EDGES], accent: ["mobileBank"], packets: [{ from: "platform", to: "mobileBank", label: "confirmation" }], badges: { mobileBank: "session device only" } },
  { cue: 30, layout: RELEASE, edges: [...RELEASE_EDGES], badges: { platform: "phone check" } },
  { cue: 31, layout: RELEASE, edges: [...RELEASE_EDGES], accent: ["records"], packets: [{ from: "platform", to: "records", label: "number only" }] },
  { cue: 32, layout: RELEASE, edges: [...RELEASE_EDGES], accent: ["caseOperator"], packets: [{ from: "platform", to: "caseOperator", label: "masked" }], badges: { caseOperator: "case · phone review" } },
  { cue: 33, layout: RELEASE, edges: [...RELEASE_EDGES], badges: { platform: "compliance export" } },
  { cue: 34, layout: RELEASE, edges: [...RELEASE_EDGES], badges: { platform: "deletion job" } },
  { cue: 35, layout: RELEASE, edges: [...RELEASE_EDGES], badges: { platform: "approved address share" } },
  // Who never gets it.
  { cue: 36, layout: NEVER, edges: [...NEVER_EDGES], badges: { platform: "never to" } },
  { cue: 37, layout: NEVER, edges: [...NEVER_EDGES], accent: ["mobileBank"], badges: { mobileBank: "summary: level + name" } },
  { cue: 38, layout: NEVER, edges: [...NEVER_EDGES], crossed: ["audit"], badges: { platform: "✕ antifraud · notices", audit: "no identity data" } },
  { cue: 39, layout: NEVER, edges: [...NEVER_EDGES], badges: { marketplace: "only a shared address" } },
  // Every release leaves a trace.
  { cue: 40, layout: TRACE, edges: [...TRACE_EDGES], accent: ["audit"], badges: { audit: "reader + purpose" } },
  { cue: 41, layout: TRACE, edges: [...TRACE_EDGES], accent: ["caseOperator"], packets: [{ from: "caseOperator", to: "platform", label: "open case" }] },
  { cue: 42, layout: TRACE, edges: [...TRACE_EDGES], badges: { caseOperator: "masked values only" } },
  { cue: 43, layout: TRACE, edges: [...TRACE_EDGES], accent: ["audit"], packets: [{ from: "platform", to: "audit", label: "her · purpose · time" }] },
  { cue: 44, layout: TRACE, edges: [...TRACE_EDGES], accent: ["audit"] },
  { cue: 45, layout: { thief: [0, 0.3], caseOperator: [0, 1.7], identity: [1.5, 1], audit: [3, 1] }, edges: [{ from: "thief", to: "identity" }, { from: "caseOperator", to: "identity" }, { from: "identity", to: "audit" }], badges: { thief: "stopped by encryption", caseOperator: "seen by the audit" } },
  { cue: 46, layout: TRACE, edges: [...TRACE_EDGES], accent: ["audit"], badges: { audit: "later: shown to Aziz" } },
  // History: only a refresh changes it.
  { cue: 47, layout: HISTORY, edges: [{ from: "platform", to: "identity" }], badges: { identity: "history" } },
  { cue: 48, layout: HISTORY, edges: [{ from: "platform", to: "identity" }], packets: [{ from: "platform", to: "identity", label: "refresh" }], badges: { platform: "only by refresh" } },
  { cue: 49, layout: HISTORY, edges: [{ from: "platform", to: "identity" }], accent: ["identity"], badges: { identity: "v2 · v1 kept" } },
  { cue: 50, layout: HISTORY, edges: [{ from: "platform", to: "identity" }], badges: { identity: "same number in every version" } },
  // The close.
  { cue: 52, layout: CLOSE, edges: [{ from: "identity", to: "trusted" }], accent: ["identity"], badges: { identity: "MyID phone number" } },
  { cue: 53, layout: CLOSE, edges: [{ from: "identity", to: "trusted" }], badges: { identity: "an old number?" } },
  { cue: 54, layout: CLOSE, edges: [{ from: "identity", to: "trusted" }], accent: ["trusted"], badges: { trusted: "his number?" } },
];
