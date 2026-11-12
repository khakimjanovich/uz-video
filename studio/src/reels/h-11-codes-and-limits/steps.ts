import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 11: codes and limits. The night (0–7); one code: digest, pepper, one alive (8–18); limits on one code (19–26);
// TAF's own lock (27–30); rate limits in Valkey (31–48); only the server counts (49–53); MyID attempt counters (54–63);
// recap and the open question (64–71).
const UNIT = { heeyid: "codes and limits" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 0, part: 3, current: ["customer"], dot: "customer" },
  { cue: 4, part: 3, current: ["mobile", "edge", "custgw", "sms"], dot: "mobile" },
  { cue: 6, part: 3, rows: [3], current: ["custgw", "postgres", "valkey"], dot: "custgw", units: UNIT },
  { cue: 10, part: 3, current: ["custgw", "postgres", "vault"], dot: "postgres", units: { heeyid: "code: keyed digest" } },
  { cue: 19, part: 3, current: ["custgw", "postgres"], dot: "postgres", units: UNIT },
  { cue: 27, part: 3, current: ["adapters", "taf"], dot: "taf", units: { heeyid: "TAF has its own lock" } },
  { cue: 34, part: 3, current: ["mobile", "custgw", "valkey"], dot: "valkey", units: { heeyid: "rate limits" } },
  { cue: 44, part: 3, current: ["valkey", "postgres"], dot: "valkey", units: UNIT },
  { cue: 49, part: 3, current: ["mobile", "edge", "custgw"], dot: "custgw", units: { heeyid: "only the server counts" } },
  { cue: 54, part: 3, rows: [3, 4], current: ["custgw", "valkey", "myid"], dot: "myid", units: { heeyid: "MyID attempts" } },
  { cue: 64, part: 3, rows: [3], current: ["custgw", "postgres", "valkey"], dot: "off", units: UNIT },
  { cue: 68, part: 3, current: ["mobile", "taf"], dot: "taf", units: UNIT },
];

const NIGHT = { bot: [0, 1], webProfile: [1, 1], platform: [2, 1], azizPhone: [3, 1] } as const;
const NIGHT_EDGES = [{ from: "bot", to: "webProfile" }, { from: "webProfile", to: "platform" }, { from: "platform", to: "azizPhone" }] as const;
const STORE = { aziz: [0, 1], platform: [1.5, 1], codeStore: [3, 1] } as const;
const STORE_EDGES = [{ from: "aziz", to: "platform" }, { from: "platform", to: "codeStore" }] as const;
const LOCK = { ...STORE, codeStore: [3, 0.3], taf: [3, 1.7] } as const;
const LOCK_EDGES = [...STORE_EDGES, { from: "platform", to: "taf" }] as const;
const RATE = { bot: [0, 1], webProfile: [1, 1], platform: [2, 1], valkey: [3, 0.3], azizPhone: [3, 1.7] } as const;
const RATE_EDGES = [{ from: "bot", to: "webProfile" }, { from: "webProfile", to: "platform" }, { from: "platform", to: "valkey" }, { from: "platform", to: "azizPhone" }] as const;
const KV = { platform: [0.5, 1], valkey: [2, 0.4], records: [2, 1.7] } as const;
const KV_EDGES = [{ from: "platform", to: "valkey" }, { from: "records", to: "valkey", label: "comes again" }] as const;
const SERVER = { bot: [0, 0.3], mobileBank: [0, 1.7], platform: [2, 1], valkey: [3, 1] } as const;
const SERVER_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "valkey" }] as const;
const PROOF = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1], myid: [3, 0.3], valkey: [3, 1.7] } as const;
const PROOF_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "myid" }, { from: "platform", to: "valkey" }] as const;
const RECAP = { platform: [1, 1], codeStore: [2.5, 0.3], valkey: [2.5, 1.7] } as const;
const RECAP_EDGES = [{ from: "platform", to: "codeStore" }, { from: "platform", to: "valkey" }] as const;
const MONDAY = { aziz: [0, 1], mobileBank: [1.5, 1], taf: [3, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Two in the morning: codes Aziz never asked for.
  { cue: 0, layout: { azizPhone: [1.5, 1] }, accent: ["azizPhone"], shake: { azizPhone: 0.5 } },
  { cue: 1, layout: { platform: [0.5, 1], azizPhone: [2.5, 1] }, edges: [{ from: "platform", to: "azizPhone" }], packets: [{ from: "platform", to: "azizPhone", label: "code" }] },
  { cue: 2, layout: { platform: [0.5, 1], azizPhone: [2.5, 1] }, edges: [{ from: "platform", to: "azizPhone" }], packets: [{ from: "platform", to: "azizPhone", label: "code", delay: 0 }, { from: "platform", to: "azizPhone", label: "code", delay: 25 }] },
  { cue: 3, layout: { platform: [0.5, 1], azizPhone: [2.5, 1] }, edges: [{ from: "platform", to: "azizPhone" }], badges: { azizPhone: "not asked" } },
  { cue: 4, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"], packets: [{ from: "bot", to: "webProfile", label: "Aziz's number" }, { from: "platform", to: "azizPhone", label: "code", delay: 40 }] },
  { cue: 5, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"], badges: { bot: "then guess?" } },
  { cue: 6, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "digest only" } },
  // One code: random, a keyed digest, one alive.
  { cue: 8, layout: STORE, edges: [...STORE_EDGES], accent: ["codeStore"] },
  { cue: 9, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "random" } },
  { cue: 10, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "table in Postgres" } },
  { cue: 11, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "no code inside" } },
  { cue: 12, layout: STORE, edges: [...STORE_EDGES], accent: ["codeStore"], badges: { codeStore: "digest + pepper (Vault)" } },
  { cue: 13, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "copy: no codes" } },
  { cue: 14, layout: STORE, edges: [...STORE_EDGES], packets: [{ from: "platform", to: "codeStore", label: "new code" }], badges: { codeStore: "older: void" } },
  { cue: 15, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "one alive" } },
  { cue: 16, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "never clear · never logged" } },
  { cue: 17, layout: STORE, edges: [...STORE_EDGES], packets: [{ from: "aziz", to: "platform", label: "code" }], badges: { platform: "constant time" } },
  { cue: 18, layout: STORE, edges: [...STORE_EDGES], badges: { platform: "same time, any code" } },
  // Limits on one code.
  { cue: 19, layout: STORE, edges: [...STORE_EDGES], accent: ["codeStore"] },
  { cue: 20, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "bank policy" } },
  { cue: 21, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "short life" } },
  { cue: 22, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "few wrong entries" } },
  { cue: 23, layout: STORE, edges: [...STORE_EDGES], packets: [{ from: "aziz", to: "platform", label: "wrong", stopAt: 0.6 }], badges: { aziz: "tries left" } },
  { cue: 24, layout: STORE, edges: [...STORE_EDGES], danger: ["codeStore"], badges: { codeStore: "void" } },
  { cue: 25, layout: STORE, edges: [...STORE_EDGES], badges: { aziz: "wait, then ask" } },
  { cue: 26, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "few resends" } },
  // TAF's own lock.
  { cue: 27, layout: LOCK, edges: [...LOCK_EDGES], accent: ["taf"] },
  { cue: 28, layout: LOCK, edges: [...LOCK_EDGES], badges: { taf: "own lock" } },
  { cue: 29, layout: LOCK, edges: [...LOCK_EDGES], badges: { codeStore: "wrong entries", taf: "never looser" } },
  { cue: 30, layout: LOCK, edges: [...LOCK_EDGES], danger: ["aziz"], badges: { aziz: "locked by TAF?" } },
  // The script does not guess: it asks. Rate limits in Valkey.
  { cue: 31, layout: STORE, edges: [...STORE_EDGES], crossed: ["aziz"], badges: { codeStore: "guess: no" } },
  { cue: 32, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"] },
  { cue: 33, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"], packets: [{ from: "bot", to: "webProfile", label: "new code" }, { from: "bot", to: "webProfile", label: "new code", delay: 35 }] },
  { cue: 34, layout: RATE, edges: [...RATE_EDGES], accent: ["valkey"] },
  { cue: 35, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "3 counters" } },
  { cue: 36, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "number · day" } },
  { cue: 37, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "address · hour" } },
  { cue: 38, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "device · day" } },
  { cue: 39, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "bank policy" } },
  { cue: 40, layout: RATE, edges: [...RATE_EDGES], shake: { valkey: 0.3 }, badges: { valkey: "number: limit" } },
  { cue: 41, layout: RATE, edges: [...RATE_EDGES], danger: ["bot"], packets: [{ from: "webProfile", to: "platform", label: "code?", stopAt: 0.5 }], badges: { platform: "too many requests" } },
  { cue: 42, layout: RATE, edges: [...RATE_EDGES], badges: { platform: "audit · antifraud event" } },
  { cue: 43, layout: RATE, edges: [...RATE_EDGES], accent: ["azizPhone"], crossed: ["bot"], badges: { azizPhone: "quiet" } },
  // Why Valkey.
  { cue: 44, layout: KV, edges: [{ from: "platform", to: "valkey" }], accent: ["valkey"] },
  { cue: 46, layout: KV, edges: [{ from: "platform", to: "valkey" }], badges: { valkey: "expires by itself" } },
  { cue: 47, layout: KV, edges: [...KV_EDGES], badges: { valkey: "not the only copy" } },
  { cue: 48, layout: KV, edges: [...KV_EDGES], accent: ["records"], badges: { valkey: "rebuilt or expires" } },
  // Only the server counts.
  { cue: 49, layout: SERVER, edges: [...SERVER_EDGES] },
  { cue: 50, layout: SERVER, edges: [...SERVER_EDGES], badges: { mobileBank: "convenience only" } },
  { cue: 51, layout: SERVER, edges: [...SERVER_EDGES], accent: ["platform"], badges: { mobileBank: "greys a button", platform: "counts" } },
  { cue: 52, layout: SERVER, edges: [...SERVER_EDGES, { from: "bot", to: "platform" }], danger: ["bot"], badges: { bot: "no app" } },
  { cue: 53, layout: SERVER, edges: [...SERVER_EDGES, { from: "bot", to: "platform" }], danger: ["bot"], packets: [{ from: "bot", to: "platform", label: "API call", stopAt: 0.6 }], badges: { platform: "no" } },
  // MyID attempts: three subjects, a cap and two cool-downs.
  { cue: 54, layout: PROOF, edges: [...PROOF_EDGES], accent: ["myid"] },
  { cue: 55, layout: PROOF, edges: [...PROOF_EDGES], accent: ["valkey"], badges: { valkey: "number · device · personal ID" } },
  { cue: 56, layout: PROOF, edges: [...PROOF_EDGES], badges: { valkey: "one at limit: refuse" } },
  { cue: 57, layout: PROOF, edges: [...PROOF_EDGES], badges: { valkey: "daily cap · 2 cool-downs" } },
  { cue: 58, layout: PROOF, edges: [...PROOF_EDGES], badges: { mobileBank: "next try at …" } },
  { cue: 59, layout: PROOF, edges: [...PROOF_EDGES], badges: { valkey: "person's failure counts" } },
  { cue: 60, layout: PROOF, edges: [...PROOF_EDGES], shake: { aziz: 0.3 }, badges: { myid: "face ✕: counts" } },
  { cue: 61, layout: PROOF, edges: [...PROOF_EDGES], crossed: ["myid"], badges: { myid: "down: not counted" } },
  { cue: 62, layout: PROOF, edges: [...PROOF_EDGES], badges: { valkey: "operator reset + reason" } },
  { cue: 63, layout: PROOF, edges: [...PROOF_EDGES], badges: { valkey: "test customers: never" } },
  // Recap and the open question.
  { cue: 64, layout: RECAP, edges: [...RECAP_EDGES] },
  { cue: 65, layout: RECAP, edges: [...RECAP_EDGES], accent: ["codeStore"], badges: { codeStore: "digest · short life · few tries" } },
  { cue: 66, layout: RECAP, edges: [...RECAP_EDGES], accent: ["valkey"], badges: { valkey: "number · address · device" } },
  { cue: 67, layout: RECAP, edges: [...RECAP_EDGES], accent: ["platform"], badges: { platform: "server decides" } },
  { cue: 68, layout: MONDAY, edges: [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "taf" }], accent: ["mobileBank"] },
  { cue: 69, layout: MONDAY, edges: [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "taf" }], badges: { mobileBank: "right code ✓" } },
  { cue: 70, layout: MONDAY, edges: [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "taf" }], accent: ["taf"], badges: { taf: "which phone? which SIM?" } },
];
