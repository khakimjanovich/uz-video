import { BuildMapStep, BuyerStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 1: behind the Pay button. One payment walks the map (cues 0–14), with the banks drawn out (10–11);
// the three kinds of people (15–18); the two products and what each keeps (19–23); the close (24).
const MODULES = ["partner", "commission", "epos", "payment", "reconciliation"] as const;
const CARD_ZONE = ["frame", "card", "bin", "adapters", "cardsinfra"] as const;
const INFRA = ["postgres", "redis", "keycloak", "vault", "s3", "temporal", "kafka", "observability", "cardsinfra"] as const;
const UNITS = { ecom: "the shop's side", cards: "locked room" };

const BANKS = { card: [0, 1], processing: [1.5, 1], issuer: [3, 1] } as const;
const BANK_EDGES = [{ from: "card", to: "processing" }, { from: "processing", to: "issuer" }] as const;
const PEOPLE = { buyer: [0.2, 1], shopStaff: [1.5, 1], bankStaff: [2.8, 1] } as const;

export const map: BuildMapStep[] = [
  // One payment, step by step.
  { cue: 0, part: 1 },
  { cue: 1, part: 1, current: ["buyer"], dot: "buyer" },
  { cue: 3, part: 1, current: ["merchant", "payment"], dot: "payment" },
  { cue: 4, part: 1, current: ["payment", "buyer"], dot: "buyer" },
  { cue: 6, part: 1, current: ["frame"], dot: "frame", units: { cards: "card zone" } },
  { cue: 8, part: 1, current: ["buyer", "frame", "card"], dot: "card", units: { cards: "card zone" } },
  { cue: 9, part: 1, current: ["card"], analogy: "card-token", units: { cards: "token out" } },
  { cue: 10, part: 1, current: ["payment", "procport", "card"], dot: "procport" },
  { cue: 13, part: 1, current: ["buyer", "merchant", "payment"], dot: "buyer" },
  { cue: 14, part: 1, current: ["payment", "commission"], dot: "commission" },
  { cue: 15, part: 1, current: ["reconciliation", "procsvc"], dot: "reconciliation" },
  // Two products, and what each keeps.
  { cue: 20, part: 1, dot: "off", units: { ecom: "product", cards: "product" } },
  { cue: 21, part: 1, current: [...MODULES], units: { ecom: "the shop's side" } },
  { cue: 22, part: 1, current: [...CARD_ZONE], units: UNITS },
  { cue: 23, part: 1, rows: [2], current: [...INFRA], units: UNITS },
  { cue: 24, part: 1, rows: [3, 4], current: [...CARD_ZONE], units: { cards: "first", ecom: "then" } },
  // Recap, the question (held 2 s), and the answer: only the card zone stays bright.
  { cue: 25, part: 1, units: UNITS },
  { cue: 27, part: 1, current: [...CARD_ZONE], units: UNITS },
  { cue: 28, part: 1, units: UNITS },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The card zone asks the buyer's bank, through the processing centre.
  { cue: 11, layout: BANKS, edges: [...BANK_EDGES], packets: [{ from: "card", to: "processing", label: "charge" }, { from: "processing", to: "issuer", label: "OK?", delay: 45 }] },
  { cue: 12, layout: BANKS, edges: [...BANK_EDGES], packets: [{ from: "issuer", to: "processing", label: "yes" }, { from: "processing", to: "card", label: "yes", delay: 35 }], accent: ["issuer"] },
  // Three kinds of people.
  { cue: 16, layout: PEOPLE, accent: ["buyer", "shopStaff", "bankStaff"] },
  { cue: 17, layout: PEOPLE, accent: ["buyer"], badges: { buyer: "one page" } },
  { cue: 18, layout: PEOPLE, accent: ["shopStaff"], badges: { buyer: "one page", shopStaff: "payments · refunds" } },
  { cue: 19, layout: PEOPLE, accent: ["bankStaff"], badges: { buyer: "one page", shopStaff: "payments · refunds", bankStaff: "approve · fees" } },
];

// The buyer's own screen, beside the map: bright when the buyer is the one acting, dim while the system works behind the page.
const TOP = [535, 117, 365, 145] as const; // the shop, the amount and the order on the bank's page
const FORM = [535, 337, 370, 215] as const; // the card form
const NUMBER = [555, 372, 330, 45] as const; // the card number field

export const buyer: BuyerStep[] = [
  { cue: 2, screen: "shop" },
  { cue: 3, screen: "shop", dim: true },
  { cue: 5, screen: "pay-typed", focus: [[...TOP]] },
  { cue: 6, screen: "pay-typed", focus: [[...FORM]] },
  { cue: 8, screen: "pay-typed", focus: [[...NUMBER]] },
  { cue: 9, screen: "off" }, // the card-to-token picture takes this place
  { cue: 10, screen: "pay-typed", dim: true },
  { cue: 13, screen: "pay-paid" },
  { cue: 14, screen: "pay-paid", dim: true },
  { cue: 16, screen: "off" },
];
