import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 28b: a registered letter. What the shop and the bank need (4–9), the registered letter (10–14),
// the webhook, its id, time and signature (15–21), the address guard (22–27), success, retries, order, undelivered (28–33),
// the merchant portal's webhooks (34–48), what it protects (49–53), the close (54–56).
const POST = { m6Ecom: [0, 1], m6Hook: [1.5, 1], merchant: [3, 1] } as const;
const POST_EDGES = [{ from: "m6Ecom", to: "m6Hook" }, { from: "m6Hook", to: "merchant" }] as const;
const LETTER = { m6Registered: [0, 1], m6Street: [3, 1] } as const;
const LETTER_EDGES = [{ from: "m6Registered", to: "m6Street" }] as const;
const GUARD = { m6Ecom: [0, 1], m6Hook: [1.5, 1], merchant: [3, 0.2], m6Inside: [3, 1.8] } as const;
const GUARD_EDGES = [{ from: "m6Ecom", to: "m6Hook" }, { from: "m6Hook", to: "merchant" }, { from: "m6Hook", to: "m6Inside", broken: true }] as const;
const post = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: POST, edges: [...POST_EDGES], ...rest });
const letter = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: LETTER, edges: [...LETTER_EDGES], ...rest });
const guard = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: GUARD, edges: [...GUARD_EDGES], ...rest });
const tries = (stop = 0.85) => [10, 45, 110].map((delay) => ({ from: "m6Hook" as const, to: "merchant" as const, label: "try", delay, duration: 25, stopAt: stop }));

export const diagram: DiagramStep<BuildId>[] = [
  post(4, { packets: [{ from: "m6Hook", to: "merchant", label: "paid" }], badges: { merchant: "before shipping" } }),
  post(5, { danger: ["merchant"], badges: { merchant: "down an hour" } }),
  { ...post(6, { packets: [{ from: "attacker", to: "merchant", label: "paid", delay: 10 }], danger: ["attacker"] }), layout: { ...POST, attacker: [3, 2.1] } },
  { ...post(7, { packets: [{ from: "attacker", to: "merchant", label: "paid", delay: 10 }], danger: ["attacker"], badges: { attacker: "anyone" } }), layout: { ...POST, attacker: [3, 2.1] } },
  { cue: 8, layout: { m6Ecom: [0, 1], m6Inside: [3, 1] }, edges: [{ from: "m6Ecom", to: "m6Inside" }] },
  {
    cue: 9,
    layout: { attacker: [0, 0.2], m6Ecom: [0, 1.8], m6Inside: [3, 1.8] },
    edges: [{ from: "attacker", to: "m6Ecom", label: "set address" }, { from: "m6Ecom", to: "m6Inside" }],
    packets: [{ from: "m6Ecom", to: "m6Inside", label: "call", delay: 40 }],
    danger: ["attacker", "m6Inside"],
  },
  letter(10, { accent: ["m6Registered"] }),
  letter(11, { badges: { m6Registered: "sealed: who sent it" } }),
  letter(12, { packets: [{ from: "m6Registered", to: "m6Street", label: "deliver" }], badges: { m6Street: "real address" } }),
  letter(13, { packets: [10, 60].map((delay) => ({ from: "m6Registered" as const, to: "m6Street" as const, label: "again", delay, stopAt: 0.85 })), badges: { m6Street: "nobody home" } }),
  letter(14, { badges: { m6Registered: "returned" } }),
  post(15, { accent: ["m6Hook"] }),
  { cue: 16, layout: { m6Outbox: [0, 1], m6Ecom: [1.5, 1], m6Hook: [3, 1] }, edges: [{ from: "m6Outbox", to: "m6Ecom" }, { from: "m6Ecom", to: "m6Hook" }], packets: [{ from: "m6Outbox", to: "m6Ecom", label: "news" }, { from: "m6Ecom", to: "m6Hook", label: "event", delay: 50 }] },
  post(17, { badges: { m6Hook: "set per website" } }),
  post(18, { packets: [{ from: "m6Hook", to: "merchant", label: "id · time · signature" }] }),
  post(19, { badges: { m6Ecom: "same signing key" } }),
  post(20, { badges: { m6Hook: "open standard" } }),
  post(21, { packets: [{ from: "m6Hook", to: "merchant", label: "event" }], badges: { merchant: "seal · age · id" } }),
  guard(22, { badges: { m6Ecom: "check first" } }),
  guard(23, { badges: { m6Hook: "secure address" } }),
  guard(24, { danger: ["m6Inside"], badges: { m6Hook: "public only" } }),
  guard(25, { packets: [{ from: "m6Hook", to: "merchant", label: "connect" }], badges: { m6Hook: "checked again" } }),
  guard(26, { packets: [{ from: "m6Hook", to: "m6Inside", label: "redirect", stopAt: 0.5 }], badges: { m6Hook: "no redirects" } }),
  guard(27, { danger: ["m6Inside"], crossed: ["m6Inside"], badges: { m6Ecom: "request forgery stopped" } }),
  post(28, { packets: [{ from: "m6Hook", to: "merchant", label: "event" }, { from: "merchant", to: "m6Hook", label: "success", delay: 50 }] }),
  post(29, { packets: tries(), badges: { m6Hook: "longer each time" } }),
  post(30, {
    packets: [
      { from: "m6Hook", to: "merchant", label: "paid", delay: 10, stopAt: 0.85 },
      { from: "m6Ecom", to: "m6Hook", label: "refunded", delay: 20 },
    ],
    badges: { m6Hook: "later waits" },
  }),
  post(31, { danger: ["merchant"], badges: { m6Hook: "undelivered" } }),
  post(32, { packets: [{ from: "merchant", to: "m6Ecom", label: "send again" }] }),
  { cue: 33, layout: { m6Bill: [0, 1], m6Hook: [3, 1] }, edges: [{ from: "m6Bill", to: "m6Hook" }], crossed: ["m6Hook"], badges: { m6Bill: "no server behind it" } },
  { cue: 34, layout: { merchant: [1.5, 1] }, accent: ["merchant"] },
  { cue: 39, layout: POST, edges: [...POST_EDGES], danger: ["merchant"], packets: tries(), badges: { merchant: "offline" } },
  { cue: 49, layout: POST, edges: [...POST_EDGES] },
  { ...post(50, { packets: [{ from: "attacker", to: "merchant", label: "paid", stopAt: 0.8 }], danger: ["attacker"], badges: { merchant: "seal checked" } }), layout: { ...POST, attacker: [3, 2.1] } },
  post(51, { packets: tries(1), badges: { merchant: "back: all events" } }),
  post(52, { packets: [{ from: "m6Hook", to: "merchant", label: "paid" }, { from: "m6Hook", to: "merchant", label: "refunded", delay: 45 }] }),
  guard(53, { danger: ["m6Inside"], crossed: ["m6Inside"], badges: { m6Inside: "protected" } }),
  letter(54, {}),
  letter(55, { packets: [10, 50, 90].map((delay) => ({ from: "m6Registered" as const, to: "m6Street" as const, label: "try", delay, duration: 25 })), badges: { m6Street: "arrives" } }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["kafka", "payment", "merchant"], units: { ecom: "webhooks" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 5, current: ["payment", "kafka"] },
  { cue: 2, part: 5, current: ["merchant"] },
  { cue: 3, part: 5, current: ["kafka", "merchant"] },
  { cue: 56, part: 5, current: ["merchant", "payment", "frame"], units: { ecom: "payment links next" } },
];

const SHOT = (name: string) => `screens/c-28b-webhooks/${name}.png`;
const TITLE = "Merchant portal · Payment";
const DRAWER = [820, 0, 620, 388] as const;
const HOOKS = [820, 200, 620, 388] as const;
const LOWER = [820, 250, 620, 388] as const;
export const screens: ScreenStep[] = [
  {
    cue: 35,
    src: SHOT("delivered"),
    title: TITLE,
    region: [...DRAWER],
    beats: [
      { cue: 36, region: [...HOOKS], focus: [[836, 392, 200, 34]] },
      { cue: 37, region: [...HOOKS], focus: [[845, 448, 175, 28], [1328, 448, 78, 28]] },
      { cue: 38, region: [...HOOKS], focus: [[1328, 448, 78, 28], [845, 469, 175, 24]] },
    ],
  },
  {
    cue: 40,
    src: SHOT("retrying"),
    title: TITLE,
    region: [...LOWER],
    focus: [[1333, 448, 74, 28], [845, 486, 200, 40]],
    beats: [
      { cue: 41, region: [...LOWER], focus: [[1200, 561, 207, 30]] },
      { cue: 42, region: [...LOWER], focus: [[1290, 440, 125, 95]] },
    ],
  },
  {
    cue: 43,
    src: SHOT("undelivered"),
    title: TITLE,
    region: [...HOOKS],
    focus: [[1311, 448, 95, 28]],
    beats: [
      { cue: 44, region: [...HOOKS], focus: [[844, 509, 572, 28]] },
      { cue: 45, region: [...HOOKS], focus: [[1326, 475, 75, 38]] },
    ],
  },
  { cue: 46, src: SHOT("queued"), title: TITLE, region: [820, 400, 620, 480], focus: [[995, 838, 420, 44]] },
  { cue: 47, src: SHOT("delivered"), title: TITLE, region: [...HOOKS], focus: [[1328, 448, 78, 28]] },
  { cue: 48, src: SHOT("link"), title: TITLE, region: [...HOOKS], focus: [[832, 434, 596, 52]] },
];
