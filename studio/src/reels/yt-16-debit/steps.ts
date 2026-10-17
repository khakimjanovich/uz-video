import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 16: DebitClaim (conditional update), TerminalResolver, OperationJournal, PaymentStateMachine.
const B4 = builtBefore(4);
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "procport", "terminal"], built: B4 },
  { cue: 9, part: 4, current: ["observability"], built: B4 },
];

const FLOW = { payment: [0, 1], port: [1.5, 1], processing: [3, 1] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { buyer: [0, 1], payment: [2, 1] }, edges: [{ from: "buyer", to: "payment" }], packets: [{ from: "buyer", to: "payment", label: "confirm", delay: 8 }, { from: "buyer", to: "payment", label: "confirm", delay: 14 }], danger: ["payment"], badges: { payment: "charged twice?" } },
  {
    cue: 2,
    layout: { buyer: [0, 1], payment: [1.5, 1], postgres: [3, 1] },
    edges: [{ from: "buyer", to: "payment" }, { from: "payment", to: "postgres", label: "OPEN → AUTHORIZING" }],
    packets: [{ from: "buyer", to: "payment", label: "confirm", delay: 8 }, { from: "buyer", to: "payment", label: "confirm", delay: 14, stopAt: 0.7 }],
    accent: ["postgres"],
    badges: { postgres: "one winner" },
  },
  { cue: 3, layout: { payment: [1.5, 1], terminal: [0, 0], commission: [3, 0] }, edges: [{ from: "payment", to: "terminal", label: "MID · TID" }, { from: "payment", to: "commission", label: "fee snapshot" }] },
  { cue: 4, layout: { payment: [0.5, 1], journal: [2.5, 1] }, edges: [{ from: "payment", to: "journal", label: "write first" }], accent: ["journal"] },
  { cue: 5, layout: { ...FLOW }, edges: [{ from: "payment", to: "port" }, { from: "port", to: "processing" }], packets: [{ from: "payment", to: "port", label: "authorize", delay: 8 }, { from: "port", to: "processing", label: "authorize", delay: 40 }], badges: { processing: "hold" } },
  { cue: 6, layout: { ...FLOW }, edges: [{ from: "payment", to: "port" }, { from: "port", to: "processing" }], packets: [{ from: "payment", to: "port", label: "capture", delay: 8 }, { from: "port", to: "processing", label: "capture", delay: 40 }] },
  { cue: 7, layout: { ...FLOW, record: [0, 2] }, edges: [{ from: "processing", to: "port" }, { from: "port", to: "payment" }, { from: "payment", to: "record" }], packets: [{ from: "processing", to: "port", label: "approved", delay: 8 }, { from: "port", to: "payment", label: "RRN", delay: 36 }], accent: ["record"], badges: { record: "CAPTURED · RRN" } },
  { cue: 8, layout: { record: [1.5, 1] }, badges: { record: "CAPTURED ↛ OPEN" }, accent: ["record"] },
];
