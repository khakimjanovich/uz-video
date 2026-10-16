import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// One step per script sentence (edge-tts emits one subtitle cue per sentence).
export const acts: ActsMap = { hook: 0, break: 1, v2: 2, handoff: 5 };

type Edge = DiagramEdge<AcquiringNodeId>;

const LAYOUT: Partial<Record<AcquiringNodeId, Slot>> = {
  buyer: [0, 0],
  merchant: [2, 0],
  bank: [1, 2.3],
  network: [1, 4],
};

const SHOP: Edge = { from: "buyer", to: "merchant", label: "🛒" };
const LICENSED: Edge[] = [{ from: "bank", to: "network" }];
const CARD: Edge = { from: "buyer", to: "bank", label: "💳 card" };
const ACQUIRER: Edge = { from: "bank", to: "merchant", label: "acquirer" };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: what does an online store in Uzbekistan need to accept card payments?
  {
    cue: 0,
    layout: { buyer: [0, 0], merchant: [2, 0] },
    edges: [SHOP],
    badges: { merchant: "❓ cards" },
  },
  // 1 Law: only CBU-licensed banks / payment orgs connect to processing centers, not stores.
  {
    cue: 1,
    layout: { ...LAYOUT, bank: [0, 2.3] }, // left, clear of the "not allowed" line; slides to centre next step
    edges: [SHOP, { from: "merchant", to: "network", label: "⚖️ not allowed", broken: true }, ...LICENSED],
    danger: ["merchant"],
    badges: { bank: "✅ licensed" },
  },
  // 2 An acquirer has to sit between the store and the processing center.
  {
    cue: 2,
    layout: LAYOUT,
    edges: [SHOP, ...LICENSED, ACQUIRER],
    accent: ["bank"],
  },
  // 3 Bank takes the card on its own page; the store never sees the number.
  {
    cue: 3,
    layout: LAYOUT,
    edges: [SHOP, ...LICENSED, CARD, ACQUIRER],
    // Processing shown silently: card -> debit at processing center -> approved -> paid.
    packets: [
      { from: "buyer", to: "bank", label: "💳 + SMS code" },
      { from: "bank", to: "network", label: "💳 debit", delay: 55, duration: 25 },
      { from: "network", to: "bank", label: "✅ approved", delay: 85, duration: 25 },
      { from: "bank", to: "merchant", label: "✅ paid", delay: 115, duration: 25 },
    ],
    accent: ["bank"],
    badges: { merchant: "8600 •••• 9012" },
  },
  // 4 One contract, paid into the store's own account at the same bank.
  {
    cue: 4,
    layout: LAYOUT,
    edges: [SHOP, ...LICENSED, CARD, { from: "bank", to: "merchant", label: "own account" }],
    packets: [{ from: "bank", to: "merchant", label: "💰 payout", duration: 40 }],
    accent: ["bank", "merchant"],
    badges: { merchant: "📄 1 contract" },
  },
  // 5 Handoff: before the first payment, what does the bank check? -> Part 2 (onboarding)
  {
    cue: 5,
    layout: LAYOUT,
    edges: [SHOP, ...LICENSED, CARD, { from: "bank", to: "merchant", label: "own account" }],
    accent: ["bank"],
    badges: { merchant: "🔍 checked?" },
  },
];
