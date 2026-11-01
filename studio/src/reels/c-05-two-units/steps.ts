import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 5: the bank's card reader on the shop's counter. The shop's card reader (cues 0–3),
// the card-entry session and the frame (4–8), charging by token (9), the contract (10–11), the token is guarded (12), the close (13).
const ASK = { m01Ecom: [0.3, 1], m01CardZone: [2.7, 1] } as const;
const ASK_EDGE = [{ from: "m01Ecom", to: "m01CardZone" }] as const;
const PAGE = { m01Page: [0, 1.4], m01Frame: [1.5, 1.4], m01CardZone: [3, 1.4], buyer: [1.5, 0] } as const;
const PAGE_EDGES = [{ from: "m01Page", to: "m01Frame" }, { from: "m01Frame", to: "m01CardZone" }] as const;
const COUNTER = { label: "ecom's counter", from: [0, 1.4], to: [1.5, 1.4] } as const;
const DEAL = { m01Ecom: [0, 1], m01Contract: [1.5, 1], m01CardZone: [3, 1] } as const;
const DEAL_EDGES = [{ from: "m01Ecom", to: "m01Contract" }, { from: "m01Contract", to: "m01CardZone" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Without ever seeing the card.
  { cue: 0, layout: { m01Ecom: [0.5, 1], pan: [2.5, 1] }, crossed: ["pan"] },
  // The bank's card reader on the shop's counter.
  { cue: 1, layout: { shop: [0.5, 1], m01Reader: [2.5, 1] }, badges: { m01Reader: "the bank's" } },
  {
    cue: 2,
    layout: { buyer: [0, 1], m01Reader: [1.5, 1], shop: [3, 1] },
    edges: [{ from: "buyer", to: "m01Reader" }, { from: "m01Reader", to: "shop" }],
    packets: [{ from: "buyer", to: "m01Reader", label: "PIN" }, { from: "m01Reader", to: "shop", label: "receipt", delay: 60 }],
  },
  { cue: 3, layout: { m01Page: [1.5, 1] }, accent: ["m01Page"] },
  // The card-entry session.
  { cue: 4, layout: ASK, edges: [...ASK_EDGE], packets: [{ from: "m01Ecom", to: "m01CardZone", label: "session?" }], badges: { m01CardZone: "one card, one payment" } },
  { cue: 5, layout: ASK, edges: [...ASK_EDGE], packets: [{ from: "m01CardZone", to: "m01Ecom", label: "address" }] },
  // The frame: the bank's card reader, on ecom's counter.
  { cue: 6, layout: PAGE, edges: [...PAGE_EDGES], frames: [COUNTER], accent: ["m01Frame"] },
  {
    cue: 7,
    layout: PAGE,
    edges: [...PAGE_EDGES, { from: "buyer", to: "m01Frame" }],
    frames: [COUNTER],
    packets: [{ from: "buyer", to: "m01Frame", label: "card" }, { from: "m01Frame", to: "m01CardZone", label: "card", delay: 55 }],
  },
  {
    cue: 8,
    layout: PAGE,
    edges: [...PAGE_EDGES, { from: "buyer", to: "m01Frame" }],
    frames: [COUNTER],
    packets: [{ from: "m01CardZone", to: "m01Frame", label: "token" }, { from: "m01Frame", to: "m01Page", label: "token · masked", delay: 45 }],
  },
  // Charge by token, from this payment's session only.
  {
    cue: 9,
    layout: ASK,
    edges: [...ASK_EDGE],
    packets: [{ from: "m01Ecom", to: "m01CardZone", label: "charge token" }],
    badges: { m01Ecom: "same session?" },
  },
  // The contract.
  { cue: 10, layout: DEAL, edges: [...DEAL_EDGES], accent: ["m01Contract"] },
  {
    cue: 11,
    layout: DEAL,
    edges: [...DEAL_EDGES],
    packets: [{ from: "m01Ecom", to: "m01Contract", label: "charge" }, { from: "m01Ecom", to: "m01Contract", label: "other", delay: 60, stopAt: 0.75 }],
  },
  // The token can spend money.
  { cue: 12, layout: { m01Ecom: [0.5, 1], m01Token: [2.5, 1] }, accent: ["m01Ecom"], badges: { m01Token: "can spend money" } },
];

export const map: BuildMapStep[] = [
  { cue: 13, part: 1, current: ["payment", "procport", "frame", "card"], units: { ecom: "tokens", cards: "card numbers" } },
];
