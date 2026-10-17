import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 10: commission rules (CommissionResolutionUtils, CommissionResolver, CommissionChangeRequestServiceImpl).
export const map: BuildMapStep[] = [
  { cue: 0, part: 2, current: ["commission"], built: builtBefore(2) },
  { cue: 9, part: 2, current: ["terminal"], built: [...builtBefore(2), "commission"] },
];

const SCOPE = { salespoint: [0, 0], shop: [0, 1], processing: [0, 2], commission: [2, 1] } as const;
const SCOPE_EDGES = [
  { from: "salespoint", to: "commission" },
  { from: "shop", to: "commission" },
  { from: "processing", to: "commission" },
] as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { shop: [0, 0.5], salespoint: [1.5, 0.5], merchant: [3, 0.5] }, badges: { shop: "1.2%", salespoint: "1.5%", merchant: "0.9%" } },
  { cue: 2, layout: { commission: [1.5, 1] }, accent: ["commission"], badges: { commission: "scope · scheme · dates" } },
  { cue: 3, layout: { ...SCOPE }, edges: [...SCOPE_EDGES], badges: { salespoint: "1st", shop: "2nd", processing: "3rd" } },
  { cue: 4, layout: { ...SCOPE }, edges: [...SCOPE_EDGES], badges: { commission: "priority breaks ties" } },
  { cue: 5, layout: { payment: [0.5, 1], commission: [2.5, 1] }, edges: [{ from: "payment", to: "commission", label: "resolve" }, { from: "commission", to: "payment" }], packets: [{ from: "payment", to: "commission", label: "100 000", delay: 10 }, { from: "commission", to: "payment", label: "fee 1 500", delay: 45 }] },
  { cue: 6, layout: { payment: [0.5, 1], commission: [2.5, 1] }, edges: [{ from: "payment", to: "commission" }], danger: ["commission"], badges: { commission: "fee ≥ amount" } },
  {
    cue: 7,
    layout: { admin: [0, 0], checker: [3, 0], request: [1.5, 1], commission: [1.5, 2] },
    edges: [{ from: "admin", to: "request" }, { from: "checker", to: "request", label: "approve" }, { from: "request", to: "commission" }],
    packets: [{ from: "admin", to: "request", label: "new fee", delay: 8 }, { from: "checker", to: "request", label: "approve", delay: 35 }, { from: "request", to: "commission", label: "apply", delay: 62 }],
  },
  { cue: 8, layout: { commission: [0.5, 1], journal: [2.5, 1] }, edges: [{ from: "commission", to: "journal", label: "history" }], accent: ["journal"], badges: { journal: "old payments keep old fee" } },
];
