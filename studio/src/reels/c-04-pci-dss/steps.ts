import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";
import { BANK, PAY } from "../../series/build/screens-m01";

// Lesson 4: where a card number may live. One story carries it: Bekzod wants to keep card numbers in Malika's orders table.
// The idea (cues 0–1), the bridge from lesson 3 (2–3), where the numbers spread (4–10), the rulebook (11–17), shrink the check (18–21),
// Timur's card zone and its two doors (22–28), one payment through the room (29–40), ecom's smaller check (41–44),
// the bank's building (45–50), what it protects (51–52), Bekzod drops the idea (53–55), next (56).
const CARD_ZONE = ["frame", "card", "bin", "adapters", "cardsinfra"] as const;

const SHOP = { shop: [0, 0], orders: [1.2, 1] } as const;
const SPREAD = { ...SHOP, reporting: [2.6, 0], backup: [2.6, 2], laptop: [0, 2] } as const;
const SPREAD_EDGES = [
  { from: "shop", to: "orders" },
  { from: "orders", to: "reporting" },
  { from: "orders", to: "backup" },
  { from: "laptop", to: "orders" },
] as const;
const ALL = ["shop", "orders", "reporting", "backup", "laptop"] as const;
const CHECKED = { label: "Checked: everything", from: [0, 0], to: [2.6, 2], tone: "danger" } as const;

const ROOM = { lockedRoom: [2.8, 1], shop: [0, 0], reporting: [0, 1], laptop: [0, 2] } as const;
const ROOM_WALL = { label: "Locked room", from: [2.8, 1], to: [2.8, 1], tone: "wall" } as const;
const TOKENS = (["shop", "reporting", "laptop"] as const).map((to, k) => ({ from: "lockedRoom" as const, to, label: "card token", delay: 15 + k * 20 }));

const OWN = { m01CardZone: [1.2, 1], m01OwnDb: [2.8, 0], m01OwnKeys: [2.8, 1], m01OwnLogins: [2.8, 2] } as const;
const OWN_EDGES = (["m01OwnDb", "m01OwnKeys", "m01OwnLogins"] as const).map((to) => ({ from: "m01CardZone" as const, to }));
const OWN_WALL = { label: "Card zone", from: [1.2, 0], to: [2.8, 2], tone: "wall" } as const;

const DOORS = { buyer: [0, 0], m01Ecom: [0, 2], ingress: [1.6, 0], partnerdoor: [1.6, 2], m01CardZone: [3, 1] } as const;
const DOOR_EDGES = [
  { from: "buyer", to: "ingress" },
  { from: "ingress", to: "m01CardZone" },
  { from: "m01Ecom", to: "partnerdoor" },
  { from: "partnerdoor", to: "m01CardZone" },
] as const;
const ZONE_WALL = { label: "Card zone", from: [1.6, 0], to: [3, 2], tone: "wall" } as const;

const PATH = { buyer: [0, 0.4], ingress: [1.5, 0.4], m01CardZone: [3, 0.4], m01Ecom: [1.5, 2] } as const;
const PATH_EDGES = [{ from: "buyer", to: "ingress" }, { from: "ingress", to: "m01CardZone" }] as const;
const CHARGE = { m01Ecom: [0, 1], partnerdoor: [1.5, 1], m01CardZone: [3, 1] } as const;
const CHARGE_EDGES = [{ from: "m01Ecom", to: "partnerdoor" }, { from: "partnerdoor", to: "m01CardZone" }] as const;

const RUN = { buyer: [0, 0], m01Ecom: [0, 2], ingress: [1.1, 0], partnerdoor: [1.1, 2], m01CardZone: [2.1, 1], m01OwnDb: [3.1, 1] } as const;
const RUN_EDGES = [...DOOR_EDGES, { from: "m01CardZone", to: "m01OwnDb" }] as const;
const RUN_WALL = { label: "Card zone", from: [1.1, 0], to: [3.1, 2], tone: "wall" } as const;

const SMALL = { m01Ecom: [0.3, 1], m01Frame: [2.4, 0.3], m01Token: [2.4, 1.8] } as const;
const SMALL_EDGES = [{ from: "m01Ecom", to: "m01Frame", label: "shows" }, { from: "m01Ecom", to: "m01Token", label: "uses" }] as const;

const BUILDING = { m01CardZone: [1.8, 1.2], bank: [0.4, 0.6] } as const;
const BUILDING_FRAMES = [
  { label: "Card zone · we deliver", from: [1.8, 1.2], to: [1.8, 1.2], tone: "wall" },
  { label: "The bank's building", from: [0, 0], to: [3, 2] },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Bekzod's idea: keep card numbers, just in case.
  { cue: 0, layout: { m01Engineer: [0.5, 1], orders: [2.5, 1] }, edges: [{ from: "m01Engineer", to: "orders" }], badges: { m01Engineer: "Bekzod · Wed" } },
  { cue: 1, layout: { shop: [0.5, 1], orders: [2.5, 1] }, edges: [{ from: "shop", to: "orders" }], packets: [{ from: "shop", to: "orders", label: "card number" }], badges: { orders: "for refunds" } },
  // The numbers spread.
  { cue: 4, layout: { shop: [0.5, 1], orders: [2.5, 1] }, edges: [{ from: "shop", to: "orders" }], badges: { orders: "seems harmless" } },
  { cue: 5, layout: SHOP, edges: [{ from: "shop", to: "orders" }], badges: { orders: "card numbers" } },
  { cue: 6, layout: { ...SHOP, reporting: SPREAD.reporting }, edges: SPREAD_EDGES.slice(0, 2), packets: [{ from: "orders", to: "reporting", label: "card number" }], badges: { reporting: "every morning" } },
  { cue: 7, layout: { ...SHOP, reporting: SPREAD.reporting, backup: SPREAD.backup }, edges: SPREAD_EDGES.slice(0, 3), packets: [{ from: "orders", to: "backup", label: "card number" }], badges: { backup: "every night" } },
  { cue: 8, layout: SPREAD, edges: [...SPREAD_EDGES], packets: [{ from: "orders", to: "laptop", label: "card number" }], badges: { laptop: "Bekzod's" } },
  { cue: 9, layout: SPREAD, edges: [...SPREAD_EDGES], frames: [CHECKED], danger: [...ALL], shake: { reporting: 0.3, backup: 0.45, laptop: 0.6 } },
  {
    cue: 10,
    layout: { ...SPREAD, attacker: [3.1, 1] },
    edges: [...SPREAD_EDGES],
    frames: [CHECKED],
    danger: ["laptop"],
    crossed: ["laptop"],
    packets: [{ from: "laptop", to: "attacker", label: "every card", delay: 30 }],
  },
  // The rulebook.
  { cue: 11, layout: { chd: [1.5, 1] }, badges: { chd: "one rulebook" } },
  { cue: 12, layout: { chd: [1.5, 1] }, accent: ["chd"], badges: { chd: "PCI DSS" } },
  { cue: 13, layout: { chd: [1.5, 1] }, accent: ["chd"], badges: { chd: "stores · handles · sends" } },
  {
    cue: 14,
    layout: { chd: [2.4, 1], laptop: [0.4, 1] },
    edges: [{ from: "laptop", to: "chd", label: "connected" }],
    frames: [{ label: "Checked", from: [0.4, 1], to: [2.4, 1], tone: "danger" }],
  },
  { cue: 15, layout: { chd: [1.5, 1] }, frames: [{ label: "Checked", from: [1.5, 1], to: [1.5, 1], tone: "danger" }], badges: { chd: "network · logins · logs" } },
  { cue: 16, layout: SPREAD, edges: [...SPREAD_EDGES], frames: [CHECKED], danger: ["reporting", "backup", "laptop"] },
  { cue: 17, layout: SPREAD, edges: [...SPREAD_EDGES], frames: [CHECKED], danger: [...ALL], badges: { orders: "a bigger check" } },
  // Shrink what gets checked: one locked room, tokens everywhere else.
  { cue: 18, layout: SPREAD, edges: [...SPREAD_EDGES], frames: [CHECKED], danger: [...ALL], badges: { orders: "pass it all?" } },
  { cue: 19, layout: { chd: [2.4, 1] }, frames: [{ label: "Checked", from: [2.4, 1], to: [2.4, 1], tone: "danger" }], badges: { chd: "less to check" } },
  { cue: 20, layout: ROOM, frames: [ROOM_WALL] },
  { cue: 21, layout: ROOM, frames: [ROOM_WALL], packets: TOKENS, badges: { lockedRoom: "never the number" } },
  // Timur's card zone: its own parts, two doors, a database with no door.
  { cue: 23, layout: OWN, edges: OWN_EDGES, frames: [OWN_WALL], shake: { m01OwnDb: 0.2, m01OwnKeys: 0.45, m01OwnLogins: 0.7 } },
  { cue: 24, layout: OWN, edges: OWN_EDGES, frames: [OWN_WALL], badges: { m01CardZone: "shares none with ecom" } },
  { cue: 25, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], accent: ["ingress", "partnerdoor"] },
  { cue: 26, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], packets: [{ from: "buyer", to: "ingress", label: "card" }], badges: { ingress: "the card form" } },
  { cue: 27, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], packets: [{ from: "m01Ecom", to: "partnerdoor", label: "call" }], badges: { partnerdoor: "partner systems" } },
  {
    cue: 28,
    layout: { m01CardZone: [0.8, 1], m01OwnDb: [2.6, 1] },
    edges: [{ from: "m01CardZone", to: "m01OwnDb" }],
    frames: [{ label: "Card zone", from: [0.8, 1], to: [2.6, 1], tone: "wall" }],
    badges: { m01OwnDb: "no door" },
  },
  // One payment through the room.
  { cue: 29, layout: { m01CardZone: [1.5, 1] }, frames: [{ label: "Card zone", from: [1.5, 1], to: [1.5, 1], tone: "wall" }], badges: { m01CardZone: "no screen of its own" } },
  {
    cue: 33,
    layout: PATH,
    edges: [...PATH_EDGES],
    frames: [{ label: "Card zone", from: [1.5, 0.4], to: [3, 0.4], tone: "wall" }],
    packets: [{ from: "buyer", to: "ingress", label: "card" }, { from: "ingress", to: "m01CardZone", label: "card", delay: 50 }],
    crossed: ["m01Ecom"],
    badges: { m01Ecom: "not on the way" },
  },
  {
    cue: 34,
    layout: { m01Page: [0, 1], ingress: [1.5, 1], m01CardZone: [3, 1] },
    edges: [{ from: "m01Page", to: "ingress" }, { from: "ingress", to: "m01CardZone" }],
    frames: [{ label: "Card zone", from: [1.5, 1], to: [3, 1], tone: "wall" }],
    packets: [{ from: "m01CardZone", to: "ingress", label: "token" }, { from: "ingress", to: "m01Page", label: "token", delay: 45 }],
    badges: { m01CardZone: "card locked away" },
  },
  {
    cue: 35,
    layout: CHARGE,
    edges: [...CHARGE_EDGES],
    frames: [{ label: "Card zone", from: [1.5, 1], to: [3, 1], tone: "wall" }],
    packets: [{ from: "m01Ecom", to: "partnerdoor", label: "charge: token" }],
  },
  // The running card zone.
  { cue: 36, layout: RUN, edges: [...RUN_EDGES], frames: [RUN_WALL], badges: { m01CardZone: "Timur's" } },
  {
    cue: 37,
    layout: RUN,
    edges: [...RUN_EDGES],
    frames: [RUN_WALL],
    accent: ["ingress", "partnerdoor"],
    packets: [{ from: "ingress", to: "buyer", label: "answers" }, { from: "partnerdoor", to: "m01Ecom", label: "answers", delay: 30 }],
  },
  { cue: 38, layout: RUN, edges: [...RUN_EDGES], frames: [RUN_WALL], accent: ["m01OwnDb"], badges: { m01OwnDb: "answers nobody" } },
  // ecom holds tokens, and still gets a smaller check.
  { cue: 40, layout: { m01Ecom: [0.4, 1], lockedRoom: [2.6, 1] }, frames: [{ label: "Card zone", from: [2.6, 1], to: [2.6, 1], tone: "wall" }], badges: { m01Ecom: "tokens", lockedRoom: "card numbers" } },
  { cue: 41, layout: { m01Ecom: [1.5, 1] } },
  { cue: 42, layout: { m01Ecom: [1.5, 1] }, frames: [{ label: "Checked", from: [1.5, 1], to: [1.5, 1], tone: "danger" }], badges: { m01Ecom: "still a check" } },
  { cue: 43, layout: SMALL, edges: [...SMALL_EDGES], frames: [{ label: "Checked", from: [0.3, 1], to: [0.3, 1], tone: "danger" }] },
  // The bank's building around the room.
  { cue: 45, layout: { m01CardZone: [1.5, 1] }, frames: [{ label: "Card zone", from: [1.5, 1], to: [1.5, 1], tone: "wall" }], badges: { m01CardZone: "needs a building" } },
  { cue: 46, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { bank: "secured network" } },
  { cue: 47, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { bank: "firewalls · guards" } },
  { cue: 48, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { m01CardZone: "two narrow doors" } },
  { cue: 49, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { m01CardZone: "claims no certificate" } },
  {
    cue: 50,
    layout: { ...BUILDING, assessor: [0.4, 1.9] },
    edges: [{ from: "assessor", to: "m01CardZone" }, { from: "assessor", to: "bank" }],
    frames: [...BUILDING_FRAMES],
    accent: ["assessor"],
    badges: { assessor: "the bank's own" },
  },
  // What it protects.
  {
    cue: 51,
    layout: { m01Ecom: [0.4, 1], attacker: [2.6, 1] },
    edges: [{ from: "m01Ecom", to: "attacker" }],
    packets: [{ from: "m01Ecom", to: "attacker", label: "leak" }],
    badges: { attacker: "no card number" },
  },
  { cue: 52, layout: { buyer: [0, 1], m01Ecom: [1.5, 1], bank: [3, 1] }, accent: ["buyer", "m01Ecom", "bank"], badges: { buyer: "card safe", m01Ecom: "small check", bank: "one small room" } },
  // Bekzod drops the idea: a refund needs the payment, not the card.
  { cue: 53, layout: { m01Engineer: [0.5, 1], orders: [2.5, 1] }, crossed: ["orders"], badges: { m01Engineer: "Bekzod" } },
  {
    cue: 54,
    layout: { wallet: [0.4, 0.8], buyer: [2.6, 0.8], pan: [1.5, 2.2] },
    edges: [{ from: "wallet", to: "buyer" }],
    packets: [{ from: "wallet", to: "buyer", label: "refund" }],
    crossed: ["pan"],
    badges: { pan: "not needed" },
  },
  { cue: 55, layout: BUILDING, frames: [...BUILDING_FRAMES], accent: ["m01CardZone"], badges: { bank: "owns the building" } },
];

// The product: the room's first door inside the bank's page, and masked numbers in the bank's own list.
const SHOT = "screens/c-04-pci-dss";
export const screens: ScreenStep[] = [
  { cue: 30, src: `${SHOT}/pay-card.png`, title: PAY.cardTitle, region: PAY.top, focus: [PAY.header] },
  { cue: 31, src: `${SHOT}/pay-card.png`, title: PAY.cardTitle, region: PAY.frame, focus: [PAY.frameBox] },
  { cue: 32, src: `${SHOT}/pay-typed.png`, title: PAY.cardTitle, region: PAY.frame, focus: [PAY.fields] },
  { cue: 39, src: `${SHOT}/admin-payments.png`, title: BANK.title, region: BANK.list, focus: [BANK.cards] },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the one before.
  { cue: 2, part: 2, current: [...CARD_ZONE], units: { cards: "card numbers only here" } },
  { cue: 3, part: 2, current: [...CARD_ZONE], units: { cards: "the locked room" } },
  { cue: 22, part: 2, current: [...CARD_ZONE], units: { cards: "Timur's locked room" } },
  { cue: 44, part: 2, current: ["frame", "payment"], units: { cards: "full check", ecom: "smaller check" } },
  { cue: 56, part: 2, current: ["frame", "card", "payment"], units: { ecom: "tokens only", cards: "card numbers" } },
];
