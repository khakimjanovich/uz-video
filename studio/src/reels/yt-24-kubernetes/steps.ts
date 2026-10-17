import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 24: image, Helm chart, probes, Vault secrets, replicas, ShedLock.
export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["kubernetes"], built: builtBefore(5) },
  { cue: 7, part: 5, current: ["card"], built: [...builtBefore(5), "kubernetes"] },
];

const PODS = { kubernetes: [0, 1], app: [2, 0], payment: [2, 1], card: [2, 2] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { gradle: [0.5, 1], docker: [2.5, 1] }, edges: [{ from: "gradle", to: "docker", label: "image" }], accent: ["docker"] },
  { cue: 2, layout: { docker: [0, 1], kubernetes: [1.5, 1], app: [3, 1] }, edges: [{ from: "docker", to: "kubernetes", label: "Helm" }, { from: "kubernetes", to: "app" }], accent: ["kubernetes"], badges: { app: "× 3 replicas" } },
  { cue: 3, layout: { kubernetes: [0.5, 1], app: [2.5, 1] }, edges: [{ from: "kubernetes", to: "app", label: "liveness · readiness" }], packets: [{ from: "kubernetes", to: "app", label: "/health", delay: 15 }] },
  { cue: 4, layout: { vault: [0.5, 1], app: [2.5, 1] }, edges: [{ from: "vault", to: "app", label: "at startup" }], packets: [{ from: "vault", to: "app", label: "secrets", delay: 15 }] },
  { cue: 5, layout: { sweep: [0, 1], app: [2, 0], payment: [2, 1], card: [2, 2] }, edges: [{ from: "sweep", to: "app" }, { from: "sweep", to: "payment", broken: true }, { from: "sweep", to: "card", broken: true }], badges: { sweep: "ShedLock: one runs" } },
  { cue: 6, layout: { ...PODS }, edges: [{ from: "kubernetes", to: "app" }, { from: "kubernetes", to: "payment" }, { from: "kubernetes", to: "card" }], crossed: ["app"], badges: { payment: "resolves once" } },
];
