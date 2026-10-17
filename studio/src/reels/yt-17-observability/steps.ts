import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 17: metrics, traces, logs (Micrometer, Prometheus, Grafana, OpenTelemetry, Loki). Not in the real repo yet.
const B4 = builtBefore(4);
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["observability"], built: B4 },
  { cue: 7, part: 4, current: ["temporal"], built: [...B4, "observability"] },
];

const STACK = { app: [0, 1], prometheus: [1.5, 1], grafana: [3, 1] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { partner: [0, 0], payment: [1, 1], card: [2, 0], processing: [3, 1] }, edges: [{ from: "partner", to: "payment" }, { from: "payment", to: "card" }, { from: "card", to: "processing" }], badges: { payment: "where is it?" } },
  { cue: 2, layout: { app: [0, 1], prometheus: [1.5, 1] }, edges: [{ from: "app", to: "prometheus", label: "metrics" }], packets: [{ from: "app", to: "prometheus", label: "payments_total", delay: 15 }], accent: ["prometheus"] },
  { cue: 3, layout: { ...STACK }, edges: [{ from: "app", to: "prometheus" }, { from: "prometheus", to: "grafana" }], accent: ["grafana"], badges: { grafana: "alert: timeouts" } },
  { cue: 4, layout: { ...STACK }, edges: [{ from: "app", to: "prometheus" }, { from: "prometheus", to: "grafana" }], badges: { app: "trace id: 4f2a…" } },
  { cue: 5, layout: { ...STACK }, edges: [{ from: "app", to: "prometheus" }, { from: "prometheus", to: "grafana" }, { from: "app", to: "grafana", label: "logs → Loki" }] },
  { cue: 6, layout: { ...STACK, processing: [1.5, 2] }, edges: [{ from: "app", to: "prometheus" }, { from: "prometheus", to: "grafana" }, { from: "app", to: "processing" }], danger: ["processing"], accent: ["grafana"], badges: { grafana: "spike", processing: "waiting 30 s" } },
];
