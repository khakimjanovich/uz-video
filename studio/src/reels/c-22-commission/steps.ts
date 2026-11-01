import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 22: price tags. One rate in the code (0–9), the most specific tag wins (10–12), how it works (13–28),
// the product (29–47), what it protects (48–54).
const TANGLE = { payment: [1.5, 1], m45ScopeMerchant: [0, 0.2], m45ScopeSite: [3, 0.2], m45ScopeCard: [1.5, 2.1] } as const;
const TANGLE_EDGES = [
  { from: "m45ScopeMerchant", to: "payment", label: "lower rate" },
  { from: "m45ScopeSite", to: "payment", label: "offer" },
  { from: "m45ScopeCard", to: "payment", label: "costs more" },
] as const;
const TAGS = { m45Item: [0, 1], m45Aisle: [1.5, 1], m45WholeStore: [3, 1] } as const;
const TAG_EDGES = [{ from: "m45Item", to: "m45Aisle", label: "beats" }, { from: "m45Aisle", to: "m45WholeStore", label: "beats" }] as const;
const SCOPES = { m45ScopeSite: [0, 1], m45ScopeMerchant: [1, 1], m45ScopeCard: [2, 1], m45ScopeBank: [3, 1] } as const;
const SCOPE_EDGES = [
  { from: "m45ScopeSite", to: "m45ScopeMerchant", label: "beats" },
  { from: "m45ScopeMerchant", to: "m45ScopeCard", label: "beats" },
  { from: "m45ScopeCard", to: "m45ScopeBank", label: "beats" },
] as const;
const FEE = { m45Amount: [0, 1], m45Fee: [1.5, 1], m45Bounds: [3, 1] } as const;
const FEE_EDGES = [{ from: "m45Amount", to: "m45Fee", label: "% + fixed" }, { from: "m45Fee", to: "m45Bounds" }] as const;
const FOUR = { admin: [0, 1], m45Proposal: [1.5, 1], checker: [3, 1], m45Rule: [1.5, 2.1] } as const;
const FOUR_EDGES = [{ from: "admin", to: "m45Proposal", label: "proposes" }, { from: "checker", to: "m45Proposal", label: "approves" }, { from: "m45Proposal", to: "m45Rule" }] as const;
const OVERLAP = { m45Rule: [0, 0.4], m45Rule2: [0, 1.8], m45Db: [2.5, 1] } as const;
const KEPT = { payment: [0, 1], m45Rule: [2, 0.3], m45Fee: [2, 1.1], shop: [2, 1.9] } as const;
const KEPT_EDGES = [{ from: "payment", to: "m45Rule", label: "rule used" }, { from: "payment", to: "m45Fee", label: "fee" }, { from: "payment", to: "shop", label: "receives" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { payment: [0.5, 1], m45Fee: [2.5, 1] }, edges: [{ from: "payment", to: "m45Fee" }], badges: { m45Fee: "who decides?" } },
  { cue: 4, layout: { payment: [1.5, 1] }, badges: { payment: "one rate in the code" } },
  { cue: 5, layout: { payment: TANGLE.payment, m45ScopeMerchant: TANGLE.m45ScopeMerchant }, edges: [TANGLE_EDGES[0]] },
  { cue: 6, layout: { payment: TANGLE.payment, m45ScopeMerchant: TANGLE.m45ScopeMerchant, m45ScopeSite: TANGLE.m45ScopeSite }, edges: [TANGLE_EDGES[0], TANGLE_EDGES[1]] },
  { cue: 7, layout: TANGLE, edges: [...TANGLE_EDGES] },
  { cue: 8, layout: TANGLE, edges: [...TANGLE_EDGES], danger: ["payment"], badges: { payment: "a tangle" }, shake: { payment: 0.4 } },
  { cue: 9, layout: { payment: [0.5, 1], m45History: [2.5, 1] }, edges: [{ from: "payment", to: "m45History", broken: true }], danger: ["m45History"], badges: { m45History: "last month?" } },
  { cue: 10, layout: TAGS, edges: [...TAG_EDGES] },
  { cue: 11, layout: TAGS, edges: [...TAG_EDGES], accent: ["m45Item"], badges: { m45Item: "most specific wins" } },
  { cue: 12, layout: SCOPES, edges: [...SCOPE_EDGES] },
  { cue: 14, layout: { m45Rule: [1.5, 1] }, accent: ["m45Rule"], badges: { m45Rule: "one price" } },
  { cue: 15, layout: SCOPES, edges: [], badges: { m45ScopeSite: "website", m45ScopeBank: "whole bank" } },
  { cue: 16, layout: SCOPES, edges: [...SCOPE_EDGES], accent: ["m45ScopeSite"] },
  { cue: 17, layout: SCOPES, edges: [...SCOPE_EDGES], accent: ["m45ScopeSite"], badges: { m45ScopeSite: "beats merchant" } },
  { cue: 18, layout: SCOPES, edges: [...SCOPE_EDGES], accent: ["m45ScopeMerchant"], badges: { m45ScopeMerchant: "beats card" } },
  { cue: 19, layout: SCOPES, edges: [...SCOPE_EDGES], accent: ["m45ScopeBank"], badges: { m45ScopeBank: "the default" } },
  { cue: 20, layout: FEE, edges: [...FEE_EDGES], packets: [{ from: "m45Amount", to: "m45Fee", label: "1.2% + 0.50" }] },
  { cue: 21, layout: FEE, edges: [...FEE_EDGES], accent: ["m45Bounds"] },
  { cue: 22, layout: FEE, edges: [...FEE_EDGES], badges: { m45Amount: "whole cents" } },
  { cue: 23, layout: FEE, edges: [...FEE_EDGES], packets: [{ from: "m45Amount", to: "m45Fee", label: "rounded once" }], badges: { m45Fee: "exact" } },
  { cue: 24, layout: { m45Rule: [1.5, 1] }, crossed: ["m45Rule"], badges: { m45Rule: "never edited" } },
  { cue: 25, layout: FOUR, edges: [...FOUR_EDGES], packets: [{ from: "admin", to: "m45Proposal", label: "change" }, { from: "checker", to: "m45Proposal", label: "approve", delay: 50 }] },
  {
    cue: 26,
    layout: OVERLAP,
    edges: [{ from: "m45Rule", to: "m45Db" }, { from: "m45Rule2", to: "m45Db", broken: true }],
    packets: [{ from: "m45Rule2", to: "m45Db", label: "overlap", stopAt: 0.6 }],
    danger: ["m45Rule2"],
    badges: { m45Db: "refuses" },
  },
  { cue: 27, layout: KEPT, edges: [...KEPT_EDGES], packets: [{ from: "payment", to: "m45Rule", label: "kept" }] },
  { cue: 28, layout: KEPT, edges: [...KEPT_EDGES], accent: ["payment"], badges: { payment: "explained" } },
  { cue: 48, layout: TANGLE, edges: [...TANGLE_EDGES], badges: { payment: "protect what?" } },
  { cue: 49, layout: TANGLE, edges: [...TANGLE_EDGES], danger: ["payment"], badges: { payment: "code change" } },
  { cue: 50, layout: FOUR, edges: [...FOUR_EDGES], accent: ["checker"], badges: { admin: "no quiet favours" } },
  { cue: 51, layout: FEE, edges: [...FEE_EDGES], badges: { m45Amount: "whole cents", m45Fee: "nothing leaks" } },
  { cue: 52, layout: KEPT, edges: [...KEPT_EDGES], accent: ["m45Rule"], badges: { shop: "why this fee?" } },
  { cue: 53, layout: KEPT, edges: [...KEPT_EDGES], accent: ["shop", "m45Rule"] },
  { cue: 54, layout: TAGS, edges: [...TAG_EDGES], accent: ["m45Item"], badges: { m45WholeStore: "never repainted" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 4, current: ["commission"] },
  { cue: 2, part: 4, current: ["partner"] },
  { cue: 3, part: 4, current: ["commission"] },
  { cue: 13, part: 4, current: ["commission", "admin", "payment"], units: { ecom: "fee rules" } },
  { cue: 55, part: 4, current: ["epos"], units: { ecom: "next: e-POS" } },
];

const DIR = "screens/c-22-commission";
const LEFT: [number, number, number, number] = [240, 60, 800, 500];
const FORM: [number, number, number, number] = [380, 160, 880, 550];
const CALC: [number, number, number, number] = [610, 150, 830, 520];
export const screens: ScreenStep[] = [
  { cue: 30, src: `${DIR}/fees.png`, title: "Bank console · Fees", region: [0, 0, 880, 550], focus: [[6, 200, 220, 30]], beats: [{ cue: 31, region: LEFT, focus: [[260, 80, 650, 60]] }, { cue: 32, region: LEFT, focus: [[273, 172, 741, 36]] }] },
  { cue: 33, src: `${DIR}/fees.png`, title: "Bank console · Fees", region: [640, 40, 800, 500], focus: [[1303, 103, 117, 36]] },
  { cue: 34, src: `${DIR}/new-rule.png`, title: "Bank console · Fees", region: FORM, focus: [[426, 290, 588, 140]], beats: [{ cue: 35, region: FORM, focus: [[426, 240, 588, 36]] }] },
  { cue: 36, src: `${DIR}/needs-card.png`, title: "Bank console · Fees", region: FORM, focus: [[426, 280, 588, 50], [728, 400, 286, 60]] },
  { cue: 37, src: `${DIR}/bank-default.png`, title: "Bank console · Fees", region: FORM, focus: [[426, 445, 588, 130], [857, 673, 157, 36]] },
  { cue: 38, src: `${DIR}/proposed.png`, title: "Bank console · Fees", region: [700, 438, 740, 462], focus: [[996, 838, 390, 44]] },
  { cue: 39, src: `${DIR}/approvals-maker.png`, title: "Bank console · Approvals · Fee changes", region: [180, 60, 800, 500], focus: [[363, 159, 114, 52], [281, 326, 192, 36]] },
  { cue: 40, src: `${DIR}/approvals-checker.png`, title: "Bank console · Approvals · Fee changes", region: LEFT, focus: [[281, 326, 95, 36]] },
  { cue: 41, src: `${DIR}/rule-details.png`, title: "Bank console · Fees · Fee rule", region: [780, 20, 660, 412], focus: [[1015, 60, 80, 30], [1010, 355, 420, 60]] },
  {
    cue: 42,
    src: `${DIR}/calculator.png`,
    title: "Bank console · Fees",
    region: CALC,
    focus: [[1047, 159, 373, 40]],
    beats: [
      { cue: 43, region: CALC, focus: [[1047, 192, 373, 30]] },
      { cue: 44, region: CALC, focus: [[1068, 250, 330, 130]] },
      { cue: 45, region: CALC, focus: [[1068, 470, 330, 50]] },
      { cue: 46, region: CALC, focus: [[1068, 538, 330, 34]] },
      { cue: 47, region: CALC, focus: [[1068, 580, 330, 80]] },
    ],
  },
];
