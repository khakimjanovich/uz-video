import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 22: fee rules. One shop carries it: why does Malika pay more per bouquet than the shop next door?
// The question (0–1), the bridge (2), one rate in the code (3–5), fee rules and the most specific wins (6–13),
// percent, bounds and whole cents (14–18), Dilnoza's new default (19–27), never edited in place (28–33),
// Malika's answer in the calculator (34–40), every payment keeps its rule (41–42), next (43).
const TANGLE = { payment: [1.5, 1], m45ScopeMerchant: [0, 0.2], m45ScopeSite: [3, 0.2], m45ScopeCard: [1.5, 2.1] } as const;
const TANGLE_EDGES = [
  { from: "m45ScopeMerchant", to: "payment", label: "lower rate" },
  { from: "m45ScopeSite", to: "payment", label: "offer" },
  { from: "m45ScopeCard", to: "payment", label: "costs more" },
] as const;
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
const ASK = { shop: [0.5, 1], m45Fee: [2.5, 1] } as const;
const ASK_EDGE = [{ from: "shop", to: "m45Fee" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // A fair question: why more than the shop next door?
  { cue: 0, layout: ASK, edges: [...ASK_EDGE], badges: { shop: "Malika", m45Fee: "more than next door?" } },
  { cue: 1, layout: { ...ASK, admin: [1.5, 2.1] }, edges: [...ASK_EDGE], accent: ["admin"], badges: { admin: "Dilnoza: one minute" } },
  // The easy way: one rate in the code, then a tangle.
  { cue: 3, layout: { payment: [1.5, 1] }, badges: { payment: "one rate in the code" } },
  { cue: 4, layout: TANGLE, edges: [...TANGLE_EDGES] },
  { cue: 5, layout: TANGLE, edges: [...TANGLE_EDGES], danger: ["payment"], badges: { payment: "a tangle" }, shake: { payment: 0.4 } },
  // Fee rules: the most specific wins.
  { cue: 7, layout: { m45Rule: [1.5, 1] }, accent: ["m45Rule"], badges: { m45Rule: "one price" } },
  { cue: 8, layout: SCOPES, edges: [], badges: { m45ScopeSite: "website", m45ScopeBank: "whole bank" } },
  { cue: 9, layout: SCOPES, edges: [...SCOPE_EDGES], accent: ["m45ScopeSite"] },
  { cue: 10, layout: SCOPES, edges: [...SCOPE_EDGES], accent: ["m45ScopeSite"], badges: { m45ScopeSite: "beats merchant" } },
  { cue: 11, layout: SCOPES, edges: [...SCOPE_EDGES], accent: ["m45ScopeMerchant"], badges: { m45ScopeMerchant: "beats card" } },
  { cue: 12, layout: SCOPES, edges: [...SCOPE_EDGES], accent: ["m45ScopeBank"], badges: { m45ScopeBank: "the default" } },
  { cue: 13, layout: SCOPES, edges: [...SCOPE_EDGES], accent: ["m45ScopeMerchant", "m45ScopeBank"], badges: { m45ScopeMerchant: "shop next door", m45ScopeBank: "Malika" } },
  // The fee: percent plus fixed, inside bounds, in whole cents.
  { cue: 14, layout: FEE, edges: [...FEE_EDGES], packets: [{ from: "m45Amount", to: "m45Fee", label: "1.2% + 0.50" }] },
  { cue: 15, layout: FEE, edges: [...FEE_EDGES], accent: ["m45Bounds"] },
  { cue: 16, layout: FEE, edges: [...FEE_EDGES], badges: { m45Amount: "whole cents" } },
  { cue: 17, layout: FEE, edges: [...FEE_EDGES], packets: [{ from: "m45Amount", to: "m45Fee", label: "rounded once" }], badges: { m45Fee: "exact" } },
  { cue: 18, layout: FEE, edges: [...FEE_EDGES], badges: { m45Amount: "whole cents", m45Fee: "nothing leaks" } },
  // Never edited in place: a new rule, four eyes, no overlap.
  { cue: 28, layout: { m45Rule: [1.5, 1] }, crossed: ["m45Rule"], badges: { m45Rule: "never edited" } },
  { cue: 29, layout: FOUR, edges: [...FOUR_EDGES], packets: [{ from: "admin", to: "m45Proposal", label: "change" }, { from: "checker", to: "m45Proposal", label: "approve", delay: 50 }], badges: { checker: "four eyes" } },
  {
    cue: 33,
    layout: OVERLAP,
    edges: [{ from: "m45Rule", to: "m45Db" }, { from: "m45Rule2", to: "m45Db", broken: true }],
    packets: [{ from: "m45Rule2", to: "m45Db", label: "overlap", stopAt: 0.6 }],
    danger: ["m45Rule2"],
    badges: { m45Db: "refuses" },
  },
  { cue: 34, layout: ASK, edges: [...ASK_EDGE], badges: { shop: "Malika", m45Fee: "why more?" } },
  // Every payment keeps its rule: last March still explained.
  { cue: 41, layout: KEPT, edges: [...KEPT_EDGES], packets: [{ from: "payment", to: "m45Rule", label: "kept" }] },
  { cue: 42, layout: KEPT, edges: [...KEPT_EDGES], accent: ["payment"], badges: { payment: "last March" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 2, part: 4, current: ["commission", "partner"] },
  { cue: 6, part: 4, current: ["commission", "admin", "payment"], units: { ecom: "fee rules" } },
  { cue: 43, part: 4, current: ["epos"], units: { ecom: "next: e-POS" } },
];

const DIR = "screens/c-22-commission";
const LEFT: [number, number, number, number] = [240, 60, 800, 500];
const FORM: [number, number, number, number] = [380, 160, 880, 550];
const CALC: [number, number, number, number] = [610, 150, 830, 520];
export const screens: ScreenStep[] = [
  { cue: 19, src: `${DIR}/fees.png`, title: "Bank console · Fees", region: [0, 0, 880, 550], focus: [[6, 200, 220, 30]], beats: [{ cue: 20, region: LEFT, focus: [[260, 80, 650, 60]] }, { cue: 21, region: LEFT, focus: [[273, 172, 741, 36]] }] },
  { cue: 22, src: `${DIR}/fees.png`, title: "Bank console · Fees", region: [640, 40, 800, 500], focus: [[1303, 103, 117, 36]] },
  { cue: 23, src: `${DIR}/new-rule.png`, title: "Bank console · Fees", region: FORM, focus: [[426, 290, 588, 140]], beats: [{ cue: 24, region: FORM, focus: [[426, 240, 588, 36]] }] },
  { cue: 25, src: `${DIR}/needs-card.png`, title: "Bank console · Fees", region: FORM, focus: [[426, 280, 588, 50], [728, 400, 286, 60]] },
  { cue: 26, src: `${DIR}/bank-default.png`, title: "Bank console · Fees", region: FORM, focus: [[426, 445, 588, 130], [857, 673, 157, 36]] },
  { cue: 27, src: `${DIR}/proposed.png`, title: "Bank console · Fees", region: [700, 438, 740, 462], focus: [[996, 838, 390, 44]] },
  { cue: 30, src: `${DIR}/approvals-maker.png`, title: "Bank console · Approvals · Fee changes", region: [180, 60, 800, 500], focus: [[363, 159, 114, 52], [281, 326, 192, 36]] },
  { cue: 31, src: `${DIR}/approvals-checker.png`, title: "Bank console · Approvals · Fee changes", region: LEFT, focus: [[281, 326, 95, 36]] },
  { cue: 32, src: `${DIR}/rule-details.png`, title: "Bank console · Fees · Fee rule", region: [780, 20, 660, 412], focus: [[1015, 60, 80, 30], [1010, 355, 420, 60]] },
  {
    cue: 35,
    src: `${DIR}/calculator.png`,
    title: "Bank console · Fees",
    region: CALC,
    focus: [[1047, 159, 373, 40]],
    beats: [
      { cue: 36, region: CALC, focus: [[1047, 192, 373, 30]] },
      { cue: 37, region: CALC, focus: [[1068, 250, 330, 130]] },
      { cue: 38, region: CALC, focus: [[1068, 470, 330, 50]] },
      { cue: 39, region: CALC, focus: [[1068, 538, 330, 34]] },
      { cue: 40, region: CALC, focus: [[1068, 580, 330, 80]] },
    ],
  },
];
