import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 23: exercises from real gaps found in the code review.
const B = [...builtBefore(4), "observability", "temporal", "kafka"] as const;
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "partner"], built: [...B] },
  { cue: 6, part: 5, current: ["kubernetes"], built: builtBefore(5) },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { attacker: [0, 1], payment: [1.5, 1], redis: [3, 1] }, edges: [{ from: "attacker", to: "payment", broken: true, label: "late replay" }, { from: "payment", to: "redis", label: "nonce TTL = window" }], danger: ["attacker"] },
  { cue: 2, layout: { attacker: [0, 1], payment: [2, 1] }, edges: [{ from: "attacker", to: "payment", broken: true, label: "bad signature" }], badges: { payment: "verify, then spend nonce" } },
  { cue: 3, layout: { admin: [0, 1], stActive: [2, 1] }, edges: [{ from: "admin", to: "stActive", label: "activate" }], badges: { stActive: "KYB approved?" } },
  { cue: 4, layout: { salespoint: [0.5, 1], payment: [2.5, 1] }, edges: [{ from: "salespoint", to: "payment", label: "limit" }], badges: { salespoint: "max per payment · per day" } },
  { cue: 5, layout: { test: [1.5, 1] }, danger: ["test"], badges: { test: "failing · yours to fix" } },
];
