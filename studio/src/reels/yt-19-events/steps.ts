import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 19: transactional outbox + Kafka relay + merchant webhooks (event_outbox exists in the real repo; no relay yet).
const B = [...builtBefore(4), "observability", "temporal"] as const;
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["kafka"], built: [...B] },
  { cue: 7, part: 4, current: ["payment", "merchant"], built: [...B, "kafka"] },
];

const PIPE = { payment: [0, 1], outbox: [1, 1], kafka: [2, 1], webhook: [3, 1] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { payment: [0.5, 1], kafka: [2.5, 1] }, edges: [{ from: "payment", to: "kafka", broken: true, label: "crash" }], packets: [{ from: "payment", to: "kafka", label: "captured", delay: 15, stopAt: 0.5 }] },
  { cue: 2, layout: { payment: [0.5, 1], outbox: [2, 1], postgres: [1.25, 2] }, edges: [{ from: "payment", to: "outbox", label: "same transaction" }, { from: "outbox", to: "postgres" }, { from: "payment", to: "postgres" }], accent: ["outbox"] },
  { cue: 3, layout: { ...PIPE }, edges: [{ from: "payment", to: "outbox" }, { from: "outbox", to: "kafka", label: "relay" }], packets: [{ from: "outbox", to: "kafka", label: "payments.captured", delay: 15 }], accent: ["kafka"] },
  { cue: 4, layout: { ...PIPE }, edges: [{ from: "payment", to: "outbox" }, { from: "outbox", to: "kafka" }], packets: [{ from: "outbox", to: "kafka", label: "event 42", delay: 8 }, { from: "outbox", to: "kafka", label: "event 42", delay: 40 }], badges: { kafka: "dedupe by ID" } },
  { cue: 5, layout: { ...PIPE, merchant: [3, 2] }, edges: [{ from: "payment", to: "outbox" }, { from: "outbox", to: "kafka" }, { from: "kafka", to: "webhook" }, { from: "webhook", to: "merchant", label: "retries" }], packets: [{ from: "kafka", to: "webhook", label: "captured", delay: 8 }, { from: "webhook", to: "merchant", label: "POST /webhook", delay: 40 }] },
  { cue: 6, layout: { postgres: [0.5, 1], kafka: [2.5, 1] }, edges: [{ from: "postgres", to: "kafka" }], badges: { postgres: "the truth", kafka: "the news" } },
];
