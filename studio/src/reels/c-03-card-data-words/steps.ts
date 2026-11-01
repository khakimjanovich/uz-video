import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";
import { BANK, PAY } from "../../series/build/screens-m01";

// Lesson 3: what you may keep about a card. One story carries it: your bank on the phone.
// The call (cues 0–3), the pasted ticket (4–9), the PAN (10–13), the code on the back (14–16), the masked number (17–21),
// the card token (22–26), three rules (27–31), the product (32–44), what it protects (45–50), back to the ticket (51–54), next (55).
const CARD_ZONE = ["frame", "card", "bin", "adapters", "cardsinfra"] as const;
const CALL = { issuer: [0.6, 1], masked: [2.6, 1] } as const;
const SAYS = [{ from: "issuer", to: "masked", label: "says" }] as const;
const PASTE = { m01Engineer: [0.4, 1], supportTicket: [2.6, 1] } as const;
const SPREAD = { supportTicket: [0.3, 1], backup: [2.6, 0], searchIndex: [2.6, 1], readers: [2.6, 2] } as const;
const SPREAD_EDGES = (["backup", "searchIndex", "readers"] as const).map((to) => ({ from: "supportTicket" as const, to }));
const COPIES = SPREAD_EDGES.map((e, k) => ({ ...e, label: "card number", delay: 10 + k * 25 }));
const WORDS = { pan: [0, 1], masked: [1.5, 1], m01Token: [3, 1] } as const;
const RULES = { pan: [0, 0.6], masked: [1.5, 0.6], m01Token: [3, 0.6], backCode: [1.5, 2.1] } as const;
const MASK = { pan: [0.4, 1], masked: [2.6, 1] } as const;
const MASK_EDGE = [{ from: "pan", to: "masked", label: "first 6 · last 4" }] as const;
const TOKEN = { pan: [0, 1], m01CardZone: [1.5, 1], m01Token: [3, 1] } as const;
const TOKEN_EDGES = [{ from: "pan", to: "m01CardZone" }, { from: "m01CardZone", to: "m01Token", label: "random" }] as const;
const TWO = { m01CardZone: [0.4, 1], m01Token: [2.6, 0.3], m01Token2: [2.6, 1.7] } as const;
const ROOM = { masked: [0.4, 0.3], m01Token: [0.4, 1.7], m01CardZone: [2.8, 1] } as const;
const ROOM_WALL = { label: "Card zone", from: [2.8, 1], to: [2.8, 1], tone: "wall" } as const;
const FIXED = { supportTicket: [0, 1], masked: [1.7, 0.2], m01Token: [1.7, 1.8], pan: [3, 1] } as const;
const FIXED_EDGES = [{ from: "supportTicket", to: "masked" }, { from: "supportTicket", to: "m01Token" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Your bank on the phone.
  { cue: 0, layout: { pan: [1.5, 1] } },
  { cue: 1, layout: CALL, edges: [...SAYS], badges: { masked: "card ending 7890" } },
  { cue: 2, layout: { ...CALL, pan: [1.6, 2.2] }, edges: [...SAYS], crossed: ["pan"], badges: { pan: "never read out" } },
  { cue: 3, layout: { ...CALL, backCode: [1.6, 2.2] }, edges: [...SAYS], crossed: ["backCode"], badges: { backCode: "never asked" } },
  // The pasted ticket.
  { cue: 4, layout: { m01Engineer: [1.5, 1] } },
  { cue: 5, layout: PASTE, edges: [{ from: "m01Engineer", to: "supportTicket" }], packets: [{ from: "m01Engineer", to: "supportTicket", label: "whole card number" }] },
  { cue: 6, layout: PASTE, edges: [{ from: "m01Engineer", to: "supportTicket" }], danger: ["supportTicket"], badges: { supportTicket: "lives here now" } },
  { cue: 7, layout: SPREAD, edges: SPREAD_EDGES, packets: COPIES, danger: ["supportTicket"] },
  { cue: 8, layout: SPREAD, edges: SPREAD_EDGES, danger: ["supportTicket", "backup", "searchIndex", "readers"], badges: { supportTicket: "never built to guard" } },
  { cue: 9, layout: CALL, edges: [...SAYS], accent: ["issuer"], badges: { masked: "card ending 7890" } },
  // The words: the PAN first.
  { cue: 10, layout: WORDS, accent: ["pan", "masked", "m01Token"] },
  { cue: 11, layout: { pan: [1.5, 1] }, accent: ["pan"], badges: { pan: "the long number" } },
  { cue: 12, layout: { pan: [0.5, 1], attacker: [2.5, 1] }, edges: [{ from: "attacker", to: "pan", label: "wants" }], danger: ["pan"], badges: { attacker: "needs it most" } },
  // The code on the back.
  { cue: 14, layout: { backCode: [1.5, 1] }, badges: { backCode: "security code" } },
  { cue: 15, layout: { backCode: [1.5, 1] }, crossed: ["backCode"], badges: { backCode: "not kept once approved" } },
  { cue: 16, layout: { backCode: [1.5, 1] }, crossed: ["backCode"], badges: { backCode: "never even asked" } },
  // The masked number.
  { cue: 17, layout: { masked: [1.5, 1] }, accent: ["masked"], badges: { masked: "screens · reports" } },
  { cue: 18, layout: MASK, edges: [...MASK_EDGE], packets: [{ from: "pan", to: "masked", label: "stars between" }] },
  { cue: 19, layout: MASK, edges: [...MASK_EDGE], badges: { masked: "first 6: the bank" } },
  { cue: 20, layout: MASK, edges: [...MASK_EDGE], badges: { masked: "last 4: your card" } },
  {
    cue: 21,
    layout: { masked: [0.5, 1], attacker: [2.5, 1] },
    edges: [{ from: "masked", to: "attacker" }],
    packets: [{ from: "masked", to: "attacker", label: "pay?", stopAt: 0.55 }],
    badges: { masked: "cannot pay" },
  },
  // The card token.
  { cue: 22, layout: { m01Ecom: [0.5, 1], m01Token: [2.5, 1] }, edges: [{ from: "m01Ecom", to: "m01Token", label: "keeps" }], accent: ["m01Token"], badges: { m01Ecom: "charge it later" } },
  { cue: 23, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "m01CardZone", to: "m01Token", label: "random name" }], accent: ["m01Token"] },
  { cue: 24, layout: TOKEN, edges: [...TOKEN_EDGES], badges: { m01Token: "nothing from the number" } },
  {
    cue: 25,
    layout: TWO,
    edges: [{ from: "m01CardZone", to: "m01Token" }, { from: "m01CardZone", to: "m01Token2" }],
    packets: [{ from: "m01CardZone", to: "m01Token", label: "token" }, { from: "m01CardZone", to: "m01Token2", label: "token", delay: 30 }],
    badges: { m01Token2: "share nothing" },
  },
  {
    cue: 26,
    layout: { ...TOKEN, attacker: [3, 2.2] },
    edges: [...TOKEN_EDGES, { from: "m01Token", to: "attacker" }],
    packets: [{ from: "m01Token", to: "attacker", label: "?", stopAt: 0.5 }],
    badges: { attacker: "learns nothing" },
  },
  // Three words, three rules.
  { cue: 27, layout: WORDS },
  { cue: 28, layout: WORDS, frames: [{ label: "Card zone", from: [0, 1], to: [0, 1], tone: "wall" }], accent: ["pan"], badges: { pan: "card zone only" } },
  { cue: 29, layout: WORDS, frames: [{ label: "Card zone", from: [0, 1], to: [0, 1], tone: "wall" }], accent: ["masked"], badges: { masked: "may be shown" } },
  { cue: 30, layout: WORDS, frames: [{ label: "Card zone", from: [0, 1], to: [0, 1], tone: "wall" }], accent: ["m01Token"], badges: { m01Token: "may be kept" } },
  {
    cue: 31,
    layout: RULES,
    frames: [{ label: "Card zone", from: [0, 0.6], to: [0, 0.6], tone: "wall" }],
    crossed: ["backCode"],
    badges: { backCode: "never kept" },
  },
  // What it protects.
  { cue: 45, layout: WORDS },
  { cue: 46, layout: WORDS, accent: ["masked"], badges: { masked: "leaks nothing useful" } },
  { cue: 47, layout: WORDS, accent: ["masked", "m01Token"], badges: { m01Token: "only a random name" } },
  { cue: 48, layout: { pan: [0.5, 1], attacker: [2.5, 1] }, edges: [{ from: "pan", to: "attacker" }], packets: [{ from: "pan", to: "attacker", label: "spend" }], danger: ["pan"] },
  { cue: 49, layout: ROOM, frames: [ROOM_WALL], accent: ["masked", "m01Token"], badges: { m01CardZone: "the PAN" } },
  { cue: 50, layout: { buyer: [0, 1], shop: [1.5, 1], bank: [3, 1] }, accent: ["buyer"], badges: { buyer: "protected first" } },
  // Back to the support ticket.
  { cue: 51, layout: { supportTicket: [1.5, 1] } },
  { cue: 52, layout: FIXED, edges: [...FIXED_EDGES], accent: ["masked", "m01Token"], crossed: ["pan"] },
  { cue: 53, layout: FIXED, edges: [...FIXED_EDGES], accent: ["masked", "m01Token"], crossed: ["pan"], badges: { supportTicket: "leaks nothing" } },
  { cue: 54, layout: ROOM, frames: [ROOM_WALL], accent: ["masked", "m01Token"], badges: { m01CardZone: "the PAN" } },
];

// The product: the card form with no code box, the short card line, the bank's Card column.
const SHOT = "screens/c-03-card-data-words";
export const screens: ScreenStep[] = [
  { cue: 32, src: `${SHOT}/pay-card.png`, title: PAY.cardTitle, region: PAY.top, beats: [{ cue: 33, region: PAY.top, focus: [PAY.header] }] },
  {
    cue: 34,
    src: `${SHOT}/pay-card.png`,
    title: PAY.cardTitle,
    region: PAY.frame,
    focus: [PAY.frameBox],
    beats: [{ cue: 35, region: PAY.frame, focus: [PAY.fields] }, { cue: 36, region: PAY.frame }],
  },
  { cue: 37, src: `${SHOT}/pay-typed.png`, title: PAY.cardTitle, region: PAY.frame, focus: [PAY.fields] },
  { cue: 38, src: `${SHOT}/pay-debiting.png`, title: PAY.title, region: PAY.status, focus: [PAY.cardLine] },
  { cue: 40, src: `${SHOT}/admin-payments.png`, title: BANK.title, region: BANK.list, beats: [{ cue: 41, region: BANK.list, focus: [BANK.cards] }, { cue: 42, region: BANK.list, focus: [BANK.firstCard] }, { cue: 43, region: BANK.list, focus: [BANK.cards] }] },
];

export const map: BuildMapStep[] = [
  { cue: 13, part: 0, current: [...CARD_ZONE], units: { cards: "PAN only here" } },
  { cue: 55, part: 0, current: [...CARD_ZONE], units: { cards: "card numbers" } },
];
