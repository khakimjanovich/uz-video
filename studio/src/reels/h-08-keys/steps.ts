import { BuildMapStep, DiagramFrame, DiagramStep } from "../../components";
import { HeeyMapId } from "../../series/heeyid/map";
import { HeeyId } from "../../series/heeyid/nodes";

// Lesson 8: keys. The disk (0–5); Vault in the bank (6–11); the six kinds (12–41); passwords (42–45);
// rotation (46–50); the disk again (51–54); recap and the way to the API contract (55–61).
export const map: BuildMapStep<HeeyMapId>[] = [
  { cue: 6, part: 2, rows: [2], current: ["vault"], units: { heeyid: "all keys: Vault" } },
  { cue: 59, part: 2, current: ["mobile", "sideapps", "edge"], units: { heeyid: "what may an app keep?" } },
  { cue: 61, part: 2, rows: [2], dot: "off" },
];

const bank: DiagramFrame = { label: "the bank", from: [2.5, 1], to: [2.5, 1], tone: "wall" };
const DISK = { thief: [0, 1], disk: [1.5, 1] } as const;
const VAULT = { vendor: [0.5, 1], vault: [2.5, 1] } as const;
const ENV = { identity: [0, 1], dataKey: [1.5, 1], vault: [3, 1] } as const;
const ENV_EDGES = [{ from: "dataKey", to: "identity" }, { from: "vault", to: "dataKey" }] as const;
const READ = { platform: [0, 1], dataKey: [1.5, 0.4], vault: [3, 1], identity: [1.5, 1.8] } as const;
const READ_EDGES = [{ from: "platform", to: "vault" }, { from: "platform", to: "identity" }] as const;
const THIEF = (target: HeeyId): DiagramStep<HeeyId>["layout"] => ({ thief: [0, 1], [target]: [1.5, 1], vault: [3, 1] });
const THIEF_EDGES = (target: HeeyId) => [{ from: "thief" as HeeyId, to: target }, { from: "vault" as HeeyId, to: target }];
const SIX = { identity: [0, 0.4], blindIndex: [1, 0.4], codeDigest: [2, 0.4], auditChain: [3, 0.4], keycloak: [0.5, 1.8], credentials: [1.5, 1.8], vault: [2.8, 1.8] } as const;

export const diagram: DiagramStep<HeeyId>[] = [
  // The disk.
  { cue: 0, layout: DISK, edges: [{ from: "disk", to: "thief" }], danger: ["thief"], packets: [{ from: "disk", to: "thief", label: "backup copy" }] },
  { cue: 1, layout: DISK, edges: [{ from: "disk", to: "thief" }], danger: ["thief"], badges: { disk: "names · passports · addresses" } },
  { cue: 2, layout: { ...DISK, aziz: [3, 1] }, edges: [{ from: "disk", to: "thief" }, { from: "aziz", to: "disk" }], danger: ["thief"], accent: ["aziz"] },
  { cue: 3, layout: { ...DISK, aziz: [3, 1] }, edges: [{ from: "disk", to: "thief" }, { from: "aziz", to: "disk" }], danger: ["thief"], badges: { thief: "what can I read?" } },
  // Vault, in the bank.
  { cue: 6, layout: VAULT, frames: [bank], accent: ["vault"] },
  { cue: 7, layout: VAULT, frames: [bank], badges: { vault: "new, per zone · unseal: bank" } },
  { cue: 8, layout: VAULT, frames: [bank], edges: [{ from: "vendor", to: "vault", broken: true }], crossed: ["vendor"] },
  { cue: 9, layout: VAULT, frames: [bank], crossed: ["vendor"], accent: ["vault"], badges: { vault: "the bank keeps the keys" } },
  { cue: 10, layout: SIX, frames: [{ label: "the bank", from: [2.8, 1.8], to: [2.8, 1.8], tone: "wall" }], accent: ["vault"] },
  { cue: 11, layout: { ...DISK, vault: [3, 1] }, frames: [{ label: "the bank", from: [3, 1], to: [3, 1], tone: "wall" }], edges: [{ from: "disk", to: "thief" }], danger: ["thief"] },
  // 1 · Envelope encryption.
  { cue: 12, layout: { identity: [1.5, 1] }, accent: ["identity"], badges: { identity: "1 · names · documents · addresses" } },
  { cue: 13, layout: { identity: [0.5, 1], dataKey: [2.5, 1] }, edges: [{ from: "dataKey", to: "identity", label: "encrypts" }], accent: ["dataKey"] },
  { cue: 14, layout: ENV, edges: [...ENV_EDGES], accent: ["vault"], badges: { dataKey: "wrapped", vault: "key-encryption key" } },
  { cue: 15, layout: ENV, frames: [{ label: "the bank", from: [3, 1], to: [3, 1], tone: "wall" }], edges: [...ENV_EDGES], badges: { vault: "never leaves" } },
  { cue: 16, layout: READ, edges: [...READ_EDGES], packets: [{ from: "platform", to: "vault", label: "wrapped key" }, { from: "vault", to: "platform", label: "unwrapped, one request", delay: 60 }], badges: { platform: "then forgets" } },
  { cue: 17, layout: ENV, edges: [...ENV_EDGES], accent: ["identity", "dataKey", "vault"], badges: { dataKey: "envelope encryption" } },
  { cue: 18, layout: THIEF("identity"), edges: THIEF_EDGES("identity"), danger: ["thief"], packets: [{ from: "thief", to: "identity", label: "open?", stopAt: 0.6 }], badges: { identity: "encrypted" } },
  { cue: 19, layout: ENV, edges: [...ENV_EDGES], accent: ["vault"], badges: { vault: "each unwrap recorded" } },
  // 2 · Blind index.
  { cue: 20, layout: { maker: [0, 1], blindIndex: [1.5, 1], identity: [3, 1] }, edges: [{ from: "maker", to: "blindIndex" }, { from: "blindIndex", to: "identity" }], accent: ["blindIndex"], badges: { blindIndex: "2 · search" } },
  { cue: 21, layout: { maker: [0, 1], blindIndex: [1.5, 1], identity: [3, 1] }, edges: [{ from: "maker", to: "blindIndex" }, { from: "blindIndex", to: "identity" }], badges: { maker: "operator: exact number" } },
  { cue: 22, layout: { maker: [0, 1], identity: [3, 1] }, edges: [{ from: "maker", to: "identity", broken: true }], badges: { identity: "number encrypted" } },
  { cue: 23, layout: { blindIndex: [0.5, 1], vault: [2.5, 1] }, edges: [{ from: "vault", to: "blindIndex", label: "index key" }], accent: ["blindIndex"], badges: { blindIndex: "keyed hash" } },
  { cue: 24, layout: { maker: [0, 1], blindIndex: [1.5, 1], identity: [3, 1] }, edges: [{ from: "maker", to: "blindIndex" }, { from: "blindIndex", to: "identity" }], packets: [{ from: "maker", to: "identity", label: "same index" }], badges: { identity: "found ✓" } },
  { cue: 25, layout: THIEF("blindIndex"), edges: THIEF_EDGES("blindIndex"), danger: ["thief"], packets: [{ from: "thief", to: "blindIndex", label: "guess", stopAt: 0.6 }], badges: { blindIndex: "no key, no test" } },
  { cue: 26, layout: { blindIndex: [0.5, 1], trusted: [2.5, 1] }, edges: [{ from: "blindIndex", to: "trusted", label: "binding digest" }], badges: { trusted: "session bound" } },
  // 3 · Code digests with a pepper.
  { cue: 28, layout: { codeDigest: [0.5, 1], vault: [2.5, 1] }, edges: [{ from: "vault", to: "codeDigest", label: "pepper" }], accent: ["codeDigest"], badges: { codeDigest: "3 · codes" } },
  { cue: 29, layout: { thief: [0.5, 1], codeDigest: [2.5, 1] }, edges: [{ from: "thief", to: "codeDigest" }], danger: ["codeDigest"], badges: { codeDigest: "plain: easy to reverse" } },
  { cue: 30, layout: THIEF("codeDigest"), edges: THIEF_EDGES("codeDigest"), danger: ["thief"], packets: [{ from: "thief", to: "codeDigest", label: "guess", stopAt: 0.6 }], badges: { codeDigest: "pepper: in Vault" } },
  // 4 · Audit chain.
  { cue: 31, layout: { auditChain: [1.5, 1] }, accent: ["auditChain"], badges: { auditChain: "4 · audit" } },
  { cue: 32, layout: { auditChain: [0.5, 1], vault: [2.5, 1] }, edges: [{ from: "vault", to: "auditChain", label: "audit key" }], badges: { auditChain: "each event ← the one before" } },
  { cue: 33, layout: { thief: [0.5, 1], auditChain: [2.5, 1] }, edges: [{ from: "thief", to: "auditChain" }], danger: ["auditChain"], shake: { auditChain: 0.3 }, badges: { auditChain: "chain breaks" } },
  { cue: 34, layout: { auditChain: [0.5, 1], platformTeam: [2.5, 1] }, edges: [{ from: "auditChain", to: "platformTeam" }], packets: [{ from: "auditChain", to: "platformTeam", label: "alert" }], badges: { auditChain: "daily verifier" } },
  // 5 · Realm keys.
  { cue: 35, layout: { keycloak: [1.5, 1] }, accent: ["keycloak"], badges: { keycloak: "5 · signatures" } },
  { cue: 36, layout: { keycloak: [0.5, 1], token: [2.5, 1] }, edges: [{ from: "keycloak", to: "token", label: "signs" }], badges: { keycloak: "realm keys" } },
  { cue: 37, layout: { keycloak: [0.5, 1], vault: [2.5, 1] }, edges: [{ from: "vault", to: "keycloak", label: "secret" }], badges: { keycloak: "keystore: encrypted" } },
  // 6 · Outside credentials.
  { cue: 38, layout: { credentials: [1.5, 1] }, accent: ["credentials"], badges: { credentials: "6 · outside services" } },
  { cue: 39, layout: { credentials: [0, 1], adapter: [1.5, 1], myid: [3, 1] }, edges: [{ from: "credentials", to: "adapter" }, { from: "adapter", to: "myid" }], badges: { adapter: "only its own" } },
  { cue: 40, layout: { vault: [0, 1], adapter: [1.5, 1], push: [3, 1] }, edges: [{ from: "vault", to: "adapter", label: "file" }, { from: "adapter", to: "push" }], badges: { adapter: "push adapter only" } },
  { cue: 41, layout: { credentials: [0, 1], code: [1.5, 0.4], trusted: [1.5, 1.6], log: [3, 1] }, edges: [{ from: "credentials", to: "code", broken: true }, { from: "credentials", to: "trusted", broken: true }, { from: "credentials", to: "log", broken: true }], crossed: ["code", "trusted", "log"] },
  // Passwords: nothing to decrypt.
  { cue: 42, layout: { passwordHash: [1.5, 1] }, accent: ["passwordHash"] },
  { cue: 43, layout: { passwordHash: [1.5, 1] }, badges: { passwordHash: "not encrypted: on purpose" } },
  { cue: 44, layout: { passwordHash: [1.5, 1] }, badges: { passwordHash: "slow · salted hash" } },
  { cue: 45, layout: THIEF("passwordHash"), edges: [{ from: "thief", to: "passwordHash" }], crossed: ["vault"], danger: ["thief"], badges: { passwordHash: "no key to steal" } },
  // Rotation.
  { cue: 46, layout: { vault: [1.5, 1] }, accent: ["vault"], badges: { vault: "keys age" } },
  { cue: 47, layout: { vault: [1.5, 1] }, badges: { vault: "rotation: the bank's period" } },
  { cue: 48, layout: ENV, edges: [...ENV_EDGES], packets: [{ from: "vault", to: "dataKey", label: "wrap again" }], badges: { vault: "new version + old kept" } },
  { cue: 49, layout: { auditChain: [0.5, 1], vault: [2.5, 1] }, edges: [{ from: "vault", to: "auditChain" }], badges: { auditChain: "old chains verify" } },
  { cue: 50, layout: { vault: [0.5, 1], platformTeam: [2.5, 1] }, edges: [{ from: "platformTeam", to: "vault", label: "approves" }], badges: { platformTeam: "owner per key" } },
  // The disk again.
  { cue: 51, layout: { ...DISK, vault: [3, 1] }, frames: [{ label: "the bank", from: [3, 1], to: [3, 1], tone: "wall" }], edges: [{ from: "disk", to: "thief" }], danger: ["thief"] },
  { cue: 52, layout: SIX, frames: [{ label: "the bank", from: [2.8, 1.8], to: [2.8, 1.8], tone: "wall" }], badges: { identity: "encrypted", blindIndex: "index", codeDigest: "digest", auditChain: "signed", credentials: "not on disk" } },
  { cue: 53, layout: { ...DISK, vault: [3, 1] }, frames: [{ label: "the bank", from: [3, 1], to: [3, 1], tone: "wall" }], edges: [{ from: "disk", to: "thief" }, { from: "thief", to: "vault", broken: true }], accent: ["vault"], badges: { vault: "every key" } },
  { cue: 54, layout: { ...DISK, vault: [3, 1] }, frames: [{ label: "the bank", from: [3, 1], to: [3, 1], tone: "wall" }], edges: [{ from: "disk", to: "thief" }], crossed: ["disk"], badges: { disk: "hardware, not identities" } },
  // Recap.
  { cue: 55, layout: VAULT, frames: [bank], crossed: ["vendor"], accent: ["vault"], badges: { vault: "one per zone" } },
  { cue: 56, layout: SIX, frames: [{ label: "the bank", from: [2.8, 1.8], to: [2.8, 1.8], tone: "wall" }], accent: ["identity", "blindIndex", "codeDigest", "auditChain", "keycloak", "credentials"] },
  { cue: 57, layout: ENV, edges: [...ENV_EDGES], accent: ["dataKey"], badges: { dataKey: "envelope" } },
  { cue: 58, layout: { vault: [0.5, 1], trusted: [2.5, 1] }, frames: [{ label: "the bank", from: [0.5, 1], to: [0.5, 1], tone: "wall" }], edges: [{ from: "vault", to: "trusted", broken: true }], badges: { trusted: "no key on the phone" } },
  { cue: 60, layout: { mobileBank: [0.5, 1], platform: [2.5, 1] }, edges: [{ from: "mobileBank", to: "platform" }], accent: ["mobileBank"], badges: { mobileBank: "keeps what?" } },
];
