import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 28b: webhooks. One shop carries it: Malika's server down for an hour on a Saturday, six bouquets waiting.
// Server down, six waiting (0–3), the bridge from lessons 29 and 24 (4–5), what the shop and the bank need (6–9),
// the webhook, its id, time and signature (10–16), the address guard (17–23), success, retries, order, undelivered (24–29),
// that Saturday in the merchant portal (30–46), what it protects (47–50), next (51).
const POST = { m6Ecom: [0, 1], m6Hook: [1.5, 1], merchant: [3, 1] } as const;
const POST_EDGES = [{ from: "m6Ecom", to: "m6Hook" }, { from: "m6Hook", to: "merchant" }] as const;
const GUARD = { m6Ecom: [0, 1], m6Hook: [1.5, 1], merchant: [3, 0.2], m6Inside: [3, 1.8] } as const;
const GUARD_EDGES = [{ from: "m6Ecom", to: "m6Hook" }, { from: "m6Hook", to: "merchant" }, { from: "m6Hook", to: "m6Inside", broken: true }] as const;
const post = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: POST, edges: [...POST_EDGES], ...rest });
const guard = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: GUARD, edges: [...GUARD_EDGES], ...rest });
const tries = (stop = 0.85) => [10, 45, 110].map((delay) => ({ from: "m6Hook" as const, to: "merchant" as const, label: "try", delay, duration: 25, stopAt: stop }));

export const diagram: DiagramStep<BuildId>[] = [
  // Saturday 14:00: the server goes down for an hour; six bouquets sell and wait for paid.
  post(1, { danger: ["merchant"], badges: { m6Ecom: "Sat 14:00", merchant: "down an hour" } }),
  post(2, { packets: tries(), danger: ["merchant"], badges: { m6Ecom: "6 bouquets paid", merchant: "down an hour" } }),
  post(3, { packets: [{ from: "m6Hook", to: "merchant", label: "paid", stopAt: 0.85 }], badges: { m6Ecom: "6 waiting", merchant: "ships on paid" } }),
  // What the shop and the bank need.
  post(6, { packets: tries(1), badges: { merchant: "back: all, in order" } }),
  { ...post(7, { packets: [{ from: "attacker", to: "merchant", label: "paid", delay: 10 }], danger: ["attacker"], badges: { attacker: "anyone" } }), layout: { ...POST, attacker: [3, 2.1] } },
  { cue: 8, layout: { m6Ecom: [0, 1], m6Inside: [3, 1] }, edges: [{ from: "m6Ecom", to: "m6Inside" }] },
  {
    cue: 9,
    layout: { attacker: [0, 0.2], m6Ecom: [0, 1.8], m6Inside: [3, 1.8] },
    edges: [{ from: "attacker", to: "m6Ecom", label: "set address" }, { from: "m6Ecom", to: "m6Inside" }],
    packets: [{ from: "m6Ecom", to: "m6Inside", label: "call", delay: 40 }],
    danger: ["attacker", "m6Inside"],
    badges: { attacker: "signs up" },
  },
  // The webhook: id, time, signature.
  post(10, { accent: ["m6Hook"] }),
  { cue: 11, layout: { m6Outbox: [0, 1], m6Ecom: [1.5, 1], m6Hook: [3, 1] }, edges: [{ from: "m6Outbox", to: "m6Ecom" }, { from: "m6Ecom", to: "m6Hook" }], packets: [{ from: "m6Outbox", to: "m6Ecom", label: "news" }, { from: "m6Ecom", to: "m6Hook", label: "event", delay: 50 }] },
  post(12, { badges: { m6Hook: "set per website" } }),
  post(13, { packets: [{ from: "m6Hook", to: "merchant", label: "id · time · signature" }] }),
  post(14, { badges: { m6Ecom: "same signing key" } }),
  post(15, { badges: { m6Hook: "open standard" } }),
  post(16, { packets: [{ from: "m6Hook", to: "merchant", label: "event" }], badges: { merchant: "seal · age · id" } }),
  // The address guard.
  guard(17, { badges: { m6Ecom: "check first" } }),
  guard(18, { badges: { m6Hook: "secure address" } }),
  guard(19, { danger: ["m6Inside"], badges: { m6Hook: "public only" } }),
  guard(20, { packets: [{ from: "m6Hook", to: "merchant", label: "connect" }], badges: { m6Hook: "checked again" } }),
  guard(21, { packets: [{ from: "m6Hook", to: "m6Inside", label: "redirect", stopAt: 0.5 }], badges: { m6Hook: "no redirects" } }),
  guard(22, { danger: ["m6Inside"], crossed: ["m6Inside"], badges: { m6Ecom: "request forgery stopped" } }),
  guard(23, { packets: [{ from: "m6Hook", to: "m6Inside", label: "call" }], danger: ["m6Inside"], badges: { m6Inside: "a way into the bank" } }),
  // Success, retries, order, undelivered.
  post(24, { packets: [{ from: "m6Hook", to: "merchant", label: "event" }, { from: "merchant", to: "m6Hook", label: "success", delay: 50 }] }),
  post(25, { packets: tries(), badges: { m6Hook: "longer each time" } }),
  post(26, {
    packets: [
      { from: "m6Hook", to: "merchant", label: "paid", delay: 10, stopAt: 0.85 },
      { from: "m6Ecom", to: "m6Hook", label: "refunded", delay: 20 },
    ],
    badges: { m6Hook: "later waits" },
  }),
  post(27, { danger: ["merchant"], badges: { m6Hook: "undelivered" } }),
  post(28, { packets: [{ from: "merchant", to: "m6Ecom", label: "send again" }] }),
  { cue: 29, layout: { m6Bill: [0, 1], m6Hook: [3, 1] }, edges: [{ from: "m6Bill", to: "m6Hook" }], crossed: ["m6Hook"], badges: { m6Bill: "no server behind it" } },
  // That Saturday in the merchant portal.
  { cue: 30, layout: { merchant: [1.5, 1] }, accent: ["merchant"], badges: { merchant: "Saturday" } },
  { cue: 35, layout: POST, edges: [...POST_EDGES], danger: ["merchant"], packets: tries(), badges: { merchant: "maintenance hour" } },
  { cue: 39, layout: POST, edges: [...POST_EDGES], danger: ["merchant"], packets: tries(), badges: { merchant: "still down", m6Hook: "past chosen time" } },
  // What it protects.
  { ...post(47, { packets: [{ from: "attacker", to: "merchant", label: "paid", stopAt: 0.8 }], danger: ["attacker"], badges: { merchant: "no bouquet ships" } }), layout: { ...POST, attacker: [3, 2.1] } },
  post(48, { packets: tries(1), badges: { merchant: "back: all events" } }),
  post(49, { packets: [{ from: "m6Hook", to: "merchant", label: "paid" }, { from: "m6Hook", to: "merchant", label: "refunded", delay: 45 }] }),
  guard(50, { danger: ["m6Inside"], crossed: ["m6Inside"], badges: { m6Inside: "out of reach" } }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["kafka", "payment", "merchant"], units: { ecom: "webhooks" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 4, part: 5, current: ["payment", "kafka", "merchant"] },
  { cue: 5, part: 5, current: ["kafka", "merchant"] },
  { cue: 51, part: 5, current: ["merchant", "payment", "frame"], units: { ecom: "payment links next" } },
];

const SHOT = (name: string) => `screens/c-28b-webhooks/${name}.png`;
const TITLE = "Merchant portal · Payment";
const DRAWER = [820, 0, 620, 388] as const;
const HOOKS = [820, 200, 620, 388] as const;
const LOWER = [820, 250, 620, 388] as const;
export const screens: ScreenStep[] = [
  {
    cue: 31,
    src: SHOT("delivered"),
    title: TITLE,
    region: [...DRAWER],
    beats: [
      { cue: 32, region: [...HOOKS], focus: [[836, 392, 200, 34]] },
      { cue: 33, region: [...HOOKS], focus: [[845, 448, 175, 28], [1328, 448, 78, 28]] },
      { cue: 34, region: [...HOOKS], focus: [[1328, 448, 78, 28], [845, 469, 175, 24]] },
    ],
  },
  {
    cue: 36,
    src: SHOT("retrying"),
    title: TITLE,
    region: [...LOWER],
    focus: [[1333, 448, 74, 28], [845, 486, 200, 40]],
    beats: [
      { cue: 37, region: [...LOWER], focus: [[1200, 561, 207, 30]] },
      { cue: 38, region: [...LOWER], focus: [[1290, 440, 125, 95]] },
    ],
  },
  {
    cue: 40,
    src: SHOT("undelivered"),
    title: TITLE,
    region: [...HOOKS],
    focus: [[1311, 448, 95, 28]],
    beats: [
      { cue: 41, region: [...HOOKS], focus: [[844, 509, 572, 28]] },
      { cue: 42, region: [...HOOKS], focus: [[1326, 475, 75, 38]] },
    ],
  },
  { cue: 43, src: SHOT("queued"), title: TITLE, region: [820, 400, 620, 480], focus: [[995, 838, 420, 44]] },
  { cue: 44, src: SHOT("delivered"), title: TITLE, region: [...HOOKS], focus: [[1328, 448, 78, 28]] },
  { cue: 45, src: SHOT("link"), title: TITLE, region: [...HOOKS], beats: [{ cue: 46, region: [...HOOKS], focus: [[832, 434, 596, 52]] }] },
];
