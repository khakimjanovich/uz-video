import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 23: a taxi's licence plate. The plate (cue 1), the e-POS terminal and its pair of numbers (2),
// registered for one website and card (3), one live terminal (4), the centre accepts it (5),
// written down (6), no terminal, no charge (7–8).
const REG = { m45BankAdmin: [0, 1], tid: [1.5, 0.3], m45Tid2: [1.5, 2.1], salespoint: [3, 0.3], m45ScopeCard: [3, 1.9] } as const;
const REG_EDGES = [
  { from: "m45BankAdmin", to: "tid", label: "registers" },
  { from: "tid", to: "salespoint" },
  { from: "tid", to: "m45ScopeCard" },
] as const;
const CHARGE = { record: [0, 1], tid: [1.5, 1], processing: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { m45Taxi: [1.5, 1] }, badges: { m45Taxi: "issued once" } },
  {
    cue: 2,
    layout: CHARGE,
    edges: [{ from: "record", to: "tid" }, { from: "processing", to: "tid", label: "issues" }],
    packets: [{ from: "processing", to: "tid", label: "merchant id · terminal id" }],
    badges: { tid: "the plate" },
  },
  { cue: 3, layout: { m45BankAdmin: REG.m45BankAdmin, tid: [1.5, 1], salespoint: REG.salespoint, m45ScopeCard: REG.m45ScopeCard }, edges: [...REG_EDGES] },
  {
    cue: 4,
    layout: REG,
    edges: [...REG_EDGES, { from: "m45Tid2", to: "m45ScopeCard", broken: true }],
    crossed: ["m45Tid2"],
    danger: ["m45Tid2"],
    badges: { tid: "only live one" },
  },
  {
    cue: 5,
    layout: { tid: [0.5, 1], processing: [2.5, 1] },
    edges: [{ from: "tid", to: "processing" }],
    packets: [{ from: "tid", to: "processing", label: "register" }, { from: "processing", to: "tid", label: "accepted", delay: 50 }],
    badges: { tid: "kept" },
  },
  {
    cue: 6,
    layout: { tid: [0.5, 1], m45History: [2.5, 1] },
    edges: [{ from: "tid", to: "m45History" }],
    packets: [{ from: "tid", to: "m45History", label: "change" }],
    accent: ["m45History"],
  },
  {
    cue: 7,
    layout: CHARGE,
    edges: [{ from: "record", to: "tid" }, { from: "tid", to: "processing" }],
    packets: [{ from: "record", to: "tid", label: "live terminal?" }, { from: "tid", to: "record", label: "yes", delay: 50 }],
    accent: ["tid"],
  },
  {
    cue: 8,
    layout: CHARGE,
    edges: [{ from: "record", to: "tid", broken: true }, { from: "tid", to: "processing", broken: true }],
    crossed: ["tid"],
    danger: ["tid"],
    badges: { record: "no charge", processing: "no money moves" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["epos"], units: { ecom: "which machine?" } },
  { cue: 9, part: 5, current: ["merchant", "payment"], units: { ecom: "next: real merchant?" } },
];
