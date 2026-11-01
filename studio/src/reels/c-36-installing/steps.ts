import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 38: the keyholders. One morning carries it: Timur installs the card zone with five colleagues behind him.
// The server room (cues 0–3), the bridge (4–6), the easier way (7–14), key shares (15–23), sealed Vault (24–27),
// the session's master key (28–30), backups together (31–34), the installer (35–46), a restart (47–54), nine o'clock (55–59).
// Never a share on screen: shares are only named, never shown.
const ONE = { m78Alone: [0, 1], m78TextFile: [1.5, 1], laptop: [3, 1] } as const;
const ONE_EDGES = [{ from: "m78Alone", to: "m78TextFile", label: "ran once" }, { from: "m78TextFile", to: "laptop" }] as const;
const LOST = { postgres: [0.4, 1], backup: [2.6, 1] } as const;
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
const ROOM = { admin: [0.4, 0.4], m78Server: [2.6, 0.4], keyholders: [1.5, 1.9] } as const;
const GUARDS = { m78Alone: [0, 1], card: [1.5, 1], backup: [3, 1] } as const;

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 4, part: 7, current: ["vault", "cardsinfra"] },
  { cue: 5, part: 7, current: ["card", "cardsinfra"] },
  { cue: 6, part: 7, current: ["vault", "cardsinfra"] },
  { cue: 60, part: 7, current: ["kubernetes"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // Monday morning in the server room.
  { cue: 0, layout: { admin: [0.4, 1], m78Server: [2.6, 1] }, edges: [{ from: "admin", to: "m78Server" }], badges: { admin: "Timur", m78Server: "Mon 7:00" } },
  { cue: 1, layout: { admin: [0.4, 1], m78Server: [2.6, 1] }, edges: [{ from: "admin", to: "m78Server" }], badges: { admin: "Timur", m78Server: "fresh" }, accent: ["m78Server"] },
  { cue: 2, layout: ROOM, edges: [{ from: "admin", to: "m78Server", label: "installs" }], badges: { admin: "Timur", keyholders: "five colleagues" }, accent: ["keyholders"] },
  { cue: 3, layout: ROOM, edges: [{ from: "admin", to: "m78Server", label: "installs" }], badges: { admin: "Timur", keyholders: "Dilnoza among them" } },
  // The easier way: one person and one file.
  { cue: 7, layout: ONE, edges: [ONE_EDGES[0]], badges: { m78Alone: "Timur" }, accent: ["m78Alone"] },
  { cue: 8, layout: ONE, edges: [...ONE_EDGES], badges: { m78TextFile: "master password" }, danger: ["m78TextFile"] },
  { cue: 9, layout: ONE, edges: [...ONE_EDGES], badges: { m78Alone: "leaves the bank" }, crossed: ["m78Alone"] },
  { cue: 10, layout: LOST, edges: [{ from: "postgres", to: "backup" }], badges: { postgres: "disk fails" }, danger: ["postgres"] },
  { cue: 11, layout: LOST, edges: [{ from: "postgres", to: "backup" }], badges: { backup: "can't be read" }, danger: ["backup"] },
  { cue: 12, layout: ONE, edges: [...ONE_EDGES], badges: { m78Alone: "one person", m78TextFile: "lost or leaked" }, danger: ["m78TextFile"] },
  { cue: 13, layout: { attacker: [0, 1], vault: [1.5, 1], m78Alone: [3, 1] }, edges: [{ from: "attacker", to: "vault", label: "guarded" }, { from: "m78Alone", to: "vault" }], badges: { m78Alone: "forgotten" } },
  { cue: 14, layout: { attacker: [0, 1], vault: [1.5, 1], m78Alone: [3, 1] }, edges: [{ from: "attacker", to: "vault", label: "guarded" }, { from: "m78Alone", to: "vault" }], badges: { m78Alone: "the bigger risk" }, danger: ["m78Alone"] },
  // Key shares.
  { cue: 15, layout: { vault: [1.5, 1] }, badges: { vault: "every key · setting" }, accent: ["vault"] },
  { cue: 16, layout: SHARES, edges: [...SHARE_EDGE], packets: [{ from: "vault", to: "keyholders", label: "split in five" }] },
  { cue: 17, layout: SHARES, edges: [...SHARE_EDGE], badges: { keyholders: "useless alone" } },
  { cue: 18, layout: SHARES, edges: [{ from: "keyholders", to: "vault", label: "any three" }], packets: [{ from: "keyholders", to: "vault", label: "three" }], badges: { vault: "opens" }, accent: ["vault"] },
  { cue: 19, layout: { m78Alone: [0.4, 1], vault: [2.6, 1] }, edges: [{ from: "m78Alone", to: "vault", label: "one or two" }], badges: { vault: "stays shut" }, crossed: ["m78Alone"] },
  { cue: 20, layout: SHARES, edges: [...SHARE_EDGE], badges: { keyholders: "one share each" }, accent: ["keyholders"] },
  { cue: 21, layout: KEEP, edges: [...KEEP_EDGE], badges: { m78PasswordManager: "nowhere else" }, accent: ["m78PasswordManager"] },
  { cue: 22, layout: { bank: [0.4, 1], keyholders: [2.6, 1] }, edges: [{ from: "bank", to: "keyholders", label: "chooses" }], badges: { keyholders: "nobody holds two" } },
  { cue: 23, layout: { m78Notes: [1.5, 1] }, badges: { m78Notes: "nothing written" }, crossed: ["m78Notes"] },
  // Sealed at every start.
  { cue: 24, layout: SEAL, edges: [SEAL_EDGES[1]], badges: { vault: "locks itself" } },
  { cue: 25, layout: SEAL, edges: [SEAL_EDGES[1]], badges: { vault: "sealed" }, danger: ["vault"] },
  { cue: 26, layout: SEAL, edges: [...SEAL_EDGES], packets: [{ from: "keyholders", to: "vault", label: "each their own" }], badges: { vault: "sealed" } },
  { cue: 27, layout: SEAL, edges: [...SEAL_EDGES], packets: [{ from: "vault", to: "card", label: "?", stopAt: 0.5 }], badges: { card: "can't run yet" }, danger: ["card"] },
  // The session's master key.
  { cue: 28, layout: MASTER, edges: [...MASTER_EDGES], accent: ["m78MasterKey"] },
  { cue: 29, layout: MASTER, edges: [...MASTER_EDGES], packets: [{ from: "keyholders", to: "m78MasterKey", label: "three" }], badges: { m78MasterKey: "always revoked" } },
  { cue: 30, layout: MASTER, edges: [...MASTER_EDGES], badges: { m78MasterKey: "nothing to steal" }, crossed: ["m78MasterKey"] },
  // Backups, together.
  { cue: 31, layout: BACKUP, edges: [...BACKUP_EDGES] },
  { cue: 32, layout: BACKUP, edges: [...BACKUP_EDGES], badges: { postgres: "sealed by Vault" } },
  { cue: 33, layout: BACKUP, edges: [BACKUP_EDGES[0]], badges: { backup: "unreadable alone" }, crossed: ["vault"], danger: ["backup"] },
  { cue: 34, layout: BACKUP, edges: [...BACKUP_EDGES], badges: { backup: "together" }, frames: [{ label: "backed up together", from: [0, 1], to: [1.5, 1] }], accent: ["backup"] },
  // Back in the server room: the installer.
  { cue: 35, layout: RUN, edges: [...RUN_EDGES], packets: [{ from: "admin", to: "m78Installer", label: "card zone" }], badges: { admin: "Timur" }, accent: ["m78Installer"] },
  { cue: 36, layout: RUN, edges: [...RUN_EDGES], badges: { admin: "Timur", m78Server: "checked first" } },
  { cue: 37, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { m78Installer: "Vault is new" } },
  { cue: 38, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { m78Installer: "press Enter" } },
  { cue: 39, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { keyholders: "five people" }, accent: ["keyholders"] },
  { cue: 40, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { keyholders: "people, not the screen" } },
  { cue: 41, layout: CEREMONY, edges: [...CEREMONY_EDGES], packets: [{ from: "keyholders", to: "m78PasswordManager", label: "saved" }] },
  { cue: 42, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { m78Installer: "every share saved?" } },
  { cue: 43, layout: CEREMONY, edges: [...CEREMONY_EDGES], badges: { m78Installer: "screen cleared" }, accent: ["m78Installer"] },
  { cue: 44, layout: MASTER, edges: [...MASTER_EDGES], packets: [{ from: "keyholders", to: "m78MasterKey", label: "three, unseen" }], badges: { vault: "unsealed" } },
  { cue: 45, layout: START, edges: [...START_EDGES], packets: [{ from: "m78Installer", to: "m78Services", label: "start" }], accent: ["m78Services"] },
  { cue: 46, layout: MASTER, edges: [...MASTER_EDGES], badges: { m78MasterKey: "revoked" }, crossed: ["m78MasterKey"] },
  // Day one: a restart.
  { cue: 47, layout: RESTART, edges: [...RESTART_EDGES], badges: { admin: "Timur · day one" } },
  { cue: 48, layout: RESTART, edges: [...RESTART_EDGES], badges: { admin: "Timur", vault: "restarted" } },
  { cue: 49, layout: RESTART, edges: [...RESTART_EDGES], packets: [{ from: "admin", to: "m78InstallCheck", label: "check" }], accent: ["m78InstallCheck"] },
  { cue: 50, layout: RESTART, edges: [...RESTART_EDGES], badges: { m78InstallCheck: "stops", vault: "Vault is sealed" }, danger: ["m78InstallCheck", "vault"] },
  { cue: 51, layout: RESTART, edges: [...RESTART_EDGES, { from: "keyholders", to: "vault" }], badges: { vault: "sealed", keyholders: "three called" } },
  { cue: 52, layout: RESTART, edges: [...RESTART_EDGES, { from: "keyholders", to: "vault" }], packets: [{ from: "keyholders", to: "vault", label: "Dilnoza: 1 of 3" }], badges: { vault: "sealed" } },
  { cue: 53, layout: RESTART, edges: [...RESTART_EDGES, { from: "keyholders", to: "vault" }], packets: [2, 3].map((k) => ({ from: "keyholders" as const, to: "vault" as const, label: `${k} of 3`, delay: 10 + (k - 2) * 40 })) },
  { cue: 54, layout: RESTART, edges: [...RESTART_EDGES, { from: "keyholders", to: "vault" }], badges: { vault: "open", m78InstallCheck: "passes" }, accent: ["vault", "m78InstallCheck"] },
  // Nine o'clock: what the ceremony bought.
  { cue: 55, layout: { keyholders: [0.4, 1], vault: [2.6, 1] }, edges: [{ from: "keyholders", to: "vault" }], badges: { vault: "open · 9:00" }, accent: ["vault"] },
  { cue: 56, layout: GUARDS, badges: { m78Alone: "can't open alone" }, crossed: ["m78Alone"] },
  { cue: 57, layout: GUARDS, badges: { m78Alone: "leaves · loses · tempted" }, crossed: ["m78Alone"] },
  { cue: 58, layout: GUARDS, badges: { card: "nothing readable" }, accent: ["card"] },
  { cue: 59, layout: GUARDS, badges: { card: "nothing readable", backup: "restore works" }, accent: ["backup"] },
];
