import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 36: the keyholders. One person and one file (cues 1–6), the torn map (7–10), key shares (11–18),
// sealed Vault (19–22), the session's master key (23–25), backups together (26–29), the installer (30–42),
// a restart (43–48), what it protects (49–53). Never a share on screen: shares are only named, never shown.
const ONE = { m78Alone: [0, 1], m78TextFile: [1.5, 1], laptop: [3, 1] } as const;
const ONE_EDGES = [{ from: "m78Alone", to: "m78TextFile", label: "ran once" }, { from: "m78TextFile", to: "laptop" }] as const;
const LOST = { postgres: [0.4, 1], backup: [2.6, 1] } as const;
const MAP = { m78Treasure: [0.4, 1], keyholders: [2.6, 1] } as const;
const MAP_EDGE = [{ from: "m78Treasure", to: "keyholders", label: "five pieces" }] as const;
const SHARES = { vault: [0.4, 1], keyholders: [2.6, 1] } as const;
const SHARE_EDGE = [{ from: "vault", to: "keyholders", label: "five shares" }] as const;
const KEEP = { keyholders: [0.4, 1], m78PasswordManager: [2.6, 1] } as const;
const KEEP_EDGE = [{ from: "keyholders", to: "m78PasswordManager", label: "own share" }] as const;
const SEAL = { keyholders: [0, 1], vault: [1.5, 1], card: [3, 1] } as const;
const SEAL_EDGES = [{ from: "keyholders", to: "vault", label: "three shares" }, { from: "vault", to: "card" }] as const;
const MASTER = { keyholders: [0, 1], m78MasterKey: [1.5, 1], vault: [3, 1] } as const;
const MASTER_EDGES = [{ from: "keyholders", to: "m78MasterKey", label: "three" }, { from: "m78MasterKey", to: "vault", label: "one session" }] as const;
const BACKUP = { postgres: [0, 1], vault: [1.5, 1], backup: [3, 1] } as const;
const BACKUP_EDGES = [{ from: "postgres", to: "backup" }, { from: "vault", to: "backup" }] as const;
const RUN = { admin: [0, 1], m78Installer: [1.5, 1], m78Server: [3, 1] } as const;
const RUN_EDGES = [{ from: "admin", to: "m78Installer", label: "runs" }, { from: "m78Installer", to: "m78Server" }] as const;
const CEREMONY = { m78Installer: [0, 1], keyholders: [1.5, 1], m78PasswordManager: [3, 1] } as const;
const CEREMONY_EDGES = [{ from: "m78Installer", to: "keyholders", label: "waits" }, { from: "keyholders", to: "m78PasswordManager", label: "own share" }] as const;
const START = { m78Installer: [0, 1], vault: [1.5, 1], m78Services: [3, 1] } as const;
const START_EDGES = [{ from: "m78Installer", to: "vault" }, { from: "m78Installer", to: "m78Services", label: "starts" }] as const;
const RESTART = { admin: [0, 0.4], m78InstallCheck: [1.5, 0.4], vault: [3, 0.4], keyholders: [3, 1.9] } as const;
const RESTART_EDGES = [{ from: "admin", to: "m78InstallCheck", label: "runs" }, { from: "m78InstallCheck", to: "vault" }] as const;
const GUARDS = { m78Alone: [0, 1], card: [1.5, 1], backup: [3, 1] } as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 7, current: ["vault", "cardsinfra"] },
  { cue: 56, part: 7, current: ["kubernetes"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // One person and one file.
  { cue: 1, layout: ONE, edges: [ONE_EDGES[0]], accent: ["m78Alone"] },
  { cue: 2, layout: ONE, edges: [...ONE_EDGES], badges: { m78TextFile: "master password" }, danger: ["m78TextFile"] },
  { cue: 3, layout: ONE, edges: [...ONE_EDGES], badges: { m78Alone: "leaves the bank" }, crossed: ["m78Alone"] },
  { cue: 4, layout: LOST, edges: [{ from: "postgres", to: "backup" }], badges: { postgres: "disk fails" }, danger: ["postgres"] },
  { cue: 5, layout: LOST, edges: [{ from: "postgres", to: "backup" }], badges: { backup: "can't be read" }, danger: ["backup"] },
  { cue: 6, layout: ONE, edges: [...ONE_EDGES], badges: { m78Alone: "one person", m78TextFile: "lost or leaked" }, danger: ["m78TextFile"] },
  // The torn treasure map.
  { cue: 7, layout: { m78Treasure: [1.5, 1] }, accent: ["m78Treasure"] },
  { cue: 8, layout: MAP, edges: [...MAP_EDGE], packets: [{ from: "m78Treasure", to: "keyholders", label: "five" }], badges: { keyholders: "five people" } },
  { cue: 9, layout: MAP, edges: [...MAP_EDGE], badges: { keyholders: "any three" }, accent: ["keyholders"] },
  { cue: 10, layout: { m78Alone: [0.4, 1], m78Treasure: [2.6, 1] }, edges: [{ from: "m78Alone", to: "m78Treasure", label: "one or two" }], badges: { m78Treasure: "stays torn" }, crossed: ["m78Alone"] },
  // Key shares.
  { cue: 11, layout: { vault: [1.5, 1] }, badges: { vault: "every key · setting" }, accent: ["vault"] },
  { cue: 12, layout: SHARES, edges: [...SHARE_EDGE], packets: [{ from: "vault", to: "keyholders", label: "split in five" }] },
  { cue: 13, layout: SHARES, edges: [...SHARE_EDGE], badges: { keyholders: "useless alone" } },
  { cue: 14, layout: SHARES, edges: [{ from: "keyholders", to: "vault", label: "any three" }], packets: [{ from: "keyholders", to: "vault", label: "three" }], badges: { vault: "opens" }, accent: ["vault"] },
  { cue: 15, layout: SHARES, edges: [...SHARE_EDGE], badges: { keyholders: "one share each" }, accent: ["keyholders"] },
  { cue: 16, layout: KEEP, edges: [...KEEP_EDGE], badges: { m78PasswordManager: "nowhere else" }, accent: ["m78PasswordManager"] },
  { cue: 17, layout: { bank: [0.4, 1], keyholders: [2.6, 1] }, edges: [{ from: "bank", to: "keyholders", label: "chooses" }], badges: { keyholders: "nobody holds two" } },
  { cue: 18, layout: { m78Notes: [1.5, 1] }, badges: { m78Notes: "nothing written" }, crossed: ["m78Notes"] },
  // Sealed at every start.
  { cue: 19, layout: SEAL, edges: [SEAL_EDGES[1]], badges: { vault: "locks itself" } },
  { cue: 20, layout: SEAL, edges: [SEAL_EDGES[1]], badges: { vault: "sealed" }, danger: ["vault"] },
  { cue: 21, layout: SEAL, edges: [...SEAL_EDGES], packets: [{ from: "keyholders", to: "vault", label: "each their own" }], badges: { vault: "sealed" } },
  { cue: 22, layout: SEAL, edges: [...SEAL_EDGES], packets: [{ from: "vault", to: "card", label: "?", stopAt: 0.5 }], badges: { card: "can't run yet" }, danger: ["card"] },
  // The session's master key.
  { cue: 23, layout: MASTER, edges: [...MASTER_EDGES], accent: ["m78MasterKey"] },
  { cue: 24, layout: MASTER, edges: [...MASTER_EDGES], packets: [{ from: "keyholders", to: "m78MasterKey", label: "three" }], badges: { m78MasterKey: "always revoked" } },
  { cue: 25, layout: MASTER, edges: [...MASTER_EDGES], badges: { m78MasterKey: "nothing to steal" }, crossed: ["m78MasterKey"] },
  // Backups, together.
  { cue: 26, layout: BACKUP, edges: [...BACKUP_EDGES] },
  { cue: 27, layout: BACKUP, edges: [...BACKUP_EDGES], badges: { postgres: "sealed by Vault" } },
  { cue: 28, layout: BACKUP, edges: [BACKUP_EDGES[0]], badges: { backup: "unreadable alone" }, crossed: ["vault"], danger: ["backup"] },
  { cue: 29, layout: BACKUP, edges: [...BACKUP_EDGES], badges: { backup: "together" }, frames: [{ label: "backed up together", from: [0, 1], to: [1.5, 1] }], accent: ["backup"] },
  // The installer.
  { cue: 30, layout: RUN, edges: [...RUN_EDGES] },
  { cue: 31, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "admin", to: "m78Installer", label: "card zone" }], accent: ["m78Installer"] },
  { cue: 32, layout: RUN, edges: [...RUN_EDGES], badges: { m78Server: "checked first" } },
  { cue: 33, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { m78Installer: "Vault is new" } },
  { cue: 34, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { m78Installer: "press Enter" } },
  { cue: 35, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { keyholders: "five people" }, accent: ["keyholders"] },
  { cue: 36, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { keyholders: "people, not the screen" } },
  { cue: 37, layout: CEREMONY, edges: [...CEREMONY_EDGES], packets: [{ from: "keyholders", to: "m78PasswordManager", label: "saved" }] },
  { cue: 38, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { m78Installer: "every share saved?" } },
  { cue: 39, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { m78Installer: "screen cleared" }, accent: ["m78Installer"] },
  { cue: 40, layout: MASTER, edges: [...MASTER_EDGES], packets: [{ from: "keyholders", to: "m78MasterKey", label: "three, unseen" }], badges: { vault: "unsealed" } },
  { cue: 41, layout: START, edges: [...START_EDGES], packets: [{ from: "m78Installer", to: "m78Services", label: "start" }], accent: ["m78Services"] },
  { cue: 42, layout: MASTER, edges: [...MASTER_EDGES], badges: { m78MasterKey: "revoked" }, crossed: ["m78MasterKey"] },
  // A restart.
  { cue: 43, layout: RESTART, edges: [...RESTART_EDGES], badges: { vault: "restarted" } },
  { cue: 44, layout: RESTART, edges: [...RESTART_EDGES], packets: [{ from: "admin", to: "m78InstallCheck", label: "check" }], accent: ["m78InstallCheck"] },
  { cue: 45, layout: RESTART, edges: [...RESTART_EDGES], badges: { m78InstallCheck: "stops", vault: "Vault is sealed" }, danger: ["m78InstallCheck", "vault"] },
  { cue: 46, layout: RESTART, edges: [...RESTART_EDGES, { from: "keyholders", to: "vault" }], badges: { vault: "sealed", keyholders: "three called" } },
  { cue: 47, layout: RESTART, edges: [...RESTART_EDGES, { from: "keyholders", to: "vault" }], packets: [1, 2, 3].map((k) => ({ from: "keyholders" as const, to: "vault" as const, label: `${k} of 3`, delay: 10 + (k - 1) * 40 })) },
  { cue: 48, layout: RESTART, edges: [...RESTART_EDGES, { from: "keyholders", to: "vault" }], badges: { vault: "open", m78InstallCheck: "passes" }, accent: ["vault", "m78InstallCheck"] },
  // What it protects.
  { cue: 49, layout: GUARDS },
  { cue: 50, layout: GUARDS, badges: { m78Alone: "leaves · loses · tempted" }, danger: ["m78Alone"] },
  { cue: 51, layout: GUARDS, badges: { m78Alone: "can't open alone" }, crossed: ["m78Alone"] },
  { cue: 52, layout: GUARDS, badges: { card: "nothing readable" }, accent: ["card"] },
  { cue: 53, layout: GUARDS, badges: { card: "nothing readable", backup: "restore works" }, accent: ["backup"] },
  { cue: 54, layout: MAP, edges: [...MAP_EDGE] },
  { cue: 55, layout: MAP, edges: [...MAP_EDGE], badges: { keyholders: "three, every time" }, accent: ["keyholders"] },
];
