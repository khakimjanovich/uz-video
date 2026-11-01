import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 38: the room and the building. The brochure and the assessor (cues 3–10), the room inside the building
// (11–19), the guide and its who-does-what table (20–28), checking each release and the known gaps (29–34),
// two people for money and keys (35–37), the install team and the assessor (38–44), what it protects (45–50).
const ASKED = { m78Firewall: [2, 0.2], m78LoginLogs: [3.1, 0.2], m78KeyPeople: [2, 1.8], m78Cameras: [3.1, 1.8] } as const;
const BUILDING = { lockedRoom: [1.5, 1], bank: [0.2, 0.2], assessor: [2.8, 0.2] } as const;
const BUILDING_FRAMES = [
  { label: "Locked room", from: [1.5, 1], to: [1.5, 1], tone: "wall" },
  { label: "The bank's building", from: [0.2, 0.2], to: [2.8, 1.8] },
] as const;
const DOORS = { ingress: [0.2, 0.3], partnerdoor: [0.2, 1.8], lockedRoom: [1.6, 1], cardsPostgres: [3, 1] } as const;
const DOOR_EDGES = [{ from: "ingress", to: "lockedRoom" }, { from: "partnerdoor", to: "lockedRoom" }, { from: "lockedRoom", to: "cardsPostgres" }] as const;
const OWN = { cardsPostgres: [0.4, 1], cardsVault: [1.5, 1], cardsKeycloak: [2.6, 1] } as const;
const THREE = { m78Guide: [0.4, 1], m78Provide: [2.6, 0], m78Install: [2.6, 1], m78WhoDoes: [2.6, 2] } as const;
const THREE_EDGES = [{ from: "m78Guide", to: "m78Provide" }, { from: "m78Guide", to: "m78Install" }, { from: "m78Guide", to: "m78WhoDoes" }] as const;
const MATRIX = { m78Twelve: [0.4, 1], m78ProductDoes: [2.6, 0], m78BanksPart: [2.6, 1], m78Shared: [2.6, 2] } as const;
const MATRIX_EDGES = [{ from: "m78Twelve", to: "m78ProductDoes" }, { from: "m78Twelve", to: "m78BanksPart" }, { from: "m78Twelve", to: "m78Shared" }] as const;
const GAPS = { m78Guide: [0.4, 1], m78Gap: [2.6, 0.3], m78Meanwhile: [2.6, 1.8] } as const;
const GAP_EDGES = [{ from: "m78Guide", to: "m78Gap", label: "known gaps" }, { from: "m78Gap", to: "m78Meanwhile" }] as const;
const TWO = { admin: [0.4, 1], checker: [2.6, 1] } as const;
const TWO_EDGE = [{ from: "admin", to: "checker", label: "asks · decides" }] as const;
const NETWORK_ROW = { m78ProductDoes: "two doors", m78BanksPart: "firewalls", m78Shared: "allowed connections" };
const LOG_ROW = { m78ProductDoes: "keeps the trails", m78BanksPart: "collects · reviews daily" };

export const map: BuildMapStep[] = [
  { cue: 0, part: 7, units: { ecom: "product", cards: "product" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 7, current: ["frame", "card", "bin", "adapters", "cardsinfra", "kubernetes"], units: { cards: "locked room" } },
  { cue: 2, part: 7 },
  { cue: 51, part: 7, units: { ecom: "the shop", cards: "locked room" } },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The brochure and the assessor.
  { cue: 3, layout: { bank: [0.4, 1], m78Product: [2.6, 1] }, edges: [{ from: "bank", to: "m78Product", label: "buys" }] },
  { cue: 4, layout: { bank: [0.4, 1], m78Product: [2.6, 1] }, edges: [{ from: "bank", to: "m78Product", label: "buys" }], badges: { m78Product: "compliant" }, accent: ["m78Product"] },
  { cue: 5, layout: { assessor: [0.4, 1], bank: [2.6, 1] }, edges: [{ from: "assessor", to: "bank", label: "arrives" }] },
  { cue: 6, layout: { assessor: [0.4, 1], bank: [2.6, 1] }, edges: [{ from: "assessor", to: "bank", label: "checks" }], badges: { assessor: "independent", bank: "PCI DSS" }, accent: ["assessor"] },
  { cue: 7, layout: { assessor: [0, 1], ...ASKED }, badges: { assessor: "show me" } },
  { cue: 8, layout: { m78Vendor: [0, 1], ...ASKED }, badges: { m78Vendor: "none of them" }, danger: ["m78Vendor"] },
  { cue: 9, layout: { m78Vendor: [0, 1], ...ASKED }, frames: [{ label: "The bank's building", from: [2, 0.2], to: [3.1, 1.8] }], badges: { m78Vendor: "not ours" } },
  {
    cue: 10,
    layout: { m78Product: [0, 1], m78WhoDoes: [1.5, 1], bank: [3, 1] },
    edges: [{ from: "m78Product", to: "m78WhoDoes" }, { from: "bank", to: "m78WhoDoes" }],
    badges: { m78WhoDoes: "fell between" },
    danger: ["m78WhoDoes"],
  },
  // The room inside the building.
  { cue: 11, layout: BUILDING, frames: [...BUILDING_FRAMES] },
  { cue: 12, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { lockedRoom: "we deliver" }, accent: ["lockedRoom"] },
  { cue: 13, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { lockedRoom: "we deliver", bank: "walls · guards · doors" }, accent: ["bank"] },
  { cue: 14, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { lockedRoom: "fits, breaks nothing" } },
  { cue: 15, layout: DOORS, edges: [DOOR_EDGES[0], DOOR_EDGES[1]], badges: { ingress: "payers", partnerdoor: "bank's systems" }, accent: ["ingress", "partnerdoor"] },
  { cue: 16, layout: DOORS, edges: [DOOR_EDGES[0], DOOR_EDGES[1]], badges: { lockedRoom: "nothing else listens" } },
  { cue: 17, layout: DOORS, edges: [...DOOR_EDGES], badges: { cardsPostgres: "never from outside" }, accent: ["cardsPostgres"] },
  { cue: 18, layout: OWN, badges: { cardsPostgres: "own", cardsVault: "own keys", cardsKeycloak: "own logins" }, frames: [{ label: "shares nothing", from: [0.4, 1], to: [2.6, 1], tone: "wall" }] },
  { cue: 19, layout: { lockedRoom: [0.4, 1], m78Firewalls: [2.6, 1] }, edges: [{ from: "m78Firewalls", to: "lockedRoom", label: "wraps around" }], accent: ["m78Firewalls"] },
  // The guide.
  { cue: 20, layout: { m78Guide: [1.5, 1] }, badges: { m78Guide: "with each product" }, accent: ["m78Guide"] },
  { cue: 21, layout: THREE, edges: [...THREE_EDGES] },
  { cue: 22, layout: THREE, edges: [...THREE_EDGES], badges: { m78WhoDoes: "responsibility matrix" }, accent: ["m78WhoDoes"] },
  { cue: 23, layout: MATRIX, edges: [...MATRIX_EDGES], accent: ["m78Twelve"] },
  { cue: 24, layout: MATRIX, edges: [...MATRIX_EDGES], badges: { m78ProductDoes: "not a claim" } },
  { cue: 25, layout: MATRIX, edges: [...MATRIX_EDGES], badges: { m78Twelve: "network", ...NETWORK_ROW } },
  { cue: 26, layout: MATRIX, edges: [...MATRIX_EDGES], badges: { m78Twelve: "logs", ...LOG_ROW } },
  { cue: 27, layout: { m78Ecom: [1.5, 1] }, badges: { m78Ecom: "its own matrix" }, accent: ["m78Ecom"] },
  { cue: 28, layout: { m78Ecom: [0.4, 1], assessor: [2.6, 1] }, edges: [{ from: "assessor", to: "m78Ecom", label: "decides" }], badges: { m78Ecom: "smaller check" } },
  // Each release checked; the known gaps.
  { cue: 29, layout: { m78Release: [0.4, 1], m78Twelve: [2.6, 1] }, edges: [{ from: "m78Release", to: "m78Twelve" }] },
  { cue: 30, layout: { m78Release: [0.4, 1], m78Twelve: [2.6, 1] }, edges: [{ from: "m78Release", to: "m78Twelve", label: "one by one" }], badges: { m78Release: "every release" } },
  { cue: 31, layout: { m78Release: [0.4, 1], m78Twelve: [2.6, 1] }, edges: [{ from: "m78Release", to: "m78Twelve" }], badges: { m78Twelve: "met · partly · bank's · shared · gap" } },
  { cue: 32, layout: GAPS, edges: [GAP_EDGES[0]], danger: ["m78Gap"] },
  { cue: 33, layout: GAPS, edges: [...GAP_EDGES], badges: { m78Gap: "the requirement" }, accent: ["m78Meanwhile"] },
  { cue: 34, layout: GAPS, edges: [...GAP_EDGES], badges: { m78Gap: "unseal after restart", m78Meanwhile: "3 keyholders near" } },
  // Two people for money and keys.
  { cue: 35, layout: TWO, edges: [...TWO_EDGE], badges: { checker: "money or keys" } },
  { cue: 36, layout: TWO, edges: [...TWO_EDGE], badges: { admin: "one asks", checker: "another decides" }, accent: ["checker"] },
  { cue: 37, layout: { bank: [0.4, 1], keyholders: [2.6, 1] }, edges: [{ from: "keyholders", to: "bank" }], badges: { keyholders: "3 of 5 · never two" }, accent: ["keyholders"] },
  // The install team and the assessor.
  { cue: 39, layout: { admin: [0.4, 1], m78Guide: [2.6, 1] }, edges: [{ from: "admin", to: "m78Guide", label: "opens" }], badges: { m78Guide: "who does what" } },
  { cue: 40, layout: MATRIX, edges: [...MATRIX_EDGES], badges: { m78Twelve: "12 rows" } },
  { cue: 41, layout: MATRIX, edges: [...MATRIX_EDGES], badges: { m78Twelve: "network · logging", ...NETWORK_ROW } },
  { cue: 42, layout: GAPS, edges: [...GAP_EDGES] },
  { cue: 43, layout: GAPS, edges: [...GAP_EDGES], badges: { m78Gap: "gap · requirement", m78Meanwhile: "the bank's control" } },
  { cue: 44, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { assessor: "guide in hand" }, accent: ["assessor"] },
  // What it protects.
  { cue: 45, layout: BUILDING, frames: [...BUILDING_FRAMES] },
  { cue: 46, layout: { m78Product: [1.5, 1] }, badges: { m78Product: "can't promise alone" }, crossed: ["m78Product"] },
  { cue: 47, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { lockedRoom: "every job owned" }, accent: ["lockedRoom"] },
  { cue: 48, layout: GAPS, edges: [...GAP_EDGES], badges: { m78Gap: "never hidden" }, accent: ["m78Gap"] },
  { cue: 49, layout: { m78Product: [1.5, 1] }, badges: { m78Product: "not certified alone" } },
  { cue: 50, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { assessor: "the whole building", lockedRoom: "the guide: evidence" }, accent: ["assessor"] },
];
