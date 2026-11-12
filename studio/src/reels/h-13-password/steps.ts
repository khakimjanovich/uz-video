import { BuildMapStep, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 13: the password. Thursday night (0–7); one row, not Keycloak (8–14); Argon2id and the salt (15–26);
// password first, the dummy digest (27–33); the lock (34–39); a lock is not a block (40–44); the change (45–55);
// never (56–59); recap and the open question (60–69).
const UNIT = { heeyid: "password" };

export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 0, part: 3, current: ["mobile"], dot: "mobile" },
  { cue: 5, part: 3, rows: [3], current: ["custgw", "postgres"], dot: "postgres", units: UNIT },
  { cue: 9, part: 3, current: ["custgw", "postgres", "keycloak"], dot: "postgres", units: { heeyid: "one row, not Keycloak" } },
  { cue: 24, part: 3, current: ["custgw", "postgres"], dot: "custgw", units: { heeyid: "settings: installation config" } },
  { cue: 27, part: 3, current: ["mobile", "edge", "custgw", "postgres"], dot: "custgw", units: UNIT },
  { cue: 35, part: 3, current: ["custgw", "postgres", "kafka"], dot: "kafka", units: { heeyid: "audit · antifraud" } },
  { cue: 37, part: 3, current: ["custgw", "sms", "push"], dot: "sms", units: UNIT },
  { cue: 40, part: 3, current: ["mobile", "custgw", "keycloak"], dot: "mobile", units: { heeyid: "lock ≠ block" } },
  { cue: 45, part: 3, current: ["mobile", "custgw", "postgres", "kafka"], dot: "postgres", units: { heeyid: "change: one transaction" } },
  { cue: 52, part: 3, current: ["custgw", "keycloak", "mobile"], dot: "mobile", units: UNIT },
  { cue: 60, part: 3, rows: [3], current: ["custgw", "postgres"], dot: "off", units: UNIT },
  { cue: 67, part: 3, rows: [4], current: ["mobile", "myid"], dot: "myid", units: UNIT },
];

const NIGHT = { bot: [0, 1], webProfile: [1, 1], platform: [2, 1], passwordRow: [3, 1] } as const;
const NIGHT_EDGES = [{ from: "bot", to: "webProfile" }, { from: "webProfile", to: "platform" }, { from: "platform", to: "passwordRow" }] as const;
const ROW = { aziz: [0, 1], platform: [1.4, 1], passwordRow: [2.8, 0.4], keycloak: [2.8, 1.7] } as const;
const ROW_EDGES = [{ from: "aziz", to: "platform" }, { from: "platform", to: "passwordRow" }, { from: "platform", to: "keycloak" }] as const;
const HASH = { platform: [0.5, 1], passwordRow: [2.5, 1] } as const;
const HASH_EDGES = [{ from: "platform", to: "passwordRow", label: "Argon2id" }] as const;
const STEAL = { ...HASH, bot: [2.5, 0.1] } as const;
const LOCK = { bot: [0, 0.4], webProfile: [1, 0.4], platform: [2, 1], passwordRow: [3, 1], azizPhone: [1, 1.7] } as const;
const LOCK_EDGES = [{ from: "bot", to: "webProfile" }, { from: "webProfile", to: "platform" }, { from: "platform", to: "passwordRow" }, { from: "platform", to: "azizPhone" }] as const;
const MORNING = { aziz: [0, 1], mobileBank: [1.2, 1], platform: [2.4, 1], keycloak: [3.2, 0.3] } as const;
const MORNING_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "keycloak" }] as const;
const CHANGE = { aziz: [0, 1], mobileBank: [1, 1], platform: [2, 1], passwordRow: [3, 0.3], webProfile: [3, 1.7] } as const;
const CHANGE_EDGES = [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "platform" }, { from: "platform", to: "passwordRow" }, { from: "platform", to: "webProfile" }] as const;
const NEVER = { mobileBank: [0.5, 1], platform: [2.5, 1] } as const;
const NEVER_EDGES = [{ from: "mobileBank", to: "platform" }] as const;
const NEXT = { aziz: [0, 1], mobileBank: [1.5, 1], myid: [3, 1] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // Thursday night: leaked passwords, one after another.
  { cue: 0, layout: { bot: [0.5, 1], webProfile: [2, 1] }, edges: [{ from: "bot", to: "webProfile" }], danger: ["bot"] },
  { cue: 1, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"], packets: [{ from: "webProfile", to: "platform", label: "password?" }, { from: "webProfile", to: "platform", label: "password?", delay: 40 }], badges: { bot: "leaked list" } },
  { cue: 2, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { bot: "leaked list" } },
  { cue: 3, layout: NIGHT, edges: [...NIGHT_EDGES], accent: ["passwordRow"] },
  { cue: 4, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { passwordRow: "check, never read?" } },
  // One row, in the gateway, not in Keycloak.
  { cue: 8, layout: ROW, edges: [...ROW_EDGES], accent: ["passwordRow"] },
  { cue: 9, layout: ROW, edges: [...ROW_EDGES], badges: { aziz: "one password", passwordRow: "one row" } },
  { cue: 10, layout: ROW, edges: [...ROW_EDGES], badges: { passwordRow: "customer gateway" } },
  { cue: 11, layout: ROW, edges: [...ROW_EDGES], crossed: ["keycloak"], badges: { keycloak: "no password" } },
  { cue: 13, layout: ROW, edges: [...ROW_EDGES], accent: ["platform"], badges: { platform: "password before code" } },
  { cue: 14, layout: ROW, edges: [...ROW_EDGES], danger: ["keycloak"], badges: { keycloak: "code first · password travels" } },
  // Argon2id, memory-hard, a salt.
  { cue: 15, layout: HASH, edges: [...HASH_EDGES] },
  { cue: 16, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "no password" } },
  { cue: 17, layout: HASH, edges: [...HASH_EDGES], accent: ["passwordRow"], packets: [{ from: "platform", to: "passwordRow", label: "digest" }], badges: { passwordRow: "Argon2id" } },
  { cue: 18, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "memory + time per check" } },
  { cue: 19, layout: HASH, edges: [...HASH_EDGES], badges: { platform: "one check per login" } },
  { cue: 20, layout: STEAL, edges: [...HASH_EDGES, { from: "bot", to: "passwordRow" }], danger: ["bot"], badges: { bot: "stolen copy: slow" } },
  { cue: 21, layout: HASH, edges: [...HASH_EDGES], accent: ["passwordRow"], badges: { passwordRow: "+ random salt" } },
  { cue: 22, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "same password · different digest" } },
  { cue: 23, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "algorithm · settings · salt · digest" } },
  { cue: 24, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "settings: configuration" } },
  { cue: 25, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "no old digests · login module only" } },
  { cue: 26, layout: HASH, edges: [...HASH_EDGES], badges: { passwordRow: "bcrypt: not memory-hard" } },
  // Password first, and the dummy digest.
  { cue: 27, layout: NIGHT, edges: [...NIGHT_EDGES], danger: ["bot"] },
  { cue: 28, layout: NIGHT, edges: [...NIGHT_EDGES], accent: ["platform"], badges: { platform: "password first" } },
  { cue: 29, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { platform: "constant time" } },
  { cue: 31, layout: NIGHT, edges: [...NIGHT_EDGES], accent: ["passwordRow"], badges: { passwordRow: "unknown: dummy digest" } },
  { cue: 32, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { webProfile: "wrong number or password" } },
  { cue: 33, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { bot: "customer exists?" } },
  // The lock.
  { cue: 34, layout: LOCK, edges: [...LOCK_EDGES], packets: [{ from: "webProfile", to: "platform", label: "wrong", stopAt: 0.6 }], badges: { passwordRow: "wrong entries +1" } },
  { cue: 35, layout: LOCK, edges: [...LOCK_EDGES], badges: { platform: "audit · antifraud event" } },
  { cue: 36, layout: LOCK, edges: [...LOCK_EDGES], danger: ["passwordRow"], shake: { passwordRow: 0.4 }, badges: { passwordRow: "locked until …" } },
  { cue: 37, layout: LOCK, edges: [...LOCK_EDGES], accent: ["azizPhone"], packets: [{ from: "platform", to: "azizPhone", label: "SMS · push" }], badges: { azizPhone: "password login locked" } },
  { cue: 38, layout: LOCK, edges: [...LOCK_EDGES], danger: ["bot"], badges: { webProfile: "too many wrong passwords" } },
  { cue: 39, layout: LOCK, edges: [...LOCK_EDGES], crossed: ["bot"], badges: { webProfile: "try later, or reset" } },
  // A lock is not a block.
  { cue: 40, layout: MORNING, edges: [...MORNING_EDGES], accent: ["mobileBank"] },
  { cue: 41, layout: MORNING, edges: [...MORNING_EDGES], badges: { mobileBank: "works" } },
  { cue: 42, layout: MORNING, edges: [...MORNING_EDGES], badges: { platform: "lock ≠ block" } },
  { cue: 43, layout: MORNING, edges: [...MORNING_EDGES], accent: ["keycloak"], packets: [{ from: "platform", to: "keycloak", label: "renewal" }], badges: { keycloak: "no password needed" } },
  { cue: 44, layout: MORNING, edges: [...MORNING_EDGES], badges: { platform: "ends: time or reset" } },
  // The change.
  { cue: 45, layout: CHANGE, edges: [...CHANGE_EDGES], accent: ["aziz"] },
  { cue: 46, layout: CHANGE, edges: [...CHANGE_EDGES], packets: [{ from: "mobileBank", to: "platform", label: "current · new · new" }] },
  { cue: 47, layout: CHANGE, edges: [...CHANGE_EDGES], badges: { mobileBank: "long · not breached · no number" } },
  { cue: 48, layout: CHANGE, edges: [...CHANGE_EDGES], badges: { mobileBank: "wrong current: +1" } },
  { cue: 49, layout: CHANGE, edges: [...CHANGE_EDGES], accent: ["passwordRow"], badges: { passwordRow: "new digest · old gone" } },
  { cue: 50, layout: CHANGE, edges: [...CHANGE_EDGES], badges: { passwordRow: "counter 0 · unlocked" } },
  { cue: 51, layout: CHANGE, edges: [...CHANGE_EDGES], badges: { platform: "outbox · same transaction" } },
  { cue: 52, layout: CHANGE, edges: [...CHANGE_EDGES], badges: { platform: "end same or lower rank" } },
  { cue: 53, layout: CHANGE, edges: [...CHANGE_EDGES], crossed: ["webProfile"], badges: { webProfile: "laptop session ends" } },
  { cue: 54, layout: CHANGE, edges: [...CHANGE_EDGES], accent: ["webProfile"], badges: { webProfile: "new password ✓" } },
  { cue: 55, layout: CHANGE, edges: [...CHANGE_EDGES], badges: { aziz: "password changed" } },
  // Never.
  { cue: 56, layout: NEVER, edges: [...NEVER_EDGES] },
  { cue: 57, layout: NEVER, edges: [...NEVER_EDGES], badges: { platform: "never shown · logged · sent" } },
  { cue: 58, layout: NEVER, edges: [...NEVER_EDGES], badges: { mobileBank: "masked · not kept" } },
  { cue: 59, layout: NEVER, edges: [...NEVER_EDGES], badges: { mobileBank: "not the app PIN" } },
  // Recap and the open question.
  { cue: 60, layout: ROW, edges: [...ROW_EDGES] },
  { cue: 61, layout: ROW, edges: [...ROW_EDGES], accent: ["passwordRow"], badges: { passwordRow: "salted Argon2id" } },
  { cue: 62, layout: ROW, edges: [...ROW_EDGES], accent: ["platform"], badges: { platform: "first · constant time" } },
  { cue: 63, layout: ROW, edges: [...ROW_EDGES], badges: { passwordRow: "lock, not block" } },
  { cue: 64, layout: ROW, edges: [...ROW_EDGES], badges: { platform: "change ends weaker sessions" } },
  { cue: 65, layout: NEXT, edges: [{ from: "aziz", to: "mobileBank" }], badges: { aziz: "level 1" } },
  { cue: 66, layout: NEXT, edges: [{ from: "aziz", to: "mobileBank" }], badges: { aziz: "phone ✓ · person ?" } },
  { cue: 67, layout: NEXT, edges: [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }], accent: ["myid"] },
  { cue: 68, layout: NEXT, edges: [{ from: "aziz", to: "mobileBank" }, { from: "mobileBank", to: "myid" }], badges: { mobileBank: "agree to what?" } },
];
