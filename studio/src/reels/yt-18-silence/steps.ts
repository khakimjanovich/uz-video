import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 18: unknown outcomes (PaymentResolutionWorkflowImpl, ResolutionSweepWorkflowImpl, manual review).
const B4 = builtBefore(4);
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["temporal"], built: [...B4, "observability"] },
  { cue: 8, part: 4, current: ["kafka"], built: [...B4, "observability", "temporal"] },
];

const RES = { payment: [0, 1], temporal: [1.5, 1], processing: [3, 1] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { payment: [0.5, 1], processing: [2.5, 1] }, edges: [{ from: "payment", to: "processing" }], packets: [{ from: "payment", to: "processing", label: "capture", delay: 10, stopAt: 0.6 }], badges: { processing: "no answer" } },
  { cue: 2, layout: { payment: [0.5, 1], processing: [2.5, 1] }, edges: [{ from: "payment", to: "processing", broken: true, label: "retry?" }], danger: ["payment"], badges: { payment: "charged twice?" } },
  { cue: 3, layout: { payment: [0.5, 1], temporal: [2.5, 1] }, edges: [{ from: "payment", to: "temporal", label: "start workflow" }], accent: ["temporal"], badges: { payment: "UNKNOWN" } },
  { cue: 4, layout: { ...RES }, edges: [{ from: "payment", to: "temporal" }, { from: "temporal", to: "processing", label: "status?" }], packets: [0, 1, 2].map((k) => ({ from: "temporal" as const, to: "processing" as const, label: "status?", delay: 8 + k * 22, duration: 18 })), badges: { temporal: "backoff · survives restarts" } },
  { cue: 5, layout: { ...RES, record: [1.5, 2] }, edges: [{ from: "payment", to: "temporal" }, { from: "temporal", to: "processing" }, { from: "temporal", to: "record" }], packets: [{ from: "processing", to: "temporal", label: "went through", delay: 10 }], accent: ["record"], badges: { record: "CAPTURED or REVERSED" } },
  { cue: 6, layout: { ...RES, review: [1.5, 2] }, edges: [{ from: "payment", to: "temporal" }, { from: "temporal", to: "processing" }, { from: "temporal", to: "review" }], accent: ["review"], badges: { review: "a human decides" } },
  { cue: 7, layout: { sweep: [0.5, 1], payment: [2.5, 1] }, edges: [{ from: "sweep", to: "payment", label: "every minute" }], packets: [{ from: "sweep", to: "payment", label: "stuck?", delay: 15 }] },
];
