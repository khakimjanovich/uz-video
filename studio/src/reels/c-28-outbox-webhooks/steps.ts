import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 28: the outbox tray. Save then tell, and the two crashes (1–7), the office tray (8–12), both or neither (13–18),
// the relay, several copies, one line per payment (19–26), at least once and the id (27–33), records are the truth (34–36),
// the product (37–47), what it protects (48–53), the close (54–57).
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
  app(1, { packets: [{ from: "m6App", to: "m6Saved", label: "save paid" }, { from: "m6App", to: "shop", label: "tell", delay: 60 }] }),
  app(2, { packets: [{ from: "m6App", to: "m6Saved", label: "save paid" }, { from: "m6App", to: "shop", label: "tell", delay: 50, stopAt: 0.3 }], danger: ["m6App"], badges: { shop: "never hears" } }),
  app(3, { danger: ["m6App"], badges: { shop: "ships nothing", m6Saved: "paid" } }),
  app(4, { badges: { m6App: "swap the order" } }),
  app(5, { packets: [{ from: "m6App", to: "shop", label: "paid" }, { from: "m6App", to: "m6Saved", label: "save", delay: 50, stopAt: 0.3 }], danger: ["m6App"] }),
  app(6, { danger: ["shop"], crossed: ["m6Saved"], badges: { shop: "ships goods" } }),
  app(7, { danger: ["m6App"], shake: { m6App: 0.3 }, badges: { m6App: "split by a crash" } }),
  desk(8, { accent: ["m6Outbox"] }),
  desk(9, { packets: [{ from: "m6Clerk", to: "m6Outbox", label: "letter" }], badges: { m6Clerk: "one motion" } }),
  desk(10, { packets: [{ from: "m6Outbox", to: "m6Postman", label: "collect" }] }),
  desk(11, { badges: { m6Outbox: "in the tray", m6Clerk: "or still open" } }),
  desk(12, { badges: { m6Outbox: "never half done" } }),
  both(13, {}),
  both(14, { packets: [{ from: "m6Ecom", to: "m6Outbox", label: "news: paid" }] }),
  both(15, { accent: ["m6Outbox"], badges: { m6Outbox: "inside the records" } }),
  both(16, { packets: [{ from: "m6Ecom", to: "m6Final", label: "paid" }, { from: "m6Ecom", to: "m6Outbox", label: "news" }], badges: { m6Ecom: "one step" } }),
  both(17, { badges: { m6Ecom: "both or neither" } }),
  both(18, { badges: { m6Final: "never without news", m6Outbox: "never without paid" } }),
  relay(19, { accent: ["m6Relay"] }),
  relay(20, { badges: { m6Relay: "the postman" } }),
  relay(21, { packets: [{ from: "m6Outbox", to: "m6Relay", label: "oldest" }, { from: "m6Relay", to: "m6Stream", label: "news", delay: 50 }], accent: ["m6Stream"] }),
  { cue: 22, layout: COPIES, edges: [...COPIES_EDGES], accent: ["m6Relay2"] },
  {
    cue: 23,
    layout: COPIES,
    edges: [...COPIES_EDGES],
    packets: [{ from: "m6Outbox", to: "m6Relay", label: "letter 1" }, { from: "m6Outbox", to: "m6Relay2", label: "letter 2" }],
    badges: { m6Relay2: "a different one" },
  },
  relay(24, { packets: line(["order 1042"]), badges: { m6Stream: "labelled" } }),
  relay(25, { packets: line(["created", "paid", "refunded"]), badges: { m6Stream: "one line, in order" } }),
  relay(26, { packets: line(["created", "paid"]), badges: { m6Stream: "never overtakes" } }),
  relay(27, { packets: [{ from: "m6Stream", to: "m6Relay", label: "got it" }], badges: { m6Outbox: "then marked sent" } }),
  relay(28, { packets: [{ from: "m6Relay", to: "m6Stream", label: "news" }], danger: ["m6Relay"], shake: { m6Relay: 0.7 }, badges: { m6Outbox: "not marked" } }),
  relay(29, { packets: line(["news", "news again"]), badges: { m6Relay: "starts again" } }),
  relay(30, { badges: { m6Stream: "at least once" } }),
  relay(31, { badges: { m6Stream: "twice, never zero" } }),
  read(32, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81" }] }),
  read(33, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81" }, { from: "m6Stream", to: "merchant", label: "id 81", delay: 40, stopAt: 0.85 }], badges: { merchant: "drops the second" } }),
  both(34, {}),
  both(35, { accent: ["m6Final"], badges: { m6Final: "the truth" } }),
  { cue: 36, layout: { m6Final: [0, 1], m6Stream: [3, 1] }, edges: [{ from: "m6Final", to: "m6Stream" }], packets: [{ from: "m6Final", to: "m6Stream", label: "news" }], badges: { m6Stream: "only carries" } },
  { cue: 38, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }], packets: [{ from: "buyer", to: "m6Page", label: "pay" }] },
  { cue: 41, layout: { m6App: [1.5, 1] }, danger: ["m6App"], shake: { m6App: 0.5 }, badges: { m6App: "stopped at paid" } },
  { cue: 42, layout: { m6App: [1.5, 1] }, accent: ["m6App"], badges: { m6App: "a minute later" } },
  relay(43, { packets: [{ from: "m6Outbox", to: "m6Relay", label: "news" }, { from: "m6Relay", to: "m6Stream", label: "news", delay: 50 }], badges: { m6Outbox: "still there" } }),
  relay(44, { badges: { m6Stream: "nothing missing" } }),
  read(45, { packets: [{ from: "m6Stream", to: "merchant", label: "news" }, { from: "m6Stream", to: "merchant", label: "news", delay: 40 }] }),
  read(46, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81" }, { from: "m6Stream", to: "merchant", label: "id 81", delay: 40 }] }),
  read(47, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81", delay: 10, stopAt: 0.85 }], badges: { merchant: "keeps the first" } }),
  { cue: 49, layout: { merchant: [1.5, 1] }, accent: ["merchant"], badges: { merchant: "never waits forever" } },
  app(50, { danger: ["shop"], crossed: ["m6Saved"], badges: { shop: "no ghost payments" } }),
  relay(51, { packets: line(["paid", "refunded"]), badges: { m6Stream: "paid before refunded" } }),
  { cue: 52, layout: { shop: [0, 1], buyer: [3, 1] }, edges: [{ from: "shop", to: "buyer" }], packets: [{ from: "shop", to: "buyer", label: "goods" }] },
  both(53, { accent: ["m6Final"], badges: { m6Ecom: "news = records" } }),
  desk(54, {}),
  desk(55, { packets: [{ from: "m6Clerk", to: "m6Outbox", label: "decide + post" }] }),
  desk(56, { packets: [{ from: "m6Outbox", to: "m6Postman", label: "knock" }, { from: "m6Outbox", to: "m6Postman", label: "knock", delay: 40 }], badges: { m6Postman: "never zero" } }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["payment", "kafka"], units: { ecom: "the news" } },
  { cue: 57, part: 5, current: ["payment", "kafka", "merchant"], units: { ecom: "webhooks next" } },
];

const SHOT = "screens/c-28-outbox-webhooks/detail-webhook.png";
const DRAWER = [820, 0, 620, 388] as const;
const HOOKS = [820, 200, 620, 388] as const;
export const screens: ScreenStep[] = [
  { cue: 37, src: SHOT, title: "Merchant portal · Payment", region: [...DRAWER] },
  { cue: 39, src: SHOT, title: "Merchant portal · Payment", region: [...DRAWER], focus: [[1365, 66, 68, 32]], beats: [{ cue: 40, region: [...HOOKS], focus: [[836, 440, 588, 62]] }] },
];
