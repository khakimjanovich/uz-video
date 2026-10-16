import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 1 (high road): one step per sentence. Source: acquiring API — single-use payment links
// (purpose + expiresAt + optional amount; opening mints a regular payment session; ACTIVE until PAID/EXPIRED/CANCELLED).
export const acts: ActsMap = { hook: 0, handoff: 6 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const LAYOUT: Layout = { merchant: [0, 1.5], bank: [2, 1.5], buyer: [1, 3.3] };

const CREATE: Edge = { from: "merchant", to: "bank", label: "create link" };
const CHAT: Edge = { from: "merchant", to: "buyer", label: "chat" };
const OPEN: Edge = { from: "buyer", to: "bank" }; // unlabeled: the "open link" packet says it, and the buyer stamp sits here

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: Part 5's last diagram — what if a store has no website?
  {
    cue: 0,
    layout: LAYOUT,
    edges: [
      { from: "bank", to: "buyer" },
      { from: "buyer", to: "merchant", label: "return" },
      { from: "merchant", to: "bank", label: "status" },
    ],
    badges: { merchant: "no website?" },
  },
  // 1 The store creates a payment link: purpose, amount, expiry.
  {
    cue: 1,
    layout: LAYOUT,
    edges: [CREATE],
    packets: [{ from: "merchant", to: "bank", label: "purpose · amount · expiry", delay: 20 }],
    accent: ["bank"],
  },
  // 2 It shares the link with the buyer in any chat or message.
  {
    cue: 2,
    layout: LAYOUT,
    edges: [CREATE, CHAT],
    packets: [
      { from: "bank", to: "merchant", label: "link", delay: 10, duration: 25 },
      { from: "merchant", to: "buyer", label: "link", delay: 45, duration: 25 },
    ],
  },
  // 3 The buyer opens it: store name, purpose, amount.
  {
    cue: 3,
    layout: LAYOUT,
    edges: [CREATE, CHAT, OPEN],
    packets: [{ from: "buyer", to: "bank", label: "open link", delay: 20 }],
    accent: ["bank"],
    badges: { buyer: "purpose · amount" },
  },
  // 4 From there, the same card payment as before.
  {
    cue: 4,
    layout: LAYOUT,
    edges: [CREATE, CHAT, OPEN],
    packets: [{ from: "buyer", to: "bank", label: "card + sms code", delay: 20 }],
    accent: ["bank"],
    badges: { bank: "captured" },
  },
  // 5 Once paid, expired or cancelled, the link stops working.
  {
    cue: 5,
    layout: LAYOUT,
    edges: [CREATE, CHAT, OPEN],
    packets: [{ from: "buyer", to: "bank", label: "open link", delay: 15, stopAt: 0.5 }],
    badges: { bank: "link closed" },
  },
  // 6 Handoff: paid in seconds — when does the money reach the store? -> Part 7 (T+1 settlement)
  {
    cue: 6,
    layout: LAYOUT,
    edges: [CHAT, { from: "bank", to: "merchant", label: "money?" }], // no "create link": it would overlap
    badges: { merchant: "when?" },
  },
];
