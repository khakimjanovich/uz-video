import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 21: reversal vs refund (PaymentStateMachine: CAPTURED → PARTIALLY_REFUNDED → REFUNDED; refund window per sales point).
const B = [...builtBefore(4), "observability", "temporal", "kafka"] as const;
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "buyer"], built: [...B] },
  { cue: 6, part: 4, current: ["payment", "partner"], built: [...B] },
];

const FLOW = { payment: [0, 1], processing: [1.5, 1], buyer: [3, 1] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { ...FLOW }, edges: [{ from: "payment", to: "processing" }, { from: "processing", to: "buyer" }], packets: [{ from: "payment", to: "processing", label: "reversal", delay: 10 }], badges: { buyer: "hold released" } },
  { cue: 2, layout: { ...FLOW }, edges: [{ from: "payment", to: "processing" }, { from: "processing", to: "buyer" }], packets: [{ from: "payment", to: "processing", label: "refund", delay: 8 }, { from: "processing", to: "buyer", label: "100 000", delay: 40 }], badges: { payment: "new operation" } },
  { cue: 3, layout: { record: [1.5, 1] }, accent: ["record"], badges: { record: "PARTIALLY_REFUNDED" } },
  { cue: 4, layout: { payment: [0.5, 1], record: [2.5, 1] }, edges: [{ from: "payment", to: "record", broken: true, label: "over captured" }], packets: [{ from: "payment", to: "record", label: "refund 120 000", delay: 15, stopAt: 0.5 }] },
  { cue: 5, layout: { salespoint: [0.5, 1], payment: [2.5, 1] }, edges: [{ from: "salespoint", to: "payment", label: "refund window" }], badges: { salespoint: "configured days" } },
];
