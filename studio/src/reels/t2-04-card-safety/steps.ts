import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 2 deep dive (parent: Part 4). One step per sentence; naive -> break -> fix. Industry terms:
// PCI DSS, hosted payment page, tokenization / token vault, masked PAN, OTP.
// Source: BRD §8.2 (card data only in the bank's secure zone); ecom: single-use session token (only its SHA-256 hash
// stored), card tokenised by card-processor-service, payment keeps card_mask, PAN revealed only for the debit,
// OTP resend limit and cooldown are settings, card attempts limited.
export const acts: ActsMap = { hook: 0, v1: 1, break: 2, v2: 3 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const NAIVE: Layout = { buyer: [1, 0.3], merchant: [1, 2], bank: [1, 3.7] };
const HOSTED: Layout = { merchant: [0, 0.3], bank: [2, 0.3], buyer: [1, 2] };
const TOKEN: Layout = { bank: [1, 0.8], vault: [2, 3.2], payment: [0, 3.2] };
const REVEAL: Layout = { bank: [1, 1.2], vault: [0, 3.2], network: [2, 3.2] };
const OTP: Layout = { buyer: [0, 1.2], bank: [2, 1.2] };

const STORE_PATH: Edge[] = [
  { from: "buyer", to: "merchant", label: "card number" },
  { from: "merchant", to: "bank" },
];
const LINK: Edge = { from: "merchant", to: "buyer", label: "session link" };
const CARD: Edge = { from: "buyer", to: "bank", label: "card" };
const SMS: Edge = { from: "bank", to: "buyer", label: "sms" };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: how does a card number stay safe on its way to the bank?
  {
    cue: 0,
    layout: { ...OTP, dd4: [1, 3.4] },
    accent: ["dd4"],
    edges: [CARD],
    badges: { buyer: "safe?" },
  },
  // 1 Naive v1: the store's website collects the card and forwards it.
  {
    cue: 1,
    layout: NAIVE,
    edges: STORE_PATH,
    packets: [
      { from: "buyer", to: "merchant", label: "8600 1234 5678 9012", delay: 15, duration: 25 },
      { from: "merchant", to: "bank", label: "8600 1234 5678 9012", delay: 50, duration: 25 },
    ],
  },
  // 2 Break: every store holds card data — under PCI DSS a target and a liability.
  {
    cue: 2,
    layout: { ...NAIVE, attacker: [0, 3.7] },
    edges: [...STORE_PATH, { from: "merchant", to: "attacker", label: "breach", broken: true }],
    packets: [{ from: "merchant", to: "attacker", label: "card data", delay: 20 }],
    danger: ["merchant", "attacker"],
    badges: { merchant: "PCI DSS" },
  },
  // 3 Fix: card entered only on the bank's hosted payment page, opened by a one-time session link.
  {
    cue: 3,
    layout: HOSTED,
    edges: [LINK, CARD],
    packets: [
      { from: "merchant", to: "buyer", label: "session link", delay: 15, duration: 25 },
      { from: "buyer", to: "bank", label: "card", delay: 50, duration: 25 },
    ],
    accent: ["bank"],
    badges: { bank: "hosted page" },
  },
  // 4 Token vault turns the card number into a token; the payment keeps only a masked PAN.
  {
    cue: 4,
    layout: TOKEN,
    edges: [{ from: "bank", to: "vault", label: "pan" }, { from: "bank", to: "payment", label: "masked" }],
    packets: [
      { from: "bank", to: "vault", label: "pan", delay: 15, duration: 25 },
      { from: "vault", to: "bank", label: "token", delay: 45, duration: 25 },
      { from: "bank", to: "payment", label: "8600 **** 9012", delay: 75, duration: 25 },
    ],
    accent: ["vault"],
    badges: { payment: "masked" },
  },
  // 5 The real number is revealed only inside the bank, at the moment of the debit.
  {
    cue: 5,
    layout: REVEAL,
    edges: [{ from: "vault", to: "bank", label: "reveal" }, { from: "bank", to: "network", label: "debit" }],
    packets: [
      { from: "vault", to: "bank", label: "pan", delay: 15, duration: 25 },
      { from: "bank", to: "network", label: "debit", delay: 50, duration: 25 },
    ],
    accent: ["bank"],
    badges: { bank: "inside only" },
  },
  // 6 OTP by SMS to the card's phone proves the payer owns the card.
  {
    cue: 6,
    layout: OTP,
    edges: [CARD, SMS],
    packets: [
      { from: "bank", to: "buyer", label: "otp", delay: 15, duration: 25 },
      { from: "buyer", to: "bank", label: "otp ✓", delay: 50, duration: 25 },
    ],
    accent: ["bank"],
    badges: { buyer: "otp" },
  },
  // 7 Resends limited and spaced by the configured time; wrong attempts limited too.
  {
    cue: 7,
    layout: OTP,
    edges: [CARD, SMS],
    packets: [{ from: "buyer", to: "bank", label: "resend", delay: 20, stopAt: 0.55 }],
    badges: { bank: "configured limit" },
  },
];
