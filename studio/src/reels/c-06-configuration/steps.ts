import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 6: every setting, and no guessing. The cook (cues 0–2), no defaults (3–4),
// one locked store (5–7), handed its own settings or refuse to start (8–10), the bank's numbers (11), the close (12).
const GUESS = { m01Service: [0.3, 1], m01Prod: [2.7, 1] } as const;
const STORE = { m01Operator: [0, 0.3], vault: [1.5, 1], m01File: [0, 1.9] } as const;
const HAND = { vault: [0.3, 1], m01Service: [2.7, 1] } as const;
const HAND_EDGE = [{ from: "vault", to: "m01Service" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // A missing setting.
  { cue: 0, layout: { m01Service: [1.5, 1] }, badges: { m01Service: "a setting missing?" } },
  { cue: 1, layout: { m01Cook: [1.5, 1] }, badges: { m01Cook: "no guessing" } },
  { cue: 2, layout: { m01Cook: [0.5, 1], m01Service: [2.5, 1] }, badges: { m01Cook: "no guessing", m01Service: "no guessing" } },
  // No defaults.
  { cue: 3, layout: { m01Service: [0.5, 1], m01Default: [2.5, 1] }, crossed: ["m01Default"] },
  {
    cue: 4,
    layout: GUESS,
    edges: [{ from: "m01Service", to: "m01Prod" }],
    packets: [{ from: "m01Service", to: "m01Prod", label: "guessed timeout" }, { from: "m01Service", to: "m01Prod", label: "test password", delay: 55 }],
    danger: ["m01Prod"],
  },
  // One locked store.
  { cue: 5, layout: { vault: [1.5, 1] }, accent: ["vault"], badges: { vault: "one locked store" } },
  { cue: 6, layout: STORE, edges: [{ from: "m01Operator", to: "vault", label: "addresses" }], packets: [{ from: "m01Operator", to: "vault", label: "typed once" }] },
  { cue: 7, layout: STORE, edges: [{ from: "m01Operator", to: "vault", label: "addresses" }], crossed: ["m01File"], badges: { vault: "keys made here" } },
  // Handed its own settings, or refuse to start.
  { cue: 8, layout: HAND, edges: [...HAND_EDGE], packets: [{ from: "vault", to: "m01Service", label: "its own settings" }] },
  {
    cue: 9,
    layout: HAND,
    edges: [...HAND_EDGE],
    packets: [{ from: "vault", to: "m01Service", label: "settings", stopAt: 0.7 }],
    danger: ["m01Service"],
    badges: { m01Service: "2 missing: stop" },
  },
  {
    cue: 10,
    layout: { ...HAND, m01Prod: [2.7, 2.2] },
    edges: [...HAND_EDGE, { from: "m01Service", to: "m01Prod", broken: true }],
    danger: ["m01Service"],
    badges: { m01Service: "fail fast" },
  },
  // The bank's numbers are settings the bank chooses.
  {
    cue: 11,
    layout: { bank: [0, 1], vault: [1.5, 1], m01Service: [3, 1] },
    edges: [{ from: "bank", to: "vault" }, { from: "vault", to: "m01Service" }],
    packets: [{ from: "bank", to: "vault", label: "rates · limits" }, { from: "vault", to: "m01Service", label: "waiting times", delay: 45 }],
    badges: { bank: "the bank chooses" },
  },
];

export const map: BuildMapStep[] = [{ cue: 12, part: 1, current: ["vault", "cardsinfra"], units: { ecom: "own settings", cards: "own settings" } }];
