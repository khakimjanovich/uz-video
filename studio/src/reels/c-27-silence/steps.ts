import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 27: silent tracking. No answer (4–8), three mistakes (9–12), the parcel (13–17), never declined, never resent (18–20),
// the durable workflow, its questions and backoff (21–29), the outcomes (30–33), the cut-off and manual review (34–37),
// the product on three screens (38–52), what it protects (53–57), the close (58–60).
const SILENT = { m6Ecom: [0, 1], m6Zone: [1.5, 1], processing: [3, 1] } as const;
const SILENT_EDGES = [{ from: "m6Ecom", to: "m6Zone" }, { from: "m6Zone", to: "processing" }] as const;
const ZONE_WALL = { label: "Card zone", from: [1.5, 1], to: [1.5, 1], tone: "wall" } as const;
const PARCEL = { buyer: [0, 1], m6Parcel: [1.5, 1], m6Tracking: [3, 1] } as const;
const PARCEL_EDGES = [{ from: "buyer", to: "m6Parcel" }, { from: "m6Parcel", to: "m6Tracking" }] as const;
const ASK = { m6Ecom: [0, 1], m6Workflow: [1.5, 1], processing: [3, 1] } as const;
const ASK_EDGES = [{ from: "m6Ecom", to: "m6Workflow" }, { from: "m6Workflow", to: "processing" }] as const;
const silent = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: SILENT, edges: [...SILENT_EDGES], frames: [ZONE_WALL], ...rest });
const parcel = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: PARCEL, edges: [...PARCEL_EDGES], ...rest });
const ask = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: ASK, edges: [...ASK_EDGES], ...rest });
const question = (delay = 10) => ({ from: "m6Workflow" as const, to: "processing" as const, label: "this charge?", delay, duration: 25 });
const reply = (label: string) => [question(), { from: "processing" as const, to: "m6Workflow" as const, label, delay: 50 }];
const UNKNOWN = { m6Ecom: [0, 1], m6Unknown: [1.5, 1], processing: [3, 1] } as const;
const UNKNOWN_EDGES = [{ from: "m6Ecom", to: "m6Unknown" }, { from: "m6Unknown", to: "processing" }] as const;
const REVIEW = { m6Workflow: [0, 1], review: [1.5, 1], processing: [3, 1] } as const;
const REVIEW_EDGES = [{ from: "m6Workflow", to: "review" }, { from: "review", to: "processing", label: "asks" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  silent(4, { packets: [{ from: "m6Ecom", to: "m6Zone", label: "charge" }, { from: "m6Zone", to: "processing", label: "charge", delay: 45 }] }),
  silent(5, { packets: [{ from: "processing", to: "m6Zone", label: "reply", stopAt: 0.4 }], danger: ["processing"] }),
  silent(6, { danger: ["processing"], badges: { m6Ecom: "time's up" } }),
  { cue: 7, layout: { m6Ecom: [0, 1], issuer: [3, 1] }, edges: [{ from: "m6Ecom", to: "issuer" }], badges: { issuer: "charged?" } },
  { cue: 8, layout: { m6Ecom: [0, 1], issuer: [3, 1] }, edges: [{ from: "m6Ecom", to: "issuer" }], badges: { issuer: "or not?" } },
  { cue: 9, layout: UNKNOWN, edges: [...UNKNOWN_EDGES], badges: { m6Unknown: "three mistakes" } },
  {
    cue: 10,
    layout: { buyer: [0, 1], m6Page: [1.5, 1], issuer: [3, 1] },
    edges: [{ from: "buyer", to: "m6Page" }, { from: "m6Page", to: "issuer" }],
    packets: [{ from: "buyer", to: "m6Page", label: "pay again" }, { from: "m6Page", to: "issuer", label: "second charge", delay: 50 }],
    danger: ["issuer"],
    badges: { m6Page: "declined?" },
  },
  { cue: 11, layout: UNKNOWN, edges: [...UNKNOWN_EDGES], packets: [{ from: "m6Unknown", to: "processing", label: "again" }], danger: ["processing"], badges: { processing: "charged twice" } },
  { cue: 12, layout: { m6App: [1.5, 1] }, danger: ["m6App"], shake: { m6App: 0.5 }, badges: { m6App: "restarts · forgets" } },
  parcel(13, { packets: [{ from: "buyer", to: "m6Parcel", label: "sent" }] }),
  parcel(14, { badges: { m6Tracking: "says nothing" } }),
  { cue: 15, layout: { ...PARCEL, m6Parcel2: [1.5, 2.1] }, edges: [...PARCEL_EDGES], crossed: ["m6Parcel2"], badges: { m6Tracking: "says nothing" } },
  {
    cue: 16,
    layout: { buyer: [0, 1], m6Tracking: [3, 1] },
    edges: [{ from: "buyer", to: "m6Tracking" }],
    packets: [5, 35, 85].map((delay) => ({ from: "buyer" as const, to: "m6Tracking" as const, label: "check", delay, duration: 20 })),
    badges: { buyer: "wait longer" },
  },
  {
    cue: 17,
    layout: { buyer: [0, 1], m6Tracking: [3, 0.2], m6PostOffice: [3, 1.8] },
    edges: [{ from: "buyer", to: "m6Tracking" }, { from: "buyer", to: "m6PostOffice" }],
    packets: [{ from: "buyer", to: "m6PostOffice", label: "ask a person" }],
    accent: ["m6PostOffice"],
    badges: { m6PostOffice: "before closing" },
  },
  { cue: 18, layout: UNKNOWN, edges: [...UNKNOWN_EDGES], accent: ["m6Unknown"] },
  { cue: 19, layout: UNKNOWN, edges: [...UNKNOWN_EDGES], packets: [{ from: "m6Unknown", to: "processing", label: "again?", stopAt: 0.3 }], badges: { m6Unknown: "not declined · not resent" } },
  { cue: 20, layout: { m6Page: [0, 1], buyer: [3, 1] }, edges: [{ from: "m6Page", to: "buyer" }], packets: [{ from: "m6Page", to: "buyer", label: "don't pay again" }] },
  ask(21, { accent: ["m6Workflow"] }),
  ask(22, { badges: { m6Workflow: "survives restarts" } }),
  ask(23, { badges: { m6Workflow: "one per payment" } }),
  ask(24, { packets: [question()], badges: { processing: "by its own id" } }),
  ask(25, { packets: [question()], badges: { m6Workflow: "questions only" } }),
  ask(26, { badges: { m6Workflow: "never moves money" } }),
  ask(27, { packets: [10, 45, 110].map(question) }),
  ask(28, { packets: [10, 45, 110].map(question), badges: { m6Workflow: "backoff" } }),
  ask(29, { badges: { processing: "room to recover" } }),
  ask(30, { packets: reply("found"), accent: ["m6Ecom"], badges: { m6Ecom: "paid" } }),
  ask(31, { packets: reply("not found"), badges: { m6Ecom: "declined, later" } }),
  ask(32, { packets: reply("found"), badges: { m6Ecom: "page closed" } }),
  { cue: 33, layout: { m6Ecom: [0, 1], buyer: [3, 1] }, edges: [{ from: "m6Ecom", to: "buyer" }], packets: [{ from: "m6Ecom", to: "buyer", label: "money back" }] },
  ask(34, { badges: { processing: "cut-off − margin" }, packets: [question(), question(40)] }),
  ask(35, { badges: { m6Ecom: "same-day return" } }),
  { cue: 36, layout: REVIEW, edges: [...REVIEW_EDGES], packets: [{ from: "m6Workflow", to: "review", label: "still unknown" }], accent: ["review"] },
  { cue: 37, layout: REVIEW, edges: [...REVIEW_EDGES], packets: [{ from: "review", to: "processing", label: "check" }], badges: { review: "records the answer" } },
  ask(42, { packets: reply("answer") }),
  { cue: 44, layout: REVIEW, edges: [...REVIEW_EDGES] },
  { cue: 45, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { m6Workflow: "deadline · no answer" } },
  { cue: 53, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }] },
  { cue: 54, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }], badges: { buyer: "pays once" } },
  { cue: 55, layout: { merchant: [1.5, 1] }, accent: ["merchant"], badges: { merchant: "ships right" } },
  { cue: 56, layout: { m6Ecom: [1.5, 1] }, accent: ["m6Ecom"], badges: { m6Ecom: "every charge explained" } },
  ask(57, { badges: { m6Workflow: "no one has to remember" } }),
  parcel(58, {}),
  {
    cue: 59,
    layout: { buyer: [0, 1], m6Tracking: [3, 0.2], m6PostOffice: [3, 1.8] },
    edges: [{ from: "buyer", to: "m6Tracking" }, { from: "buyer", to: "m6PostOffice" }],
    packets: [
      ...[5, 35, 85].map((delay) => ({ from: "buyer" as const, to: "m6Tracking" as const, label: "check", delay, duration: 20 })),
      { from: "buyer" as const, to: "m6PostOffice" as const, label: "ask", delay: 150 },
    ],
  },
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["payment", "card", "adapters", "procsvc"], units: { cards: "no answer" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 5, current: ["payment", "card"] },
  { cue: 2, part: 5, current: ["adapters", "procsvc"] },
  { cue: 3, part: 5, current: ["payment", "temporal"] },
  { cue: 60, part: 5, current: ["payment", "kafka"], units: { ecom: "the news next" } },
];

const SHOT = (name: string) => `screens/c-27-silence/${name}.png`;
const DRAWER = [820, 0, 620, 388] as const;
const ADMIN_LEFT = [255, 140, 720, 450] as const;
const ADMIN_RIGHT = [700, 140, 730, 456] as const;
const MODAL = [440, 220, 560, 450] as const;
export const screens: ScreenStep[] = [
  { cue: 38, src: SHOT("pay-unknown"), title: "Payment page", region: [330, 40, 780, 487], beats: [{ cue: 39, region: [330, 40, 780, 487], focus: [[480, 340, 480, 140]] }] },
  { cue: 40, src: SHOT("list-unknown"), title: "Merchant portal · Payments", region: [480, 200, 880, 550], focus: [[1125, 266, 240, 56]] },
  { cue: 41, src: SHOT("detail-unknown"), title: "Merchant portal · Payment", region: [...DRAWER], focus: [[840, 228, 390, 45]] },
  { cue: 43, src: SHOT("detail-paid"), title: "Merchant portal · Payment", region: [...DRAWER], focus: [[1365, 66, 68, 32]] },
  { cue: 46, src: SHOT("detail-review"), title: "Merchant portal · Payment", region: [...DRAWER], focus: [[1310, 66, 122, 32]] },
  {
    cue: 47,
    src: SHOT("admin-review"),
    title: "Bank console · Payments",
    region: [...ADMIN_LEFT],
    focus: [[380, 150, 110, 38], [270, 262, 140, 45]],
    beats: [{ cue: 48, region: [...ADMIN_RIGHT], focus: [[1228, 268, 168, 44]] }],
  },
  {
    cue: 49,
    src: SHOT("admin-resolve"),
    title: "Bank console · Payments",
    region: [...MODAL],
    focus: [[512, 395, 416, 50]],
    beats: [
      { cue: 50, region: [...MODAL], focus: [[512, 480, 416, 110]] },
      { cue: 52, region: [...MODAL], focus: [[848, 597, 61, 42]] },
    ],
  },
];
