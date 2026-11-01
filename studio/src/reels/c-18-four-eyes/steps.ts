import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 18: four eyes. One admin alone (0–2), two signatures (3–5), how it works (6–20),
// the whole product (21–27), the product screens (28–44), what it protects (45–51).
const FOUR = { admin: [0, 0.5], request: [1.5, 0.5], checker: [3, 0.5], shop: [1.5, 2] } as const;
const FOUR_EDGES = [
  { from: "admin", to: "request", label: "opens" },
  { from: "checker", to: "request", label: "decides" },
  { from: "request", to: "shop" },
] as const;
const ALONE = { admin: [0.5, 1], shop: [2.5, 1] } as const;
const ALL = { admin: [0, 1], request: [1.5, 0.2], m45Rule: [1.5, 1.1], m45Refund: [1.5, 2], checker: [3, 1] } as const;
const ALL_EDGES = [
  { from: "admin", to: "request" },
  { from: "admin", to: "m45Rule" },
  { from: "admin", to: "m45Refund" },
  { from: "checker", to: "request" },
  { from: "checker", to: "m45Rule" },
  { from: "checker", to: "m45Refund" },
] as const;
const HISTORY = { ...FOUR, m45History: [0, 2] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: ALONE, edges: [{ from: "admin", to: "shop", label: "switch on" }], badges: { admin: "alone?" } },
  { cue: 1, layout: ALONE, edges: [{ from: "admin", to: "shop", label: "switch on" }], packets: [{ from: "admin", to: "shop", label: "on" }], danger: ["admin"], badges: { admin: "rushed or bribed" } },
  {
    cue: 2,
    layout: { attacker: [0, 1], shop: [2, 1], bank: [3.1, 1] },
    edges: [{ from: "attacker", to: "shop" }, { from: "shop", to: "bank" }],
    packets: [0, 1, 2].map((k) => ({ from: "attacker" as const, to: "shop" as const, label: "stolen card", delay: k * 30 })),
    danger: ["shop"],
    badges: { shop: "a week of payments" },
  },
  { cue: 3, layout: { m45Cheque: [1.5, 1] }, accent: ["m45Cheque"], badges: { m45Cheque: "two signatures" } },
  { cue: 4, layout: FOUR, edges: [...FOUR_EDGES], badges: { shop: "off" } },
  { cue: 5, layout: FOUR, edges: [...FOUR_EDGES], accent: ["admin", "checker"], badges: { request: "four eyes" } },
  { cue: 7, layout: ALONE, edges: [{ from: "admin", to: "shop", broken: true }], badges: { admin: "no such button" } },
  { cue: 8, layout: FOUR, edges: [...FOUR_EDGES], packets: [{ from: "admin", to: "request", label: "switch on" }], accent: ["admin"] },
  { cue: 9, layout: FOUR, edges: [...FOUR_EDGES], accent: ["admin"], badges: { admin: "the maker" } },
  { cue: 10, layout: FOUR, edges: [...FOUR_EDGES], badges: { request: "pending", shop: "still off" } },
  { cue: 12, layout: FOUR, edges: [...FOUR_EDGES], packets: [{ from: "checker", to: "request", label: "decide" }], accent: ["checker"] },
  { cue: 13, layout: FOUR, edges: [...FOUR_EDGES], accent: ["checker"], badges: { checker: "agrees or refuses" } },
  {
    cue: 14,
    layout: FOUR,
    edges: [...FOUR_EDGES],
    packets: [{ from: "checker", to: "request", label: "approve" }, { from: "request", to: "shop", label: "on", delay: 50 }],
    accent: ["checker", "shop"],
    badges: { shop: "active" },
  },
  { cue: 15, layout: FOUR, edges: [...FOUR_EDGES], packets: [{ from: "admin", to: "request", label: "approve", stopAt: 0.6 }], danger: ["admin"] },
  { cue: 16, layout: FOUR, edges: [...FOUR_EDGES], danger: ["admin"], badges: { admin: "not offered", request: "server refuses" } },
  { cue: 17, layout: FOUR, edges: [...FOUR_EDGES], crossed: ["request"], badges: { request: "expired", shop: "off" } },
  { cue: 18, layout: FOUR, edges: [...FOUR_EDGES], crossed: ["request"], badges: { request: "months later? no" } },
  {
    cue: 19,
    layout: { ...FOUR, m45Docs: [3, 2] },
    edges: [...FOUR_EDGES, { from: "request", to: "m45Docs" }],
    packets: [{ from: "request", to: "m45Docs", label: "check again" }],
    accent: ["m45Docs"],
  },
  {
    cue: 20,
    layout: HISTORY,
    edges: [...FOUR_EDGES],
    packets: [{ from: "checker", to: "m45History", label: "approved" }, { from: "admin", to: "m45History", label: "asked", delay: 45 }],
    accent: ["m45History"],
    badges: { m45History: "both named" },
  },
  { cue: 21, layout: ALL, edges: [...ALL_EDGES], badges: { request: "merchants" } },
  { cue: 22, layout: ALL, edges: [...ALL_EDGES], accent: ["request", "m45Rule", "m45Refund"] },
  { cue: 23, layout: ALL, edges: [...ALL_EDGES], badges: { m45Rule: "moves money", request: "switches on" } },
  { cue: 24, layout: ALL, edges: [...ALL_EDGES], accent: ["m45Rule"], badges: { m45Rule: "new fee rule" } },
  { cue: 25, layout: ALL, edges: [...ALL_EDGES], accent: ["m45Refund"], badges: { m45Refund: "window · refund" } },
  {
    cue: 26,
    layout: ALL,
    edges: [...ALL_EDGES],
    packets: [{ from: "admin", to: "m45Rule", label: "propose" }, { from: "checker", to: "m45Rule", label: "decide", delay: 50 }],
  },
  { cue: 27, layout: ALL, edges: [...ALL_EDGES], badges: { admin: "same grey buttons", checker: "same history" } },
  { cue: 45, layout: ALONE, edges: [{ from: "admin", to: "shop" }], badges: { admin: "protect what?" } },
  { cue: 46, layout: ALONE, edges: [{ from: "admin", to: "shop" }], packets: [{ from: "admin", to: "shop", label: "on" }], danger: ["admin", "shop"], badges: { admin: "one bribe" } },
  { cue: 47, layout: FOUR, edges: [...FOUR_EDGES], packets: [{ from: "admin", to: "request", label: "approve", stopAt: 0.6 }], accent: ["checker"] },
  { cue: 48, layout: { buyer: [0, 1], shop: [2, 1], checker: [3.1, 1] }, edges: [{ from: "buyer", to: "shop" }, { from: "checker", to: "shop", label: "checked" }], accent: ["buyer"] },
  { cue: 49, layout: FOUR, edges: [...FOUR_EDGES], accent: ["checker"], badges: { admin: "one error", request: "caught" } },
  { cue: 50, layout: HISTORY, edges: [...FOUR_EDGES], accent: ["admin", "checker", "m45History"], badges: { m45History: "both names" } },
  { cue: 51, layout: { m45Cheque: [1.5, 1] }, accent: ["m45Cheque"], badges: { m45Cheque: "two people, every time" } },
];

export const map: BuildMapStep[] = [
  { cue: 6, part: 4, current: ["admin", "partner"], units: { ecom: "four eyes" } },
  { cue: 52, part: 4, current: ["merchant", "keycloak"], units: { ecom: "next: server login" } },
];

const DIR = "screens/c-18-four-eyes";
const ACTIONS: [number, number, number, number] = [620, 150, 820, 512];
const LIST: [number, number, number, number] = [240, 60, 800, 500];
const TOAST: [number, number, number, number] = [700, 438, 740, 462];
export const screens: ScreenStep[] = [
  { cue: 29, src: `${DIR}/request.png`, title: "Bank console · Merchant", region: [250, 50, 1180, 738], focus: [[1318, 150, 104, 24]], beats: [{ cue: 30, region: ACTIONS, focus: [[1064, 353, 325, 36], [1064, 391, 325, 17]] }] },
  { cue: 31, src: `${DIR}/request-confirm.png`, title: "Bank console · Merchant", region: [380, 20, 680, 425], focus: [[500, 36, 440, 148]] },
  { cue: 32, src: `${DIR}/requested.png`, title: "Bank console · Merchant", region: TOAST, focus: [[996, 823, 390, 61]] },
  { cue: 33, src: `${DIR}/approvals-maker-plain.png`, title: "Bank console · Approvals", region: LIST, beats: [{ cue: 34, region: LIST, focus: [[260, 227, 760, 70]] }, { cue: 35, region: LIST, focus: [[281, 309, 192, 36]] }] },
  { cue: 36, src: `${DIR}/approvals-maker.png`, title: "Bank console · Approvals", region: [180, 60, 800, 500], focus: [[198, 251, 260, 53]] },
  { cue: 38, src: `${DIR}/approvals-checker.png`, title: "Bank console · Approvals", region: [0, 0, 1440, 900], focus: [[1340, 12, 96, 36]], beats: [{ cue: 39, region: LIST, focus: [[281, 309, 192, 36]] }, { cue: 40, region: LIST, focus: [[281, 309, 95, 36]] }] },
  { cue: 41, src: `${DIR}/approved.png`, title: "Bank console · Approvals", region: TOAST, focus: [[996, 838, 390, 44]] },
  { cue: 42, src: `${DIR}/history.png`, title: "Bank console · Merchant", region: [250, 350, 880, 550], focus: [[270, 578, 753, 323]], beats: [{ cue: 43, region: [250, 350, 880, 550], focus: [[290, 640, 400, 70]] }] },
  { cue: 44, src: `${DIR}/tabs.png`, title: "Bank console · Approvals", region: LIST, focus: [[262, 159, 420, 52]] },
];
