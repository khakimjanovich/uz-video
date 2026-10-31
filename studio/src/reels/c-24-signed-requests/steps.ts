import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 24: a wax-sealed letter. Who wrote the request (0–1), the seal and its key (2–3),
// the bank's three checks and the spent serial (4–5), three attacks refused (6–8), the close (9).
const SEND = { merchant: [0, 1], m6Ecom: [3, 1] } as const;
const SEAL = { merchant: [0, 1], m6Letter: [1.5, 1], m6Ecom: [3, 1] } as const;
const SEAL_EDGES = [{ from: "merchant", to: "m6Letter" }, { from: "m6Letter", to: "m6Ecom" }] as const;
const GUARD = { merchant: [0, 0.3], m6Ecom: [3, 0.3], m6Spent: [3, 1.9], attacker: [0, 1.9] } as const;
const GUARD_EDGES = [{ from: "merchant", to: "m6Ecom" }, { from: "m6Ecom", to: "m6Spent" }] as const;
const attack = (label: string) => [{ from: "attacker" as const, to: "m6Ecom" as const, label, stopAt: 0.8 }];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: SEND, edges: [{ from: "merchant", to: "m6Ecom" }], packets: [{ from: "merchant", to: "m6Ecom", label: "request" }], badges: { m6Ecom: "who wrote it?" } },
  { cue: 1, layout: SEND, edges: [{ from: "merchant", to: "m6Ecom" }], packets: [{ from: "merchant", to: "m6Ecom", label: "token" }], badges: { merchant: "who you are" } },
  { cue: 2, layout: SEAL, edges: [...SEAL_EDGES], accent: ["m6Letter"], packets: [{ from: "merchant", to: "m6Letter", label: "seal" }] },
  {
    cue: 3,
    layout: { ...SEAL, m6Key: [1.5, 2.1] },
    edges: [...SEAL_EDGES, { from: "m6Key", to: "m6Letter", label: "seals" }],
    accent: ["m6Key"],
    badges: { m6Letter: "method · address · body" },
  },
  {
    cue: 4,
    layout: SEAL,
    edges: [...SEAL_EDGES],
    packets: [{ from: "m6Letter", to: "m6Ecom", label: "sealed" }],
    accent: ["m6Ecom"],
    badges: { m6Ecom: "fresh · matches · right" },
  },
  {
    cue: 5,
    layout: GUARD,
    edges: [...GUARD_EDGES],
    packets: [{ from: "m6Ecom", to: "m6Spent", label: "serial" }, { from: "attacker", to: "m6Ecom", label: "same, tomorrow", delay: 60, stopAt: 0.8 }],
    accent: ["m6Spent"],
    badges: { m6Ecom: "refused" },
  },
  { cue: 6, layout: GUARD, edges: [...GUARD_EDGES], packets: attack("amount changed"), danger: ["attacker"], badges: { m6Ecom: "seal broken" } },
  { cue: 7, layout: GUARD, edges: [...GUARD_EDGES], packets: attack("old request"), danger: ["attacker"], badges: { m6Ecom: "too late" } },
  { cue: 8, layout: GUARD, edges: [...GUARD_EDGES], packets: attack("copy"), danger: ["attacker"], badges: { m6Ecom: "refused", m6Spent: "already used" } },
];

export const map: BuildMapStep[] = [{ cue: 9, part: 6, current: ["merchant", "payment"], units: { ecom: "sealed requests" } }];
