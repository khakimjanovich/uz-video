import { BuildMapStep, DiagramFrame, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 6: keys. The disk (0–4); bridge (5–7); Vault in the bank (8–14); envelope encryption (15–24);
// blind index (25–31); pepper (32–36); the other keys (37–42); passwords (43–45); rotation (46–47);
// the disk again (48–52); check (53–55); summary and lesson 7 (56–60).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 5, part: 2, rows: [2], current: ["adapters", "vault"], units: { heeyid: "credentials from Vault" } },
  { cue: 7, part: 2, rows: [2], current: ["vault"], units: { heeyid: "all keys: Vault" } },
  { cue: 59, part: 2, current: ["mobile", "edge"], units: { heeyid: "calls heeyID" } },
  { cue: 60, part: 2, rows: [2], dot: "off" },
];

const wall = (at: [number, number]): DiagramFrame => ({ label: "the bank", from: at, to: at, tone: "wall" });
const DISK = { thief: [0, 1], disk: [1.5, 1] } as const;
const DISK_V = { ...DISK, vault: [3, 1] } as const;
const VAULT = { vendor: [0.5, 1], vault: [2.5, 1] } as const;
const ENV = { identity: [0, 1], dataKey: [1.5, 1], kek: [3, 1] } as const;
const ENV_EDGES = [{ from: "dataKey", to: "identity", label: "encrypts" }, { from: "kek", to: "dataKey", label: "locks" }] as const;
const READ = { platform: [0, 1], dataKey: [1.5, 0.4], vault: [3, 1], identity: [1.5, 1.8] } as const;
const READ_EDGES = [{ from: "platform", to: "vault" }, { from: "platform", to: "identity" }] as const;
const SEARCH = { platform: [0, 1], blindIndex: [1.5, 1], identity: [3, 1] } as const;
const SEARCH_EDGES = [{ from: "platform", to: "blindIndex" }, { from: "blindIndex", to: "identity" }] as const;
const THIEF = (target: HeeyId): DiagramStep<HeeyId>["layout"] => ({ thief: [0, 1], [target]: [1.5, 1], vault: [3, 1] });
const THIEF_EDGES = (target: HeeyId) => [{ from: "thief" as HeeyId, to: target }, { from: "vault" as HeeyId, to: target }];
const THREE = { identity: [0, 0.4], blindIndex: [1.5, 0.4], codeDigest: [3, 0.4], vault: [1.5, 1.8] } as const;
const THREE_EDGES = [{ from: "vault", to: "identity" }, { from: "vault", to: "blindIndex" }, { from: "vault", to: "codeDigest" }] as const;
const OTHERS = { auditChain: [0, 0.4], keycloak: [1, 0.4], credentials: [2, 0.4], platform: [3, 0.4], vault: [1.5, 1.8] } as const;
const OTHERS_EDGES = [{ from: "vault", to: "auditChain" }, { from: "vault", to: "keycloak" }, { from: "vault", to: "credentials" }, { from: "vault", to: "platform" }] as const;
const ON_DISK = { identity: [0, 0.4], blindIndex: [1, 0.4], codeDigest: [2, 0.4], passwordHash: [3, 0.4], thief: [0.5, 1.8], vault: [2.5, 1.8] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The disk.
  { cue: 0, layout: DISK, edges: [{ from: "disk", to: "thief" }], danger: ["thief"], packets: [{ from: "disk", to: "thief", label: "backup copy" }] },
  { cue: 2, layout: DISK, edges: [{ from: "disk", to: "thief" }], danger: ["thief"], badges: { disk: "names · passports · addresses · numbers" } },
  { cue: 3, layout: { ...DISK, aziz: [3, 1] }, edges: [{ from: "disk", to: "thief" }, { from: "aziz", to: "disk" }], danger: ["thief"], accent: ["aziz"] },
  { cue: 4, layout: { ...DISK, aziz: [3, 1] }, edges: [{ from: "disk", to: "thief" }, { from: "aziz", to: "disk" }], danger: ["thief"], badges: { thief: "what can I read?" } },
  // Bridge: the adapters take their credentials from Vault.
  { cue: 5, layout: { adapter: [0.5, 1], myid: [2.5, 0.4], push: [2.5, 1.6] }, edges: [{ from: "adapter", to: "myid" }, { from: "adapter", to: "push" }], badges: { adapter: "Lesson 5" } },
  { cue: 6, layout: { vault: [0, 1], adapter: [1.5, 1], myid: [3, 1] }, edges: [{ from: "vault", to: "adapter", label: "credential" }, { from: "adapter", to: "myid" }], accent: ["vault"] },
  { cue: 7, layout: DISK_V, frames: [wall([3, 1])], edges: [{ from: "disk", to: "thief" }], danger: ["thief"], accent: ["vault"] },
  // Vault, in the bank.
  { cue: 8, layout: { vault: [1.5, 1] }, frames: [wall([1.5, 1])], accent: ["vault"], badges: { vault: "a safe for keys" } },
  { cue: 9, layout: { stage: [0.5, 0.4], production: [2.5, 0.4], vault: [1.5, 1.8] }, badges: { vault: "new, one per zone" } },
  { cue: 10, layout: { platformTeam: [0.5, 1], vault: [2.5, 1] }, frames: [wall([2.5, 1])], edges: [{ from: "platformTeam", to: "vault", label: "unlock keys" }], badges: { platformTeam: "security team" } },
  { cue: 11, layout: VAULT, frames: [wall([2.5, 1])], edges: [{ from: "vendor", to: "vault", broken: true }], crossed: ["vendor"] },
  { cue: 12, layout: VAULT, frames: [wall([2.5, 1])], crossed: ["vendor"], accent: ["vault"], badges: { vault: "the bank keeps the keys" } },
  { cue: 13, layout: { vault: [1.5, 1] }, frames: [wall([1.5, 1])], accent: ["vault"], badges: { vault: "9 kinds of keys" } },
  { cue: 14, layout: THREE, edges: [...THREE_EDGES], accent: ["identity", "blindIndex", "codeDigest"] },
  // 1 · Envelope encryption.
  { cue: 15, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "1 · names · passport · number · address" } },
  { cue: 16, layout: { identity: [0.5, 1], dataKey: [2.5, 1] }, edges: [{ from: "dataKey", to: "identity", label: "encrypts" }], accent: ["dataKey"] },
  { cue: 17, layout: { identity: [0.5, 1], dataKey: [2.5, 1] }, edges: [{ from: "dataKey", to: "identity", label: "encrypts" }], badges: { dataKey: "locked" } },
  { cue: 18, layout: ENV, edges: [...ENV_EDGES], accent: ["kek"] },
  { cue: 19, layout: ENV, frames: [wall([3, 1])], edges: [...ENV_EDGES], badges: { kek: "in Vault" } },
  { cue: 20, layout: READ, edges: [...READ_EDGES], packets: [{ from: "platform", to: "vault", label: "locked key" }] },
  { cue: 21, layout: READ, edges: [...READ_EDGES], packets: [{ from: "vault", to: "platform", label: "open, one request" }], badges: { platform: "then forgets" } },
  { cue: 22, layout: ENV, edges: [...ENV_EDGES], accent: ["identity", "dataKey", "kek"], badges: { dataKey: "envelope encryption" } },
  { cue: 23, layout: { vault: [1.5, 1] }, accent: ["vault"], badges: { vault: "each opening recorded" } },
  { cue: 24, layout: THIEF("identity"), edges: THIEF_EDGES("identity"), danger: ["thief"], packets: [{ from: "thief", to: "identity", label: "open?", stopAt: 0.6 }], badges: { identity: "locked" } },
  // 2 · Blind index.
  { cue: 25, layout: SEARCH, edges: [...SEARCH_EDGES], accent: ["blindIndex"], badges: { blindIndex: "2 · search" } },
  { cue: 26, layout: { platform: [0, 1], identity: [3, 1] }, edges: [{ from: "platform", to: "identity", label: "find by number" }], badges: { identity: "millions" } },
  { cue: 27, layout: { platform: [0, 1], identity: [3, 1] }, edges: [{ from: "platform", to: "identity", broken: true }], badges: { identity: "number encrypted" } },
  { cue: 28, layout: { blindIndex: [0.5, 1], vault: [2.5, 1] }, edges: [{ from: "vault", to: "blindIndex", label: "index key" }], accent: ["blindIndex"] },
  { cue: 29, layout: SEARCH, edges: [...SEARCH_EDGES], packets: [{ from: "platform", to: "identity", label: "same fingerprint" }], badges: { identity: "found ✓" } },
  { cue: 30, layout: { blindIndex: [0.5, 1], person: [2.5, 1] }, edges: [{ from: "blindIndex", to: "person", broken: true }], badges: { blindIndex: "one-way" } },
  { cue: 31, layout: THIEF("blindIndex"), edges: THIEF_EDGES("blindIndex"), danger: ["thief"], packets: [{ from: "thief", to: "blindIndex", label: "fingerprint?", stopAt: 0.6 }], badges: { vault: "index key" } },
  // 3 · Pepper.
  { cue: 32, layout: { codeDigest: [1.5, 1] }, accent: ["codeDigest"], badges: { codeDigest: "3 · codes" } },
  { cue: 33, layout: { codeDigest: [1.5, 1] }, badges: { codeDigest: "Lesson 9: the rules" } },
  { cue: 34, layout: { thief: [0.5, 1], codeDigest: [2.5, 1] }, edges: [{ from: "thief", to: "codeDigest" }], danger: ["codeDigest"], packets: [{ from: "thief", to: "codeDigest", label: "every code" }], badges: { codeDigest: "few digits" } },
  { cue: 35, layout: { codeDigest: [0.5, 1], vault: [2.5, 1] }, frames: [wall([2.5, 1])], edges: [{ from: "vault", to: "codeDigest", label: "pepper" }], accent: ["codeDigest"] },
  { cue: 36, layout: THIEF("codeDigest"), edges: THIEF_EDGES("codeDigest"), danger: ["thief"], packets: [{ from: "thief", to: "codeDigest", label: "every code", stopAt: 0.6 }], badges: { codeDigest: "no pepper, no match" } },
  // The other six kinds.
  { cue: 37, layout: OTHERS, edges: [...OTHERS_EDGES], accent: ["vault"], badges: { vault: "6 more kinds" } },
  { cue: 38, layout: OTHERS, edges: [...OTHERS_EDGES], accent: ["auditChain"], badges: { auditChain: "Lesson 21" } },
  { cue: 39, layout: OTHERS, edges: [...OTHERS_EDGES], accent: ["keycloak"], badges: { keycloak: "signing keys: encrypted" } },
  { cue: 40, layout: OTHERS, edges: [...OTHERS_EDGES], accent: ["credentials"], badges: { credentials: "Lesson 5" } },
  { cue: 41, layout: OTHERS, edges: [...OTHERS_EDGES], accent: ["platform"], badges: { platform: "certificates · 3 kinds" } },
  { cue: 42, layout: { vault: [0, 1], code: [1.8, 0.3], log: [1.8, 1.7], trusted: [3, 1] }, edges: [{ from: "vault", to: "code", broken: true }, { from: "vault", to: "log", broken: true }, { from: "vault", to: "trusted", broken: true }], crossed: ["code", "log", "trusted"] },
  // Passwords: nothing to decrypt.
  { cue: 43, layout: { passwordHash: [1.5, 1] }, accent: ["passwordHash"], badges: { passwordHash: "no key" } },
  { cue: 44, layout: { passwordHash: [1.5, 1] }, badges: { passwordHash: "Lesson 11" } },
  { cue: 45, layout: { thief: [0.5, 1], passwordHash: [2.5, 1] }, edges: [{ from: "thief", to: "passwordHash" }], danger: ["thief"], badges: { passwordHash: "nothing to decrypt" } },
  // Rotation.
  { cue: 46, layout: { platformTeam: [0.5, 1], vault: [2.5, 1] }, edges: [{ from: "platformTeam", to: "vault", label: "sets the period" }], badges: { platformTeam: "the bank" } },
  { cue: 47, layout: ENV, edges: [...ENV_EDGES], packets: [{ from: "kek", to: "dataKey", label: "lock again" }], badges: { kek: "new + old versions" } },
  // The disk again: the plain answer.
  { cue: 48, layout: DISK_V, frames: [wall([3, 1])], edges: [{ from: "disk", to: "thief" }], danger: ["thief"] },
  { cue: 49, layout: { thief: [0.5, 1], login: [2.5, 1] }, edges: [{ from: "thief", to: "login" }], danger: ["thief"], badges: { login: "readable · masked parts" } },
  { cue: 50, layout: ON_DISK, edges: [{ from: "thief", to: "identity", broken: true }], danger: ["thief"], badges: { identity: "unreadable" } },
  { cue: 51, layout: ON_DISK, frames: [wall([2.5, 1.8])], edges: [{ from: "thief", to: "vault", broken: true }], accent: ["vault"], badges: { vault: "every key" } },
  { cue: 52, layout: DISK_V, frames: [wall([3, 1])], edges: [{ from: "disk", to: "thief" }], crossed: ["disk"], badges: { disk: "only lost hardware" } },
  // Check.
  { cue: 53, layout: THIEF("blindIndex"), edges: THIEF_EDGES("blindIndex"), danger: ["thief"], badges: { thief: "guesses the number" } },
  { cue: 54, layout: THIEF("blindIndex"), edges: THIEF_EDGES("blindIndex"), danger: ["thief"], badges: { blindIndex: "match?" } },
  { cue: 55, layout: THIEF("blindIndex"), frames: [wall([3, 1])], edges: THIEF_EDGES("blindIndex"), danger: ["thief"], packets: [{ from: "thief", to: "blindIndex", label: "guess", stopAt: 0.6 }], badges: { blindIndex: "no index key, no match" } },
  // Summary and lesson 7.
  { cue: 56, layout: VAULT, frames: [wall([2.5, 1])], crossed: ["vendor"], accent: ["vault"], badges: { vault: "one per zone" } },
  { cue: 57, layout: THREE, frames: [wall([1.5, 1.8])], edges: [...THREE_EDGES], accent: ["identity", "blindIndex", "codeDigest"], badges: { identity: "envelope", blindIndex: "blind index", codeDigest: "pepper" } },
  { cue: 58, layout: { vault: [0.5, 1], trusted: [2.5, 1] }, frames: [wall([0.5, 1])], edges: [{ from: "vault", to: "trusted", broken: true }], badges: { trusted: "no key on the phone" } },
  { cue: 59, layout: { mobileBank: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "mobileBank", to: "platform" }], accent: ["mobileBank"], badges: { mobileBank: "no key" } },
  { cue: 60, layout: { mobileBank: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "mobileBank", to: "platform", label: "API contract" }], accent: ["platform"], badges: { platform: "Lesson 7" } },
];
