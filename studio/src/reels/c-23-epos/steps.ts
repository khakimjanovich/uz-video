import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 23: e-POS terminals. One site carries it: Malika's wedding site opens Saturday, and Dilnoza has one step left.
// Wednesday (0–1), the bridge (2), which machine (3–6), the e-POS terminal and its pair (7–9), registering it (10–22),
// suspend, revoke, the record (23–31), never reused (32–35), ready (36–39), the live terminal before every charge (40–42), next (43).
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
  // Wednesday: the wedding site opens Saturday, one step left.
  { cue: 0, layout: ONLINE, edges: [...ONLINE_EDGES], badges: { salespoint: "wedding site · Sat" } },
  { cue: 1, layout: CENTRE, edges: [...CENTRE_EDGES], accent: ["processing"], badges: { m45BankAdmin: "Dilnoza: one step left" } },
  // Which machine? Online there is no counter.
  { cue: 3, layout: COUNTER, edges: [...COUNTER_EDGES], packets: [{ from: "buyer", to: "m45Counter", label: "pay" }] },
  { cue: 4, layout: ONLINE, edges: [...ONLINE_EDGES], packets: [{ from: "salespoint", to: "processing", label: "charge" }], badges: { processing: "which machine?" } },
  { cue: 5, layout: COUNTER, edges: [...COUNTER_EDGES], accent: ["processing"], badges: { processing: "issued machines only" } },
  {
    cue: 6,
    layout: WRONG,
    edges: [{ from: "salespoint", to: "processing", label: "wrong numbers" }, { from: "processing", to: "shop", broken: true }, { from: "processing", to: "m45Site2" }],
    packets: [{ from: "processing", to: "m45Site2", label: "money", delay: 30 }],
    danger: ["m45Site2"],
    badges: { m45Site2: "another merchant" },
  },
  // The e-POS terminal and its pair of numbers.
  { cue: 7, layout: PAIR, edges: [...PAIR_EDGES], packets: [{ from: "salespoint", to: "tid", label: "payment" }, { from: "tid", to: "processing", label: "charge", delay: 45 }], accent: ["tid"] },
  { cue: 8, layout: PAIR, edges: [...PAIR_EDGES], packets: [{ from: "processing", to: "tid", label: "number pair" }], badges: { tid: "merchant · terminal" } },
  { cue: 9, layout: PAIR, edges: [...PAIR_EDGES], badges: { tid: "MID · TID" } },
  // One pair per website and card, registered with the centre.
  { cue: 17, layout: CENTRE, edges: [...CENTRE_EDGES], packets: [{ from: "m45BankAdmin", to: "tid", label: "website + card" }] },
  { cue: 18, layout: PAIR, edges: [...PAIR_EDGES], packets: [{ from: "salespoint", to: "tid", label: "payment" }], accent: ["tid"], badges: { tid: "one live · one way out" } },
  { cue: 19, layout: CENTRE, edges: [...CENTRE_EDGES], packets: [{ from: "tid", to: "processing", label: "register" }], badges: { processing: "via Timur's card zone" } },
  { cue: 20, layout: CENTRE, edges: [...CENTRE_EDGES], badges: { tid: "kept only if accepted" } },
  { cue: 21, layout: CENTRE, edges: [...CENTRE_EDGES], packets: [{ from: "tid", to: "processing", label: "register", stopAt: 0.6 }], danger: ["processing"], badges: { tid: "nothing saved" } },
  { cue: 22, layout: CENTRE, edges: [...CENTRE_EDGES], packets: [{ from: "processing", to: "tid", label: "accepted" }], accent: ["tid"], badges: { tid: "kept" } },
  // Suspend, revoke, and the record.
  { cue: 26, layout: AUDIT, edges: [...AUDIT_EDGES], packets: [{ from: "m45BankAdmin", to: "tid", label: "suspend" }], badges: { tid: "suspended · resumable" } },
  { cue: 27, layout: AUDIT, edges: [...AUDIT_EDGES], crossed: ["tid"], badges: { tid: "revoked: final" } },
  { cue: 31, layout: AUDIT, edges: [...AUDIT_EDGES], packets: [{ from: "tid", to: "m45History", label: "who · what · why" }], accent: ["m45History"] },
  // Never registered twice: a licence plate.
  { cue: 32, layout: TWICE, edges: [{ from: "m45Tid2", to: "tid", broken: true }], crossed: ["m45Tid2"], badges: { tid: "closed", m45Tid2: "refused" } },
  { cue: 33, layout: { m45Taxi: [1.5, 1] }, accent: ["m45Taxi"], badges: { m45Taxi: "once · never reused" } },
  { cue: 34, layout: TWICE, edges: [{ from: "m45Tid2", to: "tid" }], badges: { tid: "old pair", m45Tid2: "save a call?" } },
  { cue: 35, layout: TWICE, edges: [{ from: "m45Tid2", to: "tid" }], danger: ["m45Tid2"], badges: { m45Tid2: "histories mixed" } },
  // Before every charge: the live terminal. Saturday: one machine.
  { cue: 40, layout: CHARGE, edges: [...CHARGE_EDGES], packets: [{ from: "payment", to: "tid", label: "website + card" }, { from: "tid", to: "processing", label: "charge", delay: 50 }] },
  { cue: 41, layout: CHARGE, edges: [...CHARGE_EDGES], packets: [{ from: "payment", to: "tid", label: "charge", stopAt: 0.6 }], crossed: ["tid"], badges: { payment: "no money moves" } },
  { cue: 42, layout: PAIR, edges: [...PAIR_EDGES], packets: [{ from: "salespoint", to: "tid", label: "wedding order" }, { from: "tid", to: "processing", label: "charge", delay: 45 }], accent: ["tid"], badges: { tid: "exactly one machine" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 2, part: 4, current: ["partner", "adapters", "epos", "procsvc"] },
  { cue: 43, part: 4, current: ["merchant", "payment"], units: { ecom: "next: signed requests" } },
];

const DIR = "screens/c-23-epos";
const SECTION: [number, number, number, number] = [250, 400, 800, 500];
const GOLIVE: [number, number, number, number] = [250, 170, 800, 500];
export const screens: ScreenStep[] = [
  { cue: 10, src: `${DIR}/no-cards.png`, title: "Bank console · Website", region: [250, 0, 1180, 738] },
  {
    cue: 11,
    src: `${DIR}/no-cards.png`,
    title: "Bank console · Website",
    region: SECTION,
    focus: [[291, 437, 711, 45]],
    beats: [{ cue: 12, region: SECTION, focus: [[801, 605, 201, 36]] }],
  },
  { cue: 13, src: `${DIR}/form.png`, title: "Bank console · Website", region: SECTION, focus: [[801, 605, 201, 36]], beats: [{ cue: 14, region: SECTION, focus: [[801, 605, 201, 36]] }] },
  { cue: 15, src: `${DIR}/form.png`, title: "Bank console · Website", region: SECTION, focus: [[291, 535, 711, 60]], beats: [{ cue: 16, region: SECTION, focus: [[291, 557, 711, 36]] }] },
  {
    cue: 23,
    src: `${DIR}/registered.png`,
    title: "Bank console · Website",
    region: SECTION,
    focus: [[291, 495, 711, 40]],
    beats: [
      { cue: 24, region: SECTION, focus: [[655, 505, 55, 26]] },
      { cue: 25, region: SECTION, focus: [[828, 503, 170, 30]] },
    ],
  },
  { cue: 28, src: `${DIR}/revoke.png`, title: "Bank console · Website", region: [380, 240, 680, 425], focus: [[500, 310, 440, 280]], beats: [{ cue: 29, region: [380, 240, 680, 425], focus: [[516, 355, 408, 60]] }, { cue: 30, region: [380, 240, 680, 425], focus: [[730, 540, 92, 34]] }] },
  {
    cue: 36,
    src: `${DIR}/ready.png`,
    title: "Bank console · Website",
    region: GOLIVE,
    focus: [[270, 192, 753, 50]],
    beats: [
      { cue: 37, region: GOLIVE, focus: [[291, 420, 450, 40]] },
      { cue: 38, region: GOLIVE, focus: [[291, 250, 450, 330]] },
      { cue: 39, region: GOLIVE, focus: [[830, 212, 180, 28]] },
    ],
  },
];
