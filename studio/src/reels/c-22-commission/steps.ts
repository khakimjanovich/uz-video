import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 22: price tags. The most specific price wins (cues 1–2, 4), the fee formula (5–6),
// changes by proposal and approval (7–8), no overlap (9), every payment keeps its rule (10).
const SHOP = { m45Item: [0, 1], m45Aisle: [1.5, 1], m45WholeStore: [3, 1] } as const;
const SHOP_EDGES = [{ from: "m45Item", to: "m45Aisle", label: "beats" }, { from: "m45Aisle", to: "m45WholeStore", label: "beats" }] as const;
const SCOPES = { m45ScopeSite: [0, 1], m45ScopeMerchant: [1, 1], m45ScopeCard: [2, 1], m45ScopeBank: [3, 1] } as const;
const FORMULA = { m45Amount: [0, 1], m45Fee: [1.5, 1], m45Bounds: [3, 1] } as const;
const FORMULA_EDGES = [{ from: "m45Amount", to: "m45Fee" }, { from: "m45Fee", to: "m45Bounds" }] as const;
const CHANGE = { admin: [0, 0.4], m45Proposal: [1.5, 0.4], checker: [3, 0.4], m45Rule: [1.5, 2] } as const;
const CHANGE_EDGES = [{ from: "admin", to: "m45Proposal" }, { from: "checker", to: "m45Proposal" }, { from: "m45Proposal", to: "m45Rule" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { m45Fee: [1.5, 1] }, badges: { m45Fee: "who decides?" } },
  { cue: 1, layout: SHOP, edges: [...SHOP_EDGES] },
  { cue: 2, layout: SHOP, edges: [...SHOP_EDGES], accent: ["m45Item"], badges: { m45Item: "wins" } },
  { cue: 4, layout: SCOPES, accent: ["m45ScopeSite"], badges: { m45ScopeSite: "most specific", m45ScopeBank: "least" } },
  {
    cue: 5,
    layout: FORMULA,
    edges: [...FORMULA_EDGES],
    packets: [{ from: "m45Amount", to: "m45Fee", label: "amount" }],
    badges: { m45Fee: "% + fixed" },
  },
  { cue: 6, layout: FORMULA, edges: [...FORMULA_EDGES], badges: { m45Fee: "whole cents", m45Amount: "rounded once" } },
  {
    cue: 7,
    layout: { admin: [0, 1], m45Rule: [2.5, 1] },
    edges: [{ from: "admin", to: "m45Rule", label: "edit", broken: true }],
    badges: { m45Rule: "never edited" },
  },
  {
    cue: 8,
    layout: CHANGE,
    edges: [...CHANGE_EDGES],
    packets: [
      { from: "admin", to: "m45Proposal", label: "propose" },
      { from: "checker", to: "m45Proposal", label: "approve", delay: 45 },
      { from: "m45Proposal", to: "m45Rule", label: "new rule", delay: 90 },
    ],
  },
  {
    cue: 9,
    layout: { m45Rule: [0.5, 1], m45Rule2: [2.5, 1] },
    crossed: ["m45Rule2"],
    danger: ["m45Rule2"],
    badges: { m45Rule: "applies", m45Rule2: "never" },
  },
  {
    cue: 10,
    layout: { record: [1.5, 1], m45Rule: [0, 1], m45History: [3, 1] },
    edges: [{ from: "record", to: "m45Rule", label: "used" }, { from: "record", to: "m45History" }],
    accent: ["record"],
    badges: { record: "rule · fee · payout", m45History: "last month" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 3, part: 5, current: ["commission"], units: { ecom: "the bank's fee" } },
  { cue: 11, part: 5, current: ["epos", "payment"], units: { ecom: "next: terminals" } },
];
