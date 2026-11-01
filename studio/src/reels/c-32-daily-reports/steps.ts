import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 34: the merchant's day. Malika's accountant and the week that is off (cues 0–6), the bridge (7–8), the nightly
// count (9–10), the business day (11–14), the four numbers (15–23), counting again (24–33), Malika's reports (34–52),
// what it buys (53–54), next (55).
const OFF = { m78Payout: [0.4, 1], m78Records: [2.6, 1] } as const;
const OFF_EDGE = [{ from: "m78Payout", to: "m78Records", label: "side by side" }] as const;
const NIGHT = { salespoint: [0, 1], m78Night: [1.5, 1], m78Report: [3, 1] } as const;
const NIGHT_EDGES = [{ from: "salespoint", to: "m78Night" }, { from: "m78Night", to: "m78Report" }] as const;
const DAY = { m78Day: [1.5, 0.3], m78Reversal: [0.5, 1.9], m78Refund: [2.5, 1.9] } as const;
const DAY_EDGES = [{ from: "m78Day", to: "m78Reversal", label: "same day" }, { from: "m78Day", to: "m78Refund", label: "later" }] as const;
const TOTALS = { m78Paid: [0, 1], m78Fee: [1, 1], m78Refunded: [2, 1], m78Payout: [3, 1] } as const;
const SUM = { m78Paid: "+ paid", m78Fee: "− fee", m78Refunded: "− refunded", m78Payout: "= payout" };
const REBUILD = { m78Night: [0.4, 1], m78Report: [2.6, 1] } as const;
const SHEET = { m78Report: [0.4, 1], m78Sheet: [2.6, 1] } as const;

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 7, part: 6, current: ["payment", "commission"], units: { ecom: "the day's count" } },
  { cue: 8, part: 6, current: ["merchant", "reconciliation"] },
  { cue: 55, part: 6, current: ["buyer", "admin"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The last day of October: one week doesn't add up.
  { cue: 0, layout: OFF, edges: [...OFF_EDGE], badges: { m78Records: "Oct 31" } },
  { cue: 1, layout: OFF, edges: [...OFF_EDGE], badges: { m78Records: "Malika's orders" }, accent: ["m78Payout", "m78Records"] },
  { cue: 2, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "off by 2 bouquets" }, danger: ["m78Payout"] },
  { cue: 3, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "refund counted today?" }, danger: ["m78Payout"] },
  { cue: 4, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "reversal as a sale?" }, danger: ["m78Payout"] },
  { cue: 5, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "a night not run?" }, danger: ["m78Payout"] },
  { cue: 6, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "can't take apart" }, crossed: ["m78Payout"] },
  // The nightly count, and the two things that make it trustworthy.
  { cue: 9, layout: NIGHT, edges: [...NIGHT_EDGES], packets: [{ from: "m78Night", to: "m78Report", label: "totals", delay: 30 }], badges: { m78Night: "every night" }, accent: ["m78Night"] },
  { cue: 10, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { m78Night: "a clear day", m78Report: "a repeatable count" } },
  // The business day.
  { cue: 11, layout: { m78Day: [1.5, 1] }, accent: ["m78Day"] },
  { cue: 12, layout: { m78Day: [1.5, 1] }, badges: { m78Day: "bank's time zone" }, accent: ["m78Day"] },
  { cue: 13, layout: DAY, edges: [...DAY_EDGES], badges: { m78Day: "reversal or refund" } },
  { cue: 14, layout: DAY, edges: [...DAY_EDGES], badges: { m78Day: "one day for both" }, accent: ["m78Day"] },
  // The four numbers.
  { cue: 15, layout: NIGHT, edges: [...NIGHT_EDGES], badges: { m78Night: "the count" } },
  { cue: 16, layout: TOTALS, badges: { m78Payout: "four numbers" } },
  { cue: 17, layout: TOTALS, badges: { m78Paid: "not reversed" }, accent: ["m78Paid"] },
  { cue: 18, layout: TOTALS, badges: { m78Paid: "not reversed", m78Refunded: "made that day" }, accent: ["m78Refunded"] },
  { cue: 19, layout: TOTALS, badges: { m78Paid: "not reversed", m78Refunded: "made that day", m78Fee: "fee rules" }, accent: ["m78Fee"] },
  { cue: 20, layout: TOTALS, badges: SUM, accent: ["m78Payout"] },
  { cue: 21, layout: TOTALS, badges: { ...SUM, m78Refunded: "− many refunds", m78Payout: "negative" }, danger: ["m78Payout"] },
  { cue: 22, layout: TOTALS, badges: { ...SUM, m78Refunded: "− many refunds", m78Payout: "not an error" } },
  { cue: 23, layout: TOTALS, badges: { ...SUM, m78Refunded: "− many refunds", m78Payout: "the honest answer" }, accent: ["m78Payout"] },
  // Counting again.
  { cue: 24, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report" }] },
  { cue: 25, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report", label: "rebuild" }], packets: [{ from: "m78Night", to: "m78Report", label: "count again" }] },
  { cue: 26, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report", label: "rebuild" }], badges: { m78Report: "replaced, not added" }, accent: ["m78Report"] },
  { cue: 27, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report", label: "add" }], badges: { m78Report: "a running total" }, danger: ["m78Report"] },
  {
    cue: 28,
    layout: REBUILD,
    edges: [{ from: "m78Night", to: "m78Report", label: "add" }],
    packets: [{ from: "m78Night", to: "m78Report", label: "rerun" }],
    badges: { m78Report: "paid twice" },
    crossed: ["m78Report"],
    danger: ["m78Report"],
  },
  { cue: 29, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report", label: "rebuild" }], badges: { m78Night: "yesterday + days before" } },
  {
    cue: 30,
    layout: REBUILD,
    edges: [{ from: "m78Night", to: "m78Report", label: "rebuild" }],
    packets: [{ from: "m78Night", to: "m78Report", label: "missed night" }],
    badges: { m78Night: "catches up" },
  },
  { cue: 31, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report" }], badges: { m78Report: "never twice" }, accent: ["m78Report"] },
  { cue: 32, layout: { m78Report: [0.4, 1], m78Lines: [2.6, 1] }, edges: [{ from: "m78Report", to: "m78Lines", label: "every line" }], badges: { m78Lines: "refund: negative" }, accent: ["m78Lines"] },
  { cue: 33, layout: { m78Report: [0.4, 1], m78Lines: [2.6, 1] }, edges: [{ from: "m78Report", to: "m78Lines", label: "explains" }], badges: { m78Lines: "one line at a time" } },
  // The week's file, opened in a spreadsheet.
  { cue: 45, layout: SHEET, edges: [{ from: "m78Report", to: "m78Sheet", label: "download" }], packets: [{ from: "m78Report", to: "m78Sheet", label: "the week's lines" }], badges: { m78Sheet: "for the accountant" }, accent: ["m78Sheet"] },
  { cue: 46, layout: SHEET, edges: [{ from: "m78Report", to: "m78Sheet" }], badges: { m78Sheet: "order · amount · fee" } },
  { cue: 47, layout: SHEET, edges: [{ from: "m78Report", to: "m78Sheet" }], badges: { m78Sheet: "refund: −499.00" } },
  { cue: 48, layout: SHEET, edges: [{ from: "m78Report", to: "m78Sheet" }], badges: { m78Sheet: "123456******7890" } },
  { cue: 49, layout: SHEET, edges: [{ from: "m78Report", to: "m78Sheet", label: "adds up" }], badges: { m78Report: "the totals", m78Sheet: "sum of lines" }, accent: ["m78Report"] },
  { cue: 50, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "Monday's refund", m78Records: "last week's bouquet" }, accent: ["m78Payout", "m78Records"] },
  // What a clear day and a rebuild buy.
  { cue: 53, layout: OFF, edges: [...OFF_EDGE], badges: { m78Payout: "can be checked", m78Records: "taken apart" }, accent: ["m78Payout"] },
  { cue: 54, layout: REBUILD, edges: [{ from: "m78Night", to: "m78Report", label: "rebuild" }], badges: { m78Night: "a clear day", m78Report: "never missed or twice" }, accent: ["m78Night", "m78Report"] },
];

const REPORTS = "screens/c-32-daily-reports/reports.png";
const TABLE: [number, number, number, number] = [255, 150, 960, 600];
const MONEY: [number, number, number, number] = [600, 150, 790, 494];
export const screens: ScreenStep[] = [
  {
    cue: 34,
    src: REPORTS,
    title: "Merchant portal · Reports",
    region: [0, 0, 760, 475],
    focus: [[12, 276, 215, 41]],
    beats: [
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
    cue: 51,
    src: "screens/c-32-daily-reports/reports-empty.png",
    title: "Merchant portal · Reports",
    region: [440, 160, 800, 500],
    focus: [[776, 272, 130, 30]],
    beats: [{ cue: 52, region: [440, 160, 800, 500], focus: [[632, 306, 416, 26]] }],
  },
];
