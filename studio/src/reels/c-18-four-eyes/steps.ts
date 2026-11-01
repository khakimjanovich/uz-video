import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 18: four eyes. One shop carries it: Malika's activation on a Monday afternoon.
// Start tonight? Not alone (0–3), the bridge from lesson 17 (4), why one admin is not enough (5–7),
// Dilnoza asks (8–13), her own request stays grey (14–19), the colleague decides (20–24), expiry and checks (25–27),
// the history (28–29), four eyes everywhere (30–35), red tape? (36–40), half past four (41), next (42).
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
const READY = { m45Papers: [0, 1], m45Contract: [1.5, 1], shop: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Monday, 4 p.m.: papers verified, contract signed. Can the shop start tonight?
  { cue: 0, layout: { shop: [1.5, 1] }, badges: { shop: "Mon 16:00" } },
  {
    cue: 1,
    layout: READY,
    edges: [{ from: "m45Papers", to: "m45Contract" }, { from: "m45Contract", to: "shop" }],
    accent: ["m45Papers", "m45Contract"],
    badges: { m45Papers: "verified", m45Contract: "signed", shop: "tonight?" },
  },
  { cue: 3, layout: ALONE, edges: [{ from: "admin", to: "shop", label: "switch on", broken: true }], badges: { admin: "not alone" } },
  // Why one admin is not enough.
  { cue: 5, layout: ALONE, edges: [{ from: "admin", to: "shop", label: "switch on" }], packets: [{ from: "admin", to: "shop", label: "on" }], danger: ["admin"], badges: { admin: "rushed or bribed" } },
  {
    cue: 6,
    layout: { attacker: [0, 1], shop: [2, 1], bank: [3.1, 1] },
    edges: [{ from: "attacker", to: "shop" }, { from: "shop", to: "bank" }],
    packets: [0, 1, 2].map((k) => ({ from: "attacker" as const, to: "shop" as const, label: "stolen card", delay: k * 30 })),
    danger: ["shop"],
    badges: { shop: "a week of payments" },
  },
  { cue: 7, layout: ALONE, edges: [{ from: "admin", to: "shop", broken: true }], badges: { admin: "no such button" } },
  // Dilnoza is the maker; nothing changes yet.
  { cue: 11, layout: FOUR, edges: [...FOUR_EDGES], packets: [{ from: "admin", to: "request", label: "switch on" }], accent: ["admin"], badges: { admin: "Dilnoza · maker" } },
  { cue: 12, layout: FOUR, edges: [...FOUR_EDGES], badges: { admin: "Dilnoza", request: "pending", shop: "still off" } },
  // The maker can never approve her own request.
  { cue: 18, layout: FOUR, edges: [...FOUR_EDGES], packets: [{ from: "admin", to: "request", label: "approve", stopAt: 0.6 }], danger: ["admin"] },
  { cue: 19, layout: FOUR, edges: [...FOUR_EDGES], danger: ["admin"], badges: { admin: "not offered", request: "server refuses" } },
  // The colleague is the checker.
  {
    cue: 22,
    layout: FOUR,
    edges: [...FOUR_EDGES],
    packets: [{ from: "checker", to: "request", label: "decide" }],
    accent: ["checker"],
    badges: { admin: "Dilnoza", checker: "agrees or refuses" },
  },
  // On approval the documents are checked again; an undecided request expires.
  {
    cue: 25,
    layout: { ...FOUR, m45Docs: [3, 2] },
    edges: [...FOUR_EDGES, { from: "request", to: "m45Docs" }],
    packets: [{ from: "request", to: "m45Docs", label: "check again" }],
    accent: ["m45Docs"],
  },
  { cue: 26, layout: FOUR, edges: [...FOUR_EDGES], crossed: ["request"], badges: { request: "expired", shop: "off" } },
  { cue: 27, layout: FOUR, edges: [...FOUR_EDGES], crossed: ["request"], badges: { request: "months later? no" } },
  // Four eyes, across the whole product.
  { cue: 30, layout: FOUR, edges: [...FOUR_EDGES], accent: ["admin", "checker"], badges: { request: "four eyes" } },
  { cue: 31, layout: ALL, edges: [...ALL_EDGES], badges: { request: "merchants" } },
  { cue: 33, layout: ALL, edges: [...ALL_EDGES], accent: ["request", "m45Rule", "m45Refund"], badges: { m45Rule: "moves money", request: "switches on" } },
  {
    cue: 34,
    layout: ALL,
    edges: [...ALL_EDGES],
    packets: [{ from: "admin", to: "m45Rule", label: "propose" }, { from: "checker", to: "m45Rule", label: "decide", delay: 50 }],
  },
  { cue: 35, layout: ALL, edges: [...ALL_EDGES], badges: { admin: "same grey buttons", checker: "same history" } },
  // Red tape? The opposite.
  { cue: 36, layout: FOUR, edges: [...FOUR_EDGES], badges: { request: "red tape?" } },
  { cue: 38, layout: ALONE, edges: [{ from: "admin", to: "shop" }], packets: [{ from: "admin", to: "shop", label: "on" }], danger: ["admin", "shop"], badges: { admin: "one bribe" } },
  { cue: 39, layout: FOUR, edges: [...FOUR_EDGES], packets: [{ from: "admin", to: "request", label: "approve", stopAt: 0.6 }], accent: ["checker"] },
  { cue: 40, layout: HISTORY, edges: [...FOUR_EDGES], accent: ["admin", "checker", "m45History"], badges: { admin: "Dilnoza", m45History: "both names" } },
  // Half past four: your company is active.
  { cue: 41, layout: ALONE, edges: [{ from: "admin", to: "shop", label: "you're active" }], accent: ["shop"], badges: { admin: "16:30", shop: "active" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the one before.
  { cue: 4, part: 4, current: ["admin", "partner"] },
  { cue: 42, part: 4, current: ["merchant", "keycloak"], units: { ecom: "next: server login" } },
];

const DIR = "screens/c-18-four-eyes";
const ACTIONS: [number, number, number, number] = [620, 150, 820, 512];
const LIST: [number, number, number, number] = [240, 60, 800, 500];
const TOAST: [number, number, number, number] = [700, 438, 740, 462];
export const screens: ScreenStep[] = [
  { cue: 2, src: `${DIR}/request.png`, title: "Bank console · Merchant", region: [250, 50, 1180, 738], focus: [[1318, 150, 104, 24]] },
  { cue: 8, src: `${DIR}/request.png`, title: "Bank console · Merchant", region: ACTIONS, focus: [[1064, 353, 325, 36], [1064, 391, 325, 17]] },
  { cue: 9, src: `${DIR}/request-confirm.png`, title: "Bank console · Merchant", region: [380, 20, 680, 425], focus: [[500, 36, 440, 148]] },
  { cue: 10, src: `${DIR}/requested.png`, title: "Bank console · Merchant", region: TOAST, focus: [[996, 823, 390, 61]] },
  { cue: 14, src: `${DIR}/approvals-maker-plain.png`, title: "Bank console · Approvals", region: LIST, beats: [{ cue: 15, region: LIST, focus: [[260, 227, 760, 70]] }, { cue: 16, region: LIST, focus: [[281, 309, 192, 36]] }] },
  { cue: 17, src: `${DIR}/approvals-maker.png`, title: "Bank console · Approvals", region: [180, 60, 800, 500], focus: [[198, 251, 260, 53]] },
  { cue: 20, src: `${DIR}/approvals-checker.png`, title: "Bank console · Approvals", region: [0, 0, 1440, 900], focus: [[1340, 12, 96, 36]], beats: [{ cue: 21, region: LIST, focus: [[281, 309, 192, 36]] }] },
  { cue: 23, src: `${DIR}/approvals-checker.png`, title: "Bank console · Approvals", region: LIST, focus: [[281, 309, 95, 36]] },
  { cue: 24, src: `${DIR}/approved.png`, title: "Bank console · Approvals", region: TOAST, focus: [[996, 838, 390, 44]] },
  { cue: 28, src: `${DIR}/history.png`, title: "Bank console · Merchant", region: [250, 350, 880, 550], focus: [[270, 578, 753, 323]], beats: [{ cue: 29, region: [250, 350, 880, 550], focus: [[290, 640, 400, 70]] }] },
  { cue: 32, src: `${DIR}/tabs.png`, title: "Bank console · Approvals", region: LIST, focus: [[262, 159, 420, 52]] },
];
