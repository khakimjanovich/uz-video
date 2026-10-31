import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 2: how a card payment works. One story carries it: the corner shop's tab book.
// The tab book (cues 0–5), two banks (6–8), asking and answering (9–11), settlement and the fee (12–14),
// giving money back (15–19), two pairs (20–22), the check (23–27), the close (28–29).
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

export const diagram: DiagramStep<BuildId>[] = [
  // The tab book: "paid" is a line, not money.
  { cue: 0, layout: { buyer: [0.5, 1], shop: [2.5, 1] }, edges: [{ from: "buyer", to: "shop" }], packets: [{ from: "buyer", to: "shop", label: "pay" }], badges: { shop: "paid" } },
  { cue: 1, layout: { shop: [0.5, 1], tabBook: [2.5, 1] }, edges: [{ from: "shop", to: "tabBook" }] },
  { cue: 2, layout: { shop: [0.5, 1], tabBook: [2.5, 1] }, edges: [{ from: "shop", to: "tabBook" }], packets: [{ from: "shop", to: "tabBook", label: "a line" }] },
  { cue: 3, layout: { shop: [0.5, 1], tabBook: [2.5, 1] }, edges: [{ from: "shop", to: "tabBook" }], badges: { tabBook: "pay: end of week" } },
  { cue: 4, layout: { buyer: [0, 1], shop: [1.5, 1], wallet: [3, 1] }, edges: [{ from: "buyer", to: "shop" }], badges: { shop: "paid" } },
  { cue: 5, layout: { buyer: [0, 1], shop: [1.5, 1], wallet: [3, 1] }, edges: [{ from: "buyer", to: "shop" }], badges: { shop: "paid", wallet: "no money yet" } },
  // Two banks.
  { cue: 6, layout: { acquirer: [0.6, 1], issuer: [2.6, 1] } },
  { cue: 7, layout: { acquirer: [0.6, 1], issuer: [2.6, 1] }, accent: ["acquirer"], badges: { acquirer: "we build this" } },
  { cue: 8, layout: { acquirer: [0.6, 1], issuer: [2.6, 1] }, badges: { acquirer: "we build this", issuer: "gave the card" } },
  // Asking and answering: a line, not money.
  {
    cue: 9,
    layout: CHAIN,
    edges: [...CHAIN_EDGES],
    packets: [{ from: "acquirer", to: "network", label: "OK?" }, { from: "network", to: "issuer", label: "OK?", delay: 40 }],
  },
  {
    cue: 10,
    layout: CHAIN,
    edges: [...CHAIN_EDGES],
    packets: [{ from: "issuer", to: "network", label: "yes", delay: 25 }, { from: "network", to: "acquirer", label: "yes", delay: 60 }],
    badges: { issuer: "card, money" },
  },
  { cue: 11, layout: BOOK, edges: [...BOOK_EDGES], packets: [{ from: "acquirer", to: "tabBook", label: "a line" }], badges: { tabBook: "not money" } },
  // Settlement: the money moves later, in one batch.
  {
    cue: 12,
    layout: BOOK,
    edges: [...BOOK_EDGES],
    packets: [{ from: "issuer", to: "network", label: "money", delay: 40 }, { from: "network", to: "acquirer", label: "money", delay: 80 }],
    badges: { network: "one batch" },
  },
  {
    cue: 13,
    layout: SPLIT,
    edges: [...SPLIT_EDGES],
    packets: [{ from: "acquirer", to: "feeacc", label: "fee" }, { from: "acquirer", to: "wallet", label: "the rest", delay: 30 }],
  },
  // Giving money back: before and after settlement.
  { cue: 15, layout: { tabBook: [0.8, 1], wallet: [2.4, 1] } },
  { cue: 16, layout: { tabBook: [0.8, 1], wallet: [2.4, 1] }, crossed: ["tabBook"], badges: { tabBook: "before settlement" } },
  { cue: 18, layout: { wallet: [0.6, 1], buyer: [2.6, 1] }, edges: [{ from: "wallet", to: "buyer" }], packets: [{ from: "wallet", to: "buyer", label: "money back" }], badges: { wallet: "after settlement", buyer: "refund" } },
  { cue: 19, layout: PAIRS, danger: ["tabBook", "wallet"], badges: { tabBook: "cross out", wallet: "refund" } },
  // Two pairs.
  { cue: 20, layout: PAIRS },
  { cue: 21, layout: PAIRS, badges: { tabBook: "approved ≠ paid out" } },
  { cue: 22, layout: PAIRS, badges: { tabBook: "approved ≠ paid out", wallet: "cancel ≠ refund" } },
  { cue: 28, layout: PAIRS, accent: ["tabBook", "wallet"], badges: { tabBook: "approved ≠ paid out", wallet: "cancel ≠ refund" } },
];

export const map: BuildMapStep[] = [{ cue: 29, part: 0, current: ["payment"], units: { ecom: "the acquirer" } }];

// The one hands-on check: the code's own words for "before" and "after" settlement.
export const code: CodeStep[] = [
  {
    cue: 24,
    file: "terminal · ecom/modules/payment/…/payment/constant",
    lines: [
      "$ grep -n -A1 \"Given back\" PaymentStatus.java",
      "38:  /** Given back before the scheme's settlement, as if it never happened. Final. */",
      "39-  REVERSED,",
      "40:  /** Given back after settlement. Final. */",
      "41-  REFUNDED,",
    ],
    small: true,
    upTo: 1,
    beats: [{ cue: 25 }, { cue: 26, highlight: [2, 3] }, { cue: 27, highlight: [4, 5] }],
  },
];
