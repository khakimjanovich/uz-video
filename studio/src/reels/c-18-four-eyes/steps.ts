import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 18: four eyes. Two signatures on a cheque (cue 1); the maker asks, the checker approves (2–5);
// the maker can't approve (6), no decision expires (7), documents rechecked (8), both named (9).
const FOUR = { admin: [0, 0.5], request: [1.5, 0.5], checker: [3, 0.5], shop: [1.5, 2] } as const;
const FOUR_EDGES = [
  { from: "admin", to: "request", label: "opens" },
  { from: "checker", to: "request", label: "approves" },
  { from: "request", to: "shop" },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { admin: [0.5, 1], shop: [2.5, 1] }, edges: [{ from: "admin", to: "shop", label: "switch on" }], badges: { admin: "alone?" } },
  { cue: 1, layout: { m45Cheque: [1.5, 1] }, accent: ["m45Cheque"], badges: { m45Cheque: "two signatures" } },
  { cue: 3, layout: FOUR, edges: [...FOUR_EDGES], packets: [{ from: "admin", to: "request", label: "switch on" }], accent: ["admin"], badges: { shop: "off" } },
  { cue: 4, layout: FOUR, edges: [...FOUR_EDGES], badges: { request: "pending", shop: "still off" } },
  {
    cue: 5,
    layout: FOUR,
    edges: [...FOUR_EDGES],
    packets: [{ from: "checker", to: "request", label: "approve" }, { from: "request", to: "shop", label: "on", delay: 50 }],
    accent: ["checker", "shop"],
    badges: { shop: "active" },
  },
  {
    cue: 6,
    layout: FOUR,
    edges: [...FOUR_EDGES],
    packets: [{ from: "admin", to: "request", label: "approve", stopAt: 0.6 }],
    danger: ["admin"],
    badges: { admin: "not offered", request: "server refuses" },
  },
  { cue: 7, layout: FOUR, edges: [...FOUR_EDGES], crossed: ["request"], badges: { request: "expired", shop: "off" } },
  {
    cue: 8,
    layout: { ...FOUR, m45Docs: [3, 2] },
    edges: [...FOUR_EDGES, { from: "request", to: "m45Docs" }],
    packets: [{ from: "request", to: "m45Docs", label: "check again" }],
    accent: ["m45Docs"],
  },
  {
    cue: 9,
    layout: { ...FOUR, m45History: [0, 2] },
    edges: [...FOUR_EDGES],
    packets: [{ from: "admin", to: "m45History", label: "asked" }, { from: "checker", to: "m45History", label: "approved", delay: 45 }],
    accent: ["m45History"],
    badges: { m45History: "both named" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 2, part: 4, current: ["admin", "partner"], units: { ecom: "four eyes" } },
  { cue: 10, part: 4, current: ["merchant", "keycloak"], units: { ecom: "next: server login" } },
];
