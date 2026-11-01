import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 36: reconciliation. Wednesday morning the bank is short, and two of Malika's payments look fine (cues 0–5),
// the bridge (6–7), our side and theirs (8–13), pairs and their four checks (14–16), breaks and exceptions (17–28),
// Dilnoza's screens (29–49), what it protects (50–52), next (53).
const MISTAKE = { m78Ours: [0.4, 1], processing: [2.6, 1] } as const;
const MISTAKE_EDGE = [{ from: "m78Ours", to: "processing" }] as const;
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
  // The bridge: what this lesson uses from the ones before.
  { cue: 6, part: 6, current: ["procsvc", "payment", "commission"], units: { ecom: "checked · counted" } },
  { cue: 7, part: 6, current: ["reconciliation", "procport", "adapters"] },
  { cue: 53, part: 6, current: ["payment", "partner"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // Wednesday morning: the bank is short.
  { cue: 0, layout: { network: [0.4, 1], acquirer: [2.6, 1] }, edges: [{ from: "network", to: "acquirer" }], badges: { acquirer: "Wednesday" } },
  { cue: 1, layout: { network: [0.4, 1], acquirer: [2.6, 1] }, edges: [{ from: "network", to: "acquirer" }], packets: [{ from: "network", to: "acquirer", label: "money" }], badges: { acquirer: "short" }, danger: ["acquirer"] },
  { cue: 2, layout: { network: [0.4, 1], acquirer: [2.6, 1] }, edges: [{ from: "network", to: "acquirer" }], badges: { acquirer: "which payment?" }, danger: ["acquirer"] },
  // Two quiet mistakes on Tuesday night.
  {
    cue: 3,
    layout: MISTAKE,
    edges: [...MISTAKE_EDGE],
    packets: [{ from: "m78Ours", to: "processing", label: "Malika's charge", stopAt: 0.6 }],
    badges: { m78Ours: "timed out", processing: "booked" },
  },
  { cue: 4, layout: MISTAKE, edges: [...MISTAKE_EDGE], badges: { m78Ours: "paid", processing: "reversed overnight" } },
  { cue: 5, layout: MISTAKE, edges: [...MISTAKE_EDGE], badges: { m78Ours: "looks fine" }, accent: ["m78Ours"] },
  // Two sets of books.
  { cue: 8, layout: BOOKS, edges: [...BOOKS_EDGES], badges: { reconciliation: "every day" } },
  { cue: 9, layout: BOOKS, edges: [...BOOKS_EDGES], badges: { reconciliation: "line by line" }, accent: ["reconciliation"] },
  { cue: 10, layout: BOOKS, edges: [...BOOKS_EDGES], badges: { m78Ours: "charge · reversal · refund" }, accent: ["m78Ours"] },
  { cue: 11, layout: BOOKS, edges: [...BOOKS_EDGES], badges: { m78Theirs: "the day's report" }, accent: ["m78Theirs"] },
  {
    cue: 12,
    layout: FETCH,
    edges: [...FETCH_EDGES],
    packets: [{ from: "processing", to: "zone", label: "report" }, { from: "zone", to: "m78Ecom", label: "report", delay: 60 }],
    badges: { zone: "masked cards only" },
  },
  { cue: 13, layout: FETCH, edges: [...FETCH_EDGES], badges: { m78Ecom: "matches", zone: "hands over" }, accent: ["m78Ecom"] },
  // Pairs and four checks.
  { cue: 14, layout: PAIR, edges: [...PAIR_EDGES], badges: { m78Pair: "kind · payment · reference" }, accent: ["m78Pair"] },
  { cue: 15, layout: PAIR, edges: [...PAIR_EDGES], badges: { m78Pair: "four checks" }, accent: ["m78Pair"] },
  { cue: 16, layout: PAIR, edges: [...PAIR_EDGES], badges: { m78Pair: "four checks", m78Ours: "totals", m78Theirs: "totals" } },
  // Breaks and exceptions.
  { cue: 17, layout: PAIR, edges: [...PAIR_EDGES], badges: { m78Pair: "a break" }, danger: ["m78Pair"] },
  { cue: 18, layout: PAIR, edges: [PAIR_EDGES[0]], badges: { m78Pair: "disagree or missing", m78Theirs: "no line" }, crossed: ["m78Theirs"], danger: ["m78Pair"] },
  { cue: 19, layout: PAIR, edges: [...PAIR_EDGES], badges: { m78Pair: "unknown at close" }, danger: ["m78Pair"] },
  { cue: 20, layout: CASE, edges: [CASE_EDGES[0]], packets: [{ from: "m78Pair", to: "m78Exception", label: "exactly one" }], badges: { m78Exception: "owner · deadline" }, accent: ["m78Exception"] },
  { cue: 21, layout: CASE, edges: [CASE_EDGES[0]], badges: { m78Exception: "an owner" }, accent: ["m78Exception"] },
  { cue: 22, layout: CASE, edges: [CASE_EDGES[0]], badges: { m78Exception: "no owner: no fix" }, crossed: ["admin"], danger: ["m78Exception"] },
  { cue: 23, layout: CASE, edges: [...CASE_EDGES], packets: [{ from: "admin", to: "m78Exception", label: "takes it" }] },
  { cue: 24, layout: CASE, edges: [...CASE_EDGES], badges: { m78Exception: "resolved: evidence" }, accent: ["m78Exception"] },
  { cue: 25, layout: CASE, edges: [...CASE_EDGES], badges: { m78Exception: "real difference" }, danger: ["m78Exception"] },
  { cue: 26, layout: CASE, edges: [...CASE_EDGES], badges: { m78Exception: "write-off: closed" } },
  { cue: 27, layout: DECIDE, edges: [...DECIDE_EDGES], packets: [{ from: "admin", to: "m78Exception", label: "write off?" }], badges: { checker: "someone else" }, accent: ["checker"] },
  { cue: 28, layout: DECIDE, edges: [...DECIDE_EDGES], badges: { m78Exception: "every change written" } },
  // What it protects.
  { cue: 50, layout: BOOKS, edges: [...BOOKS_EDGES], badges: { reconciliation: "weeks apart?" }, crossed: ["reconciliation"], danger: ["m78Ours", "m78Theirs"] },
  { cue: 51, layout: CASE, edges: [...CASE_EDGES], badges: { m78Pair: "found Wednesday", m78Exception: "one owner · deadline" }, accent: ["m78Exception"] },
  { cue: 52, layout: { acquirer: [0.4, 1], shop: [2.6, 1] }, badges: { acquirer: "its money", shop: "Malika: nothing lost" }, accent: ["acquirer", "shop"] },
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
    cue: 29,
    src: `${S}/runs.png`,
    title: "Bank console · Reconciliation",
    region: PAGE,
    focus: [[248, 80, 220, 40]],
    beats: [
      { cue: 30, region: PAGE, focus: [[260, 156, 435, 36]] },
      { cue: 31, region: RIGHT, focus: [[1150, 290, 120, 50]] },
      { cue: 32, region: PAGE, focus: [[261, 280, 1158, 82]] },
      { cue: 33, region: PAGE, focus: [[1010, 290, 120, 50]] },
    ],
  },
  {
    cue: 34,
    src: `${S}/items.png`,
    title: "Bank console · Reconciliation",
    region: ITEMS,
    focus: [[280, 520, 160, 180]],
    beats: [
      { cue: 35, region: ITEMS, focus: [[480, 522, 130, 36]] },
      { cue: 36, region: [700, 380, 740, 462], focus: [[1080, 522, 190, 36]] },
    ],
  },
  {
    cue: 37,
    src: `${S}/exceptions.png`,
    title: "Bank console · Exceptions",
    region: PAGE,
    focus: [[248, 80, 400, 40]],
    beats: [
      { cue: 38, region: PAGE, focus: [[261, 212, 1158, 207]] },
      { cue: 39, region: RIGHT, focus: [[1240, 266, 175, 52]] },
    ],
  },
  { cue: 40, src: `${S}/taken.png`, title: "Bank console · Exception", region: [700, 420, 740, 462], focus: [[984, 836, 440, 48]] },
  {
    cue: 41,
    src: `${S}/reason.png`,
    title: "Bank console · Exception",
    region: MID,
    focus: [[853, 430, 554, 82]],
    beats: [{ cue: 42, region: MID, focus: [[952, 522, 120, 30]] }],
  },
  { cue: 43, src: `${S}/ask-write-off.png`, title: "Bank console · Exception", region: LOW, focus: [[984, 836, 440, 48]] },
  {
    cue: 44,
    src: `${S}/requester.png`,
    title: "Bank console · Exception · same admin",
    region: MID,
    focus: [[853, 580, 554, 34]],
    beats: [{ cue: 45, region: MID, focus: [[853, 616, 554, 26]] }],
  },
  {
    cue: 46,
    src: `${S}/approver.png`,
    title: "Bank console · Exception · second admin",
    region: MID,
    focus: [[836, 414, 588, 41]],
    beats: [{ cue: 47, region: MID, focus: [[952, 579, 135, 30]] }],
  },
  {
    cue: 48,
    src: `${S}/written-off.png`,
    title: "Bank console · Exception",
    region: TOP,
    focus: [[836, 62, 102, 20]],
    beats: [{ cue: 49, region: LOW, focus: [[836, 523, 588, 378]] }],
  },
];
