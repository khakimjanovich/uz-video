import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 05: the partner state machine (PartnerStateGuard, PartnerLifecycleServiceImpl).
export const map: BuildMapStep[] = [
  { cue: 0, part: 1, current: ["partner"], built: builtBefore(1) },
  { cue: 8, part: 1, current: ["partner", "admin"], built: builtBefore(1) },
];

const STATES = { stPending: [0, 0], stVerified: [1, 0], stContract: [2, 0], stApproved: [3, 0], stActive: [3, 1.2] } as const;
const CHAIN = [
  { from: "stPending", to: "stVerified" },
  { from: "stVerified", to: "stContract" },
  { from: "stContract", to: "stApproved" },
  { from: "stApproved", to: "stActive" },
] as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { admin: [0, 1], partner: [2, 1] }, edges: [{ from: "admin", to: "partner", label: "set ACTIVE" }], danger: ["partner"], badges: { partner: "never checked" } },
  { cue: 2, layout: { ...STATES }, edges: [...CHAIN], packets: CHAIN.map((e, k) => ({ ...e, label: "next", delay: 8 + k * 18, duration: 16 })) },
  { cue: 3, layout: { ...STATES }, edges: [...CHAIN, { from: "stPending", to: "stActive", broken: true, label: "409" }], danger: ["stPending"], badges: { stActive: "guarded" } },
  { cue: 4, layout: { ...STATES, admin: [1, 1.2] }, edges: [...CHAIN, { from: "admin", to: "stVerified", label: "documents" }, { from: "admin", to: "stContract", label: "contract" }], accent: ["stContract"], badges: { stContract: "unique number" } },
  { cue: 5, layout: { ...STATES, journal: [1, 1.2] }, edges: [...CHAIN, { from: "stActive", to: "journal", label: "who · what · when" }], accent: ["journal"] },
  {
    cue: 6,
    layout: { stActive: [0.5, 1], stSuspended: [2, 1], stTerminated: [3, 2] },
    edges: [{ from: "stActive", to: "stSuspended", label: "suspend · restore" }, { from: "stSuspended", to: "stTerminated", label: "terminate" }],
    crossed: ["stTerminated"],
    badges: { stTerminated: "final" },
  },
  { cue: 7, layout: { payment: [0.5, 1], stActive: [2.5, 1] }, edges: [{ from: "payment", to: "stActive", label: "is active?" }], packets: [{ from: "payment", to: "stActive", label: "check", delay: 15 }], accent: ["stActive"] },
];
