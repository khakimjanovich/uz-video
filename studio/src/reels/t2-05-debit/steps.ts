import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 2 deep dive (parent: Part 4). One step per sentence; naive -> break -> fix. Industry terms:
// atomic update (compare-and-set), operation journal, MID/TID, authorization and capture, RRN.
// Source: ecom DebitClaim (SESSION_OPEN -> AUTHORIZING conditional update in its own transaction; 0 rows -> refused),
// OperationJournal, TerminalResolver (EPOS MID/TID), debit commands (authorize + capture), ExecutionFinalizer (CAPTURED + RRN).
// Shown generically at the processing center; per-scheme differences left out.
export const acts: ActsMap = { hook: 0, v1: 1, break: 2, v2: 3 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const SIMPLE: Layout = { bank: [1, 1.2], network: [1, 3.6] };
const CLAIM: Layout = { payment: [0, 0.3], bank: [1, 1.9], network: [1, 3.8] };
const FULL: Layout = { ...CLAIM, journal: [2, 0.3] };

const DEBIT: Edge = { from: "bank", to: "network", label: "debit" };
const STATE: Edge = { from: "bank", to: "payment", label: "claim" };
const LOG: Edge = { from: "bank", to: "journal", label: "log" };
const LOG_QUIET: Edge = { from: "bank", to: "journal" }; // label dropped after step 4: the MID · TID stamp sits beside it
const TERMINAL: Edge = { from: "bank", to: "network", label: "terminal" };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: what happens inside the bank when it takes money from a card?
  {
    cue: 0,
    layout: SIMPLE,
    badges: { bank: "inside?" },
  },
  // 1 Naive v1: one debit request straight to the processing center.
  {
    cue: 1,
    layout: SIMPLE,
    edges: [DEBIT],
    packets: [{ from: "bank", to: "network", label: "debit", delay: 20 }],
  },
  // 2 Break: two concurrent requests or a double submit -> charged twice.
  {
    cue: 2,
    layout: SIMPLE,
    edges: [DEBIT],
    packets: [
      { from: "bank", to: "network", label: "debit", delay: 10, duration: 25 },
      { from: "bank", to: "network", label: "debit", delay: 30, duration: 25 },
    ],
    danger: ["network"],
    badges: { network: "charged twice" },
  },
  // 3 Fix: one atomic update open -> authorizing; only one request wins.
  {
    cue: 3,
    layout: CLAIM,
    edges: [STATE, DEBIT],
    packets: [
      { from: "bank", to: "payment", label: "claim", delay: 10, duration: 25 },
      { from: "bank", to: "payment", label: "claim", delay: 40, duration: 25, stopAt: 0.55 },
    ],
    accent: ["payment"],
    badges: { payment: "open → authorizing" },
  },
  // 4 Every call to the processing center goes into an operation journal.
  {
    cue: 4,
    layout: FULL,
    edges: [STATE, DEBIT, LOG],
    packets: [{ from: "bank", to: "journal", label: "op · result · ref", delay: 20 }],
    accent: ["journal"],
  },
  // 5 The debit goes through the bank's terminal, identified by MID and TID.
  {
    cue: 5,
    layout: FULL,
    edges: [STATE, LOG_QUIET, TERMINAL],
    packets: [{ from: "bank", to: "network", label: "debit", delay: 20 }],
    accent: ["bank"],
    badges: { bank: "MID · TID" },
  },
  // 6 Authorization and capture: hold first, then capture.
  {
    cue: 6,
    layout: FULL,
    edges: [STATE, LOG_QUIET, TERMINAL],
    packets: [
      { from: "bank", to: "network", label: "authorize", delay: 15, duration: 25 },
      { from: "bank", to: "network", label: "capture", delay: 55, duration: 25 },
    ],
    accent: ["bank"],
    badges: { network: "hold" },
  },
  // 7 Approved -> payment captured with its RRN.
  {
    cue: 7,
    layout: FULL,
    edges: [STATE, LOG_QUIET, TERMINAL],
    packets: [
      { from: "network", to: "bank", label: "approved", delay: 15, duration: 25 },
      { from: "bank", to: "payment", label: "captured", delay: 50, duration: 25 },
    ],
    accent: ["payment"],
    badges: { payment: "captured · rrn" },
  },
];
