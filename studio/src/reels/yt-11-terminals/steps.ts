import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 11: the EPOS terminal registry (epos-reference-service, TerminalResolver).
export const map: BuildMapStep[] = [
  { cue: 0, part: 2, current: ["terminal"], built: [...builtBefore(2), "commission"] },
  { cue: 7, part: 3, current: ["procport", "procsvc"], built: builtBefore(3) },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { payment: [0.5, 1], processing: [2.5, 1] }, edges: [{ from: "payment", to: "processing", broken: true, label: "unknown terminal" }], packets: [{ from: "payment", to: "processing", label: "debit", delay: 15, stopAt: 0.5 }] },
  { cue: 2, layout: { salespoint: [0.5, 1], terminal: [2.5, 1] }, edges: [{ from: "salespoint", to: "terminal", label: "registered" }], accent: ["terminal"], badges: { terminal: "MID · TID" } },
  { cue: 3, layout: { salespoint: [0, 1], uzcard: [2.5, 0], humo: [2.5, 2] }, edges: [{ from: "salespoint", to: "uzcard", label: "TID 1" }, { from: "salespoint", to: "humo", label: "TID 2" }] },
  { cue: 4, layout: { payment: [0.5, 1], terminal: [2.5, 1] }, edges: [{ from: "payment", to: "terminal", label: "resolve" }, { from: "terminal", to: "payment" }], packets: [{ from: "payment", to: "terminal", label: "shop + Uzcard", delay: 10 }, { from: "terminal", to: "payment", label: "MID · TID", delay: 45 }] },
  { cue: 5, layout: { payment: [0.5, 1], terminal: [2.5, 1] }, edges: [{ from: "payment", to: "terminal" }], danger: ["terminal"], badges: { terminal: "none → refuse" } },
  { cue: 6, layout: { terminal: [0.5, 1], journal: [2.5, 1] }, edges: [{ from: "terminal", to: "journal", label: "audit log" }], accent: ["journal"] },
];
