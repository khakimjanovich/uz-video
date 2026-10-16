import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 2 deep dive (parent: Part 2). One step per sentence; naive -> break -> fix.
// Source: BRD FR-93; PRS DualControlServiceImpl (PENDING, ADMIN/COMPLIANCE approvers, no self-approval, 24h expiry)
// and commission-reference-service CommissionChangeRequestServiceImpl (DB CHECK initiator != decider, stale-snapshot refusal).
export const acts: ActsMap = { hook: 0, v1: 1, break: 2, v2: 3 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const NAIVE: Layout = { admin: [0, 1.6], merchant: [2, 0.3], feerule: [2, 2.9] };
const FLOW: Layout = { admin: [0, 0.3], checker: [2, 0.3], request: [1, 1.8], merchant: [0, 3.6], feerule: [2, 3.6] };

const DIRECT: Edge[] = [
  { from: "admin", to: "merchant", label: "activate" },
  { from: "admin", to: "feerule", label: "edit" },
];
const CHANGE: Edge = { from: "admin", to: "request", label: "change" };
const REVIEW: Edge = { from: "checker", to: "request", label: "approve" };
const APPLY: Edge[] = [
  { from: "request", to: "merchant", label: "apply" },
  { from: "request", to: "feerule" },
];

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: who may switch a store on, or change its fee?
  {
    cue: 0,
    layout: NAIVE,
    badges: { merchant: "on?", feerule: "fee?" },
  },
  // 1 Naive v1: one admin changes it, effective at once.
  {
    cue: 1,
    layout: NAIVE,
    edges: DIRECT,
    packets: [
      { from: "admin", to: "merchant", label: "active", delay: 15, duration: 25 },
      { from: "admin", to: "feerule", label: "fee 1.5%", delay: 50, duration: 25 },
    ],
  },
  // 2 Break: neither professional nor secure — one wrong click changes real money.
  {
    cue: 2,
    layout: NAIVE,
    edges: DIRECT,
    packets: [{ from: "admin", to: "feerule", label: "fee 0%", delay: 15, duration: 25 }],
    danger: ["admin", "feerule"],
    badges: { admin: "1 click", feerule: "insecure" },
  },
  // 3 Fix: every such change becomes a pending request.
  {
    cue: 3,
    layout: FLOW,
    edges: [CHANGE],
    packets: [{ from: "admin", to: "request", label: "change", delay: 20 }],
    accent: ["request"],
    badges: { request: "pending" },
  },
  // 4 A second admin with an approver role (configured; default ADMIN, COMPLIANCE) approves or rejects; then it applies.
  {
    cue: 4,
    layout: FLOW,
    edges: [CHANGE, REVIEW, ...APPLY],
    packets: [
      { from: "checker", to: "request", label: "approve", delay: 15, duration: 25 },
      { from: "request", to: "merchant", label: "apply", delay: 50, duration: 25 },
      { from: "request", to: "feerule", label: "apply", delay: 50, duration: 25 },
    ],
    accent: ["checker"],
    badges: { request: "approved" },
  },
  // 5 Nobody approves their own request; for fees the database enforces it too.
  {
    cue: 5,
    layout: FLOW,
    edges: [CHANGE, REVIEW, { from: "admin", to: "request" }],
    packets: [{ from: "admin", to: "request", label: "approve", delay: 15, stopAt: 0.5 }],
    danger: ["admin"],
    badges: { request: "not yourself" },
  },
  // 6 If the fee changed while waiting, approval is refused: the checker approves exactly what they saw.
  {
    cue: 6,
    layout: FLOW,
    edges: [CHANGE, REVIEW],
    packets: [{ from: "checker", to: "request", label: "approve", delay: 30, stopAt: 0.5 }],
    danger: ["request"],
    badges: { feerule: "changed", request: "refused" },
  },
  // 7 Store activation requests expire after the configured time (DUAL_CONTROL_DEFAULT_EXPIRY, default 24h).
  {
    cue: 7,
    layout: FLOW,
    edges: [CHANGE, REVIEW],
    danger: ["request"],
    badges: { request: "expired" },
  },
];
