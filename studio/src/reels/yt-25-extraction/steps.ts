import { BuildMapStep, DiagramStep } from "../../components";
import { BUILD_PARTS, builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 25: extract the card vault into its own service (mirrors the real card-processor-service).
export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["card"], built: [...builtBefore(5), "kubernetes"] },
  { cue: 6, part: 5, built: BUILD_PARTS.flatMap((p) => p.nodes) },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { card: [1.5, 1] }, accent: ["card"], badges: { card: "PCI DSS scope" } },
  { cue: 2, layout: { payment: [0.5, 1], card: [2.5, 1] }, edges: [{ from: "payment", to: "card", label: "CardApi only" }] },
  { cue: 3, layout: { payment: [0, 1], port: [1.5, 1], card: [3, 1] }, edges: [{ from: "payment", to: "port" }, { from: "port", to: "card", label: "REST" }], packets: [{ from: "port", to: "card", label: "resolve token", delay: 15 }] },
  { cue: 4, layout: { card: [0.5, 1], postgres: [2.5, 0], kubernetes: [2.5, 2] }, edges: [{ from: "card", to: "postgres", label: "own database" }, { from: "card", to: "kubernetes", label: "own deploy" }] },
  {
    cue: 5,
    layout: { buyer: [0, 1], payment: [1, 1], card: [2, 0], processing: [3, 1] },
    edges: [{ from: "buyer", to: "payment" }, { from: "payment", to: "card" }, { from: "card", to: "processing" }],
    packets: [{ from: "buyer", to: "payment", label: "pay", delay: 8 }, { from: "payment", to: "card", label: "token", delay: 32 }, { from: "card", to: "processing", label: "debit", delay: 56 }],
    accent: ["payment", "card"],
  },
];
