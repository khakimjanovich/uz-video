import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 28: the app restarts while peonies are paid. Monday's restart (0–3), the bridge (4–5), save then tell, and the two crashes (6–14),
// both or neither (16–20), the relay, several copies, one line per payment (21–27), at least once and the id (28–34),
// records are the truth (35–37), an ordinary day (38–41), Monday's restart again (42–49), what Malika is spared (50–53), next (53).
const RESTART = { buyer: [0, 1], m6App: [1.5, 1], shop: [3, 1] } as const;
const RESTART_EDGES = [{ from: "buyer", to: "m6App" }, { from: "m6App", to: "shop" }] as const;
const APP = { m6App: [0, 1], m6Saved: [1.5, 2.1], shop: [3, 1] } as const;
const APP_EDGES = [{ from: "m6App", to: "m6Saved" }, { from: "m6App", to: "shop" }] as const;
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
const restart = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: RESTART, edges: [...RESTART_EDGES], ...rest });
const app = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: APP, edges: [...APP_EDGES], ...rest });
const both = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: BOTH, edges: [...BOTH_EDGES], ...rest });
const relay = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: RELAY, edges: [...RELAY_EDGES], ...rest });
const read = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: READ, edges: [{ from: "m6Stream", to: "merchant" }], ...rest });
const line = (labels: string[]) => labels.map((label, i) => ({ from: "m6Relay" as const, to: "m6Stream" as const, label, delay: 10 + i * 30, duration: 25 }));

export const diagram: DiagramStep<BuildId>[] = [
  // Monday morning: peonies are paid as the app restarts. Will the shop ever hear?
  restart(1, { packets: [{ from: "buyer", to: "m6App", label: "peonies" }], danger: ["m6App"], shake: { m6App: 0.7 }, badges: { buyer: "Mon 08:15", m6App: "restarts" } }),
  restart(2, { packets: [{ from: "m6App", to: "shop", label: "paid" }], badges: { shop: "ships on paid" } }),
  restart(3, { packets: [{ from: "m6App", to: "shop", label: "paid?", stopAt: 0.5 }], badges: { shop: "news?" } }),
  // Two separate steps, and the crash between them.
  app(6, { badges: { m6App: "two steps" } }),
  app(7, { packets: [{ from: "m6App", to: "m6Saved", label: "save paid" }, { from: "m6App", to: "shop", label: "tell", delay: 60 }] }),
  app(8, { packets: [{ from: "m6App", to: "m6Saved", label: "save paid" }, { from: "m6App", to: "shop", label: "tell", delay: 50, stopAt: 0.3 }], danger: ["m6App"], badges: { shop: "never hears" } }),
  app(9, { danger: ["m6App"], badges: { shop: "ships nothing", m6Saved: "paid" } }),
  app(10, { badges: { m6App: "swap the order" } }),
  app(11, { packets: [{ from: "m6App", to: "shop", label: "paid" }, { from: "m6App", to: "m6Saved", label: "save", delay: 50, stopAt: 0.3 }], danger: ["m6App"] }),
  app(12, { danger: ["shop"], crossed: ["m6Saved"], badges: { shop: "ships peonies" } }),
  app(13, { danger: ["m6App"], shake: { m6App: 0.3 }, badges: { m6App: "split by a crash" } }),
  app(14, { packets: [{ from: "m6App", to: "m6Saved", label: "save" }, { from: "m6App", to: "shop", label: "tell", delay: 50 }], badges: { m6App: "until one restart" } }),
  // The outbox: the news and the final state, saved together.
  both(16, { packets: [{ from: "m6Ecom", to: "m6Outbox", label: "news: paid" }] }),
  both(17, { accent: ["m6Outbox"], badges: { m6Outbox: "inside the records" } }),
  both(18, { packets: [{ from: "m6Ecom", to: "m6Final", label: "paid" }, { from: "m6Ecom", to: "m6Outbox", label: "news" }], badges: { m6Ecom: "one step" } }),
  both(19, { badges: { m6Ecom: "both or neither" } }),
  both(20, { badges: { m6Final: "never without news", m6Outbox: "never without paid" } }),
  // The relay, its copies, and one line per payment.
  relay(21, { accent: ["m6Relay"] }),
  relay(22, { packets: [{ from: "m6Outbox", to: "m6Relay", label: "oldest" }, { from: "m6Relay", to: "m6Stream", label: "news", delay: 50 }], accent: ["m6Stream"] }),
  { cue: 23, layout: COPIES, edges: [...COPIES_EDGES], accent: ["m6Relay2"] },
  {
    cue: 24,
    layout: COPIES,
    edges: [...COPIES_EDGES],
    packets: [{ from: "m6Outbox", to: "m6Relay", label: "news 1" }, { from: "m6Outbox", to: "m6Relay2", label: "news 2" }],
    badges: { m6Relay2: "a different one" },
  },
  relay(25, { packets: line(["peonies"]), badges: { m6Stream: "labelled" } }),
  relay(26, { packets: line(["created", "paid", "refunded"]), badges: { m6Stream: "one line, in order" } }),
  relay(27, { packets: line(["created", "paid"]), badges: { m6Stream: "never overtakes" } }),
  // At least once, and the id that makes repeats harmless.
  relay(28, { packets: [{ from: "m6Stream", to: "m6Relay", label: "got it" }], badges: { m6Outbox: "then marked sent" } }),
  relay(29, { packets: [{ from: "m6Relay", to: "m6Stream", label: "news" }], danger: ["m6Relay"], shake: { m6Relay: 0.7 }, badges: { m6Outbox: "not marked" } }),
  relay(30, { packets: line(["news", "news again"]), badges: { m6Relay: "starts again" } }),
  relay(31, { badges: { m6Stream: "at least once" } }),
  relay(32, { badges: { m6Stream: "twice, never zero" } }),
  read(33, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81" }] }),
  read(34, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81" }, { from: "m6Stream", to: "merchant", label: "id 81", delay: 40, stopAt: 0.85 }], badges: { merchant: "drops the second" } }),
  // The records are the truth.
  both(35, {}),
  both(36, { accent: ["m6Final"], badges: { m6Final: "the truth" } }),
  { cue: 37, layout: { m6Final: [0, 1], m6Stream: [3, 1] }, edges: [{ from: "m6Final", to: "m6Stream" }], packets: [{ from: "m6Final", to: "m6Stream", label: "news" }], badges: { m6Stream: "only carries" } },
  { cue: 39, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }], packets: [{ from: "buyer", to: "m6Page", label: "pay" }] },
  // Back to Monday's restart.
  { cue: 42, layout: { m6App: [1.5, 1] }, badges: { m6App: "Mon 08:15" } },
  { cue: 43, layout: { m6App: [1.5, 1] }, danger: ["m6App"], shake: { m6App: 0.5 }, badges: { m6App: "stopped at paid" } },
  { cue: 44, layout: { m6App: [1.5, 1] }, accent: ["m6App"], badges: { m6App: "a minute later" } },
  relay(45, { packets: [{ from: "m6Outbox", to: "m6Relay", label: "news" }, { from: "m6Relay", to: "m6Stream", label: "news", delay: 50 }], badges: { m6Outbox: "still there" } }),
  relay(46, { badges: { m6Stream: "nothing missing" } }),
  read(47, { packets: [{ from: "m6Stream", to: "merchant", label: "news" }, { from: "m6Stream", to: "merchant", label: "news", delay: 40 }], badges: { merchant: "Bekzod's server" } }),
  read(48, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81" }, { from: "m6Stream", to: "merchant", label: "id 81", delay: 40 }] }),
  read(49, { packets: [{ from: "m6Stream", to: "merchant", label: "id 81", delay: 10, stopAt: 0.85 }], badges: { merchant: "keeps the first" } }),
  // What Malika and the bank are spared.
  { cue: 50, layout: { shop: [1.5, 1] }, accent: ["shop"], badges: { shop: "never waits forever" } },
  app(51, { danger: ["shop"], crossed: ["m6Saved"], badges: { shop: "no ghost payments" } }),
  relay(52, { packets: line(["paid", "refunded"]), badges: { m6Stream: "paid before refunded" } }),
  both(53, { accent: ["m6Final"], badges: { m6Ecom: "news = records" } }),
  both(54, { accent: ["m6Final", "m6Outbox"], badges: { m6Ecom: "saved together" } }),
  restart(55, { danger: ["m6App"], badges: { m6App: "crash" } }),
  relay(56, { packets: line(["paid"]), accent: ["m6Outbox"], badges: { m6Outbox: "still there" } }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["payment", "kafka"], units: { ecom: "the news" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 4, part: 5, current: ["merchant", "payment"] },
  { cue: 5, part: 5, current: ["payment", "kafka"] },
  { cue: 57, part: 5, current: ["payment", "kafka", "merchant"], units: { ecom: "webhooks next" } },
];

const SHOT = "screens/c-28-outbox-webhooks/detail-webhook.png";
const DRAWER = [820, 0, 620, 388] as const;
const HOOKS = [820, 200, 620, 388] as const;
export const screens: ScreenStep[] = [
  { cue: 38, src: SHOT, title: "Merchant portal · Payment", region: [...DRAWER] },
  { cue: 40, src: SHOT, title: "Merchant portal · Payment", region: [...DRAWER], focus: [[1365, 66, 68, 32]], beats: [{ cue: 41, region: [...HOOKS], focus: [[836, 440, 588, 62]] }] },
];
