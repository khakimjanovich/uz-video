import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 1 (high road): one step per sentence, no naive/break. Source: acquiring service create-payment flow.
// Replay/retry protection (HMAC timestamp + nonce, idempotency key) is left for a Tier 2 deep dive.
export const acts: ActsMap = { hook: 0 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const PAIR: Layout = { merchant: [0, 1.5], bank: [2, 1.5] };
const WITH_BUYER: Layout = { ...PAIR, buyer: [1, 3.3] };

const SIGNED: Edge = { from: "merchant", to: "bank", label: "signed" };
const LINK: Edge = { from: "merchant", to: "buyer", label: "link" };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: Part 2's last diagram — the store has an API key; how does its server create a payment?
  {
    cue: 0,
    layout: { merchant: [1, 0], admin: [1, 2.3], salespoint: [2, 1.5] },
    edges: [
      { from: "merchant", to: "salespoint", label: "website" },
      { from: "admin", to: "merchant", label: "activate" },
    ],
    accent: ["salespoint"],
    badges: { merchant: "create payment?" },
  },
  // 1 The server sends amount + order number to the bank, signed with its secret key.
  {
    cue: 1,
    deepDive: [3],
    layout: PAIR,
    edges: [SIGNED],
    packets: [{ from: "merchant", to: "bank", label: "amount + order", delay: 20 }],
  },
  // 2 The bank checks the signature and creates the payment.
  {
    cue: 2,
    layout: PAIR,
    edges: [SIGNED],
    accent: ["bank"],
    badges: { bank: "signature ok" },
  },
  // 3 It returns a one-time payment link; the store sends it to the buyer.
  {
    cue: 3,
    layout: WITH_BUYER,
    edges: [SIGNED, LINK],
    packets: [
      { from: "bank", to: "merchant", label: "payment link", delay: 15, duration: 25 },
      { from: "merchant", to: "buyer", label: "payment link", delay: 50, duration: 25 },
    ],
    accent: ["bank"],
  },
];
