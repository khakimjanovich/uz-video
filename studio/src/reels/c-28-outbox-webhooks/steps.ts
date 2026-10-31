import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 28: the outbox tray. Save then tell, and the two crashes (0–3), the office tray (4),
// both or neither (5), the relay, at least once, and the id (6–8), the close (9).
const APP = { m6App: [0, 1], m6Saved: [1.5, 2.1], shop: [3, 1] } as const;
const APP_EDGES = [{ from: "m6App", to: "m6Saved" }, { from: "m6App", to: "shop" }] as const;
const RELAY = { m6Outbox: [0.3, 1], m6Relay: [1.65, 1], shop: [3, 1] } as const;
const RELAY_EDGES = [{ from: "m6Outbox", to: "m6Relay" }, { from: "m6Relay", to: "shop" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 0,
    layout: { m6Final: [0, 1], shop: [3, 1] },
    edges: [{ from: "m6Final", to: "shop" }],
    packets: [{ from: "m6Final", to: "shop", label: "news" }],
    badges: { shop: "never lost" },
  },
  {
    cue: 1,
    layout: APP,
    edges: [...APP_EDGES],
    packets: [{ from: "m6App", to: "m6Saved", label: "save paid" }, { from: "m6App", to: "shop", label: "tell", delay: 60 }],
  },
  {
    cue: 2,
    layout: APP,
    edges: [...APP_EDGES],
    packets: [{ from: "m6App", to: "m6Saved", label: "save paid" }, { from: "m6App", to: "shop", label: "tell", delay: 50, stopAt: 0.3 }],
    danger: ["m6App"],
    badges: { m6Saved: "paid", shop: "never hears" },
  },
  {
    cue: 3,
    layout: APP,
    edges: [...APP_EDGES],
    packets: [{ from: "m6App", to: "shop", label: "paid" }, { from: "m6App", to: "m6Saved", label: "save", delay: 50, stopAt: 0.3 }],
    danger: ["m6App"],
    badges: { m6Saved: "never saved", shop: "told: paid" },
  },
  {
    cue: 4,
    layout: { m6Clerk: [0, 1], m6Outbox: [1.5, 1], m6Postman: [3, 1] },
    edges: [{ from: "m6Clerk", to: "m6Outbox" }, { from: "m6Postman", to: "m6Outbox" }],
    packets: [{ from: "m6Clerk", to: "m6Outbox", label: "letter", delay: 30 }, { from: "m6Outbox", to: "m6Postman", label: "collect", delay: 110 }],
    badges: { m6Clerk: "one motion" },
  },
  {
    cue: 5,
    layout: { m6Final: [0.3, 1], m6Outbox: [1.6, 1] },
    edges: [{ from: "m6Final", to: "m6Outbox" }],
    frames: [{ label: "Both or neither", from: [0.3, 1], to: [1.6, 1] }],
    packets: [{ from: "m6Final", to: "m6Outbox", label: "news" }],
    badges: { m6Final: "paid" },
  },
  {
    cue: 6,
    layout: RELAY,
    edges: [...RELAY_EDGES],
    packets: [{ from: "m6Outbox", to: "m6Relay", label: "oldest" }, { from: "m6Relay", to: "shop", label: "news 1", delay: 45 }, { from: "m6Relay", to: "shop", label: "news 2", delay: 85 }],
    accent: ["m6Relay"],
    badges: { m6Relay: "in order" },
  },
  {
    cue: 7,
    layout: RELAY,
    edges: [...RELAY_EDGES],
    packets: [{ from: "m6Relay", to: "shop", label: "news" }],
    badges: { m6Outbox: "sent after delivery", shop: "twice, never zero" },
  },
  {
    cue: 8,
    layout: RELAY,
    edges: [...RELAY_EDGES],
    packets: [{ from: "m6Relay", to: "shop", label: "news #41" }, { from: "m6Relay", to: "shop", label: "news #41", delay: 50 }],
    badges: { shop: "repeat dropped" },
  },
];

export const map: BuildMapStep[] = [{ cue: 9, part: 6, current: ["payment", "merchant"], units: { ecom: "outbox" } }];
