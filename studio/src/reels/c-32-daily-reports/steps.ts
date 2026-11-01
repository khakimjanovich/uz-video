import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 32: the merchant's day. The month that doesn't add up (cues 1–6), the till (7–11), the business day
// (12–15), the four numbers (16–24), counting again (25–32), the product (33–51), what it protects (52–58).
const OFF = { m78Payout: [0.4, 1], m78Records: [2.6, 1] } as const;
const OFF_EDGE = [{ from: "m78Payout", to: "m78Records", label: "side by side" }] as const;
const TILL = { shop: [0.4, 1], m78Till: [2.6, 1] } as const;
const NIGHT = { salespoint: [0, 1], m78Night: [1.5, 1], m78Report: [3, 1] } as const;
const NIGHT_EDGES = [{ from: "salespoint", to: "m78Night" }, { from: "m78Night", to: "m78Report" }] as const;
const DAY = { m78Day: [1.5, 0.3], m78Reversal: [0.5, 1.9], m78Refund: [2.5, 1.9] } as const;
const DAY_EDGES = [{ from: "m78Day", to: "m78Reversal", label: "same day" }, { from: "m78Day", to: "m78Refund", label: "later" }] as const;
const TOTALS = { m78Paid: [0, 1], m78Fee: [1, 1], m78Refunded: [2, 1], m78Payout: [3, 1] } as const;
const SUM = { m78Paid: "+ paid", m78Fee: "− fee", m78Refunded: "− refunded", m78Payout: "= payout" };
const REBUILD = { m78Night: [0.4, 1], m78Report: [2.6, 1] } as const;
const SHEET = { m78Report: [0.4, 1], m78Sheet: [2.6, 1] } as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 7, current: ["merchant", "reconciliation"] },
  { cue: 59, part: 7, current: ["buyer", "admin"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The month that doesn't add up.
  { cue: 1, layout: OFF, edges: [...OFF_EDGE], accent: ["m78Payout", "m78Records"] },
  { cue: 2, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "one week off" }, danger: ["m78Payout"] },
  { cue: 3, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "refund counted today?" }, danger: ["m78Payout"] },
  { cue: 4, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "reversal as a sale?" }, danger: ["m78Payout"] },
  { cue: 5, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "a night not run?" }, danger: ["m78Payout"] },
  { cue: 6, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "can't take apart" }, crossed: ["m78Payout"] },
  // The till.
  { cue: 7, layout: TILL, edges: [{ from: "shop", to: "m78Till" }], accent: ["m78Till"] },
  { cue: 8, layout: TILL, edges: [{ from: "shop", to: "m78Till", label: "count" }], packets: [{ from: "shop", to: "m78Till", label: "count" }] },
  { cue: 9, layout: TILL, edges: [{ from: "shop", to: "m78Till", label: "count" }], packets: [{ from: "shop", to: "m78Till", label: "again" }], badges: { m78Till: "same answer" } },
  { cue: 10, layout: TILL, edges: [{ from: "shop", to: "m78Till" }], badges: { shop: "a clear day", m78Till: "a repeatable count" } },
  { cue: 11, layout: NIGHT, edges: [...NIGHT_EDGES], packets: [{ from: "m78Night", to: "m78Report", label: "totals", delay: 30 }], badges: { m78Night: "every night" }, accent: ["m78Night"] },
  // The business day.
  { cue: 12, layout: { m78Day: [1.5, 1] }, accent: ["m78Day"] },
  { cue: 13, layout: { m78Day: [1.5, 1] }, badges: { m78Day: "bank's time zone" }, accent: ["m78Day"] },
  { cue: 14, layout: DAY, edges: [...DAY_EDGES], badges: { m78Day: "Lesson 30" } },
  { cue: 15, layout: DAY, edges: [...DAY_EDGES], badges: { m78Day: "one day for both" }, accent: ["m78Day"] },
  // The four numbers.
  { cue: 16, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { m78Night: "the count" } },
  { cue: 17, layout: TOTALS, badges: { m78Payout: "four numbers" } },
  { cue: 18, layout: TOTALS, badges: { m78Paid: "not reversed" }, accent: ["m78Paid"] },
  { cue: 19, layout: TOTALS, badges: { m78Paid: "not reversed", m78Refunded: "made that day" }, accent: ["m78Refunded"] },
  { cue: 20, layout: TOTALS, badges: { m78Paid: "not reversed", m78Refunded: "made that day", m78Fee: "Lesson 22" }, accent: ["m78Fee"] },
  { cue: 21, layout: TOTALS, badges: SUM, accent: ["m78Payout"] },
  { cue: 22, layout: TOTALS, badges: { ...SUM, m78Refunded: "− many refunds", m78Payout: "negative" }, danger: ["m78Payout"] },
  { cue: 23, layout: TOTALS, badges: { ...SUM, m78Refunded: "− many refunds", m78Payout: "not an error" } },
  { cue: 24, layout: TOTALS, badges: { ...SUM, m78Refunded: "− many refunds", m78Payout: "the honest answer" }, accent: ["m78Payout"] },
  // Counting again.
  { cue: 25, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report" }] },
  { cue: 26, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report", label: "rebuild" }], packets: [{ from: "m78Night", to: "m78Report", label: "count again" }] },
  { cue: 27, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report", label: "rebuild" }], badges: { m78Report: "replaced, not added" }, accent: ["m78Report"] },
  { cue: 28, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report", label: "rebuild" }], badges: { m78Night: "yesterday + days before" } },
  {
    cue: 29,
    layout: REBUILD,
    edges: [{ from: "m78Night", to: "m78Report", label: "rebuild" }],
    packets: [{ from: "m78Night", to: "m78Report", label: "missed night" }],
    badges: { m78Night: "catches up" },
  },
  { cue: 30, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report" }], badges: { m78Report: "never twice" }, accent: ["m78Report"] },
  { cue: 31, layout: { m78Report: [0.4, 1], m78Lines: [2.6, 1] }, edges: [{ from: "m78Report", to: "m78Lines", label: "every line" }], badges: { m78Lines: "refund: negative" }, accent: ["m78Lines"] },
  { cue: 32, layout: { m78Report: [0.4, 1], m78Lines: [2.6, 1] }, edges: [{ from: "m78Report", to: "m78Lines", label: "explains" }], badges: { m78Lines: "one line at a time" } },
  // The day's file, opened in a spreadsheet.
  { cue: 45, layout: SHEET, edges: [{ from: "m78Report", to: "m78Sheet", label: "download" }], packets: [{ from: "m78Report", to: "m78Sheet", label: "the day's lines" }], accent: ["m78Sheet"] },
  { cue: 46, layout: SHEET, edges: [{ from: "m78Report", to: "m78Sheet" }], badges: { m78Sheet: "order · amount · fee" } },
  { cue: 47, layout: SHEET, edges: [{ from: "m78Report", to: "m78Sheet" }], badges: { m78Sheet: "refund: −499.00" } },
  { cue: 48, layout: SHEET, edges: [{ from: "m78Report", to: "m78Sheet" }], badges: { m78Sheet: "123456******7890" } },
  { cue: 49, layout: SHEET, edges: [{ from: "m78Report", to: "m78Sheet", label: "adds up" }], badges: { m78Report: "the totals", m78Sheet: "sum of lines" }, accent: ["m78Report"] },
  // What it protects.
  { cue: 52, layout: OFF, edges: [...OFF_EDGE] },
  { cue: 53, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "can be checked" }, accent: ["m78Payout"] },
  { cue: 54, layout: { m78Support: [0.4, 1], m78Report: [2.6, 1] }, edges: [{ from: "m78Support", to: "m78Report" }], badges: { m78Report: "taken apart" } },
  { cue: 55, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report" }], badges: { m78Night: "missed night?", m78Report: "counted twice?" }, crossed: ["m78Report"] },
  { cue: 56, layout: TOTALS, badges: SUM, accent: ["m78Payout"] },
  { cue: 57, layout: TILL, edges: [{ from: "shop", to: "m78Till" }] },
  { cue: 58, layout: TILL, edges: [{ from: "shop", to: "m78Till", label: "same way" }], badges: { m78Till: "every coin" }, accent: ["m78Till"] },
];

const REPORTS = "screens/c-32-daily-reports/reports.png";
const TABLE: [number, number, number, number] = [255, 150, 960, 600];
const MONEY: [number, number, number, number] = [600, 150, 790, 494];
export const screens: ScreenStep[] = [
  {
    cue: 33,
    src: REPORTS,
    title: "Merchant portal · Reports",
    beats: [
      { cue: 34, region: [0, 0, 760, 475], focus: [[12, 276, 215, 41]] },
      { cue: 35, region: [240, 60, 860, 537], focus: [[258, 80, 160, 40]] },
      { cue: 36, region: [240, 60, 860, 537], focus: [[258, 118, 826, 22]] },
      { cue: 37, region: TABLE, focus: [[261, 207, 1158, 186]] },
      { cue: 38, region: TABLE, focus: [[261, 160, 1158, 46]] },
      { cue: 39, region: TABLE, focus: [[261, 207, 1158, 62]] },
      { cue: 40, region: MONEY, focus: [[668, 216, 110, 44]] },
      { cue: 41, region: MONEY, focus: [[952, 216, 110, 44]] },
      { cue: 42, region: MONEY, focus: [[1100, 222, 100, 30]] },
      { cue: 43, region: MONEY, focus: [[1100, 346, 100, 30]] },
      { cue: 44, region: MONEY, focus: [[1274, 346, 78, 32]] },
    ],
  },
  {
    cue: 50,
    src: "screens/c-32-daily-reports/reports-empty.png",
    title: "Merchant portal · Reports",
    region: [440, 160, 800, 500],
    focus: [[776, 272, 130, 30]],
    beats: [{ cue: 51, region: [440, 160, 800, 500], focus: [[632, 306, 416, 26]] }],
  },
];
