import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 37: limits. Malika's busiest night and the stolen account (cues 0–4), the bridge (5–6), the two limits (7–11),
// the daily race, the obvious check and the atomic reservation (12–25), the edge (26–30), the product (31–39),
// the last minutes before midnight (40–44), what it protects (45–47), next (48).
const FIVE = ["pay", "pay", "pay", "pay", "pay"];
const RACE = { m78Buyers: [0.3, 1], m78PerDay: [2.7, 1] } as const;
const RACE_EDGE = [{ from: "m78Buyers", to: "m78PerDay" }] as const;
const five = (lastStops: boolean) =>
  FIVE.map((label, k) => ({ from: "m78Buyers" as const, to: "m78PerDay" as const, label, delay: 10 + k * 18, ...(lastStops && k === 4 ? { stopAt: 0.6 } : {}) }));
const LIMITS = { salespoint: [0.4, 1], m78PerPay: [2.6, 0.3], m78PerDay: [2.6, 1.8] } as const;
const LIMIT_EDGES = [{ from: "salespoint", to: "m78PerPay" }, { from: "salespoint", to: "m78PerDay" }] as const;
const PERPAY = { merchant: [0, 0.4], m78PerPay: [1.8, 1], shop: [0, 1.8] } as const;
const SAVE = { m78PerDay: [0, 1], record: [1.5, 1], network: [3, 1] } as const;
const SAVE_EDGES = [{ from: "m78PerDay", to: "record", label: "saved together" }, { from: "record", to: "network", label: "then asked" }] as const;
const EDGE = { buyer: [0, 1], m78EdgeDoor: [1.5, 1], m78Ecom: [3, 1] } as const;
const EDGE_EDGES = [{ from: "buyer", to: "m78EdgeDoor" }, { from: "m78EdgeDoor", to: "m78Ecom" }] as const;
const GUARDS = { acquirer: [0, 1], shop: [1.5, 1], buyer: [3, 1] } as const;

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 5, part: 6, current: ["partner", "payment"], units: { ecom: "deal limits · one claim" } },
  { cue: 6, part: 6, current: ["payment", "postgres"] },
  { cue: 48, part: 7, current: ["vault", "cardsinfra"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The seventh of March: Malika's busiest night.
  { cue: 0, layout: RACE, edges: [...RACE_EDGE], badges: { m78Buyers: "7 March · 23:50" } },
  { cue: 1, layout: { shop: [1.5, 1] }, badges: { shop: "Malika · busiest night" }, accent: ["shop"] },
  { cue: 2, layout: RACE, edges: [...RACE_EDGE], packets: five(false), badges: { m78Buyers: "at once" } },
  { cue: 3, layout: RACE, edges: [...RACE_EDGE], badges: { m78Buyers: "each fits alone", m78PerDay: "together: over" }, danger: ["m78PerDay"] },
  { cue: 4, layout: { attacker: [0.4, 1], salespoint: [2.6, 1] }, edges: [{ from: "attacker", to: "salespoint" }], packets: [{ from: "attacker", to: "salespoint", label: "a fortune" }], badges: { attacker: "stolen account" }, danger: ["attacker"] },
  // The two limits.
  { cue: 7, layout: LIMITS, edges: [...LIMIT_EDGES], badges: { m78PerPay: "one payment", m78PerDay: "one day" }, accent: ["m78PerPay", "m78PerDay"] },
  { cue: 8, layout: { admin: [0.4, 1], salespoint: [2.6, 1] }, edges: [{ from: "admin", to: "salespoint", label: "the deal" }], packets: [{ from: "admin", to: "salespoint", label: "both limits" }] },
  { cue: 9, layout: PERPAY, edges: [{ from: "merchant", to: "m78PerPay" }], accent: ["m78PerPay"] },
  { cue: 10, layout: PERPAY, edges: [{ from: "merchant", to: "m78PerPay" }], packets: [{ from: "merchant", to: "m78PerPay", label: "too big", stopAt: 0.7 }], badges: { m78PerPay: "refused at once" }, danger: ["m78PerPay"] },
  {
    cue: 11,
    layout: PERPAY,
    edges: [{ from: "merchant", to: "m78PerPay", label: "server" }, { from: "shop", to: "m78PerPay", label: "payment link" }],
    packets: [{ from: "shop", to: "m78PerPay", label: "too big", stopAt: 0.7 }],
    badges: { m78PerPay: "either way" },
  },
  // The daily race: the obvious check lets all five through.
  { cue: 12, layout: RACE, edges: [...RACE_EDGE], packets: five(false), badges: { m78PerDay: "a race" } },
  { cue: 13, layout: RACE, edges: [...RACE_EDGE], packets: [{ from: "m78Buyers", to: "m78PerDay", label: "read, then charge" }], badges: { m78PerDay: "the obvious check" } },
  { cue: 14, layout: RACE, edges: [...RACE_EDGE], badges: { m78PerDay: "looks safe" }, danger: ["m78PerDay"] },
  { cue: 15, layout: RACE, edges: [...RACE_EDGE], packets: FIVE.map((_, k) => ({ from: "m78Buyers", to: "m78PerDay", label: "read: fits", delay: 10 + k * 6 })), badges: { m78PerDay: "all five through" }, danger: ["m78PerDay"] },
  // The atomic reservation.
  { cue: 16, layout: RACE, edges: [...RACE_EDGE], badges: { m78PerDay: "atomic reservation" }, accent: ["m78PerDay"] },
  { cue: 17, layout: RACE, edges: [...RACE_EDGE], badges: { m78PerDay: "one step" }, accent: ["m78PerDay"] },
  { cue: 18, layout: RACE, edges: [...RACE_EDGE], packets: [{ from: "m78Buyers", to: "m78PerDay", label: "+ amount" }], badges: { m78PerDay: "add only if it fits" } },
  { cue: 19, layout: RACE, edges: [...RACE_EDGE], packets: [{ from: "m78Buyers", to: "m78PerDay", label: "first" }, { from: "m78Buyers", to: "m78PerDay", label: "waits", delay: 70 }] },
  { cue: 20, layout: RACE, edges: [...RACE_EDGE], packets: [{ from: "m78Buyers", to: "m78PerDay", label: "doesn't fit", stopAt: 0.6 }], badges: { m78Buyers: "no money moved" }, danger: ["m78PerDay"] },
  { cue: 21, layout: SAVE, edges: [...SAVE_EDGES], packets: [{ from: "m78PerDay", to: "record", label: "reserve" }, { from: "record", to: "network", label: "charge", delay: 70 }] },
  { cue: 22, layout: SAVE, edges: [...SAVE_EDGES], packets: [{ from: "record", to: "m78PerDay", label: "share back" }], badges: { record: "declined" } },
  { cue: 23, layout: SAVE, edges: [...SAVE_EDGES], packets: [{ from: "record", to: "m78PerDay", label: "share back" }], badges: { record: "reversed same day" } },
  { cue: 24, layout: SAVE, edges: [...SAVE_EDGES], badges: { record: "unknown: keeps it" }, danger: ["record"] },
  { cue: 25, layout: { m78PerDay: [0.4, 1], m78Day: [2.6, 1] }, edges: [{ from: "m78PerDay", to: "m78Day", label: "same day" }], badges: { m78Day: "as the reports" } },
  // The edge.
  { cue: 26, layout: EDGE, edges: [...EDGE_EDGES], packets: [{ from: "buyer", to: "m78EdgeDoor", label: "request" }], accent: ["m78EdgeDoor"] },
  { cue: 27, layout: EDGE, edges: [...EDGE_EDGES], badges: { m78EdgeDoor: "modern encryption" } },
  { cue: 28, layout: EDGE, edges: [...EDGE_EDGES], badges: { m78EdgeDoor: "secure only" } },
  { cue: 29, layout: EDGE, edges: [...EDGE_EDGES], badges: { m78EdgeDoor: "no software name" } },
  { cue: 30, layout: EDGE, edges: [...EDGE_EDGES], packets: [{ from: "buyer", to: "m78EdgeDoor", label: "too big", stopAt: 0.6 }], badges: { m78EdgeDoor: "size · rate limits" } },
  // The last minutes before midnight.
  { cue: 40, layout: RACE, edges: [...RACE_EDGE], badges: { m78PerDay: "almost full" } },
  { cue: 41, layout: RACE, edges: [...RACE_EDGE], packets: five(false), badges: { m78Buyers: "Pay, together" } },
  { cue: 42, layout: RACE, edges: [...RACE_EDGE], packets: five(true).slice(0, 4), badges: { m78PerDay: "four fit" }, accent: ["m78PerDay"] },
  { cue: 43, layout: RACE, edges: [...RACE_EDGE], packets: [five(true)[4]], badges: { m78PerDay: "the fifth: no" }, danger: ["m78PerDay"] },
  { cue: 44, layout: RACE, edges: [...RACE_EDGE], badges: { m78Buyers: "no money taken", m78PerDay: "limit for today" }, danger: ["m78PerDay"] },
  // What it protects.
  { cue: 45, layout: GUARDS, badges: { acquirer: "no fortune at once" }, accent: ["acquirer"] },
  { cue: 46, layout: GUARDS, badges: { acquirer: "no fortune at once", shop: "within the deal" }, accent: ["shop"] },
  { cue: 47, layout: GUARDS, badges: { acquirer: "no fortune at once", shop: "within the deal", buyer: "stopped before" }, accent: ["buyer"] },
];

const S = "screens/c-35-hardening";
const DEAL: [number, number, number, number] = [240, 280, 800, 500];
const MODAL: [number, number, number, number] = [320, 190, 800, 500];
export const screens: ScreenStep[] = [
  {
    cue: 31,
    src: `${S}/deal-terms.png`,
    title: "Bank console · Website",
    region: [0, 40, 1152, 720],
    focus: [[270, 308, 753, 283]],
    beats: [
      { cue: 32, region: DEAL, focus: [[291, 438, 711, 30]] },
      { cue: 33, region: DEAL, focus: [[291, 456, 711, 18]] },
      { cue: 34, region: DEAL, focus: [[291, 478, 711, 40], [932, 535, 70, 36]] },
    ],
  },
  { cue: 35, src: `${S}/websites.png`, title: "Merchant portal · Websites", region: [240, 40, 860, 537], focus: [[655, 340, 370, 50]] },
  {
    cue: 36,
    src: `${S}/link-refused.png`,
    title: "Merchant portal · Payment links",
    region: MODAL,
    focus: [[516, 343, 408, 62]],
    beats: [
      { cue: 37, region: MODAL, focus: [[516, 572, 408, 56]] },
      { cue: 39, region: MODAL, focus: [[500, 205, 440, 491]] },
    ],
  },
];
