import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 38: who does what. One story carries it: the locked room and the building (Lesson 4's frame).
// The brochure (cues 0–4), the room and the building (5), the guide and its matrix (6–13), known gaps (14–15),
// the assessor (16–17), reading the guide (18–23), the close: Lesson 1's map (24–25).
const BUILDING = { card: [1.5, 1], bank: [0.2, 0.2], assessor: [2.8, 0.2] } as const;
const BUILDING_FRAMES = [
  { label: "Card zone · we deliver", from: [1.5, 1], to: [1.5, 1], tone: "wall" },
  { label: "The bank's building", from: [0.2, 0.2], to: [2.8, 1.8] },
] as const;
const COLUMNS = { colProduct: [0.4, 1], colBank: [1.5, 1], colShared: [2.6, 1] } as const;
const ASKS = { assessor: [0.4, 1], brochure: [2.6, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // A brochure can't be compliant.
  { cue: 0, layout: { brochure: [1.5, 1] } },
  { cue: 1, layout: { brochure: [1.5, 1] }, badges: { brochure: "compliant" } },
  { cue: 2, layout: ASKS, edges: [{ from: "assessor", to: "brochure", label: "asks" }], badges: { assessor: "firewalls · logs · keys · cameras" } },
  { cue: 3, layout: ASKS, edges: [{ from: "assessor", to: "brochure", label: "asks" }], crossed: ["brochure"], badges: { brochure: "none of them" } },
  { cue: 4, layout: { card: [0.3, 1], gapJob: [1.5, 1], bank: [2.7, 1] }, danger: ["gapJob"], badges: { gapJob: "falls between" } },
  // The locked room and the building.
  { cue: 5, layout: BUILDING, frames: [...BUILDING_FRAMES] },
  // The guide and its matrix.
  { cue: 6, layout: { guide: [1.5, 1] }, accent: ["guide"] },
  { cue: 7, layout: { guide: [1.5, 1] }, badges: { guide: "provide · install · who does what" } },
  { cue: 8, layout: COLUMNS, accent: ["colProduct", "colBank", "colShared"] },
  { cue: 9, layout: COLUMNS, badges: { colBank: "12 requirements" } },
  { cue: 10, layout: COLUMNS, badges: { colProduct: "what the code does" } },
  { cue: 11, layout: COLUMNS, badges: { colProduct: "two doors", colBank: "firewalls", colShared: "allowed connections" } },
  { cue: 12, layout: COLUMNS, badges: { colProduct: "audit trails", colBank: "collect · review daily" } },
  { cue: 13, layout: { app: [0.4, 1], card: [2.6, 1] }, edges: [{ from: "app", to: "card" }], badges: { app: "smaller check", card: "full check" } },
  // Known gaps.
  { cue: 14, layout: { gaps: [0.4, 1], bank: [2.6, 1] }, edges: [{ from: "gaps", to: "bank" }], accent: ["gaps"] },
  { cue: 15, layout: { gaps: [0.4, 1], bank: [2.6, 1] }, edges: [{ from: "gaps", to: "bank", label: "until fixed" }], badges: { bank: "covers it" } },
  // The assessor judges the whole building.
  { cue: 16, layout: BUILDING, frames: [...BUILDING_FRAMES], badges: { card: "not certified" } },
  { cue: 17, layout: BUILDING, frames: [...BUILDING_FRAMES], accent: ["assessor"], badges: { assessor: "the whole building" } },
  { cue: 23, layout: { guide: [1.5, 1] }, accent: ["guide"], badges: { guide: "every release" } },
  { cue: 24, layout: BUILDING, frames: [...BUILDING_FRAMES], accent: ["card"] },
];

// The close: Lesson 1's map, the shop and the locked room.
export const map: BuildMapStep[] = [{ cue: 25, part: 8, units: { ecom: "the shop", cards: "locked room" } }];

// The guide as shipped: its first lines, then sections 11 and 12 (cells quoted, "…" where cut;
// row 4 is left out: it names a processing centre; gaps shown are those that stay after the open fixes).
export const code: CodeStep[] = [
  {
    cue: 19,
    file: "cards-infra/docs/install-server.md",
    lines: [
      "# The cards unit: implementation guide",
      "",
      "This guide is for the bank's team that installs and runs the cards unit",
      "    inside the bank's own PCI DSS card zone. The zone is the bank's: its",
      "    segmentation, firewalls, operating systems and their patching, accounts",
      "    and MFA, jump host, time, SIEM, backup storage and HSM. The product",
      "    must fit into that zone without weakening it. So this guide says three",
      "    things, and nothing about how to build the zone:",
      "",
      "- **What the zone must provide** (section 2): the host, the ports in and",
      "    out, names, certificates, time, people and storage.",
      "- **How to install and run the product** (sections 1 and 3 to 10): only our",
      "    steps. One procedure on a laptop, a dev server and production; only the",
      "    values differ (section 1).",
      "- **Who does what for PCI DSS v4.0.1** (section 11), and where the product",
      "    still falls short (section 12).",
      "",
      "The product is not certified, and this guide claims no compliance: it",
      "    states what the product does, so the bank's assessor can judge it",
      "    inside the bank's assessment.",
    ],
    at: [1, 2, 3, null, null, null, null, null, 4, 5, null, 6, null, null, 7, null, 8, 9, null, null],
    small: true,
    highlight: [4, 18, 19],
  },
  {
    cue: 20,
    file: "cards-infra/docs/install-server.md · 11. Who does what",
    table: {
      columns: ["Req.", "Product", "The bank", "Shared"],
      rows: [
        ["1 Network", "Publishes only its two doors …", "The NSCs and segmentation around the host …", "Section 2's flow table … (1.2.5)"],
        ["3 Stored data", "Card numbers sealed with Vault Transit keys … (3.5.1)", "Keyholder selection … cryptoperiods (3.6.1, 3.7.4)", "Dual control and split knowledge (3.7.6) …"],
        ["9 Physical", "Nothing", "All of it, including backup media (9.4.1)", "—"],
      ],
    },
    small: true,
    beats: [{ cue: 21, highlight: [2, 3] }],
  },
  {
    cue: 22,
    file: "cards-infra/docs/install-server.md · 12. Known product gaps",
    table: {
      columns: ["#", "Gap", "Touches", "Until fixed, the bank"],
      rows: [
        ["1", "No auto-unseal: after every Vault start three keyholders must come (section 8)", "availability", "keeps three keyholders reachable"],
        ["7", "Migrations only go forward: rolling back across a schema change means restoring a dump (section 7)", "—", "plans a maintenance window for upgrades"],
      ],
    },
    small: true,
  },
];
