import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 17: earning the right to take money, told through Malika's Monday and Dilnoza's review.
// Monday morning (0), the bridge (1), the documents page (2–5), know your business (6–9), upload (10–12),
// the file store and the trick (13–17), the checksum (18–19), Dilnoza's review (20–28), the contract number (29),
// the status history (30–35), who it protects (36–37), still no money (38–39), next (40).
const STATES = { stPending: [0, 1], stVerified: [1, 1], stContract: [2, 1], stActive: [3, 1] } as const;
const STATE_EDGES = [
  { from: "stPending", to: "stVerified" },
  { from: "stVerified", to: "stContract" },
  { from: "stContract", to: "stActive" },
] as const;
const HIGH = { stPending: [0, 0.4], stVerified: [1, 0.4], stContract: [2, 0.4], stActive: [3, 0.4] } as const;
const DOCS = { shop: [0, 1], m45Docs: [1.5, 1], m45FileStore: [3, 1] } as const;
const DOCS_EDGES = [{ from: "shop", to: "m45Docs", label: "upload" }, { from: "m45Docs", to: "m45FileStore" }] as const;
const PRINT = { m45FileStore: [0, 1], m45Fingerprint: [2.5, 1] } as const;
const RUSH = { shop: [0, 1], buyer: [3, 0.3], m45BankAdmin: [3, 1.9] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Monday morning: the shop exists, but takes nothing.
  { cue: 0, layout: { shop: [1.5, 1] }, badges: { shop: "Mon · no payments" } },
  // Know your business, and the shop nobody checked.
  { cue: 6, layout: DOCS, edges: [...DOCS_EDGES], badges: { m45Docs: "who is it?" } },
  { cue: 7, layout: DOCS, edges: [...DOCS_EDGES], accent: ["m45Docs"], badges: { m45Docs: "know your business" } },
  { cue: 8, layout: { shop: [0.5, 1], buyer: [2.5, 1] }, edges: [{ from: "buyer", to: "shop", label: "pays" }], packets: [{ from: "buyer", to: "shop", label: "by lunch" }], badges: { shop: "nobody saw its papers" } },
  {
    cue: 9,
    layout: RUSH,
    edges: [{ from: "buyer", to: "shop", label: "disputes" }, { from: "m45BankAdmin", to: "shop", label: "who let it in?" }],
    packets: [{ from: "buyer", to: "shop", label: "complaint" }, { from: "buyer", to: "shop", label: "dispute", delay: 40 }],
    danger: ["shop"],
  },
  // The file store reads the contents, and keeps a fingerprint.
  { cue: 13, layout: DOCS, edges: [...DOCS_EDGES], packets: [{ from: "m45Docs", to: "m45FileStore", label: "charter" }], accent: ["m45FileStore"] },
  { cue: 14, layout: DOCS, edges: [...DOCS_EDGES], badges: { m45FileStore: "contents, not name" } },
  { cue: 18, layout: PRINT, edges: [{ from: "m45FileStore", to: "m45Fingerprint", label: "every byte" }], accent: ["m45Fingerprint"], badges: { m45Fingerprint: "checksum" } },
  { cue: 19, layout: PRINT, edges: [{ from: "m45FileStore", to: "m45Fingerprint", label: "read back" }], packets: [{ from: "m45FileStore", to: "m45Fingerprint", label: "match?" }], badges: { m45Fingerprint: "swapped = caught" } },
  // Every document verified, then the company.
  { cue: 25, layout: STATES, edges: [...STATE_EDGES], accent: ["stVerified"], badges: { stVerified: "all docs OK" } },
  // A unique contract number.
  { cue: 29, layout: { ...HIGH, m45Contract: [2, 2] }, edges: [...STATE_EDGES, { from: "stContract", to: "m45Contract" }], accent: ["m45Contract"], badges: { m45Contract: "never shared" } },
  // The status history: written with the move, or no move.
  {
    cue: 32,
    layout: { ...HIGH, m45History: [1.5, 2] },
    edges: [...STATE_EDGES],
    packets: [{ from: "stPending", to: "m45History", label: "who · why" }, { from: "stContract", to: "m45History", label: "from · to", delay: 45 }],
  },
  { cue: 33, layout: { ...HIGH, m45History: [1.5, 2] }, edges: [...STATE_EDGES], accent: ["m45History"], badges: { m45History: "first, not last" } },
  { cue: 34, layout: { ...HIGH, m45History: [1.5, 2] }, edges: [...STATE_EDGES], accent: ["m45History"], badges: { m45History: "no record, no move" } },
  { cue: 35, layout: { m45BankAdmin: [0, 1], m45History: [2.5, 1] }, edges: [{ from: "m45BankAdmin", to: "m45History", label: "why let in?" }], accent: ["m45History"], badges: { m45History: "Dilnoza · Monday" } },
  // Who it protects.
  { cue: 36, layout: { m45Docs: [0, 1], bank: [2, 0.3], buyer: [2, 1.9] }, edges: [{ from: "m45Docs", to: "bank" }, { from: "m45Docs", to: "buyer" }], accent: ["m45Docs"], badges: { m45Docs: "know your business" } },
  { cue: 37, layout: { m45BankAdmin: [0, 1], m45History: [2.5, 1] }, edges: [{ from: "m45BankAdmin", to: "m45History", label: "what · when" }], accent: ["m45BankAdmin"], badges: { m45BankAdmin: "Dilnoza" } },
  // Checked papers and a contract, but still no money.
  { cue: 38, layout: { ...HIGH, m45Contract: [2, 2] }, edges: [...STATE_EDGES, { from: "stContract", to: "m45Contract" }], accent: ["stContract"], badges: { m45Contract: "C-2026-0042" } },
  { cue: 39, layout: STATES, edges: [...STATE_EDGES], accent: ["stContract"], badges: { stActive: "not yet" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the one before.
  { cue: 1, part: 4, current: ["partner", "admin"] },
  { cue: 40, part: 4, current: ["partner", "admin"], units: { ecom: "next: two people" } },
];

const DIR = "screens/c-17-lifecycle";
const DOCS_TOP: [number, number, number, number] = [240, 60, 800, 500];
const ADMIN_DOCS: [number, number, number, number] = [250, 280, 880, 550];
const ACTIONS: [number, number, number, number] = [620, 150, 820, 512];
export const screens: ScreenStep[] = [
  {
    cue: 2,
    src: `${DIR}/docs.png`,
    title: "Merchant portal · Documents",
    region: DOCS_TOP,
    beats: [
      { cue: 3, region: DOCS_TOP, focus: [[260, 80, 477, 60]] },
      { cue: 4, region: DOCS_TOP, focus: [[260, 263, 760, 117], [260, 396, 760, 117]] },
      { cue: 5, region: [240, 280, 800, 500], focus: [[260, 528, 760, 117], [260, 661, 760, 117]] },
    ],
  },
  { cue: 10, src: `${DIR}/docs-chosen.png`, title: "Merchant portal · Documents", region: [240, 200, 800, 500], focus: [[323, 333, 116, 30], [323, 413, 72, 30]] },
  {
    cue: 11,
    src: `${DIR}/docs-uploaded.png`,
    title: "Merchant portal · Documents",
    region: [700, 438, 740, 462],
    focus: [[996, 838, 390, 44]],
    beats: [{ cue: 12, region: [240, 200, 800, 500], focus: [[858, 275, 140, 30]] }],
  },
  {
    cue: 15,
    src: `${DIR}/docs-refused.png`,
    title: "Merchant portal · Documents",
    region: [240, 380, 800, 500],
    focus: [[260, 447, 760, 197]],
    beats: [
      { cue: 16, region: [240, 380, 800, 500], focus: [[323, 495, 300, 40]] },
      { cue: 17, region: [700, 438, 740, 462], focus: [[996, 823, 390, 61]] },
    ],
  },
  {
    cue: 20,
    src: `${DIR}/admin-review.png`,
    title: "Bank console · Merchant",
    region: [250, 50, 1180, 738],
    beats: [
      { cue: 21, region: [250, 50, 1180, 738], focus: [[270, 80, 400, 60]] },
      { cue: 22, region: ADMIN_DOCS, focus: [[354, 577, 148, 30], [354, 761, 148, 30]] },
    ],
  },
  { cue: 23, src: `${DIR}/admin-reject.png`, title: "Bank console · Merchant", region: [380, 220, 680, 425], focus: [[500, 294, 440, 251]] },
  { cue: 24, src: `${DIR}/admin-approve.png`, title: "Bank console · Merchant", region: [250, 180, 880, 550], focus: [[344, 380, 641, 50]] },
  { cue: 26, src: `${DIR}/admin-unverified.png`, title: "Bank console · Merchant", region: ACTIONS, focus: [[1064, 353, 325, 36], [1097, 273, 260, 75]] },
  { cue: 27, src: `${DIR}/admin-approve.png`, title: "Bank console · Merchant", region: ACTIONS, focus: [[1064, 353, 325, 36]] },
  { cue: 28, src: `${DIR}/admin-contract.png`, title: "Bank console · Merchant", region: [380, 250, 680, 425], focus: [[516, 466, 408, 40], [796, 522, 130, 36]] },
  { cue: 30, src: `${DIR}/admin-history.png`, title: "Bank console · Merchant", region: [250, 350, 880, 550], focus: [[270, 557, 753, 323]] },
];
