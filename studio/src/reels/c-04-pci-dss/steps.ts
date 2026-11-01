import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 4: where a card number may live. One story carries it: a coat check.
// The shop that keeps card numbers everywhere (cues 0–7), the rulebook (8–10), the coat check (11–14),
// the card zone and its two doors (15–19), ecom's smaller check (20–21), the bank's building (22–23), the close (24).
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

const COAT = { lockedRoom: [2.8, 1], shop: [0, 0], reporting: [0, 1], laptop: [0, 2] } as const;
const ROOM_WALL = { label: "Locked room", from: [2.8, 1], to: [2.8, 1], tone: "wall" } as const;
const TICKETS = (["shop", "reporting", "laptop"] as const).map((to, k) => ({ from: "lockedRoom" as const, to, label: "ticket", delay: 15 + k * 20 }));

const OWN = { m01CardZone: [1.2, 1], m01OwnDb: [2.8, 0], m01OwnKeys: [2.8, 1], m01OwnLogins: [2.8, 2] } as const;
const OWN_EDGES = (["m01OwnDb", "m01OwnKeys", "m01OwnLogins"] as const).map((to) => ({ from: "m01CardZone" as const, to }));

const DOORS = { buyer: [0, 0], m01Ecom: [0, 2], ingress: [1.6, 0], partnerdoor: [1.6, 2], m01CardZone: [3, 1] } as const;
const DOOR_EDGES = [
  { from: "buyer", to: "ingress" },
  { from: "ingress", to: "m01CardZone" },
  { from: "m01Ecom", to: "partnerdoor" },
  { from: "partnerdoor", to: "m01CardZone" },
] as const;
const ZONE_WALL = { label: "Card zone", from: [1.6, 0], to: [3, 2], tone: "wall" } as const;

const ECOM = { m01Ecom: [0, 1], reporting: [0, 0], laptop: [0, 2], partnerdoor: [1.6, 1], m01CardZone: [3, 1] } as const;
const ECOM_EDGES = [{ from: "m01Ecom", to: "partnerdoor" }, { from: "partnerdoor", to: "m01CardZone" }, { from: "m01Ecom", to: "reporting" }, { from: "laptop", to: "m01Ecom" }] as const;
const ECOM_WALL = { label: "Card zone", from: [1.6, 1], to: [3, 1], tone: "wall" } as const;

const BUILDING = { m01CardZone: [1.8, 1.2], bank: [0.4, 0.6] } as const;
const BUILDING_FRAMES = [
  { label: "Card zone · we deliver", from: [1.8, 1.2], to: [1.8, 1.2], tone: "wall" },
  { label: "The bank's building", from: [0, 0], to: [3, 2] },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // The shop that keeps card numbers.
  { cue: 0, layout: { shop: [0.5, 1], orders: [2.5, 1] }, edges: [{ from: "shop", to: "orders" }], packets: [{ from: "shop", to: "orders", label: "card number" }] },
  { cue: 1, layout: { shop: [0.5, 1], orders: [2.5, 1] }, edges: [{ from: "shop", to: "orders" }], badges: { orders: "for refunds" } },
  { cue: 2, layout: SHOP, edges: [{ from: "shop", to: "orders" }], badges: { orders: "card numbers" } },
  { cue: 3, layout: { ...SHOP, reporting: SPREAD.reporting }, edges: SPREAD_EDGES.slice(0, 2), packets: [{ from: "orders", to: "reporting", label: "card number" }] },
  { cue: 4, layout: { ...SHOP, reporting: SPREAD.reporting, backup: SPREAD.backup }, edges: SPREAD_EDGES.slice(0, 3), packets: [{ from: "orders", to: "backup", label: "card number" }] },
  { cue: 5, layout: SPREAD, edges: [...SPREAD_EDGES], packets: [{ from: "orders", to: "laptop", label: "card number" }] },
  { cue: 6, layout: SPREAD, edges: [...SPREAD_EDGES], frames: [CHECKED], danger: [...ALL], shake: { reporting: 0.3, backup: 0.45, laptop: 0.6 } },
  {
    cue: 7,
    layout: { ...SPREAD, attacker: [3.1, 1] },
    edges: [...SPREAD_EDGES],
    frames: [CHECKED],
    danger: ["laptop"],
    crossed: ["laptop"],
    packets: [{ from: "laptop", to: "attacker", label: "every card", delay: 30 }],
  },
  // The rulebook.
  { cue: 8, layout: { chd: [1.5, 1] }, badges: { chd: "one rulebook" } },
  {
    cue: 9,
    layout: { chd: [2.4, 1], laptop: [0.4, 1] },
    edges: [{ from: "laptop", to: "chd", label: "can reach" }],
    frames: [{ label: "Checked", from: [0.4, 1], to: [2.4, 1], tone: "danger" }],
    badges: { chd: "PCI DSS" },
  },
  { cue: 10, layout: { chd: [2.4, 1] }, frames: [{ label: "Checked", from: [2.4, 1], to: [2.4, 1], tone: "danger" }], badges: { chd: "less to check" } },
  // The coat check.
  { cue: 11, layout: { lockedRoom: COAT.lockedRoom }, frames: [ROOM_WALL] },
  { cue: 12, layout: COAT, frames: [ROOM_WALL], packets: TICKETS },
  { cue: 13, layout: { ...COAT, attacker: [1.4, 2] }, edges: [{ from: "laptop", to: "attacker" }], frames: [ROOM_WALL], packets: [{ from: "laptop", to: "attacker", label: "ticket" }], badges: { attacker: "no coat" } },
  { cue: 14, layout: COAT, frames: [ROOM_WALL], packets: TICKETS.map((p) => ({ ...p, label: "card token" })), badges: { lockedRoom: "card numbers" } },
  // The card zone shares nothing.
  { cue: 16, layout: OWN, edges: OWN_EDGES, frames: [{ label: "Card zone", from: [1.2, 0], to: [2.8, 2], tone: "wall" }], shake: { m01OwnDb: 0.2, m01OwnKeys: 0.35, m01OwnLogins: 0.5 } },
  // Two doors.
  { cue: 17, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], accent: ["ingress", "partnerdoor"] },
  { cue: 18, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], packets: [{ from: "buyer", to: "ingress", label: "card" }, { from: "ingress", to: "m01CardZone", label: "card", delay: 55 }] },
  // ecom holds tickets.
  {
    cue: 19,
    layout: ECOM,
    edges: [...ECOM_EDGES],
    frames: [ECOM_WALL],
    packets: [{ from: "m01Ecom", to: "partnerdoor", label: "card token" }],
    badges: { m01Ecom: "tickets only", reporting: "tickets", laptop: "tickets" },
  },
  // The bank's building around the card zone.
  { cue: 22, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { bank: "guards · firewalls" } },
  { cue: 23, layout: BUILDING, frames: [...BUILDING_FRAMES], accent: ["m01CardZone"], badges: { bank: "owns the building" } },
];

export const map: BuildMapStep[] = [
  { cue: 15, part: 1, current: [...CARD_ZONE], units: { cards: "locked room" } },
  { cue: 20, part: 1, current: ["frame", "payment"], units: { cards: "full check", ecom: "smaller check" } },
  { cue: 24, part: 1, current: ["procport"], units: { cards: "card numbers", ecom: "tickets" } },
];
