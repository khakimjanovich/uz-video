import { BuildMapStep, DiagramStep } from "../../components";
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
  { cue: 0, part: 0 },
  { cue: 1, part: 0, current: ["buyer"] },
  { cue: 3, part: 0, current: ["merchant", "payment"] },
  { cue: 4, part: 0, current: ["payment", "buyer"] },
  { cue: 6, part: 0, current: ["frame"], units: { cards: "card zone" } },
  { cue: 7, part: 0, current: ["buyer", "frame", "card"], units: { cards: "card zone" } },
  { cue: 8, part: 0, current: ["card"], units: { cards: "token out" } },
  { cue: 9, part: 0, current: ["payment", "procport", "card"] },
  { cue: 12, part: 0, current: ["buyer", "merchant", "payment"] },
  { cue: 13, part: 0, current: ["payment", "commission"] },
  { cue: 14, part: 0, current: ["reconciliation", "procsvc"] },
  // Two products, and what each keeps.
  { cue: 19, part: 0, units: { ecom: "product", cards: "product" } },
  { cue: 20, part: 0, current: [...MODULES], units: { ecom: "the shop's side" } },
  { cue: 21, part: 0, current: [...CARD_ZONE], units: UNITS },
  { cue: 22, part: 0, current: [...INFRA], units: UNITS },
  { cue: 23, part: 0, current: [...CARD_ZONE], units: { cards: "first", ecom: "then" } },
  { cue: 24, part: 0, units: UNITS },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The card zone asks the buyer's bank, through the processing centre.
  { cue: 10, layout: BANKS, edges: [...BANK_EDGES], packets: [{ from: "card", to: "processing", label: "charge" }, { from: "processing", to: "issuer", label: "OK?", delay: 45 }] },
  { cue: 11, layout: BANKS, edges: [...BANK_EDGES], packets: [{ from: "issuer", to: "processing", label: "yes" }, { from: "processing", to: "card", label: "yes", delay: 35 }], accent: ["issuer"] },
  // Three kinds of people.
  { cue: 15, layout: PEOPLE, accent: ["buyer", "shopStaff", "bankStaff"] },
  { cue: 16, layout: PEOPLE, accent: ["buyer"], badges: { buyer: "one page" } },
  { cue: 17, layout: PEOPLE, accent: ["shopStaff"], badges: { buyer: "one page", shopStaff: "payments · refunds" } },
  { cue: 18, layout: PEOPLE, accent: ["bankStaff"], badges: { buyer: "one page", shopStaff: "payments · refunds", bankStaff: "approve · fees" } },
];
