import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 23: a taxi's licence plate. Which machine (0–7), the plate (8–9), how it works (10–25),
// the product (26–43), what it protects (44–50).
const COUNTER = { buyer: [0, 1], m45Counter: [1.5, 1], processing: [3, 1] } as const;
const COUNTER_EDGES = [{ from: "buyer", to: "m45Counter", label: "card" }, { from: "m45Counter", to: "processing" }] as const;
const ONLINE = { buyer: [0, 1], salespoint: [1.5, 1], processing: [3, 1] } as const;
const ONLINE_EDGES = [{ from: "buyer", to: "salespoint" }, { from: "salespoint", to: "processing", label: "which machine?" }] as const;
const WRONG = { salespoint: [0, 1], processing: [1.5, 1], shop: [3, 0.3], m45Site2: [3, 1.9] } as const;
const PAIR = { salespoint: [0, 1], tid: [1.5, 1], processing: [3, 1] } as const;
const PAIR_EDGES = [{ from: "salespoint", to: "tid" }, { from: "tid", to: "processing" }] as const;
const TWICE = { tid: [0, 1], m45Tid2: [2.5, 1] } as const;
const CENTRE = { m45BankAdmin: [0, 1], tid: [1.5, 1], processing: [3, 1] } as const;
const CENTRE_EDGES = [{ from: "m45BankAdmin", to: "tid", label: "register" }, { from: "tid", to: "processing" }] as const;
const AUDIT = { m45BankAdmin: [0, 1], tid: [1.5, 1], m45History: [3, 1] } as const;
const AUDIT_EDGES = [{ from: "m45BankAdmin", to: "tid" }, { from: "tid", to: "m45History" }] as const;
const CHARGE = { payment: [0, 1], tid: [1.5, 1], processing: [3, 1] } as const;
const CHARGE_EDGES = [{ from: "payment", to: "tid", label: "live terminal?" }, { from: "tid", to: "processing" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: ONLINE, edges: [...ONLINE_EDGES], badges: { salespoint: "which machine?" } },
  { cue: 4, layout: COUNTER, edges: [...COUNTER_EDGES], packets: [{ from: "buyer", to: "m45Counter", label: "pay" }] },
  { cue: 5, layout: ONLINE, edges: [...ONLINE_EDGES], packets: [{ from: "salespoint", to: "processing", label: "charge" }], badges: { processing: "which machine?" } },
  { cue: 6, layout: COUNTER, edges: [...COUNTER_EDGES], accent: ["processing"], badges: { processing: "issued machines only" } },
  {
    cue: 7,
    layout: WRONG,
    edges: [{ from: "salespoint", to: "processing", label: "wrong numbers" }, { from: "processing", to: "shop", broken: true }, { from: "processing", to: "m45Site2" }],
    packets: [{ from: "processing", to: "m45Site2", label: "money", delay: 30 }],
    danger: ["m45Site2"],
    badges: { m45Site2: "another merchant" },
  },
  { cue: 8, layout: { m45Taxi: [1.5, 1] }, accent: ["m45Taxi"], badges: { m45Taxi: "no plate, no fares" } },
  { cue: 9, layout: { m45Taxi: [1.5, 1] }, badges: { m45Taxi: "once · never reused" } },
  { cue: 11, layout: PAIR, edges: [...PAIR_EDGES], packets: [{ from: "salespoint", to: "tid", label: "payment" }, { from: "tid", to: "processing", label: "charge", delay: 45 }], accent: ["tid"] },
  { cue: 12, layout: PAIR, edges: [...PAIR_EDGES], packets: [{ from: "processing", to: "tid", label: "number pair" }], badges: { tid: "merchant · terminal" } },
  { cue: 13, layout: PAIR, edges: [...PAIR_EDGES], badges: { tid: "MID · TID" } },
  { cue: 14, layout: CENTRE, edges: [...CENTRE_EDGES], packets: [{ from: "m45BankAdmin", to: "tid", label: "website + card" }] },
  { cue: 15, layout: PAIR, edges: [...PAIR_EDGES], accent: ["tid"], badges: { tid: "one live per card" } },
  { cue: 16, layout: TWICE, edges: [{ from: "m45Tid2", to: "tid", broken: true }], crossed: ["m45Tid2"], badges: { tid: "closed", m45Tid2: "refused" } },
  { cue: 17, layout: CENTRE, edges: [...CENTRE_EDGES], packets: [{ from: "tid", to: "processing", label: "register" }] },
  { cue: 18, layout: CENTRE, edges: [...CENTRE_EDGES], packets: [{ from: "processing", to: "tid", label: "accepted" }], accent: ["tid"], badges: { tid: "kept" } },
  { cue: 19, layout: CENTRE, edges: [...CENTRE_EDGES], packets: [{ from: "tid", to: "processing", label: "register", stopAt: 0.6 }], danger: ["processing"], badges: { tid: "nothing saved" } },
  { cue: 20, layout: AUDIT, edges: [...AUDIT_EDGES], packets: [{ from: "m45BankAdmin", to: "tid", label: "suspend" }], badges: { tid: "suspended" } },
  { cue: 21, layout: AUDIT, edges: [...AUDIT_EDGES], badges: { tid: "bank's side · resumable" } },
  { cue: 22, layout: AUDIT, edges: [...AUDIT_EDGES], crossed: ["tid"], badges: { tid: "revoked: final" } },
  { cue: 23, layout: AUDIT, edges: [...AUDIT_EDGES], packets: [{ from: "tid", to: "m45History", label: "who · what · why" }], accent: ["m45History"] },
  { cue: 24, layout: CHARGE, edges: [...CHARGE_EDGES], packets: [{ from: "payment", to: "tid", label: "website + card" }, { from: "tid", to: "processing", label: "charge", delay: 50 }] },
  { cue: 25, layout: CHARGE, edges: [...CHARGE_EDGES], packets: [{ from: "payment", to: "tid", label: "charge", stopAt: 0.6 }], crossed: ["tid"], badges: { payment: "no money moves" } },
  { cue: 44, layout: WRONG, edges: [{ from: "salespoint", to: "processing" }, { from: "processing", to: "shop" }, { from: "processing", to: "m45Site2" }], badges: { processing: "protect what?" } },
  {
    cue: 45,
    layout: WRONG,
    edges: [{ from: "salespoint", to: "processing", label: "wrong pair" }, { from: "processing", to: "shop", broken: true }, { from: "processing", to: "m45Site2" }],
    packets: [{ from: "processing", to: "m45Site2", label: "money" }],
    danger: ["m45Site2"],
  },
  { cue: 46, layout: TWICE, edges: [{ from: "m45Tid2", to: "tid" }], danger: ["m45Tid2"], badges: { m45Tid2: "histories mixed" } },
  { cue: 47, layout: PAIR, edges: [...PAIR_EDGES], packets: [{ from: "salespoint", to: "tid", label: "payment" }], accent: ["tid"], badges: { tid: "one way out" } },
  { cue: 48, layout: CHARGE, edges: [...CHARGE_EDGES], packets: [{ from: "payment", to: "tid", label: "charge", stopAt: 0.6 }], danger: ["tid"], badges: { tid: "suspended" } },
  { cue: 49, layout: PAIR, edges: [...PAIR_EDGES], accent: ["salespoint", "tid", "processing"], badges: { processing: "the bank's books" } },
  { cue: 50, layout: { m45Taxi: [1.5, 1] }, accent: ["m45Taxi"], badges: { m45Taxi: "one per car" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 4, current: ["partner"] },
  { cue: 2, part: 4, current: ["adapters", "procsvc"] },
  { cue: 3, part: 4, current: ["epos", "procsvc"] },
  { cue: 10, part: 4, current: ["epos", "payment", "procport", "procsvc"], units: { ecom: "e-POS" } },
  { cue: 51, part: 4, current: ["merchant", "payment"], units: { ecom: "next: signed requests" } },
];

const DIR = "screens/c-23-epos";
const SECTION: [number, number, number, number] = [250, 400, 800, 500];
const GOLIVE: [number, number, number, number] = [250, 170, 800, 500];
export const screens: ScreenStep[] = [
  { cue: 27, src: `${DIR}/no-cards.png`, title: "Bank console · Website", region: [250, 0, 1180, 738] },
  {
    cue: 28,
    src: `${DIR}/no-cards.png`,
    title: "Bank console · Website",
    region: SECTION,
    focus: [[291, 437, 711, 45]],
    beats: [{ cue: 29, region: SECTION, focus: [[801, 605, 201, 36]] }],
  },
  { cue: 30, src: `${DIR}/form.png`, title: "Bank console · Website", region: SECTION, focus: [[801, 605, 201, 36]], beats: [{ cue: 31, region: SECTION, focus: [[801, 605, 201, 36]] }] },
  { cue: 32, src: `${DIR}/form.png`, title: "Bank console · Website", region: SECTION, focus: [[291, 535, 711, 60]], beats: [{ cue: 33, region: SECTION, focus: [[291, 557, 711, 36]] }] },
  {
    cue: 34,
    src: `${DIR}/registered.png`,
    title: "Bank console · Website",
    region: SECTION,
    focus: [[291, 495, 711, 40]],
    beats: [
      { cue: 35, region: SECTION, focus: [[655, 505, 55, 26]] },
      { cue: 36, region: SECTION, focus: [[828, 503, 170, 30]] },
    ],
  },
  { cue: 37, src: `${DIR}/revoke.png`, title: "Bank console · Website", region: [380, 240, 680, 425], focus: [[500, 310, 440, 280]], beats: [{ cue: 38, region: [380, 240, 680, 425], focus: [[516, 355, 408, 60]] }, { cue: 39, region: [380, 240, 680, 425], focus: [[730, 540, 92, 34]] }] },
  {
    cue: 40,
    src: `${DIR}/ready.png`,
    title: "Bank console · Website",
    region: GOLIVE,
    focus: [[270, 192, 753, 50]],
    beats: [
      { cue: 41, region: GOLIVE, focus: [[291, 420, 450, 40]] },
      { cue: 42, region: GOLIVE, focus: [[291, 250, 450, 330]] },
      { cue: 43, region: GOLIVE, focus: [[830, 212, 180, 28]] },
    ],
  },
];
