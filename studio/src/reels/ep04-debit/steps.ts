import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 1 (high road): one step per sentence, no naive/break. Source: acquiring service payment session.
// Debit internals (one claimed debit, MID/TID terminal, hold + capture) are left for a Tier 2 deep dive.
export const acts: ActsMap = { hook: 0 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const BANK_FLOW: Layout = { buyer: [1, 0], bank: [1, 2.1], network: [1, 3.8] };

const CARD: Edge = { from: "buyer", to: "bank", label: "card" };
const DEBIT: Edge = { from: "bank", to: "network", label: "debit" };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: Part 3's last diagram — the buyer opens the link; what happens to their card?
  {
    cue: 0,
    layout: { merchant: [0, 1.5], bank: [2, 1.5], buyer: [1, 3.3] },
    edges: [
      { from: "merchant", to: "bank", label: "signed" },
      { from: "merchant", to: "buyer", label: "link" },
    ],
    accent: ["buyer"],
    badges: { buyer: "card?" },
  },
  // 1 Card entered on the bank's own page; the bank swaps it for a token.
  {
    cue: 1,
    deepDive: [4],
    layout: BANK_FLOW,
    edges: [CARD],
    packets: [{ from: "buyer", to: "bank", label: "8600 1234 5678 9012", delay: 15 }],
    accent: ["bank"],
    badges: { bank: "token" },
  },
  // 2 SMS code to the owner's phone confirms it's really them.
  {
    cue: 2,
    layout: BANK_FLOW,
    edges: [CARD],
    packets: [
      { from: "bank", to: "buyer", label: "sms code", delay: 15, duration: 25 },
      { from: "buyer", to: "bank", label: "code", delay: 55, duration: 25 },
    ],
    accent: ["bank"],
    badges: { buyer: "otp" },
  },
  // 3 The bank debits the card through the processing center.
  {
    cue: 3,
    deepDive: [5, 6, 7],
    layout: BANK_FLOW,
    edges: [CARD, DEBIT],
    packets: [{ from: "bank", to: "network", label: "debit", delay: 20 }],
    accent: ["bank"],
  },
  // 4 Processing center approves -> payment captured.
  {
    cue: 4,
    layout: BANK_FLOW,
    edges: [CARD, DEBIT],
    packets: [{ from: "network", to: "bank", label: "approved", delay: 15 }],
    accent: ["bank"],
    badges: { bank: "captured" },
  },
];
