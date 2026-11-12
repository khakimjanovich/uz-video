import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 9: codes and limits. The night (0–8); one code: digest, pepper, one alive (9–19); limits on one code (20–27);
// TAF's own lock (28–31); rate limits in Valkey (32–52); only the server counts (53–57); MyID pointer (58–59);
// the check (60–62); summary and the hand-off (63–67).
const UNIT = { heeyid: "codes and limits" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 0, part: 3, current: ["customer"], dot: "customer" },
  { cue: 4, part: 3, current: ["mobile", "edge", "custgw", "taf"], dot: "custgw" },
  { cue: 6, part: 3, rows: [3], current: ["custgw", "postgres", "valkey"], dot: "custgw", units: UNIT },
  { cue: 11, part: 3, current: ["custgw", "postgres", "vault"], dot: "postgres", units: { heeyid: "code: keyed digest" } },
  { cue: 20, part: 3, current: ["custgw", "postgres"], dot: "postgres", units: UNIT },
  { cue: 28, part: 3, current: ["adapters", "taf"], dot: "taf", units: { heeyid: "TAF has its own lock" } },
  { cue: 35, part: 3, current: ["edge", "custgw", "valkey"], dot: "valkey", units: { heeyid: "rate limits" } },
  { cue: 47, part: 3, current: ["valkey", "postgres"], dot: "valkey", units: UNIT },
  { cue: 53, part: 3, current: ["mobile", "edge", "custgw"], dot: "custgw", units: { heeyid: "only the server counts" } },
  { cue: 58, part: 3, rows: [3, 4], current: ["custgw", "valkey", "myid"], dot: "myid", units: { heeyid: "MyID: lesson 13" } },
  { cue: 60, part: 3, rows: [3], current: ["custgw", "valkey"], dot: "valkey", units: { heeyid: "rate limits" } },
  { cue: 63, part: 3, current: ["custgw", "postgres", "valkey"], dot: "off", units: UNIT },
  { cue: 66, part: 3, current: ["mobile", "taf"], dot: "taf", units: UNIT },
];

const NIGHT = { bot: [0, 1], platform: [1.5, 1], azizPhone: [3, 1] } as const;
const NIGHT_EDGES = [{ from: "bot", to: "platform" }, { from: "platform", to: "azizPhone" }] as const;
const STORE = { aziz: [0, 1], platform: [1.5, 1], codeStore: [3, 1] } as const;
const STORE_EDGES = [{ from: "aziz", to: "platform" }, { from: "platform", to: "codeStore" }] as const;
const LOCK = { ...STORE, codeStore: [3, 0.3], taf: [3, 1.7] } as const;
const LOCK_EDGES = [...STORE_EDGES, { from: "platform", to: "taf" }] as const;
const RATE = { bot: [0, 1], platform: [1.5, 1], valkey: [3, 0.3], azizPhone: [3, 1.7] } as const;
const RATE_EDGES = [{ from: "bot", to: "platform" }, { from: "platform", to: "valkey" }, { from: "platform", to: "azizPhone" }] as const;
const KV = { platform: [0.5, 1], valkey: [2, 0.4], postgres: [2, 1.7] } as const;
const KV_EDGES = [{ from: "platform", to: "valkey" }, { from: "postgres", to: "valkey", label: "comes again" }] as const;
const SERVER = { bot: [0, 0.3], mobileBank: [0, 1.7], platform: [2, 1], valkey: [3, 1] } as const;
const SERVER_EDGES = [{ from: "mobileBank", to: "platform" }, { from: "platform", to: "valkey" }] as const;
const PROOF = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1], myid: [3, 0.3], valkey: [3, 1.7] } as const;
const PROOF_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "myid" }, { from: "platform", to: "valkey" }] as const;
const RECAP = { platform: [1, 1], codeStore: [2.5, 0.3], valkey: [2.5, 1.7] } as const;
const RECAP_EDGES = [{ from: "platform", to: "codeStore" }, { from: "platform", to: "valkey" }] as const;
const MONDAY = { aziz: [0, 1], mobileBank: [1.5, 1], taf: [3, 1] } as const;
const MONDAY_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "taf" }] as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Two in the morning: codes Aziz never asked for.
  { cue: 0, layout: { azizPhone: [1.5, 1] }, accent: ["azizPhone"], shake: { azizPhone: 0.5 } },
  { cue: 1, layout: { platform: [0.5, 1], azizPhone: [2.5, 1] }, edges: [{ from: "platform", to: "azizPhone" }], packets: [{ from: "platform", to: "azizPhone", label: "code" }] },
  { cue: 2, layout: { platform: [0.5, 1], azizPhone: [2.5, 1] }, edges: [{ from: "platform", to: "azizPhone" }], packets: [{ from: "platform", to: "azizPhone", label: "code", delay: 0 }, { from: "platform", to: "azizPhone", label: "code", delay: 25 }] },
  { cue: 3, layout: { platform: [0.5, 1], azizPhone: [2.5, 1] }, edges: [{ from: "platform", to: "azizPhone" }], badges: { azizPhone: "not asked" } },
  { cue: 4, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"], packets: [{ from: "bot", to: "platform", label: "Aziz's number" }, { from: "platform", to: "azizPhone", label: "code", delay: 40 }] },
  { cue: 5, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"], badges: { bot: "then guess?" } },
  { cue: 6, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "fingerprint only" } },
  { cue: 7, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"], badges: { bot: "a stranger" } },
  { cue: 8, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "life · tries · requests" } },
  // One code: random, a keyed digest, one alive.
  { cue: 9, layout: STORE, edges: [...STORE_EDGES], accent: ["codeStore"] },
  { cue: 10, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "random" } },
  { cue: 11, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "table in Postgres" } },
  { cue: 12, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "no code inside" } },
  { cue: 13, layout: STORE, edges: [...STORE_EDGES], accent: ["codeStore"], badges: { codeStore: "digest + pepper (Vault)" } },
  { cue: 14, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "copy: no codes" } },
  { cue: 15, layout: STORE, edges: [...STORE_EDGES], packets: [{ from: "platform", to: "codeStore", label: "new code" }], badges: { codeStore: "older: void" } },
  { cue: 16, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "one alive" } },
  { cue: 17, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "never clear · never logged" } },
  { cue: 18, layout: STORE, edges: [...STORE_EDGES], packets: [{ from: "aziz", to: "platform", label: "code" }], badges: { platform: "constant time" } },
  { cue: 19, layout: STORE, edges: [...STORE_EDGES], badges: { platform: "same time, any code" } },
  // Limits on one code.
  { cue: 20, layout: STORE, edges: [...STORE_EDGES], accent: ["codeStore"] },
  { cue: 21, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "bank policy" } },
  { cue: 22, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "short life" } },
  { cue: 23, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "few wrong entries" } },
  { cue: 24, layout: STORE, edges: [...STORE_EDGES], packets: [{ from: "aziz", to: "platform", label: "wrong", stopAt: 0.6 }], badges: { aziz: "tries left" } },
  { cue: 25, layout: STORE, edges: [...STORE_EDGES], danger: ["codeStore"], badges: { codeStore: "void" } },
  { cue: 26, layout: STORE, edges: [...STORE_EDGES], badges: { aziz: "wait, then ask" } },
  { cue: 27, layout: STORE, edges: [...STORE_EDGES], badges: { codeStore: "few resends" } },
  // TAF's own lock.
  { cue: 28, layout: LOCK, edges: [...LOCK_EDGES], accent: ["taf"] },
  { cue: 29, layout: LOCK, edges: [...LOCK_EDGES], badges: { taf: "3 wrong: 10 min lock" } },
  { cue: 30, layout: LOCK, edges: [...LOCK_EDGES], badges: { codeStore: "wrong entries ≤ 3", taf: "3 wrong: 10 min lock" } },
  { cue: 31, layout: LOCK, edges: [...LOCK_EDGES], danger: ["aziz"], badges: { aziz: "locked by TAF?" } },
  // The script does not guess: it asks. Rate limits in Valkey.
  { cue: 32, layout: STORE, edges: [...STORE_EDGES], crossed: ["aziz"], badges: { codeStore: "guess: no" } },
  { cue: 33, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"] },
  { cue: 34, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"], packets: [{ from: "bot", to: "platform", label: "new code" }, { from: "bot", to: "platform", label: "new code", delay: 35 }] },
  { cue: 35, layout: RATE, edges: [...RATE_EDGES], accent: ["valkey"] },
  { cue: 36, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "3 counters" } },
  { cue: 37, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "number · day" } },
  { cue: 38, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "address · hour" } },
  { cue: 39, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "device · day" } },
  { cue: 40, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "bank policy" } },
  { cue: 41, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "all codes · hour" } },
  { cue: 42, layout: RATE, edges: [...RATE_EDGES], badges: { valkey: "alert level → operations" } },
  { cue: 43, layout: RATE, edges: [...RATE_EDGES], shake: { valkey: 0.3 }, badges: { valkey: "number: limit" } },
  { cue: 44, layout: RATE, edges: [...RATE_EDGES], danger: ["bot"], packets: [{ from: "bot", to: "platform", label: "code?", stopAt: 0.5 }], badges: { platform: "too many requests" } },
  { cue: 45, layout: RATE, edges: [...RATE_EDGES], badges: { platform: "audit · antifraud event" } },
  { cue: 46, layout: RATE, edges: [...RATE_EDGES], accent: ["azizPhone"], crossed: ["bot"], badges: { azizPhone: "quiet" } },
  // Why Valkey.
  { cue: 47, layout: KV, edges: [{ from: "platform", to: "valkey" }], accent: ["valkey"] },
  { cue: 48, layout: KV, edges: [{ from: "platform", to: "valkey" }], badges: { valkey: "expires by itself" } },
  { cue: 49, layout: KV, edges: [{ from: "platform", to: "valkey" }], badges: { valkey: "< 1 ms" } },
  { cue: 50, layout: KV, edges: [{ from: "platform", to: "valkey" }], badges: { valkey: "wrong entries · end with the code" } },
  { cue: 51, layout: KV, edges: [...KV_EDGES], badges: { valkey: "not the only copy" } },
  { cue: 52, layout: KV, edges: [...KV_EDGES], accent: ["postgres"], badges: { valkey: "comes again or expires" } },
  // Only the server counts.
  { cue: 53, layout: SERVER, edges: [...SERVER_EDGES] },
  { cue: 54, layout: SERVER, edges: [...SERVER_EDGES], badges: { mobileBank: "convenience only" } },
  { cue: 55, layout: SERVER, edges: [...SERVER_EDGES], accent: ["platform"], badges: { mobileBank: "greys a button", platform: "counts" } },
  { cue: 56, layout: SERVER, edges: [...SERVER_EDGES, { from: "bot", to: "platform" }], danger: ["bot"], badges: { bot: "no app" } },
  { cue: 57, layout: SERVER, edges: [...SERVER_EDGES, { from: "bot", to: "platform" }], danger: ["bot"], packets: [{ from: "bot", to: "platform", label: "API call", stopAt: 0.6 }], badges: { platform: "no" } },
  // MyID: one pointer.
  { cue: 58, layout: PROOF, edges: [...PROOF_EDGES], accent: ["myid"] },
  { cue: 59, layout: PROOF, edges: [...PROOF_EDGES], badges: { valkey: "MyID counters: lesson 13" } },
  // The check: a slower script.
  { cue: 60, layout: RATE, edges: [...RATE_EDGES], danger: ["bot"], badges: { bot: "1 an hour · new address" } },
  { cue: 61, layout: RATE, edges: [...RATE_EDGES], danger: ["bot"], badges: { valkey: "which counter?" } },
  { cue: 62, layout: RATE, edges: [...RATE_EDGES], accent: ["valkey"], shake: { valkey: 0.2 }, badges: { valkey: "number · day: any address" } },
  // Summary and the hand-off.
  { cue: 63, layout: RECAP, edges: [...RECAP_EDGES], accent: ["codeStore"], badges: { codeStore: "digest · short life · ≤ 3 tries" } },
  { cue: 64, layout: RECAP, edges: [...RECAP_EDGES], accent: ["valkey"], badges: { valkey: "number · address · device · alert" } },
  { cue: 65, layout: RECAP, edges: [...RECAP_EDGES], accent: ["platform"], badges: { platform: "server decides" } },
  { cue: 66, layout: MONDAY, edges: [...MONDAY_EDGES], accent: ["mobileBank"], badges: { mobileBank: "right code ✓" } },
  { cue: 67, layout: MONDAY, edges: [...MONDAY_EDGES], accent: ["taf"], badges: { taf: "checks where it arrived" } },
];
