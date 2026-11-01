import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 30: refunds. One shop carries it: a wilted bouquet on a Tuesday morning, a hotel's large order, an old payment from the spring.
// The wilted bouquet (0–2), the bridge from lessons 2 and 27 (3–4), three mistakes (5–9), reversal or refund, the day, the whole amount (10–14),
// the cap and the window (15–19), claim, logbook, card zone, three answers (20–26), refund by application (27–31), how it gives back (32),
// the merchant portal, the buyer's page and the admin portal (33–55), what it protects (56–59), next (60).
const DAY = { m6Clock: [0, 1], m6Reversal: [2.2, 0.2], m6Refund: [2.2, 1.8] } as const;
const DAY_EDGES = [{ from: "m6Clock", to: "m6Reversal" }, { from: "m6Clock", to: "m6Refund" }] as const;
const LIMITS = { shop: [0, 1], m6Cap: [1.5, 0.2], m6Window: [1.5, 1.8], m6Paid: [3, 1] } as const;
const LIMITS_EDGES = [{ from: "shop", to: "m6Cap" }, { from: "shop", to: "m6Window" }, { from: "m6Cap", to: "m6Paid" }, { from: "m6Window", to: "m6Paid" }] as const;
const ASK = { m6Claim: [0, 1], m6Logbook: [1.5, 1], m6Zone: [3, 1] } as const;
const ASK_EDGES = [{ from: "m6Claim", to: "m6Logbook" }, { from: "m6Logbook", to: "m6Zone" }] as const;
const ZONE_WALL = { label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" } as const;
const APPLY = { shop: [0, 1], admin: [1.5, 0.2], checker: [1.5, 1.8], m6Request: [3, 1] } as const;
const APPLY_EDGES = [{ from: "shop", to: "admin", label: "writes" }, { from: "admin", to: "m6Request" }, { from: "checker", to: "m6Request", label: "approves" }] as const;
const CLAIM = { shop: [0, 1], m6Claim: [1.5, 1], m6Paid: [3, 1] } as const;
const CLAIM_EDGES = [{ from: "shop", to: "m6Claim" }, { from: "m6Claim", to: "m6Paid" }] as const;
const day = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: DAY, edges: [...DAY_EDGES], ...rest });
const limits = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: LIMITS, edges: [...LIMITS_EDGES], ...rest });
const ask = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: ASK, edges: [...ASK_EDGES], frames: [ZONE_WALL], ...rest });
const apply = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: APPLY, edges: [...APPLY_EDGES], ...rest });

export const diagram: DiagramStep<BuildId>[] = [
  // Tuesday morning: a wilted bouquet, and the buyer wants the money back.
  { cue: 1, layout: { buyer: [0, 1], shop: [3, 1] }, edges: [{ from: "buyer", to: "shop" }], packets: [{ from: "buyer", to: "shop", label: "wilted" }], badges: { shop: "Tue 11:00", buyer: "paid at 9" } },
  { cue: 2, layout: { m6Paid: [0, 1], buyer: [3, 1] }, edges: [{ from: "m6Paid", to: "buyer" }], packets: [{ from: "m6Paid", to: "buyer", label: "money back" }], badges: { m6Paid: "nothing may go wrong" } },
  // Three mistakes.
  { cue: 5, layout: { m6Paid: [0, 1], buyer: [3, 1] }, edges: [{ from: "m6Paid", to: "buyer" }], badges: { m6Paid: "without care" } },
  {
    cue: 6,
    layout: { shop: [0, 1], m6Paid: [1.5, 1], buyer: [3, 1] },
    edges: [{ from: "shop", to: "m6Paid" }, { from: "m6Paid", to: "buyer" }],
    packets: [{ from: "shop", to: "m6Paid", label: "give back", delay: 10 }, { from: "shop", to: "m6Paid", label: "give back", delay: 24 }],
    danger: ["m6Paid"],
  },
  {
    cue: 7,
    layout: { admin: [0, 1], m6Paid: [1.5, 1], buyer: [3, 1] },
    edges: [{ from: "admin", to: "m6Paid" }, { from: "m6Paid", to: "buyer" }],
    packets: [{ from: "admin", to: "m6Paid", label: "by phone" }],
    danger: ["m6Paid"],
    badges: { admin: "support team" },
  },
  {
    cue: 8,
    layout: { m6Paid: [0, 1], m6OldCard: [3, 1] },
    edges: [{ from: "m6Paid", to: "m6OldCard" }],
    packets: [{ from: "m6Paid", to: "m6OldCard", label: "6 months later", stopAt: 0.8 }],
    danger: ["m6OldCard"],
  },
  { cue: 9, layout: { m6Paid: [1.5, 1] }, danger: ["m6Paid"], badges: { m6Paid: "too much · too late" } },
  // Reversal or refund: the day decides; the whole amount.
  day(10, { accent: ["m6Clock"], badges: { m6Clock: "the day decides" } }),
  day(11, { packets: [{ from: "m6Clock", to: "m6Reversal", label: "before closing" }], accent: ["m6Reversal"], badges: { m6Reversal: "costs nothing" } }),
  day(12, { packets: [{ from: "m6Clock", to: "m6Refund", label: "after closing" }], accent: ["m6Refund"] }),
  day(13, { accent: ["m6Clock"], badges: { m6Clock: "bank's time zone" } }),
  day(14, { badges: { m6Clock: "the whole amount" } }),
  // The cap and the window.
  limits(15, { packets: [{ from: "shop", to: "m6Cap", label: "give back" }], accent: ["m6Cap"] }),
  limits(16, { badges: { m6Cap: "largest on its own" } }),
  limits(17, { accent: ["m6Window"], packets: [{ from: "shop", to: "m6Window", label: "later" }] }),
  limits(18, { badges: { m6Window: "working days" } }),
  { cue: 19, layout: { admin: [0, 0.2], checker: [0, 1.8], m6Window: [2, 1] }, edges: [{ from: "admin", to: "m6Window" }, { from: "checker", to: "m6Window" }], badges: { m6Window: "longer" } },
  // Like the charge: one claim, the logbook first, the card zone, three answers.
  ask(20, {}),
  { cue: 21, layout: CLAIM, edges: [...CLAIM_EDGES], packets: [{ from: "shop", to: "m6Claim", label: "click", delay: 10 }, { from: "shop", to: "m6Claim", label: "click", delay: 24 }, { from: "m6Claim", to: "m6Paid", label: "one wins", delay: 65 }], accent: ["m6Claim"] },
  ask(22, { packets: [{ from: "m6Claim", to: "m6Logbook", label: "reason" }], accent: ["m6Logbook"], badges: { m6Logbook: "first" } }),
  ask(23, { packets: [{ from: "m6Logbook", to: "m6Zone", label: "token + id" }] }),
  ask(24, { packets: [{ from: "m6Zone", to: "m6Logbook", label: "approved" }], badges: { m6Claim: "final" } }),
  ask(25, { packets: [{ from: "m6Zone", to: "m6Logbook", label: "refused" }], badges: { m6Claim: "stays paid" } }),
  ask(26, { packets: [{ from: "m6Logbook", to: "m6Zone", label: "…", stopAt: 0.6 }], badges: { m6Claim: "asked later", m6Zone: "never twice" } }),
  // Beyond the cap or the window: refund by application.
  limits(27, { danger: ["m6Cap", "m6Window"], badges: { shop: "not alone" } }),
  apply(28, { accent: ["admin"] }),
  apply(29, { accent: ["m6Request"] }),
  apply(30, { packets: [{ from: "shop", to: "admin", label: "application" }] }),
  apply(31, { packets: [{ from: "admin", to: "m6Request", label: "ask" }, { from: "checker", to: "m6Request", label: "approve", delay: 55 }] }),
  ask(32, { accent: ["m6Claim", "m6Logbook"], badges: { m6Logbook: "carefully" } }),
  // Back to the wilted bouquet, in the portals.
  { cue: 33, layout: { shop: [1.5, 1] }, accent: ["shop"], badges: { shop: "wilted bouquet" } },
  { cue: 41, layout: { m6Paid: [0, 1], m6Zone: [3, 1] }, edges: [{ from: "m6Paid", to: "m6Zone" }], frames: [ZONE_WALL], packets: [{ from: "m6Paid", to: "m6Zone", label: "give back" }], badges: { m6Paid: "giving it back" } },
  apply(51, { packets: [{ from: "shop", to: "admin", label: "application" }], badges: { admin: "Dilnoza" } }),
  apply(55, { packets: [{ from: "checker", to: "m6Request", label: "approve" }], accent: ["checker"], badges: { m6Request: "then money goes" } }),
  // What it protects.
  { cue: 56, layout: CLAIM, edges: [...CLAIM_EDGES], accent: ["m6Claim"], badges: { m6Claim: "no double refunds" } },
  ask(57, { accent: ["m6Logbook"], badges: { m6Logbook: "every refund explained" } }),
  limits(58, { accent: ["m6Cap", "m6Window"], badges: { shop: "no large, late mistakes" } }),
  apply(59, { accent: ["admin", "checker"], badges: { m6Request: "never one person" } }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["merchant", "payment", "card", "procport", "adapters"], units: { ecom: "money back" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 3, part: 5, current: ["payment", "card"] },
  { cue: 4, part: 5, current: ["payment", "procport", "card"] },
  { cue: 60, part: 5, current: ["merchant", "buyer", "payment", "commission", "epos", "card", "procsvc", "reconciliation"], units: { ecom: "one payment", cards: "end to end" } },
];

const SHOT = (name: string) => `screens/c-30-refunds/${name}.png`;
const PAYMENT = "Merchant portal · Payment";
const CONSOLE = "Bank console · Payments";
const DRAWER = [820, 0, 620, 388] as const;
const DIALOG = [440, 270, 560, 360] as const;
export const screens: ScreenStep[] = [
  {
    cue: 34,
    src: SHOT("box"),
    title: PAYMENT,
    region: [...DRAWER],
    beats: [
      { cue: 35, region: [...DRAWER], focus: [[836, 174, 588, 72]] },
      { cue: 36, region: [...DRAWER], focus: [[1318, 188, 74, 44]] },
    ],
  },
  {
    cue: 37,
    src: SHOT("dialog"),
    title: PAYMENT,
    region: [...DIALOG],
    focus: [[512, 298, 300, 32]],
    beats: [
      { cue: 38, region: [...DIALOG], focus: [[512, 328, 416, 72]] },
      { cue: 39, region: [...DIALOG], focus: [[512, 400, 416, 125]] },
      { cue: 40, region: [...DIALOG], focus: [[846, 560, 90, 46]] },
    ],
  },
  { cue: 42, src: SHOT("reversed"), title: PAYMENT, region: [...DRAWER], focus: [[1340, 66, 90, 32]], beats: [{ cue: 43, region: [...DRAWER], focus: [[840, 285, 400, 45]] }] },
  { cue: 44, src: SHOT("buyer-returned"), title: "Payment page", region: [330, 40, 780, 487], focus: [[480, 355, 480, 135]] },
  { cue: 45, src: SHOT("over-cap"), title: PAYMENT, region: [...DRAWER], beats: [{ cue: 46, region: [...DRAWER], focus: [[1240, 150, 190, 30]] }, { cue: 47, region: [...DRAWER], focus: [[836, 174, 588, 100]] }] },
  { cue: 48, src: SHOT("closed"), title: PAYMENT, region: [...DRAWER], beats: [{ cue: 49, region: [...DRAWER], focus: [[836, 174, 588, 100]] }] },
  { cue: 50, src: SHOT("viewer"), title: PAYMENT, region: [...DRAWER] },
  { cue: 52, src: SHOT("staff-sent"), title: CONSOLE, region: [700, 220, 740, 420], focus: [[1105, 288, 136, 40]] },
  { cue: 53, src: SHOT("staff-form"), title: CONSOLE, region: [440, 200, 560, 500], focus: [[512, 340, 416, 58], [512, 495, 416, 120]] },
  { cue: 54, src: SHOT("staff-sent"), title: CONSOLE, region: [820, 560, 620, 388], focus: [[995, 838, 420, 44]] },
];
