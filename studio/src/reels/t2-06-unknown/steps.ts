import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 2 deep dive (parent: Part 4). One step per sentence; naive -> break -> fix. Industry terms:
// timeout, unknown outcome, durable workflow (Temporal), status inquiry, manual review queue, sweep.
// Source: ecom debit commands (transport failure -> UNKNOWN, payment stays AUTHORIZING), PaymentResolutionWorkflowImpl
// (configured retry ladder + wall-clock limit; approve / decline / escalate to manual review), resolution sweep (configured interval).
export const acts: ActsMap = { hook: 0, v1: 1, break: 2, v2: 3 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const SIMPLE: Layout = { bank: [1, 0.8], network: [1, 3.4] };
const HELD: Layout = { payment: [0, 0.3], bank: [1, 1.8], network: [1, 3.8] };
const WORKFLOW: Layout = { ...HELD, workflow: [2, 1.8] };
const REVIEW: Layout = { ...WORKFLOW, reviewer: [2, 3.8] };

const DEBIT: Edge = { from: "bank", to: "network", label: "debit" };
const STATE: Edge = { from: "bank", to: "payment" };
const INQUIRY: Edge = { from: "workflow", to: "network", label: "status?" };
const RESULT: Edge = { from: "workflow", to: "payment" };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: no answer — was the money taken or not?
  {
    cue: 0,
    layout: { ...SIMPLE, dd6: [0, 2.1] },
    accent: ["dd6"],
    edges: [DEBIT],
    packets: [{ from: "bank", to: "network", label: "debit", delay: 10, stopAt: 0.5 }],
    danger: ["network"],
    badges: { network: "no answer" },
  },
  // 1 Naive v1: send the debit again.
  {
    cue: 1,
    layout: SIMPLE,
    edges: [DEBIT],
    packets: [{ from: "bank", to: "network", label: "debit again", delay: 15 }],
  },
  // 2 Break: the first one went through -> charged twice.
  {
    cue: 2,
    layout: SIMPLE,
    edges: [DEBIT],
    danger: ["network"],
    badges: { network: "charged twice" },
  },
  // 3 Fix: a timeout is an unknown outcome; the payment stays authorizing.
  {
    cue: 3,
    layout: HELD,
    edges: [STATE, DEBIT],
    accent: ["payment"],
    badges: { payment: "authorizing", bank: "unknown" },
  },
  // 4 Durable workflow (Temporal) asks for the status on a configured retry schedule.
  {
    cue: 4,
    layout: WORKFLOW,
    edges: [STATE, DEBIT, INQUIRY],
    packets: [
      { from: "workflow", to: "network", label: "status?", delay: 10, duration: 20 },
      { from: "workflow", to: "network", label: "status?", delay: 45, duration: 20 },
      { from: "workflow", to: "network", label: "status?", delay: 80, duration: 20 },
    ],
    accent: ["workflow"],
    badges: { workflow: "retry schedule" },
  },
  // 5 Money taken -> captured; nothing happened -> declined.
  {
    cue: 5,
    layout: WORKFLOW,
    edges: [STATE, DEBIT, INQUIRY, RESULT],
    packets: [
      { from: "network", to: "workflow", label: "taken", delay: 10, duration: 25 },
      { from: "workflow", to: "payment", label: "captured", delay: 45, duration: 25 },
    ],
    accent: ["payment"],
    badges: { payment: "captured" },
  },
  // 6 No clear answer within the configured time limit -> manual review queue.
  {
    cue: 6,
    layout: REVIEW,
    edges: [STATE, DEBIT, INQUIRY, { from: "workflow", to: "reviewer", label: "escalate" }],
    packets: [{ from: "workflow", to: "reviewer", label: "unclear", delay: 20 }],
    accent: ["reviewer"],
    badges: { reviewer: "time limit" },
  },
  // 7 A scheduled sweep picks up anything left stuck.
  {
    cue: 7,
    layout: REVIEW,
    edges: [STATE, DEBIT, INQUIRY, RESULT],
    packets: [{ from: "workflow", to: "payment", label: "stuck?", delay: 20 }],
    accent: ["workflow"],
    badges: { workflow: "sweep" },
  },
];
