import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 30: crossing out, or handing back. Three mistakes (1–6), the tab book: reversal or refund, the day, the whole amount (7–14),
// the cap and the window (15–19), claim, logbook, card zone, three answers (20–26), refund by application (27–31),
// the merchant portal, the buyer's page and the bank console (32–54), what it protects (55–59), the close (60–63).
const BOOK = { tabBook: [0, 1], m6Reversal: [2.2, 0.2], m6Refund: [2.2, 1.8] } as const;
const BOOK_EDGES = [{ from: "tabBook", to: "m6Reversal" }, { from: "tabBook", to: "m6Refund" }] as const;
const LIMITS = { merchant: [0, 1], m6Cap: [1.5, 0.2], m6Window: [1.5, 1.8], m6Paid: [3, 1] } as const;
const LIMITS_EDGES = [{ from: "merchant", to: "m6Cap" }, { from: "merchant", to: "m6Window" }, { from: "m6Cap", to: "m6Paid" }, { from: "m6Window", to: "m6Paid" }] as const;
const ASK = { m6Claim: [0, 1], m6Logbook: [1.5, 1], m6Zone: [3, 1] } as const;
const ASK_EDGES = [{ from: "m6Claim", to: "m6Logbook" }, { from: "m6Logbook", to: "m6Zone" }] as const;
const ZONE_WALL = { label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" } as const;
const APPLY = { merchant: [0, 1], admin: [1.5, 0.2], checker: [1.5, 1.8], m6Request: [3, 1] } as const;
const APPLY_EDGES = [{ from: "merchant", to: "admin", label: "writes" }, { from: "admin", to: "m6Request" }, { from: "checker", to: "m6Request", label: "approves" }] as const;
const book = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: BOOK, edges: [...BOOK_EDGES], ...rest });
const limits = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: LIMITS, edges: [...LIMITS_EDGES], ...rest });
const ask = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: ASK, edges: [...ASK_EDGES], frames: [ZONE_WALL], ...rest });
const apply = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: APPLY, edges: [...APPLY_EDGES], ...rest });

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { buyer: [0, 1], shop: [3, 1] }, edges: [{ from: "buyer", to: "shop" }], packets: [{ from: "buyer", to: "shop", label: "shoes back" }] },
  { cue: 2, layout: { m6Paid: [0, 1], buyer: [3, 1] }, edges: [{ from: "m6Paid", to: "buyer" }], badges: { m6Paid: "three mistakes" } },
  {
    cue: 3,
    layout: { merchant: [0, 1], m6Paid: [1.5, 1], buyer: [3, 1] },
    edges: [{ from: "merchant", to: "m6Paid" }, { from: "m6Paid", to: "buyer" }],
    packets: [{ from: "merchant", to: "m6Paid", label: "refund", delay: 10 }, { from: "merchant", to: "m6Paid", label: "refund", delay: 24 }],
    danger: ["m6Paid"],
  },
  {
    cue: 4,
    layout: { admin: [0, 1], m6Paid: [1.5, 1], buyer: [3, 1] },
    edges: [{ from: "admin", to: "m6Paid" }, { from: "m6Paid", to: "buyer" }],
    packets: [{ from: "admin", to: "m6Paid", label: "by phone" }],
    danger: ["m6Paid"],
    badges: { admin: "support team" },
  },
  {
    cue: 5,
    layout: { m6Paid: [0, 1], m6OldCard: [3, 1] },
    edges: [{ from: "m6Paid", to: "m6OldCard" }],
    packets: [{ from: "m6Paid", to: "m6OldCard", label: "6 months later", stopAt: 0.8 }],
    danger: ["m6OldCard"],
  },
  { cue: 6, layout: { m6Paid: [1.5, 1] }, danger: ["m6Paid"], badges: { m6Paid: "too much · too late" } },
  book(7, { accent: ["tabBook"] }),
  book(8, { packets: [{ from: "tabBook", to: "m6Reversal", label: "cross out" }], badges: { tabBook: "before closing" } }),
  book(9, { accent: ["m6Reversal"], badges: { m6Reversal: "costs nothing" } }),
  book(10, { packets: [{ from: "tabBook", to: "m6Refund", label: "hand back" }], badges: { tabBook: "after closing" } }),
  book(11, { accent: ["m6Refund"] }),
  { ...book(12, { badges: { m6Clock: "the day decides" } }), layout: { ...BOOK, m6Clock: [0, 2.1] } },
  { ...book(13, { accent: ["m6Clock"], badges: { m6Clock: "bank's time zone" } }), layout: { ...BOOK, m6Clock: [0, 2.1] } },
  book(14, { badges: { tabBook: "the whole amount" } }),
  limits(15, { packets: [{ from: "merchant", to: "m6Cap", label: "give back" }], accent: ["m6Cap"] }),
  limits(16, { badges: { m6Cap: "largest on its own" } }),
  limits(17, { accent: ["m6Window"], packets: [{ from: "merchant", to: "m6Window", label: "later" }] }),
  limits(18, { badges: { m6Window: "working days" } }),
  { cue: 19, layout: { admin: [0, 0.2], checker: [0, 1.8], m6Window: [2, 1] }, edges: [{ from: "admin", to: "m6Window" }, { from: "checker", to: "m6Window" }], badges: { m6Window: "longer" } },
  ask(20, {}),
  { cue: 21, layout: { merchant: [0, 1], m6Claim: [1.5, 1], m6Paid: [3, 1] }, edges: [{ from: "merchant", to: "m6Claim" }, { from: "m6Claim", to: "m6Paid" }], packets: [{ from: "merchant", to: "m6Claim", label: "click", delay: 10 }, { from: "merchant", to: "m6Claim", label: "click", delay: 24 }, { from: "m6Claim", to: "m6Paid", label: "one wins", delay: 65 }], accent: ["m6Claim"] },
  ask(22, { packets: [{ from: "m6Claim", to: "m6Logbook", label: "reason" }], accent: ["m6Logbook"], badges: { m6Logbook: "first" } }),
  ask(23, { packets: [{ from: "m6Logbook", to: "m6Zone", label: "token + id" }] }),
  ask(24, { packets: [{ from: "m6Zone", to: "m6Logbook", label: "approved" }], badges: { m6Claim: "final" } }),
  ask(25, { packets: [{ from: "m6Zone", to: "m6Logbook", label: "refused" }], badges: { m6Claim: "stays paid" } }),
  ask(26, { packets: [{ from: "m6Logbook", to: "m6Zone", label: "…", stopAt: 0.6 }], badges: { m6Claim: "asked later", m6Zone: "never twice" } }),
  limits(27, { danger: ["m6Cap", "m6Window"], badges: { merchant: "not alone" } }),
  apply(28, { accent: ["admin"] }),
  apply(29, { accent: ["m6Request"] }),
  apply(30, { packets: [{ from: "merchant", to: "admin", label: "application" }] }),
  apply(31, { packets: [{ from: "admin", to: "m6Request", label: "ask" }, { from: "checker", to: "m6Request", label: "approve", delay: 55 }] }),
  { cue: 32, layout: { merchant: [1.5, 1] }, accent: ["merchant"] },
  { cue: 40, layout: { m6Paid: [0, 1], m6Zone: [3, 1] }, edges: [{ from: "m6Paid", to: "m6Zone" }], frames: [ZONE_WALL], packets: [{ from: "m6Paid", to: "m6Zone", label: "give back" }], badges: { m6Paid: "giving it back" } },
  apply(54, { packets: [{ from: "checker", to: "m6Request", label: "approve" }], accent: ["checker"], badges: { m6Request: "then money goes" } }),
  { cue: 55, layout: { merchant: [0, 1], m6Claim: [1.5, 1], m6Paid: [3, 1] }, edges: [{ from: "merchant", to: "m6Claim" }, { from: "m6Claim", to: "m6Paid" }] },
  { cue: 56, layout: { merchant: [0, 1], m6Claim: [1.5, 1], m6Paid: [3, 1] }, edges: [{ from: "merchant", to: "m6Claim" }, { from: "m6Claim", to: "m6Paid" }], accent: ["m6Claim"], badges: { m6Claim: "no double refunds" } },
  ask(57, { accent: ["m6Logbook"], badges: { m6Logbook: "every refund explained" } }),
  limits(58, { accent: ["m6Cap", "m6Window"], badges: { merchant: "no large, late mistakes" } }),
  apply(59, { accent: ["admin", "checker"], badges: { m6Request: "never one person" } }),
  book(60, {}),
  book(61, { packets: [{ from: "tabBook", to: "m6Reversal", label: "today" }, { from: "tabBook", to: "m6Refund", label: "later", delay: 45 }] }),
  book(62, { badges: { tabBook: "once · written first" } }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 6, current: ["merchant", "payment", "card", "procport", "adapters"], units: { ecom: "money back" } },
  { cue: 63, part: 6, current: ["merchant", "buyer", "payment", "commission", "epos", "card", "procsvc", "reconciliation"], units: { ecom: "one payment", cards: "end to end" } },
];

const SHOT = (name: string) => `screens/c-30-refunds/${name}.png`;
const PAYMENT = "Merchant portal · Payment";
const CONSOLE = "Bank console · Payments";
const DRAWER = [820, 0, 620, 388] as const;
const DIALOG = [440, 270, 560, 360] as const;
export const screens: ScreenStep[] = [
  {
    cue: 33,
    src: SHOT("box"),
    title: PAYMENT,
    region: [...DRAWER],
    beats: [
      { cue: 34, region: [...DRAWER], focus: [[836, 174, 588, 72]] },
      { cue: 35, region: [...DRAWER], focus: [[1318, 188, 74, 44]] },
    ],
  },
  {
    cue: 36,
    src: SHOT("dialog"),
    title: PAYMENT,
    region: [...DIALOG],
    focus: [[512, 298, 300, 32]],
    beats: [
      { cue: 37, region: [...DIALOG], focus: [[512, 328, 416, 72]] },
      { cue: 38, region: [...DIALOG], focus: [[512, 400, 416, 125]] },
      { cue: 39, region: [...DIALOG], focus: [[846, 560, 90, 46]] },
    ],
  },
  { cue: 41, src: SHOT("reversed"), title: PAYMENT, region: [...DRAWER], focus: [[1340, 66, 90, 32]], beats: [{ cue: 42, region: [...DRAWER], focus: [[840, 285, 400, 45]] }] },
  { cue: 43, src: SHOT("buyer-returned"), title: "Payment page", region: [330, 40, 780, 487], focus: [[480, 355, 480, 135]] },
  { cue: 44, src: SHOT("over-cap"), title: PAYMENT, region: [...DRAWER], beats: [{ cue: 45, region: [...DRAWER], focus: [[1240, 150, 190, 30]] }, { cue: 46, region: [...DRAWER], focus: [[836, 174, 588, 100]] }] },
  { cue: 47, src: SHOT("closed"), title: PAYMENT, region: [...DRAWER], beats: [{ cue: 48, region: [...DRAWER], focus: [[836, 174, 588, 100]] }] },
  { cue: 49, src: SHOT("viewer"), title: PAYMENT, region: [...DRAWER] },
  { cue: 50, src: SHOT("staff-sent"), title: CONSOLE, region: [700, 220, 740, 420], beats: [{ cue: 51, region: [700, 220, 740, 420], focus: [[1105, 288, 136, 40]] }] },
  { cue: 52, src: SHOT("staff-form"), title: CONSOLE, region: [440, 200, 560, 500], focus: [[512, 340, 416, 58], [512, 495, 416, 120]] },
  { cue: 53, src: SHOT("staff-sent"), title: CONSOLE, region: [820, 560, 620, 388], focus: [[995, 838, 420, 44]] },
];
