import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 28: the outbox tray. Save then tell, and the two crashes (4–10), the office tray (11–15), both or neither (16–21),
// the relay, several copies, one line per payment (22–29), at least once and the id (30–36), records are the truth (37–39),
// the product (40–50), what it protects (51–56), the close (57–60).
const APP = { m6App: [0, 1], m6Saved: [1.5, 2.1], shop: [3, 1] } as const;
const APP_EDGES = [{ from: "m6App", to: "m6Saved" }, { from: "m6App", to: "shop" }] as const;
const DESK = { m6Clerk: [0, 1], m6Outbox: [1.5, 1], m6Postman: [3, 1] } as const;
const DESK_EDGES = [{ from: "m6Clerk", to: "m6Outbox" }, { from: "m6Outbox", to: "m6Postman" }] as const;
const BOTH = { m6Final: [0, 0.2], m6Outbox: [0, 1.8], m6Ecom: [2, 1] } as const;
const BOTH_EDGES = [{ from: "m6Ecom", to: "m6Final" }, { from: "m6Ecom", to: "m6Outbox" }] as const;
const RELAY = { m6Outbox: [0, 1], m6Relay: [1.5, 1], m6Stream: [3, 1] } as const;
const RELAY_EDGES = [{ from: "m6Outbox", to: "m6Relay" }, { from: "m6Relay", to: "m6Stream" }] as const;
const COPIES = { m6Outbox: [0, 1], m6Relay: [1.5, 0.2], m6Relay2: [1.5, 1.8], m6Stream: [3, 1] } as const;
const COPIES_EDGES = [
  { from: "m6Outbox", to: "m6Relay" },
  { from: "m6Outbox", to: "m6Relay2" },
  { from: "m6Relay", to: "m6Stream" },
  { from: "m6Relay2", to: "m6Stream" },
] as const;
const READ = { m6Stream: [0, 1], merchant: [3, 1] } as const;
const app = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: APP, edges: [...APP_EDGES], ...rest });
const desk = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: DESK, edges: [...DESK_EDGES], ...rest });
const both = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: BOTH, edges: [...BOTH_EDGES], ...rest });
const relay = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: RELAY, edges: [...RELAY_EDGES], ...rest });
const read = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: READ, edges: [{ from: "m6Stream", to: "merchant" }], ...rest });
const line = (labels: string[]) => labels.map((label, i) => ({ from: "m6Relay" as const, to: "m6Stream" as const, label, delay: 10 + i * 30, duration: 25 }));

export const diagram: DiagramStep<BuildId>[] = [
  app(4, { packets: [{ from: "m6App", to: "m6Saved", label: "save paid" }, { from: "m6App", to: "shop", label: "tell", delay: 60 }] }),
  app(5, { packets: [{ from: "m6App", to: "m6Saved", label: "save paid" }, { from: "m6App", to: "shop", label: "tell", delay: 50, stopAt: 0.3 }], danger: ["m6App"], badges: { shop: "never hears" } }),
  app(6, { danger: ["m6App"], badges: { shop: "ships nothing", m6Saved: "paid" } }),
  app(7, { badges: { m6App: "swap the order" } }),
  app(8, { packets: [{ from: "m6App", to: "shop", label: "paid" }, { from: "m6App", to: "m6Saved", label: "save", delay: 50, stopAt: 0.3 }], danger: ["m6App"] }),
  app(9, { danger: ["shop"], crossed: ["m6Saved"], badges: { shop: "ships goods" } }),
  app(10, { danger: ["m6App"], shake: { m6App: 0.3 }, badges: { m6App: "split by a crash" } }),
  desk(11, { accent: ["m6Outbox"] }),
  desk(12, { packets: [{ from: "m6Clerk", to: "m6Outbox", label: "letter" }], badges: { m6Clerk: "one motion" } }),
  desk(13, { packets: [{ from: "m6Outbox", to: "m6Postman", label: "collect" }] }),
  desk(14, { badges: { m6Outbox: "in the tray", m6Clerk: "or still open" } }),
  desk(15, { badges: { m6Outbox: "never half done" } }),
  both(16, {}),
  both(17, { packets: [{ from: "m6Ecom", to: "m6Outbox", label: "news: paid" }] }),
  both(18, { accent: ["m6Outbox"], badges: { m6Outbox: "inside the records" } }),
  both(19, { packets: [{ from: "m6Ecom", to: "m6Final", label: "paid" }, { from: "m6Ecom", to: "m6Outbox", label: "news" }], badges: { m6Ecom: "one step" } }),
  both(20, { badges: { m6Ecom: "both or neither" } }),
  both(21, { badges: { m6Final: "never without news", m6Outbox: "never without paid" } }),
  relay(22, { accent: ["m6Relay"] }),
  relay(23, { badges: { m6Relay: "the postman" } }),
  relay(24, { packets: [{ from: "m6Outbox", to: "m6Relay", label: "oldest" }, { from: "m6Relay", to: "m6Stream", label: "news", delay: 50 }], accent: ["m6Stream"] }),
  { cue: 25, layout: COPIES, edges: [...COPIES_EDGES], accent: ["m6Relay2"] },
  {
    cue: 26,
    layout: COPIES,
    edges: [...COPIES_EDGES],
    packets: [{ from: "m6Outbox", to: "m6Relay", label: "letter 1" }, { from: "m6Outbox", to: "m6Relay2", label: "letter 2" }],
    badges: { m6Relay2: "a different one" },
  },
  relay(27, { packets: line(["order 1042"]), badges: { m6Stream: "labelled" } }),
  relay(28, { packets: line(["created", "paid", "refunded"]), badges: { m6Stream: "one line, in order" } }),
  relay(29, { packets: line(["created", "paid"]), badges: { m6Stream: "never overtakes" } }),
  relay(30, { packets: [{ from: "m6Stream", to: "m6Relay", label: "got it" }], badges: { m6Outbox: "then marked sent" } }),
  relay(31, { packets: [{ from: "m6Relay", to: "m6Stream", label: "news" }], danger: ["m6Relay"], shake: { m6Relay: 0.7 }, badges: { m6Outbox: "not marked" } }),
  relay(32, { packets: line(["news", "news again"]), badges: { m6Relay: "starts again" } }),
  relay(33, { badges: { m6Stream: "at least once" } }),
  relay(34, { badges: { m6Stream: "twice, never zero" } }),
  read(35, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81" }] }),
  read(36, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81" }, { from: "m6Stream", to: "merchant", label: "id 81", delay: 40, stopAt: 0.85 }], badges: { merchant: "drops the second" } }),
  both(37, {}),
  both(38, { accent: ["m6Final"], badges: { m6Final: "the truth" } }),
  { cue: 39, layout: { m6Final: [0, 1], m6Stream: [3, 1] }, edges: [{ from: "m6Final", to: "m6Stream" }], packets: [{ from: "m6Final", to: "m6Stream", label: "news" }], badges: { m6Stream: "only carries" } },
  { cue: 41, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }], packets: [{ from: "buyer", to: "m6Page", label: "pay" }] },
  { cue: 44, layout: { m6App: [1.5, 1] }, danger: ["m6App"], shake: { m6App: 0.5 }, badges: { m6App: "stopped at paid" } },
  { cue: 45, layout: { m6App: [1.5, 1] }, accent: ["m6App"], badges: { m6App: "a minute later" } },
  relay(46, { packets: [{ from: "m6Outbox", to: "m6Relay", label: "news" }, { from: "m6Relay", to: "m6Stream", label: "news", delay: 50 }], badges: { m6Outbox: "still there" } }),
  relay(47, { badges: { m6Stream: "nothing missing" } }),
  read(48, { packets: [{ from: "m6Stream", to: "merchant", label: "news" }, { from: "m6Stream", to: "merchant", label: "news", delay: 40 }] }),
  read(49, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81" }, { from: "m6Stream", to: "merchant", label: "id 81", delay: 40 }] }),
  read(50, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81", delay: 10, stopAt: 0.85 }], badges: { merchant: "keeps the first" } }),
  { cue: 52, layout: { merchant: [1.5, 1] }, accent: ["merchant"], badges: { merchant: "never waits forever" } },
  app(53, { danger: ["shop"], crossed: ["m6Saved"], badges: { shop: "no ghost payments" } }),
  relay(54, { packets: line(["paid", "refunded"]), badges: { m6Stream: "paid before refunded" } }),
  { cue: 55, layout: { shop: [0, 1], buyer: [3, 1] }, edges: [{ from: "shop", to: "buyer" }], packets: [{ from: "shop", to: "buyer", label: "goods" }] },
  both(56, { accent: ["m6Final"], badges: { m6Ecom: "news = records" } }),
  desk(57, {}),
  desk(58, { packets: [{ from: "m6Clerk", to: "m6Outbox", label: "decide + post" }] }),
  desk(59, { packets: [{ from: "m6Outbox", to: "m6Postman", label: "knock" }, { from: "m6Outbox", to: "m6Postman", label: "knock", delay: 40 }], badges: { m6Postman: "never zero" } }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["payment", "kafka"], units: { ecom: "the news" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 5, current: ["payment"] },
  { cue: 2, part: 5, current: ["merchant", "payment"] },
  { cue: 3, part: 5, current: ["payment", "kafka"] },
  { cue: 60, part: 5, current: ["payment", "kafka", "merchant"], units: { ecom: "webhooks next" } },
];

const SHOT = "screens/c-28-outbox-webhooks/detail-webhook.png";
const DRAWER = [820, 0, 620, 388] as const;
const HOOKS = [820, 200, 620, 388] as const;
export const screens: ScreenStep[] = [
  { cue: 40, src: SHOT, title: "Merchant portal · Payment", region: [...DRAWER] },
  { cue: 42, src: SHOT, title: "Merchant portal · Payment", region: [...DRAWER], focus: [[1365, 66, 68, 32]], beats: [{ cue: 43, region: [...HOOKS], focus: [[836, 440, 588, 62]] }] },
];
