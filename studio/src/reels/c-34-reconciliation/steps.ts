import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 34: reconciliation. Two quiet mistakes (cues 4–8), the bank statement (9–12), our side and theirs
// (13–18), pairs and their four checks (19–21), breaks and exceptions (22–31), the product (32–53),
// what it protects (54–59).
const MISTAKE = { m78Ours: [0.4, 1], processing: [2.6, 1] } as const;
const MISTAKE_EDGE = [{ from: "m78Ours", to: "processing" }] as const;
const STATEMENT = { m78Statement: [0.4, 1], m78Records: [2.6, 1] } as const;
const STATEMENT_EDGE = [{ from: "m78Statement", to: "m78Records", label: "side by side" }] as const;
const BOOKS = { m78Ours: [0, 1], reconciliation: [1.5, 1], m78Theirs: [3, 1] } as const;
const BOOKS_EDGES = [{ from: "m78Ours", to: "reconciliation" }, { from: "m78Theirs", to: "reconciliation" }] as const;
const FETCH = { m78Ecom: [0, 1], zone: [1.5, 1], processing: [3, 1] } as const;
const FETCH_EDGES = [{ from: "zone", to: "m78Ecom" }, { from: "processing", to: "zone" }] as const;
const PAIR = { m78Ours: [0, 0.4], m78Theirs: [3, 0.4], m78Pair: [1.5, 1.6] } as const;
const PAIR_EDGES = [{ from: "m78Ours", to: "m78Pair" }, { from: "m78Theirs", to: "m78Pair" }] as const;
const CASE = { m78Pair: [0, 1], m78Exception: [1.5, 1], admin: [3, 1] } as const;
const CASE_EDGES = [{ from: "m78Pair", to: "m78Exception", label: "break" }, { from: "admin", to: "m78Exception", label: "works it" }] as const;
const DECIDE = { admin: [0, 1], m78Exception: [1.5, 1], checker: [3, 1] } as const;
const DECIDE_EDGES = [{ from: "admin", to: "m78Exception", label: "asks" }, { from: "checker", to: "m78Exception", label: "decides" }] as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 6, current: ["reconciliation", "procport", "adapters"] },
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 6, current: ["reconciliation", "procsvc"] },
  { cue: 2, part: 6, current: ["payment", "commission"] },
  { cue: 3, part: 6, current: ["reconciliation", "procsvc"] },
  { cue: 62, part: 6, current: ["payment", "partner"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // Two quiet mistakes.
  { cue: 4, layout: MISTAKE, edges: [...MISTAKE_EDGE] },
  { cue: 5, layout: MISTAKE, edges: [...MISTAKE_EDGE], packets: [{ from: "m78Ours", to: "processing", label: "charge", stopAt: 0.6 }], badges: { m78Ours: "timed out", processing: "booked" } },
  { cue: 6, layout: MISTAKE, edges: [...MISTAKE_EDGE], badges: { m78Ours: "paid", processing: "reversed overnight" } },
  { cue: 7, layout: MISTAKE, edges: [...MISTAKE_EDGE], badges: { m78Ours: "looks fine" }, accent: ["m78Ours"] },
  { cue: 8, layout: { acquirer: [1.5, 1] }, badges: { acquirer: "short · which one?" }, danger: ["acquirer"] },
  // The bank statement.
  { cue: 9, layout: STATEMENT, edges: [...STATEMENT_EDGE], accent: ["m78Statement"] },
  { cue: 10, layout: STATEMENT, edges: [...STATEMENT_EDGE], accent: ["m78Records"] },
  { cue: 11, layout: STATEMENT, edges: [...STATEMENT_EDGE], badges: { m78Statement: "ticked" } },
  { cue: 12, layout: STATEMENT, edges: [...STATEMENT_EDGE], badges: { m78Statement: "ticked · one circled" }, danger: ["m78Statement"] },
  // Two sets of books.
  { cue: 13, layout: BOOKS, edges: [...BOOKS_EDGES], badges: { reconciliation: "every day" } },
  { cue: 14, layout: BOOKS, edges: [...BOOKS_EDGES], badges: { reconciliation: "line by line" }, accent: ["reconciliation"] },
  { cue: 15, layout: BOOKS, edges: [...BOOKS_EDGES], badges: { m78Ours: "charge · reversal · refund" }, accent: ["m78Ours"] },
  { cue: 16, layout: BOOKS, edges: [...BOOKS_EDGES], badges: { m78Theirs: "the day's report" }, accent: ["m78Theirs"] },
  {
    cue: 17,
    layout: FETCH,
    edges: [...FETCH_EDGES],
    packets: [{ from: "processing", to: "zone", label: "report" }, { from: "zone", to: "m78Ecom", label: "report", delay: 60 }],
    badges: { zone: "masked cards only" },
  },
  { cue: 18, layout: FETCH, edges: [...FETCH_EDGES], badges: { m78Ecom: "matches", zone: "hands over" }, accent: ["m78Ecom"] },
  // Pairs and four checks.
  { cue: 19, layout: PAIR, edges: [...PAIR_EDGES], badges: { m78Pair: "kind · payment · reference" }, accent: ["m78Pair"] },
  { cue: 20, layout: PAIR, edges: [...PAIR_EDGES], badges: { m78Pair: "four checks" }, accent: ["m78Pair"] },
  { cue: 21, layout: PAIR, edges: [...PAIR_EDGES], badges: { m78Pair: "four checks", m78Ours: "totals", m78Theirs: "totals" } },
  // Breaks and exceptions.
  { cue: 22, layout: PAIR, edges: [...PAIR_EDGES], badges: { m78Pair: "a break" }, danger: ["m78Pair"] },
  { cue: 23, layout: PAIR, edges: [PAIR_EDGES[0]], badges: { m78Pair: "disagree or missing", m78Theirs: "no line" }, crossed: ["m78Theirs"], danger: ["m78Pair"] },
  { cue: 24, layout: PAIR, edges: [...PAIR_EDGES], badges: { m78Pair: "unknown at close" }, danger: ["m78Pair"] },
  { cue: 25, layout: CASE, edges: [CASE_EDGES[0]], packets: [{ from: "m78Pair", to: "m78Exception", label: "exactly one" }], badges: { m78Exception: "owner · deadline" }, accent: ["m78Exception"] },
  { cue: 26, layout: CASE, edges: [...CASE_EDGES], packets: [{ from: "admin", to: "m78Exception", label: "takes it" }] },
  { cue: 27, layout: CASE, edges: [...CASE_EDGES], badges: { m78Exception: "resolved: evidence" }, accent: ["m78Exception"] },
  { cue: 28, layout: CASE, edges: [...CASE_EDGES], badges: { m78Exception: "real difference" }, danger: ["m78Exception"] },
  { cue: 29, layout: CASE, edges: [...CASE_EDGES], badges: { m78Exception: "write-off: closed" } },
  { cue: 30, layout: DECIDE, edges: [...DECIDE_EDGES], packets: [{ from: "admin", to: "m78Exception", label: "write off?" }], badges: { checker: "someone else" }, accent: ["checker"] },
  { cue: 31, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { m78Exception: "every change written" } },
  // What it protects.
  { cue: 54, layout: STATEMENT, edges: [...STATEMENT_EDGE] },
  { cue: 55, layout: STATEMENT, edges: [...STATEMENT_EDGE], badges: { m78Statement: "weeks apart" }, danger: ["m78Statement"] },
  { cue: 56, layout: STATEMENT, edges: [...STATEMENT_EDGE], badges: { m78Statement: "found next day" }, accent: ["m78Statement"] },
  { cue: 57, layout: CASE, edges: [...CASE_EDGES], badges: { m78Exception: "one owner · deadline" }, accent: ["m78Exception"] },
  { cue: 58, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { admin: "can't ignore alone" }, accent: ["checker"] },
  { cue: 59, layout: { acquirer: [0.4, 1], shop: [2.6, 1] }, badges: { acquirer: "its money", shop: "no lost payment" }, accent: ["acquirer", "shop"] },
  { cue: 60, layout: STATEMENT, edges: [...STATEMENT_EDGE] },
  { cue: 61, layout: STATEMENT, edges: [...STATEMENT_EDGE], badges: { m78Statement: "ticked · circled · owned" }, accent: ["m78Statement"] },
];

const S = "screens/c-34-reconciliation";
type Box = [number, number, number, number];
const PAGE: Box = [170, 40, 1000, 625];
const RIGHT: Box = [440, 40, 1000, 625];
const ITEMS: Box = [255, 380, 900, 562];
const TOP: Box = [820, 0, 620, 388];
const MID: Box = [820, 300, 620, 388];
const LOW: Box = [820, 512, 620, 388];
export const screens: ScreenStep[] = [
  {
    cue: 32,
    src: `${S}/runs.png`,
    title: "Bank console · Reconciliation",
    region: PAGE,
    beats: [
      { cue: 33, region: PAGE, focus: [[248, 80, 220, 40]] },
      { cue: 34, region: PAGE, focus: [[260, 156, 435, 36]] },
      { cue: 35, region: RIGHT, focus: [[1150, 290, 120, 50]] },
      { cue: 36, region: PAGE, focus: [[261, 280, 1158, 82]] },
      { cue: 37, region: PAGE, focus: [[1010, 290, 120, 50]] },
    ],
  },
  {
    cue: 38,
    src: `${S}/items.png`,
    title: "Bank console · Reconciliation",
    region: ITEMS,
    focus: [[280, 520, 160, 180]],
    beats: [
      { cue: 39, region: ITEMS, focus: [[480, 522, 130, 36]] },
      { cue: 40, region: [700, 380, 740, 462], focus: [[1080, 522, 190, 36]] },
    ],
  },
  {
    cue: 41,
    src: `${S}/exceptions.png`,
    title: "Bank console · Exceptions",
    region: PAGE,
    focus: [[248, 80, 400, 40]],
    beats: [
      { cue: 42, region: PAGE, focus: [[261, 212, 1158, 207]] },
      { cue: 43, region: RIGHT, focus: [[1240, 266, 175, 52]] },
    ],
  },
  { cue: 44, src: `${S}/taken.png`, title: "Bank console · Exception", region: [700, 420, 740, 462], focus: [[984, 836, 440, 48]] },
  {
    cue: 45,
    src: `${S}/reason.png`,
    title: "Bank console · Exception",
    region: MID,
    focus: [[853, 430, 554, 82]],
    beats: [{ cue: 46, region: MID, focus: [[952, 522, 120, 30]] }],
  },
  { cue: 47, src: `${S}/ask-write-off.png`, title: "Bank console · Exception", region: LOW, focus: [[984, 836, 440, 48]] },
  {
    cue: 48,
    src: `${S}/requester.png`,
    title: "Bank console · Exception · same admin",
    region: MID,
    focus: [[853, 580, 554, 34]],
    beats: [{ cue: 49, region: MID, focus: [[853, 616, 554, 26]] }],
  },
  {
    cue: 50,
    src: `${S}/approver.png`,
    title: "Bank console · Exception · second admin",
    region: MID,
    focus: [[836, 414, 588, 41]],
    beats: [{ cue: 51, region: MID, focus: [[952, 579, 135, 30]] }],
  },
  {
    cue: 52,
    src: `${S}/written-off.png`,
    title: "Bank console · Exception",
    region: TOP,
    focus: [[836, 62, 102, 20]],
    beats: [{ cue: 53, region: LOW, focus: [[836, 523, 588, 378]] }],
  },
];
