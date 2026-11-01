import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 17: earning a licence. Nobody checked (0–6), the driving licence (7–9), how it works (10–26),
// the product (27–48), what it protects (49–55).
const LICENCE = { m45Papers: [0, 1], m45Licence: [1.5, 1], m45Folder: [3, 1] } as const;
const LICENCE_EDGES = [{ from: "m45Papers", to: "m45Licence", label: "checked" }, { from: "m45Licence", to: "m45Folder" }] as const;
const STATES = { stPending: [0, 1], stVerified: [1, 1], stContract: [2, 1], stActive: [3, 1] } as const;
const STATE_EDGES = [
  { from: "stPending", to: "stVerified" },
  { from: "stVerified", to: "stContract" },
  { from: "stContract", to: "stActive" },
] as const;
const HIGH = { stPending: [0, 0.4], stVerified: [1, 0.4], stContract: [2, 0.4], stActive: [3, 0.4] } as const;
const DOCS = { shop: [0, 1], m45Docs: [1.5, 1], m45FileStore: [3, 1] } as const;
const DOCS_EDGES = [{ from: "shop", to: "m45Docs", label: "upload" }, { from: "m45Docs", to: "m45FileStore" }] as const;
const FAKE = { m45FakeFile: [0, 1], m45FileStore: [2.5, 1] } as const;
const PRINT = { m45FileStore: [0, 1], m45Fingerprint: [2.5, 1] } as const;
const REVIEW = { m45BankAdmin: [0, 1], m45Docs: [1.5, 1], shop: [3, 1] } as const;
const REVIEW_EDGES = [{ from: "m45BankAdmin", to: "m45Docs", label: "checks" }, { from: "m45Docs", to: "shop" }] as const;
const RUSH = { shop: [0, 1], buyer: [3, 0.3], m45BankAdmin: [3, 1.9] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { shop: [1.5, 1] }, badges: { shop: "take cards?" } },
  { cue: 4, layout: { shop: [0.5, 1], buyer: [2.5, 1] }, edges: [{ from: "buyer", to: "shop", label: "pays" }], packets: [{ from: "buyer", to: "shop", label: "Tuesday" }], badges: { shop: "signed up Monday" } },
  { cue: 5, layout: { shop: [0.5, 1], m45Papers: [2.5, 1] }, edges: [{ from: "m45Papers", to: "shop", broken: true }], crossed: ["m45Papers"], badges: { m45Papers: "nobody saw them" } },
  {
    cue: 6,
    layout: RUSH,
    edges: [{ from: "buyer", to: "shop", label: "disputes" }, { from: "m45BankAdmin", to: "shop", label: "who let it in?" }],
    packets: [{ from: "buyer", to: "shop", label: "complaint" }, { from: "buyer", to: "shop", label: "dispute", delay: 40 }],
    danger: ["shop"],
  },
  { cue: 7, layout: LICENCE, edges: [...LICENCE_EDGES], packets: [{ from: "m45Papers", to: "m45Licence", label: "papers" }] },
  { cue: 8, layout: LICENCE, edges: [...LICENCE_EDGES], packets: [{ from: "m45Licence", to: "m45Folder", label: "every step" }], badges: { m45Licence: "own number" } },
  { cue: 9, layout: STATES, edges: [...STATE_EDGES], accent: ["stPending"] },
  { cue: 11, layout: DOCS, edges: [...DOCS_EDGES], packets: [{ from: "shop", to: "m45Docs", label: "documents" }] },
  { cue: 12, layout: DOCS, edges: [...DOCS_EDGES], badges: { m45Docs: "who is it?" } },
  { cue: 13, layout: DOCS, edges: [...DOCS_EDGES], accent: ["m45Docs"], badges: { m45Docs: "know your business" } },
  { cue: 14, layout: DOCS, edges: [...DOCS_EDGES], packets: [{ from: "m45Docs", to: "m45FileStore", label: "file" }], accent: ["m45FileStore"] },
  { cue: 15, layout: DOCS, edges: [...DOCS_EDGES], badges: { m45FileStore: "contents, not name" } },
  {
    cue: 16,
    layout: FAKE,
    edges: [{ from: "m45FakeFile", to: "m45FileStore" }],
    packets: [{ from: "m45FakeFile", to: "m45FileStore", label: "charter.pdf", stopAt: 0.7 }],
    danger: ["m45FakeFile"],
    badges: { m45FileStore: "refused" },
  },
  { cue: 17, layout: PRINT, edges: [{ from: "m45FileStore", to: "m45Fingerprint", label: "every byte" }], accent: ["m45Fingerprint"], badges: { m45Fingerprint: "checksum" } },
  { cue: 18, layout: PRINT, edges: [{ from: "m45FileStore", to: "m45Fingerprint", label: "read back" }], packets: [{ from: "m45FileStore", to: "m45Fingerprint", label: "match?" }], badges: { m45Fingerprint: "changed = caught" } },
  { cue: 19, layout: REVIEW, edges: [...REVIEW_EDGES], packets: [{ from: "m45BankAdmin", to: "m45Docs", label: "check" }], accent: ["m45BankAdmin"] },
  { cue: 20, layout: REVIEW, edges: [...REVIEW_EDGES], packets: [{ from: "m45Docs", to: "shop", label: "rejected: why" }], badges: { m45Docs: "verified · rejected" } },
  { cue: 21, layout: STATES, edges: [...STATE_EDGES], accent: ["stVerified"], badges: { stVerified: "all docs OK" } },
  { cue: 22, layout: { ...HIGH, m45Contract: [2, 2] }, edges: [...STATE_EDGES, { from: "stContract", to: "m45Contract" }], accent: ["m45Contract"], badges: { m45Contract: "C-2026-0042" } },
  { cue: 23, layout: { ...HIGH, m45Contract: [2, 2] }, edges: [...STATE_EDGES, { from: "stContract", to: "m45Contract" }], badges: { m45Contract: "never shared" } },
  {
    cue: 24,
    layout: { ...HIGH, m45History: [1.5, 2] },
    edges: [...STATE_EDGES],
    packets: [{ from: "stPending", to: "m45History", label: "who · why" }, { from: "stContract", to: "m45History", label: "from · to", delay: 45 }],
  },
  { cue: 25, layout: { ...HIGH, m45History: [1.5, 2] }, edges: [...STATE_EDGES], accent: ["m45History"], badges: { m45History: "same step" } },
  { cue: 26, layout: { ...HIGH, m45History: [1.5, 2] }, edges: [...STATE_EDGES], accent: ["m45History"], badges: { m45History: "no record, no move" } },
  { cue: 49, layout: RUSH, edges: [{ from: "buyer", to: "shop" }, { from: "m45BankAdmin", to: "shop" }], badges: { shop: "protect what?" } },
  { cue: 50, layout: REVIEW, edges: [...REVIEW_EDGES], accent: ["m45Docs"], badges: { shop: "who is paid?" } },
  { cue: 51, layout: PRINT, edges: [{ from: "m45FileStore", to: "m45Fingerprint" }], accent: ["m45Fingerprint"], badges: { m45Fingerprint: "no swaps" } },
  { cue: 52, layout: { ...HIGH, m45History: [1.5, 2] }, edges: [...STATE_EDGES], accent: ["m45History"], badges: { m45History: "who approved" } },
  { cue: 53, layout: { m45Docs: [0, 1], bank: [2, 0.3], buyer: [2, 1.9] }, edges: [{ from: "m45Docs", to: "bank" }, { from: "m45Docs", to: "buyer" }], accent: ["m45Docs"], badges: { m45Docs: "know your business" } },
  { cue: 54, layout: { m45BankAdmin: [0, 1], m45History: [2.5, 1] }, edges: [{ from: "m45BankAdmin", to: "m45History", label: "what · when" }], accent: ["m45BankAdmin"] },
  { cue: 55, layout: LICENCE, edges: [...LICENCE_EDGES], accent: ["m45Licence"], badges: { m45Licence: "unique number" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 4, current: ["partner"] },
  { cue: 2, part: 4, current: ["partner"] },
  { cue: 3, part: 4, current: ["partner", "admin"] },
  { cue: 10, part: 4, current: ["admin", "partner", "s3"], units: { ecom: "documents" } },
  { cue: 56, part: 4, current: ["partner", "admin"], units: { ecom: "next: two people" } },
];

const DIR = "screens/c-17-lifecycle";
const DOCS_TOP: [number, number, number, number] = [240, 60, 800, 500];
const ADMIN_DOCS: [number, number, number, number] = [250, 280, 880, 550];
const ACTIONS: [number, number, number, number] = [620, 150, 820, 512];
export const screens: ScreenStep[] = [
  {
    cue: 28,
    src: `${DIR}/docs.png`,
    title: "Merchant portal · Documents",
    region: DOCS_TOP,
    beats: [
      { cue: 29, region: DOCS_TOP, focus: [[260, 80, 477, 60]] },
      { cue: 30, region: DOCS_TOP, focus: [[260, 263, 760, 117], [260, 396, 760, 117]] },
      { cue: 31, region: [240, 280, 800, 500], focus: [[260, 528, 760, 117], [260, 661, 760, 117]] },
    ],
  },
  { cue: 32, src: `${DIR}/docs-chosen.png`, title: "Merchant portal · Documents", region: [240, 200, 800, 500], focus: [[323, 333, 116, 30], [323, 413, 72, 30]] },
  {
    cue: 33,
    src: `${DIR}/docs-uploaded.png`,
    title: "Merchant portal · Documents",
    region: [700, 438, 740, 462],
    focus: [[996, 838, 390, 44]],
    beats: [{ cue: 34, region: [240, 200, 800, 500], focus: [[858, 275, 140, 30]] }],
  },
  {
    cue: 36,
    src: `${DIR}/docs-refused.png`,
    title: "Merchant portal · Documents",
    region: [240, 380, 800, 500],
    focus: [[260, 447, 760, 197]],
    beats: [
      { cue: 37, region: [240, 380, 800, 500], focus: [[323, 495, 300, 40]] },
      { cue: 38, region: [700, 438, 740, 462], focus: [[996, 823, 390, 61]] },
    ],
  },
  {
    cue: 39,
    src: `${DIR}/admin-review.png`,
    title: "Bank console · Merchant",
    region: [250, 50, 1180, 738],
    beats: [
      { cue: 40, region: [250, 50, 1180, 738], focus: [[270, 80, 400, 60]] },
      { cue: 41, region: ADMIN_DOCS, focus: [[354, 577, 148, 30], [354, 761, 148, 30]] },
    ],
  },
  { cue: 42, src: `${DIR}/admin-reject.png`, title: "Bank console · Merchant", region: [380, 220, 680, 425], focus: [[500, 294, 440, 251]] },
  { cue: 43, src: `${DIR}/admin-approve.png`, title: "Bank console · Merchant", region: [250, 180, 880, 550], focus: [[344, 380, 641, 50]] },
  { cue: 44, src: `${DIR}/admin-unverified.png`, title: "Bank console · Merchant", region: ACTIONS, focus: [[1064, 353, 325, 36], [1097, 273, 260, 75]] },
  { cue: 45, src: `${DIR}/admin-approve.png`, title: "Bank console · Merchant", region: ACTIONS, focus: [[1064, 353, 325, 36]] },
  { cue: 46, src: `${DIR}/admin-contract.png`, title: "Bank console · Merchant", region: [380, 250, 680, 425], focus: [[516, 466, 408, 40], [796, 522, 130, 36]] },
  { cue: 47, src: `${DIR}/admin-history.png`, title: "Bank console · Merchant", region: [250, 350, 880, 550], focus: [[270, 557, 753, 323]] },
];
