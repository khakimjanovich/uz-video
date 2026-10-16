import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 1 (high road): one step per sentence. Source: BRD (story).
// FR-114 settle within one banking day after clearing, FR-115 fee withheld on crediting,
// FR-116 daily reconciliation registry, §10.1 ledger: 10511 transit -> 23508 terminal -> 45265 fee / 20208 store.
export const acts: ActsMap = { hook: 0 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const CHAIN: Layout = { network: [1, 0], transit: [1, 1.3], terminalacc: [1, 2.6] };
const FULL: Layout = { ...CHAIN, feeacc: [0, 3.9], storeacc: [2, 3.9] };
const WITH_STORE: Layout = { ...FULL, merchant: [2, 1.3] };

const CLEARING: Edge = { from: "network", to: "transit", label: "clearing" };
const LAND: Edge = { from: "transit", to: "terminalacc" };
const SPLIT: Edge[] = [
  { from: "terminalacc", to: "feeacc", label: "fee" },
  { from: "terminalacc", to: "storeacc", label: "net" },
];

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: Part 6's last diagram — paid in seconds; when does the money reach the store?
  {
    cue: 0,
    layout: { merchant: [0, 1.5], bank: [2, 1.5], buyer: [1, 3.3] },
    edges: [
      { from: "merchant", to: "buyer", label: "chat" },
      { from: "bank", to: "merchant", label: "money?" },
    ],
    badges: { merchant: "when?" },
  },
  // 1 End of day: the processing center settles all card payments with the bank.
  {
    cue: 1,
    layout: { network: [1, 0], transit: [1, 1.3] },
    edges: [CLEARING],
    packets: [{ from: "network", to: "transit", label: "day total", delay: 20 }],
    badges: { transit: "end of day" },
  },
  // 2 The money lands on the store's terminal account at the bank.
  {
    cue: 2,
    layout: CHAIN,
    edges: [CLEARING, LAND],
    packets: [{ from: "transit", to: "terminalacc", label: "money", delay: 20 }],
    accent: ["terminalacc"],
  },
  // 3 The bank keeps its fee, the rest goes to the store's own account by the next banking day.
  {
    cue: 3,
    layout: FULL,
    edges: [CLEARING, LAND, ...SPLIT],
    packets: [
      { from: "terminalacc", to: "feeacc", label: "fee", delay: 20, duration: 25 },
      { from: "terminalacc", to: "storeacc", label: "net", delay: 50, duration: 25 },
    ],
    accent: ["storeacc"],
    badges: { storeacc: "next banking day" },
  },
  // 4 A daily report lets the store match every payment with its books.
  {
    cue: 4,
    layout: WITH_STORE,
    edges: [CLEARING, LAND, ...SPLIT, { from: "terminalacc", to: "merchant", label: "report" }],
    packets: [{ from: "terminalacc", to: "merchant", label: "daily report", delay: 20 }],
    accent: ["merchant"],
    badges: { merchant: "matched" },
  },
];
