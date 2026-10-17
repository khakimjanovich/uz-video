import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 22: billing counters (BillingFlushJob, Spring Batch) and the daily report.
const B = [...builtBefore(4), "observability", "temporal", "kafka"] as const;
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "partner"], built: [...B] },
  { cue: 5, part: 4, current: ["payment", "partner", "card"], built: [...B] },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { merchant: [0, 1], app: [1.5, 1], redis: [3, 1] }, edges: [{ from: "merchant", to: "app" }, { from: "app", to: "redis", label: "count" }], packets: [{ from: "merchant", to: "app", label: "API call", delay: 8 }, { from: "app", to: "redis", label: "+1", delay: 36 }] },
  { cue: 2, layout: { redis: [0, 1], sweep: [1.5, 1], postgres: [3, 1] }, edges: [{ from: "redis", to: "sweep" }, { from: "sweep", to: "postgres", label: "billing records" }], packets: [{ from: "sweep", to: "postgres", label: "flush", delay: 15 }], badges: { sweep: "Spring Batch" } },
  { cue: 3, layout: { payment: [0.5, 1], shop: [2.5, 1] }, edges: [{ from: "payment", to: "shop", label: "daily report" }], packets: [{ from: "payment", to: "shop", label: "payments · fees · payouts", delay: 15 }] },
  { cue: 4, layout: { shop: [0.5, 1], wallet: [2.5, 1] }, edges: [{ from: "shop", to: "wallet", label: "matches" }], accent: ["wallet"], badges: { wallet: "to the so'm" } },
];
