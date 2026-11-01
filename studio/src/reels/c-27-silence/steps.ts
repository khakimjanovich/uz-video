import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 27: a wedding bouquet on Thursday night, and no answer. No answer (0–5), the bridge (6–7), three mistakes (8–11),
// never declined, never resent (12–15), the durable workflow, its questions and backoff (16–24), the outcomes (25–28),
// the cut-off and manual review (29–32), the bouquet on three screens (33–47), by morning (48–51), next (52).
const SILENT = { m6Ecom: [0, 1], m6Zone: [1.5, 1], processing: [3, 1] } as const;
const SILENT_EDGES = [{ from: "m6Ecom", to: "m6Zone" }, { from: "m6Zone", to: "processing" }] as const;
const ZONE_WALL = { label: "Card zone", from: [1.5, 1], to: [1.5, 1], tone: "wall" } as const;
const ASK = { m6Ecom: [0, 1], m6Workflow: [1.5, 1], processing: [3, 1] } as const;
const ASK_EDGES = [{ from: "m6Ecom", to: "m6Workflow" }, { from: "m6Workflow", to: "processing" }] as const;
const silent = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: SILENT, edges: [...SILENT_EDGES], frames: [ZONE_WALL], ...rest });
const ask = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: ASK, edges: [...ASK_EDGES], ...rest });
const question = (delay = 10) => ({ from: "m6Workflow" as const, to: "processing" as const, label: "this charge?", delay, duration: 25 });
const reply = (label: string) => [question(), { from: "processing" as const, to: "m6Workflow" as const, label, delay: 50 }];
const UNKNOWN = { m6Ecom: [0, 1], m6Unknown: [1.5, 1], processing: [3, 1] } as const;
const UNKNOWN_EDGES = [{ from: "m6Ecom", to: "m6Unknown" }, { from: "m6Unknown", to: "processing" }] as const;
const REVIEW = { m6Workflow: [0, 1], review: [1.5, 1], processing: [3, 1] } as const;
const REVIEW_EDGES = [{ from: "m6Workflow", to: "review" }, { from: "review", to: "processing", label: "asks" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Thursday night: the charge goes out, and nothing comes back.
  silent(1, { packets: [{ from: "m6Ecom", to: "m6Zone", label: "charge" }, { from: "m6Zone", to: "processing", label: "charge", delay: 45 }], badges: { m6Ecom: "Thu 22:50 · bouquet" } }),
  silent(2, { packets: [{ from: "processing", to: "m6Zone", label: "reply", stopAt: 0.4 }], danger: ["processing"] }),
  silent(3, { danger: ["processing"], badges: { processing: "slow, or lost", m6Ecom: "time's up" } }),
  { cue: 4, layout: { m6Ecom: [0, 1], issuer: [3, 1] }, edges: [{ from: "m6Ecom", to: "issuer" }], badges: { issuer: "charged?" } },
  { cue: 5, layout: { m6Ecom: [0, 1], issuer: [3, 1] }, edges: [{ from: "m6Ecom", to: "issuer" }], badges: { issuer: "or not?" } },
  // Three tempting mistakes.
  { cue: 8, layout: UNKNOWN, edges: [...UNKNOWN_EDGES], badges: { m6Unknown: "three mistakes" } },
  {
    cue: 9,
    layout: { buyer: [0, 1], m6Page: [1.5, 1], issuer: [3, 1] },
    edges: [{ from: "buyer", to: "m6Page" }, { from: "m6Page", to: "issuer" }],
    packets: [{ from: "buyer", to: "m6Page", label: "pay again" }, { from: "m6Page", to: "issuer", label: "second charge", delay: 50 }],
    danger: ["issuer"],
    badges: { m6Page: "declined?" },
  },
  { cue: 10, layout: UNKNOWN, edges: [...UNKNOWN_EDGES], packets: [{ from: "m6Unknown", to: "processing", label: "again" }], danger: ["processing"], badges: { processing: "charged twice" } },
  { cue: 11, layout: { m6App: [1.5, 1] }, danger: ["m6App"], shake: { m6App: 0.5 }, badges: { m6App: "restarts · forgets" } },
  // The refusal: never declined, never resent.
  { cue: 12, layout: UNKNOWN, edges: [...UNKNOWN_EDGES], danger: ["m6Unknown"], badges: { m6Unknown: "every quick answer wrong" } },
  { cue: 13, layout: UNKNOWN, edges: [...UNKNOWN_EDGES], accent: ["m6Unknown"], badges: { m6Unknown: "a refusal" } },
  { cue: 14, layout: UNKNOWN, edges: [...UNKNOWN_EDGES], packets: [{ from: "m6Unknown", to: "processing", label: "again?", stopAt: 0.3 }], badges: { m6Unknown: "not declined · not resent" } },
  { cue: 15, layout: { m6Page: [0, 1], buyer: [3, 1] }, edges: [{ from: "m6Page", to: "buyer" }], packets: [{ from: "m6Page", to: "buyer", label: "don't pay again" }] },
  // The durable workflow asks, and waits longer each time.
  ask(16, { accent: ["m6Workflow"] }),
  ask(17, { badges: { m6Workflow: "survives restarts" } }),
  ask(18, { badges: { m6Workflow: "one per payment" } }),
  ask(19, { packets: [question()], badges: { processing: "by its own id" } }),
  ask(20, { packets: [question()], badges: { m6Workflow: "questions only" } }),
  ask(21, { badges: { m6Workflow: "never moves money" } }),
  ask(22, { packets: [10, 45, 110].map(question) }),
  ask(23, { packets: [10, 45, 110].map(question), badges: { m6Workflow: "backoff" } }),
  ask(24, { badges: { processing: "room to recover" } }),
  ask(25, { packets: reply("found"), accent: ["m6Ecom"], badges: { m6Ecom: "paid" } }),
  ask(26, { packets: reply("not found"), badges: { m6Ecom: "declined, later" } }),
  ask(27, { packets: reply("found"), badges: { m6Ecom: "page closed" } }),
  { cue: 28, layout: { m6Ecom: [0, 1], buyer: [3, 1] }, edges: [{ from: "m6Ecom", to: "buyer" }], packets: [{ from: "m6Ecom", to: "buyer", label: "money back" }] },
  ask(29, { badges: { processing: "cut-off − margin" }, packets: [question(), question(40)] }),
  ask(30, { badges: { m6Ecom: "same-day return" } }),
  { cue: 31, layout: REVIEW, edges: [...REVIEW_EDGES], packets: [{ from: "m6Workflow", to: "review", label: "still unknown" }], accent: ["review"] },
  { cue: 32, layout: REVIEW, edges: [...REVIEW_EDGES], packets: [{ from: "review", to: "processing", label: "check" }], badges: { review: "records the answer" } },
  // Most nights the answer comes; tonight it does not.
  ask(37, { packets: reply("answer") }),
  { cue: 39, layout: REVIEW, edges: [...REVIEW_EDGES] },
  { cue: 40, layout: REVIEW, edges: [...REVIEW_EDGES], badges: { m6Workflow: "deadline · no answer" } },
  // By morning.
  { cue: 48, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }], badges: { buyer: "paid once, or not" } },
  { cue: 49, layout: { shop: [1.5, 1] }, accent: ["shop"], badges: { shop: "ships only if paid" } },
  { cue: 50, layout: { m6Ecom: [1.5, 1] }, accent: ["m6Ecom"], badges: { m6Ecom: "every charge explained" } },
  ask(51, { badges: { m6Workflow: "no one has to remember" } }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["payment", "card", "adapters", "procsvc"], units: { cards: "no answer" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 6, part: 5, current: ["payment", "card", "adapters", "procsvc"] },
  { cue: 7, part: 5, current: ["payment", "temporal"] },
  { cue: 52, part: 5, current: ["payment", "kafka"], units: { ecom: "the news next" } },
];

const SHOT = (name: string) => `screens/c-27-silence/${name}.png`;
const DRAWER = [820, 0, 620, 388] as const;
const ADMIN_LEFT = [255, 140, 720, 450] as const;
const ADMIN_RIGHT = [700, 140, 730, 456] as const;
const MODAL = [440, 220, 560, 450] as const;
export const screens: ScreenStep[] = [
  { cue: 33, src: SHOT("pay-unknown"), title: "Payment page", region: [330, 40, 780, 487], beats: [{ cue: 34, region: [330, 40, 780, 487], focus: [[480, 340, 480, 140]] }] },
  { cue: 35, src: SHOT("list-unknown"), title: "Merchant portal · Payments", region: [480, 200, 880, 550], focus: [[1125, 266, 240, 56]] },
  { cue: 36, src: SHOT("detail-unknown"), title: "Merchant portal · Payment", region: [...DRAWER], focus: [[840, 228, 390, 45]] },
  { cue: 38, src: SHOT("detail-paid"), title: "Merchant portal · Payment", region: [...DRAWER], focus: [[1365, 66, 68, 32]] },
  { cue: 41, src: SHOT("detail-review"), title: "Merchant portal · Payment", region: [...DRAWER], focus: [[1310, 66, 122, 32]] },
  {
    cue: 42,
    src: SHOT("admin-review"),
    title: "Bank console · Payments",
    region: [...ADMIN_LEFT],
    focus: [[380, 150, 110, 38], [270, 262, 140, 45]],
    beats: [{ cue: 43, region: [...ADMIN_RIGHT], focus: [[1228, 268, 168, 44]] }],
  },
  {
    cue: 44,
    src: SHOT("admin-resolve"),
    title: "Bank console · Payments",
    region: [...MODAL],
    focus: [[512, 395, 416, 50]],
    beats: [
      { cue: 45, region: [...MODAL], focus: [[512, 480, 416, 110]] },
      { cue: 47, region: [...MODAL], focus: [[848, 597, 61, 42]] },
    ],
  },
];
