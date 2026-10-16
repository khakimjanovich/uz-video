import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 2 deep dive (parents: Parts 2 + 7). One step per sentence; naive -> break -> fix.
// Source: BRD FR-88, FR-93, FR-115; commission-reference-service (rules: percent + fixed, optional min/max,
// scope sales point > merchant > card scheme, validity window, priority, four-eyes change requests;
// CommissionAmountUtils.calculate) and ecom (resolved at card submit, saved on the payment as a snapshot).
export const acts: ActsMap = { hook: 0, v1: 1, break: 2, v2: 3 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const STORES: Layout = { feerule: [1, 0.3], merchant: [0, 2.8], store2: [1, 2.8], store3: [2, 2.8] };
const SCOPE: Layout = { feerule: [1, 0.3], salespoint: [0, 2.8], merchant: [1, 2.8], network: [2, 2.8] };
const APPROVAL: Layout = { admin: [0, 0.3], checker: [2, 0.3], request: [1, 1.8], feerule: [1, 3.6] };
const AT_CARD: Layout = { buyer: [0, 0.3], feerule: [2, 0.3], bank: [1, 1.8] };
const SAVED: Layout = { ...AT_CARD, payment: [1, 3.6] };
const SETTLE: Layout = { payment: [1, 0.3], feeacc: [0, 2.8], storeacc: [2, 2.8] };

const ONE_FEE: Edge[] = [
  { from: "feerule", to: "merchant", label: "1%" },
  { from: "feerule", to: "store2" },
  { from: "feerule", to: "store3" },
];
const LOOKUP: Edge = { from: "bank", to: "feerule" }; // unlabeled: the "lookup" packet says it, a label would clip the rule box

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: how much does the bank earn from each payment, and who decides?
  {
    cue: 0,
    layout: { merchant: [0, 1.5], bank: [2, 1.5] },
    edges: [{ from: "merchant", to: "bank", label: "payment" }],
    badges: { bank: "how much?" },
  },
  // 1 Naive v1: one fixed fee for every store.
  {
    cue: 1,
    layout: STORES,
    edges: ONE_FEE,
    badges: { feerule: "fixed 1%" },
  },
  // 2 Break: stores differ — own rate, sometimes per sales point or card network.
  {
    cue: 2,
    layout: STORES,
    edges: ONE_FEE,
    danger: ["feerule", "merchant", "store3"],
    badges: { merchant: "needs 0.8%", store3: "needs 1.2%" },
  },
  // 3 Fix: commission rules — percent, fixed part, optional min and max.
  {
    cue: 3,
    layout: STORES,
    accent: ["feerule"],
    badges: { feerule: "% + fixed · min/max" },
  },
  // 4 Scope: one sales point, a whole store or a card network; valid in its configured period.
  {
    cue: 4,
    layout: SCOPE,
    edges: [
      { from: "feerule", to: "salespoint", label: "1st" },
      { from: "feerule", to: "merchant", label: "2nd" },
      { from: "feerule", to: "network", label: "3rd" },
    ],
    accent: ["feerule"],
    badges: { feerule: "valid period" },
  },
  // 5 Every new rule or change goes through four-eyes first.
  {
    cue: 5,
    layout: APPROVAL,
    edges: [
      { from: "admin", to: "request", label: "change" },
      { from: "checker", to: "request", label: "approve" },
      { from: "request", to: "feerule", label: "apply" },
    ],
    packets: [
      { from: "admin", to: "request", label: "new rule", delay: 10, duration: 25 },
      { from: "checker", to: "request", label: "approve", delay: 45, duration: 25 },
      { from: "request", to: "feerule", label: "apply", delay: 80, duration: 25 },
    ],
    accent: ["checker"],
  },
  // 6 At card entry the bank picks the most specific matching rule and calculates the fee.
  {
    cue: 6,
    layout: AT_CARD,
    edges: [{ from: "buyer", to: "bank", label: "card" }, LOOKUP],
    packets: [
      { from: "buyer", to: "bank", label: "card", delay: 10, duration: 25 },
      { from: "bank", to: "feerule", label: "lookup", delay: 45, duration: 25 },
      { from: "feerule", to: "bank", label: "1.2% = 12 000", delay: 80, duration: 25 },
    ],
    accent: ["bank"],
  },
  // 7 The fee is saved with the payment; a later rule change never touches it.
  {
    cue: 7,
    layout: SAVED,
    edges: [{ from: "buyer", to: "bank", label: "card" }, LOOKUP, { from: "bank", to: "payment", label: "save" }],
    packets: [{ from: "bank", to: "payment", label: "fee 12 000", delay: 15 }],
    accent: ["payment"],
    badges: { payment: "locked", feerule: "rule changed" },
  },
  // 8 At settlement the bank keeps the fee and pays the store the rest.
  {
    cue: 8,
    layout: SETTLE,
    edges: [
      { from: "payment", to: "feeacc", label: "fee" },
      { from: "payment", to: "storeacc", label: "net" },
    ],
    packets: [
      { from: "payment", to: "feeacc", label: "12 000", delay: 15, duration: 25 },
      { from: "payment", to: "storeacc", label: "988 000", delay: 45, duration: 25 },
    ],
    accent: ["storeacc"],
  },
];
