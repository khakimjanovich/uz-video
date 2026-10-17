import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 12: one port, two adapters (uzcard-adapter over SVGate REST, humo-adapter over SOAP).
export const map: BuildMapStep[] = [
  { cue: 0, part: 3, current: ["procport", "procsvc"], built: builtBefore(3) },
  { cue: 8, part: 3, current: ["card"], built: [...builtBefore(3), "procport", "procsvc"] },
];

const PORT = { payment: [0, 1], port: [1.5, 1], uzcard: [3, 0], humo: [3, 2] } as const;
const PORT_EDGES = [
  { from: "payment", to: "port" },
  { from: "port", to: "uzcard" },
  { from: "port", to: "humo" },
] as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { uzcard: [0.5, 1], humo: [2.5, 1] }, badges: { uzcard: "JSON", humo: "XML" } },
  { cue: 2, layout: { payment: [0.5, 1], uzcard: [2.5, 0], humo: [2.5, 2] }, edges: [{ from: "payment", to: "uzcard" }, { from: "payment", to: "humo" }], danger: ["payment"], badges: { payment: "knows both" } },
  { cue: 3, layout: { payment: [0.5, 1], port: [2.5, 1] }, edges: [{ from: "payment", to: "port" }], accent: ["port"], badges: { port: "otp · authorize · capture · reverse · status" } },
  { cue: 4, layout: { ...PORT }, edges: [...PORT_EDGES], badges: { uzcard: "adapter", humo: "adapter" } },
  {
    cue: 5,
    layout: { ...PORT },
    edges: [...PORT_EDGES],
    packets: [
      { from: "payment", to: "port", label: "authorize", delay: 8, duration: 22 },
      { from: "port", to: "uzcard", label: "REST", delay: 32, duration: 22 },
      { from: "port", to: "humo", label: "SOAP", delay: 32, duration: 22 },
    ],
  },
  {
    cue: 6,
    layout: { ...PORT },
    edges: [...PORT_EDGES, { from: "uzcard", to: "port" }, { from: "humo", to: "port" }, { from: "port", to: "payment" }],
    packets: [
      { from: "uzcard", to: "port", label: "err 101", delay: 8, duration: 22 },
      { from: "humo", to: "port", label: "fault X", delay: 8, duration: 22 },
      { from: "port", to: "payment", label: "DECLINED", delay: 36, duration: 22 },
    ],
  },
  { cue: 7, layout: { ...PORT }, edges: [...PORT_EDGES], badges: { uzcard: "test env", humo: "test env" }, accent: ["uzcard", "humo"] },
];
