import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 2 deep dive (separate flow after the payment). One step per sentence; naive -> break -> fix.
// Industry terms: clearing, reversal, refund, partial refund, refund window.
// Source: BRD §7.1.4 / FR-16..27 (story); PRS ClientAcquiringSettings refundWindowDays + extendedRefundDays (configured per sales point).
export const acts: ActsMap = { hook: 0, v1: 1, break: 2, v2: 3 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const ASK: Layout = { buyer: [0, 1.5], merchant: [2, 1.5] };
const CLEARING: Layout = { merchant: [0, 0.3], bank: [2, 0.3], network: [1, 3] };
const REFUND: Layout = { merchant: [0, 0.3], bank: [2, 0.3], payment: [0, 3.2], buyer: [2, 3.2] };

const BACK: Edge = { from: "merchant", to: "bank", label: "money back" };
const TO_NETWORK: Edge = { from: "bank", to: "network" };
const TO_CARD: Edge = { from: "bank", to: "buyer", label: "same card" };
const RECORD: Edge = { from: "merchant", to: "payment", label: "history" };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: money back today or next week — the same?
  {
    cue: 0,
    layout: ASK,
    edges: [{ from: "buyer", to: "merchant", label: "money back?" }],
    badges: { buyer: "today? later?" },
  },
  // 1 Naive v1: one "send it back" button for everything.
  {
    cue: 1,
    layout: CLEARING,
    edges: [BACK, TO_NETWORK],
    packets: [{ from: "merchant", to: "bank", label: "send back", delay: 20 }],
    badges: { merchant: "one button" },
  },
  // 2 Break: before clearing the money hasn't moved; after clearing it has.
  {
    cue: 2,
    layout: CLEARING,
    edges: [BACK, TO_NETWORK],
    danger: ["merchant"],
    badges: { network: "cleared?" },
  },
  // 3 Before end-of-day clearing: reversal, full amount, buyer never charged.
  {
    cue: 3,
    layout: CLEARING,
    edges: [{ from: "merchant", to: "bank", label: "reversal" }, TO_NETWORK],
    packets: [
      { from: "merchant", to: "bank", label: "reversal · full", delay: 15, duration: 25 },
      { from: "bank", to: "network", label: "cancel", delay: 50, duration: 25 },
    ],
    accent: ["bank"],
    badges: { network: "never charged" },
  },
  // 4 After clearing: refund, money goes back as a new operation.
  {
    cue: 4,
    layout: REFUND,
    edges: [{ from: "merchant", to: "bank", label: "refund" }, TO_CARD],
    packets: [
      { from: "merchant", to: "bank", label: "refund", delay: 15, duration: 25 },
      { from: "bank", to: "buyer", label: "money back", delay: 50, duration: 25 },
    ],
    accent: ["bank"],
    badges: { bank: "new operation" },
  },
  // 5 Full or partial, several partials allowed, never more than captured.
  {
    cue: 5,
    layout: REFUND,
    edges: [{ from: "merchant", to: "bank", label: "refund" }, TO_CARD, RECORD],
    packets: [
      { from: "merchant", to: "bank", label: "refund 300 000", delay: 10, duration: 25 },
      { from: "merchant", to: "bank", label: "refund 200 000", delay: 45, duration: 25 },
    ],
    accent: ["payment"],
    badges: { payment: "≤ captured" },
  },
  // 6 Only to the original card that paid.
  {
    cue: 6,
    layout: REFUND,
    edges: [{ from: "merchant", to: "bank", label: "refund" }, TO_CARD, RECORD],
    packets: [{ from: "bank", to: "buyer", label: "8600 **** 9012", delay: 20 }],
    accent: ["buyer"],
    badges: { buyer: "original card" },
  },
  // 7 Within the configured refund window, extendable for a sales point with a warranty.
  {
    cue: 7,
    layout: REFUND,
    edges: [{ from: "merchant", to: "bank", label: "refund" }, TO_CARD, RECORD],
    accent: ["payment"],
    badges: { payment: "refund window", merchant: "warranty → longer" },
  },
  // 8 Started from the merchant portal or the store's API.
  {
    cue: 8,
    layout: REFUND,
    edges: [{ from: "merchant", to: "bank", label: "portal · api" }, TO_CARD, RECORD],
    packets: [{ from: "merchant", to: "bank", label: "refund", delay: 20 }],
    accent: ["merchant"],
  },
];
