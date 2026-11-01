import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 26: one slip at the cash desk. Many callers, one crash (1–8), the cash desk (9–12), the claim (13–17),
// terminal and fee (18–21), the journal line first (22–26), the charge by token with its own id (27–34),
// three answers (35–40), the buyer's page and the merchant portal (41–53), what it protects (54–61), the close (62–65).
const DESK = { m6Cashier: [0, 1], m6Logbook: [1.5, 1], m6Drawer: [3, 1] } as const;
const DESK_EDGES = [{ from: "m6Cashier", to: "m6Logbook" }, { from: "m6Logbook", to: "m6Drawer" }] as const;
const MANY = { buyer: [0, 0.2], merchant: [0, 1.8], m6Claim: [1.5, 1], m6Ecom: [3, 1] } as const;
const MANY_EDGES = [{ from: "buyer", to: "m6Claim" }, { from: "merchant", to: "m6Claim" }, { from: "m6Claim", to: "m6Ecom" }] as const;
const FIND = { m6Claim: [0.4, 1], m6Terminal: [1.8, 0.2], m6Fee: [1.8, 1.8] } as const;
const FIND_EDGES = [{ from: "m6Claim", to: "m6Terminal" }, { from: "m6Claim", to: "m6Fee" }] as const;
const JOURNAL = { m6Claim: [0, 1], journal: [1.5, 1], network: [3, 1] } as const;
const JOURNAL_EDGES = [{ from: "m6Claim", to: "journal" }, { from: "journal", to: "network" }] as const;
const CHARGE = { m6Ecom: [0, 1], m6Zone: [1.5, 1], network: [3, 1] } as const;
const CHARGE_EDGES = [{ from: "m6Ecom", to: "m6Zone" }, { from: "m6Zone", to: "network" }] as const;
const ZONE_WALL = { label: "Card zone", from: [1.5, 1], to: [1.5, 1], tone: "wall" } as const;
const ROUTE = { m6Zone: [0, 1], processing: [1.5, 1], issuer: [3, 1] } as const;
const ROUTE_EDGES = [{ from: "m6Zone", to: "processing" }, { from: "processing", to: "issuer" }] as const;
const ROUTE_WALL = { label: "Card zone", from: [0, 1], to: [0, 1], tone: "wall" } as const;
const answer = (label: string) => [{ from: "network" as const, to: "m6Zone" as const, label }, { from: "m6Zone" as const, to: "m6Ecom" as const, label, delay: 50 }];
const desk = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: DESK, edges: [...DESK_EDGES], ...rest });
const many = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: MANY, edges: [...MANY_EDGES], ...rest });
const find = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: FIND, edges: [...FIND_EDGES], ...rest });
const journal = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: JOURNAL, edges: [...JOURNAL_EDGES], ...rest });
const charge = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: CHARGE, edges: [...CHARGE_EDGES], frames: [ZONE_WALL], ...rest });
const route = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: ROUTE, edges: [...ROUTE_EDGES], frames: [ROUTE_WALL], ...rest });
const clicks = [10, 24].map((delay) => ({ from: "buyer" as const, to: "m6Claim" as const, label: "pay", delay }));

export const diagram: DiagramStep<BuildId>[] = [
  many(1, { packets: clicks }),
  many(2, { packets: [{ from: "merchant", to: "m6Claim", label: "retry" }] }),
  {
    cue: 3,
    layout: { m6App: [0, 0.2], m6Ecom: [0, 1.8], m6Final: [2.5, 1] },
    edges: [{ from: "m6App", to: "m6Final" }, { from: "m6Ecom", to: "m6Final" }],
    packets: [{ from: "m6App", to: "m6Final", label: "take it" }, { from: "m6Ecom", to: "m6Final", label: "take it", delay: 8 }],
    badges: { m6Final: "card confirmed" },
  },
  many(4, { packets: [...clicks, { from: "merchant", to: "m6Claim", label: "retry", delay: 15 }], badges: { m6Ecom: "charge × 3?" } }),
  { cue: 5, layout: { m6App: [0, 1], network: [3, 1] }, edges: [{ from: "m6App", to: "network" }] },
  {
    cue: 6,
    layout: { m6App: [0, 1], network: [3, 1] },
    edges: [{ from: "m6App", to: "network" }],
    packets: [{ from: "m6App", to: "network", label: "charge" }, { from: "network", to: "m6App", label: "answer", delay: 55 }],
    danger: ["m6App"],
    shake: { m6App: 0.6 },
  },
  { cue: 7, layout: { m6App: [0, 1], network: [3, 1] }, edges: [{ from: "m6App", to: "network" }], danger: ["m6App"], badges: { network: "money moved?" } },
  { cue: 8, layout: { m6App: [0, 1], network: [3, 1] }, edges: [{ from: "m6App", to: "network" }], danger: ["m6App"], badges: { m6App: "nobody knows" } },
  desk(9, {}),
  desk(10, { accent: ["m6Cashier"], badges: { m6Cashier: "one slip" } }),
  desk(11, { packets: [{ from: "m6Cashier", to: "m6Logbook", label: "write", delay: 20 }, { from: "m6Logbook", to: "m6Drawer", label: "open", delay: 90 }] }),
  desk(12, { badges: { m6Logbook: "first" } }),
  many(13, { accent: ["m6Claim"] }),
  many(14, { badges: { m6Claim: "confirmed → debiting" } }),
  many(15, { badges: { m6Claim: "still confirmed?" } }),
  many(16, {
    packets: [
      { from: "buyer", to: "m6Claim", label: "click", delay: 10 },
      { from: "merchant", to: "m6Claim", label: "retry", delay: 20 },
      { from: "buyer", to: "m6Claim", label: "click", delay: 35 },
      { from: "m6Claim", to: "m6Ecom", label: "one wins", delay: 75 },
    ],
  }),
  many(17, { packets: [{ from: "m6Claim", to: "buyer", label: "taken", delay: 10 }, { from: "m6Claim", to: "merchant", label: "taken", delay: 10 }], badges: { buyer: "stop", merchant: "stop" } }),
  find(18, {}),
  find(19, { packets: [{ from: "m6Claim", to: "m6Terminal", label: "find" }], accent: ["m6Terminal"], badges: { m6Terminal: "for this card" } }),
  find(20, { packets: [{ from: "m6Claim", to: "m6Fee", label: "find" }], accent: ["m6Fee"], badges: { m6Fee: "agreed fee" } }),
  find(21, { danger: ["m6Terminal"], crossed: ["m6Terminal"], badges: { m6Claim: "nothing charged" } }),
  journal(22, { packets: [{ from: "m6Claim", to: "journal", label: "a line" }], accent: ["journal"] }),
  journal(23, { badges: { journal: "every money call" } }),
  journal(24, { badges: { journal: "debit · requested" } }),
  journal(25, { badges: { journal: "first", network: "not yet" } }),
  journal(26, { badges: { journal: "one debit line" } }),
  charge(27, { packets: [{ from: "m6Ecom", to: "m6Zone", label: "token" }] }),
  charge(28, { packets: [{ from: "m6Ecom", to: "m6Zone", label: "token + id" }] }),
  charge(29, {
    packets: [
      { from: "m6Ecom", to: "m6Zone", label: "id 7" },
      { from: "m6Ecom", to: "m6Zone", label: "id 7", delay: 45 },
      { from: "m6Zone", to: "network", label: "once", delay: 95 },
    ],
    badges: { m6Zone: "same id: once" },
  }),
  route(30, { packets: [{ from: "m6Zone", to: "processing", label: "charge" }, { from: "processing", to: "issuer", label: "ask", delay: 50 }] }),
  route(31, { badges: { processing: "holds first" } }),
  route(32, { packets: [{ from: "m6Zone", to: "processing", label: "take it" }], badges: { m6Zone: "at once" } }),
  route(33, { badges: { m6Zone: "the capture" } }),
  route(34, { packets: [{ from: "processing", to: "m6Zone", label: "approved" }], badges: { m6Zone: "money taken" } }),
  charge(35, { badges: { m6Ecom: "three answers" } }),
  charge(36, { packets: answer("approved"), accent: ["m6Ecom"], badges: { m6Ecom: "paid · reference" } }),
  charge(37, { packets: answer("declined"), badges: { m6Ecom: "final · a reason" } }),
  charge(38, { packets: [{ from: "m6Zone", to: "network", label: "charge", stopAt: 0.6 }], danger: ["network"], badges: { m6Ecom: "unknown" } }),
  charge(39, { danger: ["network"], badges: { m6Ecom: "never declined" } }),
  { cue: 40, layout: { m6Final: [1.5, 1] }, accent: ["m6Final"], badges: { m6Final: "paid stays paid" } },
  { cue: 41, layout: { buyer: [0, 1], m6Page: [1.5, 1], m6Frame: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }, { from: "m6Page", to: "m6Frame" }] },
  {
    cue: 42,
    layout: { buyer: [0, 1], m6Page: [1.5, 1], m6Frame: [3, 1] },
    edges: [{ from: "buyer", to: "m6Page" }, { from: "m6Page", to: "m6Frame" }],
    packets: [{ from: "buyer", to: "m6Frame", label: "card · confirm" }],
    accent: ["m6Frame"],
  },
  many(55, { packets: clicks, badges: { m6Ecom: "two charges" }, danger: ["m6Ecom"], crossed: ["m6Claim"] }),
  { cue: 56, layout: { m6App: [0, 1], journal: [1.5, 2.1], network: [3, 1] }, edges: [{ from: "m6App", to: "network" }], crossed: ["journal"], danger: ["m6App"], badges: { network: "no record" } },
  charge(57, { packets: [{ from: "m6Ecom", to: "m6Zone", label: "retry" }, { from: "m6Zone", to: "network", label: "charge again", delay: 50 }], danger: ["network"] }),
  {
    cue: 58,
    layout: { buyer: [0, 1], m6Ecom: [1.5, 1], network: [3, 1] },
    edges: [{ from: "m6Ecom", to: "buyer" }, { from: "m6Ecom", to: "network" }],
    packets: [{ from: "m6Ecom", to: "buyer", label: "pay again" }],
    danger: ["buyer"],
    badges: { network: "went through" },
  },
  { cue: 59, layout: { buyer: [1.5, 1] }, accent: ["buyer"], badges: { buyer: "charged once" } },
  { cue: 60, layout: { merchant: [1.5, 1] }, accent: ["merchant"], badges: { merchant: "paid once" } },
  journal(61, { accent: ["journal"], badges: { journal: "what, and when" } }),
  desk(62, {}),
  desk(63, { badges: { m6Cashier: "one slip", m6Logbook: "first" } }),
  desk(64, { packets: [{ from: "m6Logbook", to: "m6Drawer", label: "one charge" }] }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["frame", "payment", "card", "procport", "adapters"], units: { ecom: "charge once" } },
  { cue: 54, part: 5, current: ["payment", "card"], units: { ecom: "what it protects" } },
  { cue: 65, part: 5, current: ["payment", "procport", "adapters", "procsvc"], units: { cards: "silent?" } },
];

const SHOT = (name: string) => `screens/c-26-debit/${name}.png`;
const DONE = [330, 40, 780, 487] as const;
const DRAWER = [820, 0, 620, 388] as const;
export const screens: ScreenStep[] = [
  { cue: 43, src: SHOT("debiting"), title: "Payment page", region: [...DONE], focus: [[480, 380, 480, 110]] },
  { cue: 44, src: SHOT("paid"), title: "Payment page", region: [...DONE], focus: [[480, 380, 480, 110]] },
  { cue: 45, src: SHOT("declined"), title: "Payment page", region: [...DONE], beats: [{ cue: 46, region: [...DONE], focus: [[480, 380, 480, 110]] }] },
  { cue: 47, src: SHOT("list-paid"), title: "Merchant portal · Payments", region: [530, 200, 820, 525], beats: [{ cue: 48, region: [530, 200, 820, 525], focus: [[1220, 270, 120, 60]] }] },
  {
    cue: 49,
    src: SHOT("detail"),
    title: "Merchant portal · Payment",
    region: [...DRAWER],
    beats: [
      { cue: 50, region: [...DRAWER], focus: [[836, 115, 290, 45]] },
      { cue: 51, region: [...DRAWER], focus: [[836, 270, 300, 30]] },
      { cue: 52, region: [...DRAWER], focus: [[840, 315, 400, 45]] },
    ],
  },
];
