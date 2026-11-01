import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 2: how a card payment works. One story carries it: the corner shop's tab book.
// The tab book (cues 0–4), two banks (5–7), asking and answering (8–10), settlement and the fee (11–12),
// giving money back (13–16), two pairs (17), the close (18).
const BOOK_SHOP = { shop: [0.5, 1], tabBook: [2.5, 1] } as const;
const CHAIN = { shop: [0, 1], acquirer: [1, 1], network: [2, 1], issuer: [3, 1] } as const;
const CHAIN_EDGES = [
  { from: "shop", to: "acquirer" },
  { from: "acquirer", to: "network" },
  { from: "network", to: "issuer" },
] as const;
const BOOK = { ...CHAIN, tabBook: [1, 2.2] } as const;
const BOOK_EDGES = [...CHAIN_EDGES, { from: "acquirer", to: "tabBook" }] as const;
const SPLIT = { acquirer: [0.8, 1], feeacc: [2.6, 0.3], wallet: [2.6, 1.7] } as const;
const SPLIT_EDGES = [{ from: "acquirer", to: "feeacc", label: "fee" }, { from: "acquirer", to: "wallet", label: "the rest" }] as const;
const PAIRS = { tabBook: [0.8, 1], wallet: [2.4, 1] } as const;
const TWO_BANKS = { acquirer: [0.6, 1], issuer: [2.6, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // The tab book: "paid" is a line, not money.
  { cue: 0, layout: { buyer: [0.5, 1], shop: [2.5, 1] }, edges: [{ from: "buyer", to: "shop" }], packets: [{ from: "buyer", to: "shop", label: "pay" }], badges: { shop: "paid" } },
  { cue: 1, layout: BOOK_SHOP, edges: [{ from: "shop", to: "tabBook" }] },
  { cue: 2, layout: BOOK_SHOP, edges: [{ from: "shop", to: "tabBook" }], packets: [{ from: "shop", to: "tabBook", label: "a line" }] },
  { cue: 3, layout: BOOK_SHOP, edges: [{ from: "shop", to: "tabBook" }], badges: { tabBook: "money: end of week" } },
  { cue: 4, layout: { buyer: [0, 1], shop: [1.5, 1], tabBook: [3, 1] }, edges: [{ from: "buyer", to: "shop" }, { from: "shop", to: "tabBook" }], badges: { shop: "paid", tabBook: "no money yet" } },
  // Two banks.
  { cue: 5, layout: TWO_BANKS },
  { cue: 6, layout: TWO_BANKS, accent: ["acquirer"], badges: { acquirer: "we build this" } },
  { cue: 7, layout: TWO_BANKS, badges: { acquirer: "we build this", issuer: "gave the card" } },
  // Asking and answering: a line, not money.
  { cue: 8, layout: CHAIN, edges: [...CHAIN_EDGES], packets: [{ from: "acquirer", to: "network", label: "OK?" }, { from: "network", to: "issuer", label: "OK?", delay: 40 }] },
  {
    cue: 9,
    layout: CHAIN,
    edges: [...CHAIN_EDGES],
    packets: [{ from: "issuer", to: "network", label: "yes", delay: 25 }, { from: "network", to: "acquirer", label: "yes", delay: 60 }],
    badges: { issuer: "card · money" },
  },
  { cue: 10, layout: BOOK, edges: [...BOOK_EDGES], packets: [{ from: "acquirer", to: "tabBook", label: "a line" }], badges: { tabBook: "not money" } },
  // Settlement: the money moves later, in one batch.
  {
    cue: 11,
    layout: BOOK,
    edges: [...BOOK_EDGES],
    packets: [{ from: "issuer", to: "network", label: "money", delay: 40 }, { from: "network", to: "acquirer", label: "money", delay: 80 }],
    badges: { network: "one batch" },
  },
  { cue: 12, layout: SPLIT, edges: [...SPLIT_EDGES], packets: [{ from: "acquirer", to: "feeacc", label: "fee" }, { from: "acquirer", to: "wallet", label: "the rest", delay: 30 }] },
  // Giving money back: before and after settlement.
  { cue: 13, layout: PAIRS },
  { cue: 14, layout: PAIRS, crossed: ["tabBook"], badges: { tabBook: "reversal" } },
  { cue: 15, layout: { wallet: [0.6, 1], buyer: [2.6, 1] }, edges: [{ from: "wallet", to: "buyer" }], packets: [{ from: "wallet", to: "buyer", label: "money back" }], badges: { buyer: "refund" } },
  { cue: 16, layout: PAIRS, danger: ["tabBook", "wallet"], badges: { tabBook: "pays twice", wallet: "loses money" } },
  // Two pairs.
  { cue: 17, layout: PAIRS, accent: ["tabBook", "wallet"], badges: { tabBook: "approved ≠ paid out", wallet: "reversal ≠ refund" } },
];

export const map: BuildMapStep[] = [{ cue: 18, part: 0, current: ["payment"], units: { ecom: "the acquirer" } }];
