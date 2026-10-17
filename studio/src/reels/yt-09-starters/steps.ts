import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 09: refactoring with a reason: error, security, otp and redis starters.
export const map: BuildMapStep[] = [
  { cue: 0, part: 1, current: ["partner", "commission"], built: builtBefore(1) },
  { cue: 8, part: 2, current: ["commission"], built: builtBefore(2) },
];

const TWO = { partner: [0.5, 1], commission: [2.5, 1] } as const;
const HUB = { partner: [0, 0], commission: [0, 2], spring: [1.5, 1] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { ...TWO }, badges: { partner: "errors · security", commission: "errors · security" }, danger: ["commission"] },
  { cue: 2, layout: { ...HUB }, edges: [{ from: "partner", to: "spring" }, { from: "commission", to: "spring" }], accent: ["spring"], badges: { spring: "our starters" } },
  { cue: 3, layout: { ...HUB }, edges: [{ from: "partner", to: "spring" }, { from: "commission", to: "spring" }], badges: { spring: "error-starter" } },
  { cue: 4, layout: { ...HUB }, edges: [{ from: "partner", to: "spring" }, { from: "commission", to: "spring" }], badges: { spring: "security-starter" } },
  { cue: 5, layout: { ...HUB, redis: [3, 1] }, edges: [{ from: "partner", to: "spring" }, { from: "commission", to: "spring" }, { from: "spring", to: "redis" }], badges: { spring: "otp + redis starters" } },
  { cue: 6, layout: { ...HUB, payment: [3, 1] }, edges: [{ from: "partner", to: "spring" }, { from: "commission", to: "spring" }, { from: "payment", to: "spring", label: "one dependency" }], accent: ["payment"] },
  { cue: 7, layout: { ...HUB, payment: [3, 1] }, edges: [{ from: "partner", to: "spring" }, { from: "commission", to: "spring" }, { from: "payment", to: "spring" }], accent: ["spring"], badges: { spring: "fix once" } },
];
