import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 06: maker-checker (DualControlServiceImpl, DualControlExpirySweepJob, unique index).
export const map: BuildMapStep[] = [
  { cue: 0, part: 1, current: ["admin", "partner"], built: builtBefore(1) },
  { cue: 8, part: 1, current: ["partner", "keycloak", "vault"], built: builtBefore(1) },
];

const FLOW = { admin: [0, 0], checker: [3, 0], request: [1.5, 1], partner: [1.5, 2] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { admin: [0, 1], partner: [2.5, 1] }, edges: [{ from: "admin", to: "partner", label: "activate" }], danger: ["admin"], badges: { admin: "alone" } },
  { cue: 2, layout: { admin: [0, 0], request: [1.5, 1], partner: [1.5, 2] }, edges: [{ from: "admin", to: "request", label: "initiate" }], packets: [{ from: "admin", to: "request", label: "activate?", delay: 15 }], badges: { request: "PENDING", partner: "unchanged" } },
  {
    cue: 3,
    layout: { ...FLOW },
    edges: [{ from: "admin", to: "request" }, { from: "checker", to: "request", label: "approve" }, { from: "request", to: "partner" }],
    packets: [{ from: "checker", to: "request", label: "approve", delay: 10 }, { from: "request", to: "partner", label: "ACTIVE", delay: 45 }],
    accent: ["partner"],
  },
  { cue: 4, layout: { admin: [0, 0], request: [1.5, 1] }, edges: [{ from: "admin", to: "request", broken: true, label: "self-approve" }], packets: [{ from: "admin", to: "request", label: "approve", delay: 15, stopAt: 0.5 }], danger: ["admin"] },
  { cue: 5, layout: { request: [1.5, 1] }, danger: ["request"], badges: { request: "EXPIRED" } },
  { cue: 6, layout: { sweep: [0, 1], request: [2, 1] }, edges: [{ from: "sweep", to: "request", label: "expire" }], packets: [{ from: "sweep", to: "request", label: "sweep", delay: 15 }], badges: { sweep: "ShedLock: once" } },
  { cue: 7, layout: { request: [1, 1], postgres: [2.5, 1] }, edges: [{ from: "request", to: "postgres" }], accent: ["postgres"], badges: { postgres: "unique index" } },
];
