import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 11: the password. Thursday night (0–7); one row, not Keycloak (8–15); Argon2id and the salt (16–27);
// password first, the fake digest (28–34); the lock (35–41); a lock is not a block (42–46); never (47–50);
// the check (51–53); the summary and the handoff (54–59).
const UNIT = { heeyid: "password" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 0, part: 3, current: ["edge"], dot: "edge" },
  { cue: 5, part: 3, rows: [3], current: ["custgw", "postgres"], dot: "postgres", units: UNIT },
  { cue: 9, part: 3, current: ["custgw", "postgres", "keycloak"], dot: "postgres", units: { heeyid: "one row, not Keycloak" } },
  { cue: 25, part: 3, current: ["custgw", "postgres"], dot: "custgw", units: { heeyid: "settings: installation config" } },
  { cue: 28, part: 3, current: ["edge", "custgw", "postgres"], dot: "custgw", units: UNIT },
  { cue: 35, part: 3, current: ["custgw", "valkey"], dot: "valkey", units: { heeyid: "counter · lock" } },
  { cue: 39, part: 3, current: ["custgw", "sms", "push"], dot: "sms", units: UNIT },
  { cue: 42, part: 3, current: ["mobile", "custgw", "keycloak"], dot: "mobile", units: { heeyid: "lock ≠ block" } },
  { cue: 47, part: 3, current: ["mobile", "custgw"], dot: "custgw", units: UNIT },
  { cue: 54, part: 3, rows: [3], current: ["custgw", "postgres", "valkey"], dot: "off", units: UNIT },
  { cue: 59, part: 3, current: ["mobile"], dot: "mobile", units: UNIT },
];

const NIGHT = { bot: [0, 1], edge: [1, 1], platform: [2, 1], passwordRow: [3, 1] } as const;
const NIGHT_EDGES = [{ from: "bot", to: "edge", label: "API" }, { from: "edge", to: "platform" }, { from: "platform", to: "passwordRow" }] as const;
const ROW = { aziz: [0, 1], platform: [1.4, 1], passwordRow: [2.8, 0.4], keycloak: [2.8, 1.7] } as const;
const ROW_EDGES = [{ from: "aziz", to: "platform" }, { from: "platform", to: "passwordRow" }, { from: "platform", to: "keycloak" }] as const;
const HASH = { platform: [0.5, 1], passwordRow: [2.5, 1] } as const;
const HASH_EDGES = [{ from: "platform", to: "passwordRow", label: "Argon2id" }] as const;
const STEAL = { ...HASH, bot: [2.5, 0.1] } as const;
const LOCK = { bot: [0, 0.4], edge: [1, 0.4], platform: [2, 1], valkey: [3, 1], azizPhone: [1, 1.7] } as const;
const LOCK_EDGES = [{ from: "bot", to: "edge" }, { from: "edge", to: "platform" }, { from: "platform", to: "valkey" }, { from: "platform", to: "azizPhone" }] as const;
const MORNING = { aziz: [0, 1], mobileBank: [1.2, 1], platform: [2.4, 1], keycloak: [3.2, 0.3] } as const;
const MORNING_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "keycloak" }] as const;
const NEVER = { mobileBank: [0.5, 1], platform: [2.5, 1] } as const;
const NEVER_EDGES = [{ from: "mobileBank", to: "platform" }] as const;
const NEXT = { aziz: [0.5, 1], mobileBank: [2, 1], transfer: [3.3, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Thursday night: leaked passwords through the API, one after another.
  { cue: 0, layout: { bot: [0.5, 1], edge: [2, 1] }, edges: [{ from: "bot", to: "edge", label: "API" }], danger: ["bot"] },
  { cue: 1, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"], packets: [{ from: "edge", to: "platform", label: "password?" }, { from: "edge", to: "platform", label: "password?", delay: 40 }], badges: { bot: "leaked list" } },
  { cue: 2, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { bot: "leaked list" } },
  { cue: 3, layout: NIGHT, edges: [...NIGHT_EDGES], accent: ["passwordRow"] },
  { cue: 4, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { passwordRow: "check, never read?" } },
  { cue: 5, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { passwordRow: "Sunday: set two times" } },
  { cue: 6, layout: NIGHT, edges: [...NIGHT_EDGES], accent: ["platform"], badges: { platform: "Monday: password, then code" } },
  // One row, in the gateway, not in Keycloak.
  { cue: 8, layout: ROW, edges: [...ROW_EDGES], accent: ["passwordRow"] },
  { cue: 9, layout: ROW, edges: [...ROW_EDGES], badges: { aziz: "one number · one password" } },
  { cue: 10, layout: ROW, edges: [...ROW_EDGES], badges: { passwordRow: "one row" } },
  { cue: 11, layout: ROW, edges: [...ROW_EDGES], badges: { passwordRow: "customer gateway" } },
  { cue: 12, layout: ROW, edges: [...ROW_EDGES], crossed: ["keycloak"], badges: { keycloak: "no password" } },
  { cue: 14, layout: ROW, edges: [...ROW_EDGES], accent: ["platform"], badges: { platform: "password before code" } },
  { cue: 15, layout: ROW, edges: [...ROW_EDGES], danger: ["keycloak"], badges: { keycloak: "code first · password travels" } },
  // Argon2id, memory-hard, a salt.
  { cue: 16, layout: HASH, edges: [...HASH_EDGES] },
  { cue: 17, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "no password" } },
  { cue: 18, layout: HASH, edges: [...HASH_EDGES], accent: ["passwordRow"], packets: [{ from: "platform", to: "passwordRow", label: "digest" }], badges: { passwordRow: "Argon2id" } },
  { cue: 19, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "memory + time per check" } },
  { cue: 20, layout: HASH, edges: [...HASH_EDGES], badges: { platform: "one check per login" } },
  { cue: 21, layout: STEAL, edges: [...HASH_EDGES, { from: "bot", to: "passwordRow" }], danger: ["bot"], badges: { bot: "stolen copy: slow" } },
  { cue: 22, layout: HASH, edges: [...HASH_EDGES], accent: ["passwordRow"], badges: { passwordRow: "+ random salt" } },
  { cue: 23, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "same password · different digest" } },
  { cue: 24, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "algorithm · settings · salt · digest" } },
  { cue: 25, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "settings: configuration" } },
  { cue: 26, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "no old passwords · login check only" } },
  { cue: 27, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "bcrypt: not memory-hard" } },
  // Password first, and the fake digest.
  { cue: 28, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"] },
  { cue: 29, layout: NIGHT, edges: [...NIGHT_EDGES], accent: ["platform"], badges: { platform: "password first" } },
  { cue: 30, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { platform: "constant time" } },
  { cue: 32, layout: NIGHT, edges: [...NIGHT_EDGES], accent: ["passwordRow"], badges: { passwordRow: "unknown: fake digest" } },
  { cue: 33, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { edge: "wrong number or password" } },
  { cue: 34, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { bot: "customer exists?" } },
  // The lock, in Valkey.
  { cue: 35, layout: LOCK, edges: [...LOCK_EDGES], packets: [{ from: "edge", to: "platform", label: "wrong", stopAt: 0.6 }], badges: { valkey: "wrong entries +1" } },
  { cue: 36, layout: LOCK, edges: [...LOCK_EDGES], badges: { platform: "audit · antifraud event" } },
  { cue: 37, layout: LOCK, edges: [...LOCK_EDGES], accent: ["valkey"], badges: { valkey: "lock · configured time" } },
  { cue: 38, layout: LOCK, edges: [...LOCK_EDGES], danger: ["valkey"], shake: { valkey: 0.4 }, badges: { valkey: "password login locked" } },
  { cue: 39, layout: LOCK, edges: [...LOCK_EDGES], accent: ["azizPhone"], packets: [{ from: "platform", to: "azizPhone", label: "SMS · push" }], badges: { azizPhone: "password login locked" } },
  { cue: 40, layout: LOCK, edges: [...LOCK_EDGES], danger: ["bot"], badges: { edge: "too many wrong passwords" } },
  { cue: 41, layout: LOCK, edges: [...LOCK_EDGES], crossed: ["bot"], badges: { valkey: "time over: lock ends" } },
  // A lock is not a block.
  { cue: 42, layout: MORNING, edges: [...MORNING_EDGES], accent: ["mobileBank"] },
  { cue: 43, layout: MORNING, edges: [...MORNING_EDGES], badges: { mobileBank: "works" } },
  { cue: 44, layout: MORNING, edges: [...MORNING_EDGES], badges: { platform: "lock ≠ block" } },
  { cue: 45, layout: MORNING, edges: [...MORNING_EDGES], accent: ["keycloak"], packets: [{ from: "platform", to: "keycloak", label: "renewal" }], badges: { keycloak: "no password needed" } },
  { cue: 46, layout: MORNING, edges: [...MORNING_EDGES], badges: { platform: "breached passwords refused" } },
  // Never.
  { cue: 47, layout: NEVER, edges: [...NEVER_EDGES] },
  { cue: 48, layout: NEVER, edges: [...NEVER_EDGES], badges: { platform: "never shown · logged · sent" } },
  { cue: 49, layout: NEVER, edges: [...NEVER_EDGES], badges: { mobileBank: "masked · not kept" } },
  { cue: 50, layout: NEVER, edges: [...NEVER_EDGES], badges: { mobileBank: "not the app PIN" } },
  // The check.
  { cue: 51, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"] },
  { cue: 52, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"], badges: { bot: "nobody's number: faster?" } },
  { cue: 53, layout: NIGHT, edges: [...NIGHT_EDGES], accent: ["passwordRow"], badges: { passwordRow: "fake digest · same time" } },
  // The summary and the handoff.
  { cue: 54, layout: ROW, edges: [...ROW_EDGES], accent: ["passwordRow"], badges: { passwordRow: "salted Argon2id" } },
  { cue: 55, layout: ROW, edges: [...ROW_EDGES], accent: ["platform"], badges: { platform: "first · constant time" } },
  { cue: 56, layout: ROW, edges: [...ROW_EDGES], badges: { passwordRow: "lock, not block" } },
  { cue: 57, layout: NEXT, edges: [{ from: "aziz", to: "mobileBank" }], badges: { aziz: "level 1" } },
  { cue: 58, layout: NEXT, edges: [{ from: "aziz", to: "mobileBank" }], badges: { aziz: "phone ✓ · person ?" } },
  { cue: 59, layout: NEXT, edges: [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "transfer" }], accent: ["transfer"] },
];
