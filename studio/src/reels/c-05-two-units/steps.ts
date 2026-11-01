import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";
import { BANK, PAY } from "../../series/build/screens-m01";

// Lesson 5: the bank's card reader on the shop's counter. The shop's card reader (cues 0–4), the wrong design (5–9),
// the contract (10–14), the card-entry session (15–17), the frame (18–20), card in, receipt out (21–25), charge by token (26–27),
// the product (28–44), what it protects (45–52), back to the counter (53–55), next (56).
const CARD_ZONE = ["frame", "card", "bin", "adapters", "cardsinfra"] as const;
const COUNTER = { buyer: [0, 1], m01Reader: [1.5, 1], shop: [3, 1] } as const;
const COUNTER_EDGES = [{ from: "buyer", to: "m01Reader" }, { from: "m01Reader", to: "shop" }] as const;
const WRONG = { m01Page: [0, 1], m01Ecom: [1.5, 1], m01CardZone: [3, 1] } as const;
const WRONG_EDGES = [{ from: "m01Page", to: "m01Ecom" }, { from: "m01Ecom", to: "m01CardZone" }] as const;
const WRONG_CARD = [{ from: "m01Page", to: "m01Ecom", label: "card number" }, { from: "m01Ecom", to: "m01CardZone", label: "card number", delay: 50 }] as const;
const TWO = { m01Ecom: [0.3, 1], m01CardZone: [2.7, 1] } as const;
const ASK_EDGE = [{ from: "m01Ecom", to: "m01CardZone" }] as const;
const DEAL = { m01Ecom: [0, 1], m01Contract: [1.5, 1], m01CardZone: [3, 1] } as const;
const DEAL_EDGES = [{ from: "m01Ecom", to: "m01Contract" }, { from: "m01Contract", to: "m01CardZone" }] as const;
const PAGE = { m01Page: [0, 1.4], m01Frame: [1.5, 1.4], m01CardZone: [3, 1.4], buyer: [1.5, 0] } as const;
const PAGE_EDGES = [{ from: "m01Page", to: "m01Frame" }, { from: "m01Frame", to: "m01CardZone" }] as const;
const TYPED = [...PAGE_EDGES, { from: "buyer", to: "m01Frame" }] as const;
const ON_COUNTER = { label: "ecom's counter", from: [0, 1.4], to: [1.5, 1.4] } as const;
const HOLDS = { m01Ecom: [0.3, 1], m01Token: [2.6, 0.2], masked: [2.6, 1.8] } as const;
const HOLDS_EDGES = [{ from: "m01Ecom", to: "m01Token" }, { from: "m01Ecom", to: "masked" }] as const;
const STORES = { m01Ecom: [0.4, 1], backup: [2.6, 0.2], reporting: [2.6, 1.8] } as const;
const STORES_EDGES = [{ from: "m01Ecom", to: "backup" }, { from: "m01Ecom", to: "reporting" }] as const;
const GUARD = { m01Ecom: [0, 1], m01Token: [1.5, 1], lockedRoom: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Without ever seeing the card.
  { cue: 0, layout: { m01Ecom: [0.5, 1], pan: [2.5, 1] }, crossed: ["pan"] },
  // A real shop: the bank's card reader.
  { cue: 1, layout: { shop: [1.5, 1] } },
  { cue: 2, layout: COUNTER, edges: [...COUNTER_EDGES], packets: [{ from: "m01Reader", to: "buyer", label: "turned to you" }] },
  { cue: 3, layout: COUNTER, edges: [...COUNTER_EDGES], accent: ["m01Reader"], badges: { m01Reader: "not the shop's" } },
  { cue: 4, layout: COUNTER, edges: [...COUNTER_EDGES], packets: [{ from: "buyer", to: "m01Reader", label: "PIN" }, { from: "m01Reader", to: "shop", label: "receipt", delay: 60 }] },
  // The obvious web design, and why not.
  { cue: 5, layout: { m01Page: [1.5, 1] } },
  { cue: 6, layout: WRONG, edges: [...WRONG_EDGES], packets: [...WRONG_CARD] },
  { cue: 7, layout: WRONG, edges: [...WRONG_EDGES], packets: [...WRONG_CARD], danger: ["m01Ecom"], badges: { m01Ecom: "every card number" } },
  { cue: 8, layout: WRONG, edges: [...WRONG_EDGES], frames: [{ label: "Checked: everything", from: [0, 1], to: [1.5, 1], tone: "danger" }], danger: ["m01Ecom"], badges: { m01Ecom: "the full check" } },
  { cue: 9, layout: PAGE, edges: [...PAGE_EDGES], frames: [ON_COUNTER], accent: ["m01Frame"] },
  // Step one: the contract.
  { cue: 10, layout: TWO },
  { cue: 11, layout: TWO, edges: [{ from: "m01Ecom", to: "m01CardZone", broken: true }], badges: { m01CardZone: "never talk freely" } },
  { cue: 12, layout: DEAL, edges: [...DEAL_EDGES], badges: { m01Contract: "questions · answers" } },
  { cue: 13, layout: DEAL, edges: [...DEAL_EDGES], accent: ["m01Contract"], badges: { m01Contract: "a contract" } },
  {
    cue: 14,
    layout: DEAL,
    edges: [...DEAL_EDGES],
    packets: [{ from: "m01Ecom", to: "m01Contract", label: "allowed" }, { from: "m01Ecom", to: "m01Contract", label: "other", delay: 60, stopAt: 0.75 }],
  },
  // Step two: the card-entry session.
  { cue: 15, layout: TWO, edges: [...ASK_EDGE], packets: [{ from: "m01Ecom", to: "m01CardZone", label: "session?" }] },
  { cue: 16, layout: TWO, edges: [...ASK_EDGE], badges: { m01CardZone: "one card, one payment" } },
  { cue: 17, layout: TWO, edges: [...ASK_EDGE], packets: [{ from: "m01CardZone", to: "m01Ecom", label: "address" }] },
  // Step three: the frame.
  { cue: 18, layout: PAGE, edges: [...PAGE_EDGES], accent: ["m01Frame"] },
  { cue: 19, layout: PAGE, edges: [...PAGE_EDGES], badges: { m01Frame: "the card zone's" } },
  { cue: 20, layout: PAGE, edges: [...PAGE_EDGES], frames: [ON_COUNTER], badges: { m01Frame: "the bank's reader" } },
  // Step four: the card goes straight in. Step five: a receipt comes back.
  { cue: 21, layout: PAGE, edges: [...TYPED], frames: [ON_COUNTER], packets: [{ from: "buyer", to: "m01Frame", label: "card" }] },
  { cue: 22, layout: PAGE, edges: [...TYPED], frames: [ON_COUNTER], packets: [{ from: "m01Frame", to: "m01CardZone", label: "card" }] },
  { cue: 23, layout: { ...PAGE, m01Ecom: [0, 0] }, edges: [...TYPED], frames: [ON_COUNTER], crossed: ["m01Ecom"], badges: { m01Ecom: "not on the way" } },
  {
    cue: 24,
    layout: PAGE,
    edges: [...TYPED],
    frames: [ON_COUNTER],
    packets: [{ from: "m01CardZone", to: "m01Frame", label: "token" }, { from: "m01Frame", to: "m01Page", label: "token · masked · bank", delay: 45 }],
  },
  { cue: 25, layout: PAGE, edges: [...TYPED], frames: [ON_COUNTER], badges: { m01Page: "never the number" } },
  // Step six: charge by token, from this payment's session only.
  { cue: 26, layout: TWO, edges: [...ASK_EDGE], packets: [{ from: "m01Ecom", to: "m01CardZone", label: "charge: token" }] },
  { cue: 27, layout: TWO, edges: [...ASK_EDGE], badges: { m01Ecom: "same session?" } },
  // The wrong way: a short-lived session.
  { cue: 38, layout: { buyer: [0.4, 1], m01Frame: [2.6, 1] }, edges: [{ from: "buyer", to: "m01Frame" }] },
  {
    cue: 39,
    layout: { buyer: [0.4, 1], m01Frame: [2.6, 1] },
    edges: [{ from: "buyer", to: "m01Frame" }],
    packets: [{ from: "buyer", to: "m01Frame", label: "wrong card", stopAt: 0.7 }, { from: "buyer", to: "m01Frame", label: "wrong card", delay: 50, stopAt: 0.7 }],
    badges: { m01Frame: "too many tries" },
  },
  { cue: 41, layout: TWO, edges: [...ASK_EDGE], badges: { m01CardZone: "short-lived" } },
  { cue: 42, layout: TWO, edges: [...ASK_EDGE], badges: { m01CardZone: "one card, then used up" } },
  { cue: 44, layout: HOLDS, edges: [...HOLDS_EDGES], accent: ["m01Ecom"], badges: { m01Ecom: "all ecom holds" } },
  // What it protects.
  { cue: 45, layout: PAGE, edges: [...TYPED], frames: [ON_COUNTER] },
  { cue: 46, layout: STORES, edges: [...STORES_EDGES], badges: { m01Ecom: "no card number" } },
  { cue: 47, layout: { m01Ecom: [0.4, 1], attacker: [2.6, 1] }, edges: [{ from: "m01Ecom", to: "attacker" }], packets: [{ from: "m01Ecom", to: "attacker", label: "leak" }], badges: { attacker: "no card" } },
  { cue: 48, layout: { shop: [0.5, 1], pan: [2.5, 1] }, crossed: ["pan"], badges: { shop: "never touches it" } },
  { cue: 50, layout: { m01Token: [1.5, 1] }, accent: ["m01Token"], badges: { m01Token: "still matters" } },
  {
    cue: 51,
    layout: GUARD,
    edges: [{ from: "m01Ecom", to: "m01Token" }, { from: "m01Token", to: "lockedRoom", label: "fetches" }],
    packets: [{ from: "m01Token", to: "lockedRoom", label: "start a payment" }],
    badges: { m01Ecom: "guards it" },
  },
  // Back to the counter.
  { cue: 53, layout: COUNTER, edges: [...COUNTER_EDGES] },
  { cue: 54, layout: COUNTER, edges: [...COUNTER_EDGES], accent: ["m01Reader"], badges: { m01Reader: "faces the buyer" } },
  { cue: 55, layout: COUNTER, edges: [...COUNTER_EDGES], packets: [{ from: "m01Reader", to: "shop", label: "receipt" }], badges: { shop: "receipts, never cards" } },
];

// The product: the bank's page from the order to "Paid", an ended attempt, the bank's row.
const SHOT = "screens/c-05-two-units";
export const screens: ScreenStep[] = [
  {
    cue: 28,
    src: `${SHOT}/pay-card.png`,
    title: PAY.cardTitle,
    region: PAY.top,
    beats: [
      { cue: 30, region: PAY.top, focus: [PAY.header] },
      { cue: 31, region: PAY.top, focus: [PAY.amount] },
      { cue: 32, region: PAY.frame, focus: [PAY.frameBox] },
    ],
  },
  { cue: 33, src: `${SHOT}/pay-typed.png`, title: PAY.cardTitle, region: PAY.frame, focus: [PAY.fields] },
  { cue: 34, src: `${SHOT}/pay-debiting.png`, title: PAY.title, region: PAY.status, focus: [PAY.cardLine] },
  // The code from the buyer's phone, typed into the card zone's frame; "Confirm" next.
  { cue: 35, src: `${SHOT}/pay-code.png`, title: PAY.cardTitle, region: PAY.frame, focus: [[556, 426, 328, 38]] },
  { cue: 36, src: `${SHOT}/pay-debiting.png`, title: PAY.title, region: PAY.status, focus: [PAY.taking] },
  { cue: 37, src: `${SHOT}/pay-paid.png`, title: PAY.title, region: PAY.status, focus: [PAY.paid] },
  { cue: 40, src: `${SHOT}/pay-ended.png`, title: PAY.cardTitle, region: PAY.ended, focus: [PAY.note] },
  { cue: 43, src: `${SHOT}/admin-payments.png`, title: BANK.title, region: BANK.list, focus: [BANK.firstCard] },
];

export const map: BuildMapStep[] = [
  { cue: 49, part: 2, current: [...CARD_ZONE], units: { cards: "full check" } },
  { cue: 52, part: 2, current: ["payment", "procport"], units: { ecom: "smaller check", cards: "full check" } },
  { cue: 56, part: 2, current: ["vault"], units: { ecom: "settings", cards: "settings" } },
];
