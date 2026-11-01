import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 35: limits. Two ways to break a limit (cues 1–5), the last seat (6–9), the two limits (10–15), the daily
// race and its atomic reservation (16–26), the edge (27–31), the product (32–46), what it protects (47–52).
const FIVE = ["pay", "pay", "pay", "pay", "pay"];
const RACE = { m78Buyers: [0.3, 1], m78PerDay: [2.7, 1] } as const;
const RACE_EDGE = [{ from: "m78Buyers", to: "m78PerDay" }] as const;
const five = (lastStops: boolean) =>
  FIVE.map((label, k) => ({ from: "m78Buyers" as const, to: "m78PerDay" as const, label, delay: 10 + k * 18, ...(lastStops && k === 4 ? { stopAt: 0.6 } : {}) }));
const HALL = { m78Clerk1: [0, 1.8], m78Seat: [1.5, 0.3], m78Clerk2: [3, 1.8] } as const;
const HALL_EDGES = [{ from: "m78Clerk1", to: "m78Seat" }, { from: "m78Clerk2", to: "m78Seat" }] as const;
const LIMITS = { salespoint: [0.4, 1], m78PerPay: [2.6, 0.3], m78PerDay: [2.6, 1.8] } as const;
const LIMIT_EDGES = [{ from: "salespoint", to: "m78PerPay" }, { from: "salespoint", to: "m78PerDay" }] as const;
const PERPAY = { merchant: [0, 0.4], m78PerPay: [1.8, 1], shop: [0, 1.8] } as const;
const DUEL = { m78Clerk1: [0, 0.3], m78Clerk2: [0, 1.8], m78PerDay: [2.4, 1] } as const;
const DUEL_EDGES = [{ from: "m78Clerk1", to: "m78PerDay" }, { from: "m78Clerk2", to: "m78PerDay" }] as const;
const SAVE = { m78PerDay: [0, 1], record: [1.5, 1], network: [3, 1] } as const;
const SAVE_EDGES = [{ from: "m78PerDay", to: "record", label: "saved together" }, { from: "record", to: "network", label: "then asked" }] as const;
const EDGE = { buyer: [0, 1], m78EdgeDoor: [1.5, 1], m78Ecom: [3, 1] } as const;
const EDGE_EDGES = [{ from: "buyer", to: "m78EdgeDoor" }, { from: "m78EdgeDoor", to: "m78Ecom" }] as const;
const GUARDS = { acquirer: [0, 1], shop: [1.5, 1], buyer: [3, 1] } as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 6, current: ["payment", "partner"] },
  { cue: 53, part: 7, current: ["vault", "cardsinfra"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // Two ways to break a limit.
  { cue: 1, layout: LIMITS, edges: [...LIMIT_EDGES], badges: { salespoint: "a limit" } },
  { cue: 2, layout: { attacker: [0.4, 1], salespoint: [2.6, 1] }, edges: [{ from: "attacker", to: "salespoint" }], packets: [{ from: "attacker", to: "salespoint", label: "a fortune" }], danger: ["attacker"] },
  { cue: 3, layout: RACE, edges: [...RACE_EDGE], packets: five(false), badges: { m78Buyers: "at once" } },
  { cue: 4, layout: RACE, edges: [...RACE_EDGE], badges: { m78Buyers: "each fits alone", m78PerDay: "together: over" }, danger: ["m78PerDay"] },
  { cue: 5, layout: RACE, edges: [...RACE_EDGE], packets: FIVE.map((_, k) => ({ from: "m78Buyers", to: "m78PerDay", label: "read: fits", delay: 10 + k * 6 })), badges: { m78PerDay: "all five through" }, danger: ["m78PerDay"] },
  // The last seat.
  { cue: 6, layout: HALL, edges: [...HALL_EDGES], badges: { m78Seat: "one left" } },
  { cue: 7, layout: HALL, edges: [...HALL_EDGES], packets: [{ from: "m78Clerk1", to: "m78Seat", label: "sell" }, { from: "m78Clerk2", to: "m78Seat", label: "sell" }] },
  { cue: 8, layout: HALL, edges: [...HALL_EDGES], badges: { m78Seat: "sold once" }, accent: ["m78Seat"] },
  { cue: 9, layout: HALL, edges: [...HALL_EDGES], packets: [{ from: "m78Clerk1", to: "m78Seat", label: "sell" }, { from: "m78Clerk2", to: "m78Seat", label: "sell", delay: 24, stopAt: 0.6 }], badges: { m78Clerk2: "sold out" }, danger: ["m78Clerk2"] },
  // The two limits.
  { cue: 10, layout: LIMITS, edges: [...LIMIT_EDGES], accent: ["m78PerPay", "m78PerDay"] },
  { cue: 11, layout: LIMITS, edges: [...LIMIT_EDGES], badges: { m78PerPay: "one payment", m78PerDay: "one day" } },
  { cue: 12, layout: { admin: [0.4, 1], salespoint: [2.6, 1] }, edges: [{ from: "admin", to: "salespoint", label: "the deal" }], packets: [{ from: "admin", to: "salespoint", label: "both limits" }] },
  { cue: 13, layout: PERPAY, edges: [{ from: "merchant", to: "m78PerPay" }], accent: ["m78PerPay"] },
  { cue: 14, layout: PERPAY, edges: [{ from: "merchant", to: "m78PerPay" }], packets: [{ from: "merchant", to: "m78PerPay", label: "too big", stopAt: 0.7 }], badges: { m78PerPay: "refused at once" }, danger: ["m78PerPay"] },
  {
    cue: 15,
    layout: PERPAY,
    edges: [{ from: "merchant", to: "m78PerPay", label: "server" }, { from: "shop", to: "m78PerPay", label: "payment link" }],
    packets: [{ from: "shop", to: "m78PerPay", label: "too big", stopAt: 0.7 }],
    badges: { m78PerPay: "either way" },
  },
  // The daily race and its atomic reservation.
  { cue: 16, layout: DUEL, edges: [...DUEL_EDGES], packets: [{ from: "m78Clerk1", to: "m78PerDay", label: "charge" }, { from: "m78Clerk2", to: "m78PerDay", label: "charge" }], badges: { m78PerDay: "a race" } },
  { cue: 17, layout: DUEL, edges: [...DUEL_EDGES], badges: { m78PerDay: "atomic reservation" }, accent: ["m78PerDay"] },
  { cue: 18, layout: DUEL, edges: [...DUEL_EDGES], badges: { m78PerDay: "one step" }, accent: ["m78PerDay"] },
  { cue: 19, layout: DUEL, edges: [...DUEL_EDGES], packets: [{ from: "m78Clerk1", to: "m78PerDay", label: "+ amount" }], badges: { m78PerDay: "add only if it fits" } },
  { cue: 20, layout: DUEL, edges: [...DUEL_EDGES], packets: [{ from: "m78Clerk1", to: "m78PerDay", label: "first" }, { from: "m78Clerk2", to: "m78PerDay", label: "waits", delay: 70 }] },
  { cue: 21, layout: DUEL, edges: [...DUEL_EDGES], packets: [{ from: "m78Clerk2", to: "m78PerDay", label: "doesn't fit", stopAt: 0.6 }], badges: { m78Clerk2: "no money moved" }, danger: ["m78Clerk2"] },
  { cue: 22, layout: SAVE, edges: [...SAVE_EDGES], packets: [{ from: "m78PerDay", to: "record", label: "reserve" }, { from: "record", to: "network", label: "charge", delay: 70 }] },
  { cue: 23, layout: SAVE, edges: [...SAVE_EDGES], packets: [{ from: "record", to: "m78PerDay", label: "share back" }], badges: { record: "declined" } },
  { cue: 24, layout: SAVE, edges: [...SAVE_EDGES], packets: [{ from: "record", to: "m78PerDay", label: "share back" }], badges: { record: "reversed same day" } },
  { cue: 25, layout: SAVE, edges: [...SAVE_EDGES], badges: { record: "unknown: keeps it" }, danger: ["record"] },
  { cue: 26, layout: { m78PerDay: [0.4, 1], m78Day: [2.6, 1] }, edges: [{ from: "m78PerDay", to: "m78Day", label: "same day" }], badges: { m78Day: "as the reports" } },
  // The edge.
  { cue: 27, layout: EDGE, edges: [...EDGE_EDGES], packets: [{ from: "buyer", to: "m78EdgeDoor", label: "request" }], accent: ["m78EdgeDoor"] },
  { cue: 28, layout: EDGE, edges: [...EDGE_EDGES], badges: { m78EdgeDoor: "modern encryption" } },
  { cue: 29, layout: EDGE, edges: [...EDGE_EDGES], badges: { m78EdgeDoor: "secure only" } },
  { cue: 30, layout: EDGE, edges: [...EDGE_EDGES], badges: { m78EdgeDoor: "no software name" } },
  { cue: 31, layout: EDGE, edges: [...EDGE_EDGES], packets: [{ from: "buyer", to: "m78EdgeDoor", label: "too big", stopAt: 0.6 }], badges: { m78EdgeDoor: "size · rate limits" } },
  // The busy day's last minutes.
  { cue: 42, layout: RACE, edges: [...RACE_EDGE], badges: { m78PerDay: "almost full" } },
  { cue: 43, layout: RACE, edges: [...RACE_EDGE], packets: five(false), badges: { m78Buyers: "Pay, together" } },
  { cue: 44, layout: RACE, edges: [...RACE_EDGE], packets: five(true).slice(0, 4), badges: { m78PerDay: "four fit" }, accent: ["m78PerDay"] },
  { cue: 45, layout: RACE, edges: [...RACE_EDGE], packets: [five(true)[4]], badges: { m78PerDay: "the fifth: no" }, danger: ["m78PerDay"] },
  { cue: 46, layout: RACE, edges: [...RACE_EDGE], badges: { m78Buyers: "no money taken", m78PerDay: "limit for today" }, danger: ["m78PerDay"] },
  // What it protects.
  { cue: 47, layout: GUARDS },
  { cue: 48, layout: GUARDS, badges: { acquirer: "no fortune at once" }, accent: ["acquirer"] },
  { cue: 49, layout: GUARDS, badges: { acquirer: "no fortune at once", shop: "within the deal" }, accent: ["shop"] },
  { cue: 50, layout: GUARDS, badges: { acquirer: "no fortune at once", shop: "within the deal", buyer: "stopped before" }, accent: ["buyer"] },
  { cue: 51, layout: HALL, edges: [...HALL_EDGES] },
  { cue: 52, layout: HALL, edges: [...HALL_EDGES], badges: { m78Seat: "sold exactly once" }, accent: ["m78Seat"] },
];

const S = "screens/c-35-hardening";
const DEAL: [number, number, number, number] = [240, 280, 800, 500];
const MODAL: [number, number, number, number] = [320, 190, 800, 500];
export const screens: ScreenStep[] = [
  {
    cue: 32,
    src: `${S}/deal-terms.png`,
    title: "Bank console · Website",
    region: [0, 40, 1152, 720],
    beats: [
      { cue: 33, region: [0, 40, 1152, 720], focus: [[270, 308, 753, 283]] },
      { cue: 34, region: DEAL, focus: [[291, 438, 711, 30]] },
      { cue: 35, region: DEAL, focus: [[291, 456, 711, 18]] },
      { cue: 36, region: DEAL, focus: [[291, 478, 711, 40], [932, 535, 70, 36]] },
    ],
  },
  { cue: 37, src: `${S}/websites.png`, title: "Merchant portal · Websites", region: [240, 40, 860, 537], focus: [[655, 340, 370, 50]] },
  {
    cue: 38,
    src: `${S}/link-refused.png`,
    title: "Merchant portal · Payment links",
    region: MODAL,
    focus: [[516, 343, 408, 62]],
    beats: [
      { cue: 39, region: MODAL, focus: [[516, 572, 408, 56]] },
      { cue: 41, region: MODAL, focus: [[500, 205, 440, 491]] },
    ],
  },
];
