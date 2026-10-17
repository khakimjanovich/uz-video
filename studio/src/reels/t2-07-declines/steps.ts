import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 2 deep dive (parent: Part 4). One step per sentence; naive -> break -> fix. Industry terms:
// decline code, authorization hold, void.
// Source: ecom ExecutionFinalizer.decline (decline code saved; SESSION_OPEN while session open and attempts remain,
// else DECLINED) and the debit command revert path (capture declined -> cancel the hold -> status check;
// still held or unclear -> resolution workflow). Shown generically at the processing center.
export const acts: ActsMap = { hook: 0, v1: 1, break: 2, v2: 3 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const SIMPLE: Layout = { bank: [1, 1.2], network: [1, 3.6] };
const BUYER: Layout = { buyer: [0, 0.3], bank: [1, 1.8], network: [1, 3.8] };
const CLOSED: Layout = { ...BUYER, payment: [2, 0.3] };
const HOLD: Layout = { bank: [1, 1.8], network: [1, 3.8] };
const CONFIRM: Layout = { ...HOLD, workflow: [2, 0] };

const DEBIT: Edge = { from: "bank", to: "network", label: "debit" };
const TO_BUYER: Edge = { from: "bank", to: "buyer" };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: the processing center says no.
  {
    cue: 0,
    layout: { ...SIMPLE, dd7: [0, 2.4] },
    accent: ["dd7"],
    edges: [DEBIT],
    packets: [{ from: "network", to: "bank", label: "declined", delay: 15 }],
    badges: { network: "no" },
  },
  // 1 Naive v1: show an error and end the payment.
  {
    cue: 1,
    layout: BUYER,
    edges: [DEBIT, TO_BUYER],
    packets: [{ from: "bank", to: "buyer", label: "error", delay: 15 }],
    badges: { buyer: "the end" },
  },
  // 2 Break: many declines are fixable; the buyer just leaves.
  {
    cue: 2,
    layout: BUYER,
    edges: [DEBIT, TO_BUYER],
    danger: ["buyer"],
    badges: { buyer: "left" },
  },
  // 3 Fix: decline code; try another card while the session is open and attempts remain.
  {
    cue: 3,
    layout: BUYER,
    edges: [DEBIT, TO_BUYER, { from: "buyer", to: "bank", label: "new card" }],
    packets: [
      { from: "network", to: "bank", label: "decline code", delay: 10, duration: 25 },
      { from: "bank", to: "buyer", label: "try another card", delay: 45, duration: 25 },
      { from: "buyer", to: "bank", label: "card 2", delay: 80, duration: 25 },
    ],
    accent: ["bank"],
    badges: { buyer: "attempt 2" },
  },
  // 4 Attempts run out -> payment closed as declined.
  {
    cue: 4,
    layout: CLOSED,
    edges: [DEBIT, TO_BUYER, { from: "bank", to: "payment", label: "close" }],
    packets: [{ from: "bank", to: "payment", label: "declined", delay: 20 }],
    danger: ["payment"],
    badges: { payment: "declined" },
  },
  // 5 Money already held, but the capture is declined.
  {
    cue: 5,
    layout: HOLD,
    edges: [DEBIT],
    packets: [
      { from: "bank", to: "network", label: "authorize", delay: 10, duration: 25 },
      { from: "bank", to: "network", label: "capture", delay: 45, duration: 25, stopAt: 0.55 },
    ],
    danger: ["network"],
    badges: { network: "held" },
  },
  // 6 The bank voids the authorization hold; the buyer's money is released.
  {
    cue: 6,
    layout: HOLD,
    edges: [DEBIT],
    packets: [{ from: "bank", to: "network", label: "void hold", delay: 20 }],
    accent: ["bank"],
    badges: { network: "released" },
  },
  // 7 Status check confirms the hold is gone; if not, the workflow takes over.
  {
    cue: 7,
    layout: CONFIRM,
    edges: [DEBIT, { from: "bank", to: "workflow", label: "if still held" }],
    packets: [
      { from: "bank", to: "network", label: "status?", delay: 10, duration: 25 },
      { from: "network", to: "bank", label: "no hold", delay: 45, duration: 25 },
    ],
    accent: ["bank"],
    badges: { network: "no hold" },
  },
];
