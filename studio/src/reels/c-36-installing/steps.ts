import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 36: the keyholders. The torn map (cues 0–2), the key shares (3–5), sealed after a restart (6),
// the master key (7), backups with their Vault (8), the close (9).
const SHARES = { vault: [0.4, 1], keyholders: [2.6, 1] } as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 8, current: ["vault", "cardsinfra"] },
  { cue: 9, part: 8, current: ["kubernetes"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The torn treasure map.
  {
    cue: 1,
    layout: { m78Treasure: [0.4, 1], keyholders: [2.6, 1] },
    edges: [{ from: "m78Treasure", to: "keyholders", label: "5 pieces" }],
    packets: [{ from: "m78Treasure", to: "keyholders", label: "piece" }],
    badges: { keyholders: "five people" },
  },
  {
    cue: 2,
    layout: { m78Treasure: [1.5, 0.3], keyholders: [0, 1.8], m78Alone: [3, 1.8] },
    edges: [{ from: "keyholders", to: "m78Treasure", label: "any 3" }, { from: "m78Alone", to: "m78Treasure", broken: true }],
    packets: [{ from: "m78Alone", to: "m78Treasure", label: "1 piece", stopAt: 0.6 }],
    badges: { m78Treasure: "whole again" },
    accent: ["keyholders"],
  },
  // Vault, opened the same way.
  { cue: 3, layout: { vault: [1.5, 1] }, badges: { vault: "same way" }, accent: ["vault"] },
  { cue: 4, layout: SHARES, edges: [{ from: "vault", to: "keyholders", label: "5 shares" }], packets: [{ from: "vault", to: "keyholders", label: "share" }], badges: { keyholders: "any 3 open it" } },
  {
    cue: 5,
    layout: { keyholders: [0.4, 1], m78Notes: [2.6, 1] },
    badges: { keyholders: "own share each", m78Notes: "none" },
    crossed: ["m78Notes"],
  },
  // Sealed again after every restart.
  {
    cue: 6,
    layout: SHARES,
    edges: [{ from: "keyholders", to: "vault", label: "unseal" }],
    packets: ["1", "2", "3"].map((label, k) => ({ from: "keyholders" as const, to: "vault" as const, label, delay: 15 + k * 25 })),
    badges: { vault: "sealed" },
    danger: ["vault"],
  },
  // The master key, only for the session.
  { cue: 7, layout: { admin: [0.4, 1], m78MasterKey: [2.6, 1] }, edges: [{ from: "admin", to: "m78MasterKey", label: "this session" }], badges: { m78MasterKey: "revoked at end" }, crossed: ["m78MasterKey"] },
  // Backed up together.
  {
    cue: 8,
    layout: { backup: [0.4, 1], vault: [2.6, 1] },
    edges: [{ from: "backup", to: "vault", label: "unreadable without" }],
    frames: [{ label: "Backed up together", from: [0.4, 1], to: [2.6, 1] }],
  },
];
