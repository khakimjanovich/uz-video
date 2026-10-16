import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// One step per script sentence. Source: acquiring service create-payment flow
// (OAuth token + HMAC signature with timestamp/nonce, Idempotency-Key, one-time payment URL).
export const acts: ActsMap = { hook: 0, v1: 1, break: 2, v2: 4, handoff: 6 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const PAIR: Layout = { merchant: [0, 1.5], bank: [2, 1.5] };
const WITH_ATTACKER: Layout = { ...PAIR, attacker: [1, 3.3] };

const API: Edge = { from: "merchant", to: "bank", label: "api" };
const REPLAY: Edge = { from: "attacker", to: "bank", label: "replay", broken: true };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: Part 2's last diagram — the store has an API key; how does it create a payment safely?
  {
    cue: 0,
    layout: { merchant: [1, 0], salespoint: [2, 1.5], admin: [0, 3.6], checker: [2, 3.6] },
    edges: [
      { from: "merchant", to: "salespoint", label: "website" },
      { from: "admin", to: "checker", label: "request" },
      { from: "checker", to: "merchant", label: "approve" },
    ],
    accent: ["salespoint"],
    badges: { merchant: "create payment?" },
  },
  // 1 Naive v1: send amount + order number with the key.
  {
    cue: 1,
    layout: PAIR,
    edges: [API],
    packets: [{ from: "merchant", to: "bank", label: "amount + key", delay: 20 }],
  },
  // 2 Break: anyone who copies the request can send it again.
  {
    cue: 2,
    layout: WITH_ATTACKER,
    edges: [API, { from: "merchant", to: "attacker", label: "copy", broken: true }, REPLAY],
    packets: [
      { from: "merchant", to: "attacker", label: "amount + key", delay: 5, duration: 25 },
      { from: "attacker", to: "bank", label: "amount + key", delay: 35, duration: 25 },
    ],
    danger: ["attacker", "bank"],
    badges: { bank: "accepted" },
  },
  // 3 Break: network drops, the store retries -> second payment for the same order.
  {
    cue: 3,
    layout: PAIR,
    edges: [API],
    packets: [
      { from: "merchant", to: "bank", label: "pay #1042", delay: 10, stopAt: 0.5 },
      { from: "merchant", to: "bank", label: "retry #1042", delay: 55 },
    ],
    danger: ["bank"],
    badges: { bank: "2 payments" },
  },
  // 4 Fix: request signed with secret + timestamp + one-time number; a copy is rejected.
  {
    cue: 4,
    layout: WITH_ATTACKER,
    edges: [{ from: "merchant", to: "bank", label: "signed" }, REPLAY],
    packets: [
      { from: "merchant", to: "bank", label: "sig · time · nonce", delay: 15 },
      { from: "attacker", to: "bank", label: "replay", delay: 55, stopAt: 0.6 },
    ],
    accent: ["bank"],
    badges: { bank: "replay blocked" },
  },
  // 5 Fix: idempotency key ties retries to the first payment; bank returns a one-time payment link.
  {
    cue: 5,
    layout: PAIR,
    edges: [{ from: "merchant", to: "bank", label: "signed" }],
    packets: [
      { from: "merchant", to: "bank", label: "idempotency-key", delay: 15 },
      { from: "bank", to: "merchant", label: "payment link", delay: 60 },
    ],
    accent: ["bank"],
    badges: { bank: "1 payment" },
  },
  // 6 Handoff: the buyer opens the link — what happens to their card next? -> card, OTP, debit
  {
    cue: 6,
    layout: { ...PAIR, buyer: [1, 3.3] },
    edges: [{ from: "merchant", to: "bank", label: "signed" }, { from: "merchant", to: "buyer", label: "link" }],
    packets: [{ from: "merchant", to: "buyer", label: "payment link", delay: 15 }],
    accent: ["buyer"],
    badges: { buyer: "card?" },
  },
];
