import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 4: where a card number may live. One story carries it: a coat check.
// The shop that keeps card numbers everywhere (cues 0–10), the rulebook (11–13), the coat check (14–19),
// the card zone and its two doors (20–31), ecom's smaller check (32–36), one check on the laptop (37–40), the close (41–44).
const CARD_ZONE = ["frame", "card", "bin", "adapters", "cardsinfra"] as const;

const SHOP = { shop: [0, 0], orders: [1.2, 1] } as const;
const SPREAD = { ...SHOP, reporting: [2.6, 0], backup: [2.6, 2], laptop: [0, 2] } as const;
const SPREAD_EDGES = [
  { from: "shop", to: "orders" },
  { from: "orders", to: "reporting" },
  { from: "orders", to: "backup" },
  { from: "laptop", to: "orders" },
] as const;
const CHECKED = { label: "Checked: everything", from: [0, 0], to: [2.6, 2], tone: "danger" } as const;

const COAT = { lockedRoom: [2.8, 1], shop: [0, 0], reporting: [0, 1], laptop: [0, 2] } as const;
const ROOM_WALL = { label: "Locked room", from: [2.8, 1], to: [2.8, 1], tone: "wall" } as const;
const TICKETS = (["shop", "reporting", "laptop"] as const).map((to, k) => ({ from: "lockedRoom" as const, to, label: "ticket", delay: 15 + k * 20 }));

const DOORS = { buyer: [0, 0], app: [0, 2], ingress: [1.6, 0], partnerdoor: [1.6, 2], card: [3, 0.6], cardsPostgres: [3, 2] } as const;
const DOOR_EDGES = [
  { from: "buyer", to: "ingress" },
  { from: "ingress", to: "card" },
  { from: "app", to: "partnerdoor" },
  { from: "partnerdoor", to: "card" },
  { from: "card", to: "cardsPostgres" },
] as const;
const ZONE_WALL = { label: "Card zone", from: [1.6, 0], to: [3, 2], tone: "wall" } as const;

const ECOM = { app: [0, 1], postgres: [0, 0], laptop: [0, 2], partnerdoor: [1.6, 1], card: [3, 1] } as const;
const ECOM_EDGES = [{ from: "app", to: "partnerdoor" }, { from: "partnerdoor", to: "card" }, { from: "app", to: "postgres" }, { from: "laptop", to: "app" }] as const;
const ECOM_WALL = { label: "Card zone", from: [1.6, 1], to: [3, 1], tone: "wall" } as const;

const BUILDING = { card: [1.5, 1], bank: [0.2, 0.2], assessor: [2.8, 0.2] } as const;
const BUILDING_FRAMES = [
  { label: "Card zone · we deliver", from: [1.5, 1], to: [1.5, 1], tone: "wall" },
  { label: "The bank's building", from: [0.2, 0.2], to: [2.8, 1.8] },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // The shop that keeps card numbers.
  { cue: 0, layout: { shop: [0.5, 1], orders: [2.5, 1] }, edges: [{ from: "shop", to: "orders" }], packets: [{ from: "shop", to: "orders", label: "card number" }] },
  { cue: 1, layout: { shop: [0.5, 1], orders: [2.5, 1] }, edges: [{ from: "shop", to: "orders" }], badges: { orders: "for refunds" } },
  { cue: 3, layout: SHOP, edges: [{ from: "shop", to: "orders" }], badges: { orders: "card numbers" } },
  { cue: 4, layout: { ...SHOP, reporting: SPREAD.reporting }, edges: SPREAD_EDGES.slice(0, 2), packets: [{ from: "orders", to: "reporting", label: "card number" }] },
  { cue: 5, layout: { ...SHOP, reporting: SPREAD.reporting, backup: SPREAD.backup }, edges: SPREAD_EDGES.slice(0, 3), packets: [{ from: "orders", to: "backup", label: "card number" }] },
  { cue: 6, layout: SPREAD, edges: [...SPREAD_EDGES], packets: [{ from: "orders", to: "laptop", label: "card number" }] },
  {
    cue: 7,
    layout: SPREAD,
    edges: [...SPREAD_EDGES],
    frames: [CHECKED],
    danger: ["shop", "orders", "reporting", "backup", "laptop"],
    shake: { reporting: 0.3, backup: 0.45, laptop: 0.6 },
  },
  { cue: 8, layout: SPREAD, edges: [...SPREAD_EDGES], frames: [CHECKED], danger: ["shop", "orders", "reporting", "backup", "laptop"], badges: { shop: "fee change: wait" } },
  {
    cue: 9,
    layout: { ...SPREAD, attacker: [3.4, 1] },
    edges: [...SPREAD_EDGES],
    frames: [CHECKED],
    danger: ["laptop"],
    crossed: ["laptop"],
    packets: [{ from: "laptop", to: "attacker", label: "every card", delay: 40 }],
  },
  // The rulebook.
  { cue: 11, layout: { chd: [2, 1] }, badges: { chd: "PCI DSS" } },
  {
    cue: 12,
    layout: { chd: [2, 1], laptop: [0.4, 1] },
    edges: [{ from: "laptop", to: "chd", label: "can reach" }],
    frames: [{ label: "Checked", from: [0.4, 1], to: [2, 1], tone: "danger" }],
    badges: { chd: "touches" },
  },
  { cue: 13, layout: { chd: [2.6, 1], laptop: [0.4, 1] }, frames: [{ label: "Checked", from: [2.6, 1], to: [2.6, 1], tone: "danger" }] },
  // The coat check.
  { cue: 14, layout: { lockedRoom: COAT.lockedRoom }, frames: [ROOM_WALL] },
  { cue: 15, layout: COAT, frames: [ROOM_WALL], packets: TICKETS },
  { cue: 16, layout: COAT, frames: [ROOM_WALL], badges: { shop: "ticket", reporting: "ticket", laptop: "ticket" } },
  { cue: 18, layout: COAT, frames: [ROOM_WALL], packets: TICKETS.map((p) => ({ ...p, label: "card token" })), badges: { lockedRoom: "card numbers" } },
  { cue: 19, layout: COAT, frames: [ROOM_WALL], accent: ["lockedRoom"], badges: { lockedRoom: "full check" } },
  // The card zone shares nothing.
  {
    cue: 21,
    layout: { card: [2, 1], cardsPostgres: [3, 0], cardsVault: [3, 1], cardsKeycloak: [3, 2] },
    edges: [{ from: "card", to: "cardsPostgres" }, { from: "card", to: "cardsVault" }, { from: "card", to: "cardsKeycloak" }],
    frames: [{ label: "Card zone", from: [2, 0], to: [3, 2], tone: "wall" }],
    shake: { cardsPostgres: 0.35, cardsVault: 0.55, cardsKeycloak: 0.8 },
  },
  {
    cue: 22,
    layout: { app: [0, 1], postgres: [0, 0], vault: [0, 2], card: [2, 1], cardsPostgres: [3, 0], cardsVault: [3, 1], cardsKeycloak: [3, 2] },
    edges: [{ from: "app", to: "postgres" }, { from: "app", to: "vault" }, { from: "card", to: "cardsPostgres" }, { from: "card", to: "cardsVault" }, { from: "card", to: "cardsKeycloak" }],
    frames: [{ label: "Card zone", from: [2, 0], to: [3, 2], tone: "wall" }],
    badges: { app: "ecom" },
  },
  // Two doors.
  { cue: 23, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], accent: ["ingress", "partnerdoor"] },
  { cue: 24, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], accent: ["ingress"], packets: [{ from: "buyer", to: "ingress", label: "card form" }] },
  { cue: 25, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], accent: ["partnerdoor"], packets: [{ from: "app", to: "partnerdoor", label: "card token" }] },
  {
    cue: 26,
    layout: DOORS,
    edges: [...DOOR_EDGES],
    frames: [ZONE_WALL],
    packets: [{ from: "buyer", to: "ingress", label: "card number" }, { from: "ingress", to: "card", label: "card number", delay: 55 }],
  },
  {
    cue: 27,
    layout: { ...DOORS, attacker: [0, 1] },
    edges: [...DOOR_EDGES],
    frames: [ZONE_WALL],
    packets: [{ from: "attacker", to: "cardsPostgres", label: "?", delay: 30, stopAt: 0.3 }],
    badges: { cardsPostgres: "unreachable" },
  },
  // ecom holds tickets.
  { cue: 28, layout: ECOM, edges: [...ECOM_EDGES], frames: [ECOM_WALL], badges: { app: "tokens only" } },
  {
    cue: 29,
    layout: ECOM,
    edges: [...ECOM_EDGES],
    frames: [ECOM_WALL],
    packets: [{ from: "app", to: "partnerdoor", label: "charge ctk_…" }, { from: "card", to: "partnerdoor", label: "card number", delay: 70, stopAt: 0.25 }],
  },
  { cue: 30, layout: ECOM, edges: [...ECOM_EDGES], frames: [ECOM_WALL], badges: { postgres: "tokens", laptop: "tokens" }, accent: ["app"] },
  // The close: the bank's building around the card zone.
  { cue: 42, layout: BUILDING, frames: [...BUILDING_FRAMES] },
  { cue: 43, layout: BUILDING, frames: [...BUILDING_FRAMES], accent: ["card"] },
];

export const map: BuildMapStep[] = [
  { cue: 20, part: 1, current: [...CARD_ZONE], units: { cards: "card zone" } },
  { cue: 32, part: 1, current: [...CARD_ZONE], units: { cards: "full check" } },
  { cue: 33, part: 1, current: [...CARD_ZONE], units: { cards: "full check", ecom: "smaller check" } },
  { cue: 34, part: 1, current: ["frame", "payment"], units: { cards: "full check", ecom: "smaller check" } },
  { cue: 37, part: 1, current: [...CARD_ZONE], units: { cards: "card zone" } },
  { cue: 41, part: 1, current: [...CARD_ZONE], units: { cards: "card numbers", ecom: "tokens" } },
  { cue: 44, part: 1 },
];

// The one hands-on check: what the card zone publishes (elided rows are the other services).
export const code: CodeStep[] = [
  {
    cue: 38,
    file: "terminal · cards-infra",
    lines: [
      "$ docker compose -p cards ps --format 'table {{.Service}}\\t{{.Ports}}'",
      "SERVICE          PORTS",
      "…",
      "cards-ingress    127.0.0.1:8443->8443/tcp",
      "…",
      "cards-partner    127.0.0.1:9443->8443/tcp",
      "…",
      "postgres         5432/tcp",
      "…",
    ],
    small: true,
    upTo: 1,
    beats: [{ cue: 39 }, { cue: 40, highlight: [4, 6, 8] }],
  },
];
