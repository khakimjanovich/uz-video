import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 1 (high road): one step per sentence. Source: acquiring API —
// payer's browser returns to the allowlisted returnUrl; GET /payments/{id} is the authoritative state.
// Webhooks are BRD-only ("planned"), so not shown.
export const acts: ActsMap = { hook: 0, handoff: 5 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const LAYOUT: Layout = { merchant: [0, 1.5], bank: [2, 1.5], buyer: [1, 3.3] };

const REDIRECT: Edge = { from: "bank", to: "buyer", label: "redirect" };
const RETURN: Edge = { from: "buyer", to: "merchant", label: "return" };
const STATUS: Edge = { from: "merchant", to: "bank", label: "status" };
const REDIRECT_QUIET: Edge = { from: "bank", to: "buyer" }; // label dropped once "status" sits beside it

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: Part 4's last diagram — the money is captured; how does the store find out?
  {
    cue: 0,
    layout: { buyer: [1, 0], bank: [1, 2.2], network: [1, 4], merchant: [0, 1.1] },
    edges: [
      { from: "buyer", to: "bank", label: "card" },
      { from: "bank", to: "network", label: "debit" },
      { from: "bank", to: "merchant", label: "status?" },
    ],
    accent: ["bank"],
    badges: { bank: "captured", merchant: "paid?" },
  },
  // 1 The bank's page sends the buyer back to the store's website.
  {
    cue: 1,
    layout: LAYOUT,
    edges: [REDIRECT, RETURN],
    packets: [
      { from: "bank", to: "buyer", label: "back to store", delay: 15, duration: 25 },
      { from: "buyer", to: "merchant", label: "return", delay: 50, duration: 25 },
    ],
  },
  // 2 The store's server asks the bank for the payment status.
  {
    cue: 2,
    layout: LAYOUT,
    edges: [REDIRECT_QUIET, RETURN, STATUS],
    packets: [{ from: "merchant", to: "bank", label: "get status", delay: 20 }],
  },
  // 3 The bank answers with the final state: captured, amount, reference number.
  {
    cue: 3,
    layout: LAYOUT,
    edges: [REDIRECT_QUIET, RETURN, STATUS],
    packets: [{ from: "bank", to: "merchant", label: "captured · amount · ref", delay: 15 }],
    accent: ["bank"],
  },
  // 4 Only then does the store mark the order as paid.
  {
    cue: 4,
    layout: LAYOUT,
    edges: [REDIRECT_QUIET, RETURN, STATUS],
    accent: ["merchant"],
    badges: { merchant: "order paid" },
  },
  // 5 Handoff: what if a store has no website at all? -> Part 6 (payment links)
  {
    cue: 5,
    layout: LAYOUT,
    edges: [REDIRECT_QUIET, RETURN, STATUS],
    badges: { merchant: "no website?" },
  },
];
