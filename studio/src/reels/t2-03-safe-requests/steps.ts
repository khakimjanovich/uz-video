import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 2 deep dive (parent: Part 3). One step per sentence; naive -> break -> fix. Uses industry terms
// (replay attack, HMAC-SHA256, timestamp + nonce, idempotency key); how HMAC works inside is left for Tier 3.
// Source: ecom HmacAuthenticationFilter (signature + timestamp + nonce, configured tolerance window,
// nonce kept for that window) and IdempotencyService (same key + same body -> first result; different body -> refused).
export const acts: ActsMap = { hook: 0, v1: 1, break: 2, v2: 3 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const PAIR: Layout = { merchant: [0, 1.2], bank: [2, 1.2] };
const WITH_ATTACKER: Layout = { ...PAIR, attacker: [1, 3.2] };
const WITH_PAYMENT: Layout = { ...PAIR, payment: [2, 3.4] };

const REQUEST: Edge = { from: "merchant", to: "bank", label: "request" };
const SIGNED: Edge = { from: "merchant", to: "bank", label: "hmac" };
const ATTACK: Edge = { from: "attacker", to: "bank", label: "replay attack", broken: true };
const CREATE: Edge = { from: "bank", to: "payment", label: "create" };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: did the request really come from the store, and only once?
  {
    cue: 0,
    layout: PAIR,
    edges: [REQUEST],
    badges: { bank: "who? once?" },
  },
  // 1 Naive v1: amount + order with the API key.
  {
    cue: 1,
    layout: PAIR,
    edges: [REQUEST],
    packets: [{ from: "merchant", to: "bank", label: "amount + key", delay: 20 }],
  },
  // 2 Break: replay attack — a copied request is sent again; a network retry creates a second payment.
  {
    cue: 2,
    layout: WITH_ATTACKER,
    edges: [REQUEST, { from: "merchant", to: "attacker", label: "copy", broken: true }, ATTACK],
    packets: [
      { from: "merchant", to: "attacker", label: "amount + key", delay: 10, duration: 25 },
      { from: "attacker", to: "bank", label: "amount + key", delay: 45, duration: 25 },
    ],
    danger: ["bank", "attacker"],
    badges: { bank: "2 payments" },
  },
  // 3 Fix: HMAC-SHA256 signature with the store's secret key over body + timestamp + nonce.
  {
    cue: 3,
    layout: PAIR,
    edges: [SIGNED],
    packets: [{ from: "merchant", to: "bank", label: "hmac · timestamp · nonce", delay: 20 }],
    accent: ["merchant"],
    badges: { merchant: "secret key" },
  },
  // 4 The bank computes the same HMAC; any change -> signatures don't match.
  {
    cue: 4,
    layout: WITH_ATTACKER,
    edges: [SIGNED, { from: "attacker", to: "bank", label: "tampered", broken: true }],
    packets: [{ from: "attacker", to: "bank", label: "amount 9 999 999", delay: 20, stopAt: 0.55 }],
    accent: ["bank"],
    badges: { bank: "hmac mismatch" },
  },
  // 5 Timestamp within the configured window; each nonce accepted once -> replays stopped.
  {
    cue: 5,
    layout: WITH_ATTACKER,
    edges: [SIGNED, ATTACK],
    packets: [{ from: "attacker", to: "bank", label: "same nonce", delay: 20, stopAt: 0.55 }],
    accent: ["bank"],
    badges: { bank: "replay blocked" },
  },
  // 6 Retries use an idempotency key, a common payment-API pattern.
  {
    cue: 6,
    layout: WITH_PAYMENT,
    edges: [SIGNED, CREATE],
    packets: [
      { from: "merchant", to: "bank", label: "idempotency key", delay: 15, duration: 25 },
      { from: "bank", to: "payment", label: "create", delay: 50, duration: 25 },
    ],
    accent: ["bank"],
    badges: { payment: "1 payment" },
  },
  // 7 Same key + same request -> the first result, no new payment.
  {
    cue: 7,
    layout: WITH_PAYMENT,
    edges: [SIGNED, CREATE],
    packets: [
      { from: "merchant", to: "bank", label: "same key · same body", delay: 15, duration: 25 },
      { from: "bank", to: "merchant", label: "first result", delay: 50, duration: 25 },
    ],
    accent: ["bank"],
    badges: { payment: "still 1" },
  },
  // 8 Same key + a different request -> refused.
  {
    cue: 8,
    layout: WITH_PAYMENT,
    edges: [SIGNED, CREATE],
    packets: [{ from: "merchant", to: "bank", label: "same key · new body", delay: 20, stopAt: 0.55 }],
    danger: ["bank"],
    badges: { bank: "refused", payment: "still 1" },
  },
];
