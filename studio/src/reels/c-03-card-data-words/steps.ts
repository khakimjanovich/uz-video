import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";
import { BANK, PAY } from "../../series/build/screens-m01";

// Lesson 3: what you may keep about a card. One story carries it: Bekzod pastes a buyer's card number into a support ticket.
// The pasted number (cues 0–4), the bridge from lesson 2 (5–6), where it spreads (7–9), Dilnoza's reply and the bank's phone call (10–16),
// the PAN (17–20), the code on the back (21–23), the masked number (24–28), the card token (29–33), three rules (34–38),
// the product (39–48), why Dilnoza never needed it (49–53), the backups keep it anyway (54–56), next (57).
const CARD_ZONE = ["frame", "card", "bin", "adapters", "cardsinfra"] as const;
const MESSAGE = { buyer: [0.5, 1], shop: [2.5, 1] } as const;
const MESSAGE_EDGE = [{ from: "buyer", to: "shop" }] as const;
const FORWARD = { shop: [0.4, 1], m01Engineer: [2.6, 1] } as const;
const CALL = { issuer: [0.6, 1], masked: [2.6, 1] } as const;
const SAYS = [{ from: "issuer", to: "masked", label: "says" }] as const;
const PASTE = { m01Engineer: [0.4, 1], supportTicket: [2.6, 1] } as const;
const PASTE_EDGE = [{ from: "m01Engineer", to: "supportTicket" }] as const;
const SPREAD = { supportTicket: [0.3, 1], backup: [2.6, 0], searchIndex: [2.6, 1], readers: [2.6, 2] } as const;
const SPREAD_EDGES = (["backup", "searchIndex", "readers"] as const).map((to) => ({ from: "supportTicket" as const, to }));
const COPIES = SPREAD_EDGES.map((e, k) => ({ ...e, label: "card number", delay: 10 + k * 25 }));
const REPLY = { bankStaff: [0.4, 1], m01Engineer: [2.6, 1] } as const;
const WORDS = { pan: [0, 1], masked: [1.5, 1], m01Token: [3, 1] } as const;
const RULES = { pan: [0, 0.6], masked: [1.5, 0.6], m01Token: [3, 0.6], backCode: [1.5, 2.1] } as const;
const MASK = { pan: [0.4, 1], masked: [2.6, 1] } as const;
const MASK_EDGE = [{ from: "pan", to: "masked", label: "first 6 · last 4" }] as const;
const TOKEN = { pan: [0, 1], m01CardZone: [1.5, 1], m01Token: [3, 1] } as const;
const TOKEN_EDGES = [{ from: "pan", to: "m01CardZone" }, { from: "m01CardZone", to: "m01Token", label: "random" }] as const;
const TWO = { m01CardZone: [0.4, 1], m01Token: [2.6, 0.3], m01Token2: [2.6, 1.7] } as const;
const ROOM = { masked: [0.4, 0.3], m01Token: [0.4, 1.7], m01CardZone: [2.8, 1] } as const;
const ROOM_WALL = { label: "Card zone", from: [2.8, 1], to: [2.8, 1], tone: "wall" } as const;
const ZONE_WALL = { label: "Card zone", from: [0, 1], to: [0, 1], tone: "wall" } as const;
const FIXED = { supportTicket: [0, 1], masked: [1.7, 0.2], m01Token: [1.7, 1.8], pan: [3, 1] } as const;
const FIXED_EDGES = [{ from: "supportTicket", to: "masked" }, { from: "supportTicket", to: "m01Token" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Tuesday: a buyer sends Malika the whole card number, and Bekzod pastes it into a ticket.
  { cue: 0, layout: MESSAGE, edges: [...MESSAGE_EDGE], badges: { shop: "Tue 10:00" } },
  { cue: 1, layout: MESSAGE, edges: [...MESSAGE_EDGE], packets: [{ from: "buyer", to: "shop", label: "payment failed" }] },
  { cue: 2, layout: MESSAGE, edges: [...MESSAGE_EDGE], danger: ["shop"], badges: { shop: "all 16 digits" } },
  { cue: 3, layout: FORWARD, edges: [{ from: "shop", to: "m01Engineer" }], packets: [{ from: "shop", to: "m01Engineer", label: "card number" }], badges: { m01Engineer: "Bekzod" } },
  { cue: 4, layout: PASTE, edges: [...PASTE_EDGE], packets: [{ from: "m01Engineer", to: "supportTicket", label: "whole card number" }], badges: { m01Engineer: "Bekzod" } },
  // Where one paste spreads.
  { cue: 7, layout: PASTE, edges: [...PASTE_EDGE], danger: ["supportTicket"], badges: { supportTicket: "lives here now" } },
  { cue: 8, layout: SPREAD, edges: SPREAD_EDGES, packets: COPIES, danger: ["supportTicket"] },
  { cue: 9, layout: SPREAD, edges: SPREAD_EDGES, danger: ["supportTicket", "backup", "searchIndex", "readers"], badges: { supportTicket: "never built to guard" } },
  // Dilnoza's reply, and how a bank talks on the phone.
  { cue: 10, layout: { bankStaff: [0.4, 1], supportTicket: [2.6, 1] }, edges: [{ from: "bankStaff", to: "supportTicket" }], badges: { bankStaff: "Dilnoza" } },
  { cue: 11, layout: REPLY, edges: [{ from: "bankStaff", to: "m01Engineer" }], packets: [{ from: "bankStaff", to: "m01Engineer", label: "last four only" }], badges: { bankStaff: "Dilnoza" } },
  { cue: 12, layout: CALL, edges: [...SAYS], badges: { masked: "card ending 7890" } },
  { cue: 13, layout: { ...CALL, pan: [1.6, 2.2] }, edges: [...SAYS], crossed: ["pan"], badges: { pan: "never read out" } },
  { cue: 14, layout: { ...CALL, backCode: [1.6, 2.2] }, edges: [...SAYS], crossed: ["backCode"], badges: { backCode: "never asked" } },
  { cue: 15, layout: { attacker: [1.5, 1] }, crossed: ["attacker"], badges: { attacker: "a hacked server?" } },
  { cue: 16, layout: PASTE, edges: [...PASTE_EDGE], danger: ["m01Engineer"], badges: { m01Engineer: "a helpful person", supportTicket: "a text box" } },
  // The words: the PAN first.
  { cue: 17, layout: WORDS, accent: ["pan", "masked", "m01Token"] },
  { cue: 18, layout: { pan: [1.5, 1] }, accent: ["pan"], badges: { pan: "the long number" } },
  { cue: 19, layout: { pan: [0.5, 1], attacker: [2.5, 1] }, edges: [{ from: "attacker", to: "pan", label: "wants" }], danger: ["pan"], badges: { attacker: "needs it most" } },
  // The code on the back.
  { cue: 21, layout: { backCode: [1.5, 1] }, badges: { backCode: "security code" } },
  { cue: 22, layout: { backCode: [1.5, 1] }, crossed: ["backCode"], badges: { backCode: "not kept once approved" } },
  { cue: 23, layout: { backCode: [1.5, 1] }, crossed: ["backCode"], badges: { backCode: "never even asked" } },
  // The masked number.
  { cue: 24, layout: { masked: [1.5, 1] }, accent: ["masked"], badges: { masked: "screens · reports" } },
  { cue: 25, layout: MASK, edges: [...MASK_EDGE], packets: [{ from: "pan", to: "masked", label: "stars between" }] },
  { cue: 26, layout: MASK, edges: [...MASK_EDGE], badges: { masked: "first 6: the bank" } },
  { cue: 27, layout: MASK, edges: [...MASK_EDGE], badges: { masked: "last 4: your card" } },
  {
    cue: 28,
    layout: { masked: [0.5, 1], attacker: [2.5, 1] },
    edges: [{ from: "masked", to: "attacker" }],
    packets: [{ from: "masked", to: "attacker", label: "pay?", stopAt: 0.55 }],
    badges: { masked: "cannot pay" },
  },
  // The card token.
  { cue: 29, layout: { m01Ecom: [0.5, 1], m01Token: [2.5, 1] }, edges: [{ from: "m01Ecom", to: "m01Token", label: "keeps" }], accent: ["m01Token"], badges: { m01Ecom: "charge it later" } },
  { cue: 30, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "m01CardZone", to: "m01Token", label: "random name" }], accent: ["m01Token"] },
  { cue: 31, layout: TOKEN, edges: [...TOKEN_EDGES], badges: { m01Token: "nothing from the number" } },
  {
    cue: 32,
    layout: TWO,
    edges: [{ from: "m01CardZone", to: "m01Token" }, { from: "m01CardZone", to: "m01Token2" }],
    packets: [{ from: "m01CardZone", to: "m01Token", label: "token" }, { from: "m01CardZone", to: "m01Token2", label: "token", delay: 30 }],
    badges: { m01Token2: "share nothing" },
  },
  {
    cue: 33,
    layout: { ...TOKEN, attacker: [3, 2.2] },
    edges: [...TOKEN_EDGES, { from: "m01Token", to: "attacker" }],
    packets: [{ from: "m01Token", to: "attacker", label: "?", stopAt: 0.5 }],
    badges: { attacker: "learns nothing" },
  },
  // Three words, three rules.
  { cue: 34, layout: WORDS },
  { cue: 35, layout: WORDS, frames: [ZONE_WALL], accent: ["pan"], badges: { pan: "card zone only" } },
  { cue: 36, layout: WORDS, frames: [ZONE_WALL], accent: ["masked"], badges: { masked: "may be shown" } },
  { cue: 37, layout: WORDS, frames: [ZONE_WALL], accent: ["m01Token"], badges: { m01Token: "may be kept" } },
  { cue: 38, layout: RULES, frames: [{ ...ZONE_WALL, from: [0, 0.6], to: [0, 0.6] }], crossed: ["backCode"], badges: { backCode: "kept by no one" } },
  // Why Dilnoza never needed the PAN.
  { cue: 49, layout: { bankStaff: [0.5, 1], pan: [2.5, 1] }, crossed: ["pan"], badges: { bankStaff: "Dilnoza" } },
  { cue: 50, layout: { bankStaff: [0.4, 1], masked: [2.6, 1] }, edges: [{ from: "bankStaff", to: "masked" }], accent: ["masked"], badges: { masked: "finds the payment" } },
  { cue: 51, layout: WORDS, accent: ["masked", "m01Token"], badges: { masked: "nothing to spend", m01Token: "nothing to spend" } },
  { cue: 52, layout: { pan: [0.5, 1], attacker: [2.5, 1] }, edges: [{ from: "pan", to: "attacker" }], packets: [{ from: "pan", to: "attacker", label: "spend" }], danger: ["pan"] },
  { cue: 53, layout: ROOM, frames: [ROOM_WALL], accent: ["masked", "m01Token"], badges: { m01CardZone: "the PAN" } },
  // Deleted from the ticket, kept by the backups.
  { cue: 54, layout: PASTE, edges: [...PASTE_EDGE], crossed: ["supportTicket"], badges: { supportTicket: "number deleted" } },
  { cue: 55, layout: SPREAD, edges: SPREAD_EDGES, crossed: ["supportTicket"], danger: ["backup"], badges: { backup: "still there" } },
  { cue: 56, layout: FIXED, edges: [...FIXED_EDGES], accent: ["masked", "m01Token"], crossed: ["pan"], badges: { supportTicket: "never paste it" } },
];

// The product: the card form with no code box, the short card line, the bank's Card column.
const SHOT = "screens/c-03-card-data-words";
export const screens: ScreenStep[] = [
  { cue: 39, src: `${SHOT}/pay-card.png`, title: PAY.cardTitle, region: PAY.top, focus: [PAY.header] },
  {
    cue: 40,
    src: `${SHOT}/pay-card.png`,
    title: PAY.cardTitle,
    region: PAY.frame,
    focus: [PAY.frameBox],
    beats: [{ cue: 41, region: PAY.frame, focus: [PAY.fields] }, { cue: 42, region: PAY.frame }],
  },
  { cue: 43, src: `${SHOT}/pay-typed.png`, title: PAY.cardTitle, region: PAY.frame, focus: [PAY.fields] },
  { cue: 44, src: `${SHOT}/pay-debiting.png`, title: PAY.title, region: PAY.status, focus: [PAY.cardLine] },
  { cue: 45, src: `${SHOT}/admin-payments.png`, title: BANK.title, region: BANK.list, beats: [{ cue: 46, region: BANK.list, focus: [BANK.cards] }, { cue: 47, region: BANK.list, focus: [BANK.firstCard] }, { cue: 48, region: BANK.list, focus: [BANK.cards] }] },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the one before.
  { cue: 5, part: 1, current: ["payment", "procport", "card", "procsvc"], units: { cards: "enough to pay" } },
  { cue: 6, part: 1, current: [...CARD_ZONE], units: { cards: "card data" } },
  { cue: 20, part: 1, current: [...CARD_ZONE], units: { cards: "PAN only here" } },
  { cue: 57, part: 1, current: [...CARD_ZONE], units: { cards: "card numbers" } },
];
