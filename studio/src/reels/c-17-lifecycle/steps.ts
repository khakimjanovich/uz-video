import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 17: earning a licence. The driving licence (cue 1), the states (2), documents checked (3–5),
// verified then contract (6), every move written down (7–8).
const LICENCE = { m45Papers: [0, 1], m45Licence: [1.5, 1], m45Folder: [3, 1] } as const;
const STATES = { stPending: [0, 1], stVerified: [1, 1], stContract: [2, 1], stActive: [3, 1] } as const;
const STATE_EDGES = [
  { from: "stPending", to: "stVerified" },
  { from: "stVerified", to: "stContract" },
  { from: "stContract", to: "stActive" },
] as const;
const HIGH = { stPending: [0, 0.4], stVerified: [1, 0.4], stContract: [2, 0.4], stActive: [3, 0.4] } as const;
const DOCS = { shop: [0, 1], m45Docs: [1.5, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { shop: [1.5, 1] }, badges: { shop: "take cards?" } },
  {
    cue: 1,
    layout: LICENCE,
    edges: [{ from: "m45Papers", to: "m45Licence", label: "checked" }, { from: "m45Licence", to: "m45Folder" }],
    packets: [{ from: "m45Papers", to: "m45Licence", label: "papers" }, { from: "m45Licence", to: "m45Folder", label: "every step", delay: 60 }],
    badges: { m45Licence: "own number" },
  },
  { cue: 2, layout: STATES, edges: [...STATE_EDGES], accent: ["stPending"] },
  {
    cue: 3,
    layout: DOCS,
    edges: [{ from: "shop", to: "m45Docs", label: "upload" }],
    packets: [{ from: "shop", to: "m45Docs", label: "documents" }],
    badges: { m45Docs: "know your business" },
  },
  {
    cue: 4,
    layout: { ...DOCS, m45Fingerprint: [3, 1] },
    edges: [{ from: "shop", to: "m45Docs" }, { from: "m45Docs", to: "m45Fingerprint" }],
    badges: { m45Docs: "real type" },
    shake: { m45Docs: 0.4 },
  },
  {
    cue: 6,
    layout: { ...HIGH, m45Contract: [2, 2] },
    edges: [...STATE_EDGES, { from: "stContract", to: "m45Contract" }],
    accent: ["stVerified", "m45Contract"],
    badges: { stVerified: "all docs OK", m45Contract: "unique number" },
  },
  {
    cue: 7,
    layout: { ...HIGH, m45History: [1.5, 2] },
    edges: [...STATE_EDGES],
    packets: [
      { from: "stPending", to: "m45History", label: "who · why" },
      { from: "stContract", to: "m45History", label: "from · to", delay: 45 },
    ],
  },
  { cue: 8, layout: { ...HIGH, m45History: [1.5, 2] }, edges: [...STATE_EDGES], accent: ["m45History"], badges: { m45History: "years later" } },
];

export const map: BuildMapStep[] = [
  { cue: 5, part: 4, current: ["admin", "partner", "s3"], units: { ecom: "documents" } },
  { cue: 9, part: 4, current: ["partner", "admin"], units: { ecom: "next: two people" } },
];
