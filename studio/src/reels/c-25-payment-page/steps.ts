import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 25: tulips ordered at a bus stop. The link, not the card (0–3), the bridge (4–5), what the page must do (6–11),
// the link and its fingerprint (12–16), the page, the frame, the token, the lock (17–30), the buyer's side on the real page (31–43),
// what it protects (44–48), the advice (49–51), next (52).
const LINK = { merchant: [0, 1], m6Link: [1.5, 1], buyer: [3, 1] } as const;
const LINK_EDGES = [{ from: "merchant", to: "m6Link" }, { from: "m6Link", to: "buyer" }] as const;
const PRINT = { ...LINK, m6Ecom: [0, 2.1], m6Fingerprint: [1.5, 2.1] } as const;
const PRINT_EDGES = [...LINK_EDGES, { from: "m6Ecom", to: "m6Fingerprint", label: "keeps" }] as const;
const PAGE = { buyer: [0, 1], m6Page: [1.5, 1], m6Zone: [3, 1], m6Frame: [1.5, 2.1] } as const;
const PAGE_EDGES = [{ from: "buyer", to: "m6Page" }, { from: "m6Page", to: "m6Zone", label: "session" }, { from: "m6Zone", to: "m6Frame" }] as const;
const ZONE_WALL = { label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" } as const;
const CHECK = { m6Page: [0, 1], m6Ecom: [1.5, 1], m6Zone: [3, 1] } as const;
const CHECK_EDGES = [{ from: "m6Page", to: "m6Ecom" }, { from: "m6Ecom", to: "m6Zone" }] as const;
const LOCK = { buyer: [0, 1], m6Lock: [1.5, 1], m6Ecom: [3, 1] } as const;
const LOCK_EDGES = [{ from: "buyer", to: "m6Lock" }, { from: "m6Lock", to: "m6Ecom" }] as const;
const page = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: PAGE, edges: [...PAGE_EDGES], frames: [ZONE_WALL], ...rest });
const lock = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: LOCK, edges: [...LOCK_EDGES], ...rest });

export const diagram: DiagramStep<BuildId>[] = [
  // Sunday morning at a bus stop: the shop sends the buyer to a link.
  { cue: 0, layout: { buyer: [0, 1], shop: [3, 1] }, edges: [{ from: "buyer", to: "shop" }], badges: { shop: "Sun 9:15" } },
  { cue: 1, layout: { buyer: [0, 1], shop: [3, 1] }, edges: [{ from: "buyer", to: "shop" }], packets: [{ from: "buyer", to: "shop", label: "tulips · pay" }], badges: { buyer: "bus stop" } },
  { cue: 2, layout: { buyer: [0, 1], shop: [3, 1] }, edges: [{ from: "buyer", to: "shop" }], badges: { shop: "no card here" } },
  {
    cue: 3,
    layout: { shop: [0, 1], m6Link: [1.5, 1], buyer: [3, 1] },
    edges: [{ from: "shop", to: "m6Link" }, { from: "m6Link", to: "buyer" }],
    packets: [{ from: "m6Link", to: "buyer", label: "link" }],
    accent: ["m6Link"],
  },
  // What the page must do.
  { cue: 6, layout: { buyer: [0, 1], shop: [3, 1] }, edges: [{ from: "buyer", to: "shop" }], packets: [{ from: "buyer", to: "shop", label: "card", stopAt: 0.6 }], crossed: ["shop"] },
  {
    cue: 7,
    layout: { buyer: [0, 1], m6Page: [3, 1], attacker: [1.5, 2.1] },
    edges: [{ from: "buyer", to: "m6Page" }],
    packets: [{ from: "attacker", to: "m6Page", label: "…/1043?", stopAt: 0.6 }],
    danger: ["attacker"],
  },
  { cue: 8, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }], packets: [{ from: "buyer", to: "m6Page", label: "link" }], badges: { buyer: "only this person" } },
  { cue: 9, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }], badges: { m6Page: "for a while" } },
  { cue: 10, layout: { buyer: [0, 1], m6Page: [3, 1] }, edges: [{ from: "buyer", to: "m6Page" }], badges: { m6Page: "exactly what" } },
  {
    cue: 11,
    layout: { buyer: [0, 1], m6Page: [3, 1] },
    edges: [{ from: "buyer", to: "m6Page" }],
    packets: [{ from: "buyer", to: "m6Page", label: "confirm", delay: 10 }, { from: "buyer", to: "m6Page", label: "confirm", delay: 24 }],
    badges: { buyer: "cold fingers", m6Page: "survives it" },
  },
  // The link, its token and its fingerprint.
  { cue: 12, layout: LINK, edges: [...LINK_EDGES], packets: [{ from: "merchant", to: "m6Link", label: "create → link" }], accent: ["m6Link"] },
  { cue: 13, layout: LINK, edges: [...LINK_EDGES], badges: { m6Link: "long · random · one-time" } },
  { cue: 14, layout: PRINT, edges: [...PRINT_EDGES], crossed: ["m6Fingerprint"], badges: { m6Ecom: "no token" } },
  { cue: 15, layout: PRINT, edges: [...PRINT_EDGES], accent: ["m6Fingerprint"], badges: { m6Fingerprint: "can't rebuild it" } },
  { cue: 16, layout: PRINT, edges: [...PRINT_EDGES], badges: { m6Link: "expires" } },
  // The page, the frame, the token, the lock.
  { cue: 17, layout: { buyer: [0, 1], m6Page: [1.5, 1] }, edges: [{ from: "buyer", to: "m6Page" }], packets: [{ from: "buyer", to: "m6Page", label: "tap" }], accent: ["m6Page"] },
  { cue: 18, layout: { buyer: [0, 1], m6Page: [1.5, 1] }, edges: [{ from: "buyer", to: "m6Page" }], badges: { m6Page: "website · order · amount" } },
  {
    cue: 19,
    layout: { m6Page: [0, 1], m6Terminal: [2, 1] },
    edges: [{ from: "m6Terminal", to: "m6Page", label: "cards" }],
    badges: { m6Terminal: "live" },
  },
  page(20, { packets: [{ from: "m6Page", to: "m6Zone", label: "open session" }, { from: "m6Zone", to: "m6Frame", label: "frame", delay: 55 }], accent: ["m6Frame"] }),
  page(21, { packets: [{ from: "buyer", to: "m6Frame", label: "card number" }], badges: { m6Frame: "only here" } }),
  page(22, { badges: { m6Zone: "a few sessions" } }),
  page(23, { danger: ["m6Page"], badges: { m6Page: "fails · no money" } }),
  page(24, { packets: [{ from: "m6Frame", to: "m6Page", label: "message" }] }),
  { ...page(25, { packets: [{ from: "m6Frame", to: "m6Page", label: "token" }, { from: "attacker", to: "m6Page", label: "message", delay: 50, stopAt: 0.7 }] }), layout: { ...PAGE, attacker: [0, 2.1] } },
  page(26, { packets: [{ from: "m6Frame", to: "m6Page", label: "card number", stopAt: 0.6 }], badges: { m6Page: "never" } }),
  { cue: 27, layout: CHECK, edges: [...CHECK_EDGES], frames: [ZONE_WALL], packets: [{ from: "m6Page", to: "m6Ecom", label: "token" }] },
  { cue: 28, layout: CHECK, edges: [...CHECK_EDGES], frames: [ZONE_WALL], packets: [{ from: "m6Ecom", to: "m6Zone", label: "this payment's?" }] },
  { cue: 29, layout: CHECK, edges: [...CHECK_EDGES], frames: [ZONE_WALL], packets: [{ from: "m6Zone", to: "m6Ecom", label: "yes" }], badges: { m6Ecom: "charge begins" } },
  lock(30, {
    packets: [
      { from: "buyer", to: "m6Lock", label: "step", delay: 10 },
      { from: "buyer", to: "m6Lock", label: "step", delay: 24 },
      { from: "m6Lock", to: "m6Ecom", label: "one", delay: 65 },
    ],
    accent: ["m6Lock"],
  }),
  // Every rule closes a door.
  { cue: 44, layout: { attacker: [0, 1], m6Page: [3, 1] }, edges: [{ from: "attacker", to: "m6Page" }], danger: ["attacker"], badges: { m6Page: "doors closed" } },
  {
    cue: 45,
    layout: { attacker: [0, 1], m6Page: [3, 1] },
    edges: [{ from: "attacker", to: "m6Page" }],
    packets: [10, 30, 50].map((delay, i) => ({ from: "attacker" as const, to: "m6Page" as const, label: `…/${1041 + i}`, delay, duration: 22, stopAt: 0.6 })),
    danger: ["attacker"],
    badges: { m6Page: "no token, no page" },
  },
  { cue: 46, layout: PRINT, edges: [...PRINT_EDGES], accent: ["m6Fingerprint"], badges: { m6Fingerprint: "no live links" } },
  page(47, { accent: ["m6Frame"], badges: { m6Frame: "card stays here" } }),
  lock(48, {
    packets: [
      { from: "buyer", to: "m6Lock", label: "click", delay: 10 },
      { from: "buyer", to: "m6Lock", label: "click", delay: 22 },
      { from: "m6Lock", to: "m6Ecom", label: "one charge", delay: 65 },
    ],
  }),
  // The advice: no address you can count up.
  { cue: 49, layout: { m6Link: [1.5, 1] }, accent: ["m6Link"], badges: { m6Link: "the address" } },
  {
    cue: 50,
    layout: { attacker: [0, 1], m6Page: [3, 1] },
    edges: [{ from: "attacker", to: "m6Page" }],
    packets: [10, 30, 50].map((delay, i) => ({ from: "attacker" as const, to: "m6Page" as const, label: `…/${1041 + i}`, delay, duration: 22 })),
    danger: ["m6Page"],
    badges: { m6Page: "anyone can open" },
  },
  {
    cue: 51,
    layout: { buyer: [0, 1], m6Page: [1.5, 1], shop: [3, 1] },
    edges: [{ from: "buyer", to: "m6Page" }],
    accent: ["m6Page"],
    badges: { buyer: "sees what's paid", shop: "never a card" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["merchant", "buyer", "payment", "frame", "card"], units: { ecom: "payment page" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 4, part: 5, current: ["merchant", "payment", "frame"] },
  { cue: 5, part: 5, current: ["buyer", "payment", "frame"] },
  { cue: 52, part: 5, current: ["payment", "procport", "card"], units: { ecom: "the charge next" } },
];

const SHOT = (name: string) => `screens/c-25-payment-page/${name}.png`;
const TITLE = "Payment page";
const TOP = [400, 20, 640, 400] as const;
const LOW = [400, 330, 640, 400] as const;
const DONE = [330, 40, 780, 487] as const;
export const screens: ScreenStep[] = [
  {
    cue: 31,
    src: SHOT("open"),
    title: TITLE,
    region: [...TOP],
    beats: [
      { cue: 32, region: [...TOP], focus: [[528, 43, 218, 20]] },
      { cue: 33, region: [...TOP], focus: [[539, 110, 362, 130], [545, 288, 110, 28]] },
      { cue: 34, region: [...LOW], focus: [[539, 334, 362, 334], [535, 680, 171, 25]] },
    ],
  },
  // The code step: "Confirm" is what the buyer double-clicks.
  { cue: 35, src: SHOT("code"), title: TITLE, region: [400, 250, 640, 400], focus: [[555, 424, 330, 42]] },
  { cue: 37, src: SHOT("busy"), title: TITLE, region: [400, 400, 640, 400], focus: [[556, 701, 328, 43]] },
  { cue: 39, src: SHOT("ended"), title: TITLE, region: [400, 180, 640, 400], beats: [{ cue: 40, region: [400, 180, 640, 400], focus: [[556, 345, 328, 43]] }] },
  { cue: 41, src: SHOT("closed"), title: TITLE, region: [...DONE], focus: [[480, 395, 480, 95]] },
  { cue: 42, src: SHOT("expired"), title: TITLE, region: [...DONE], focus: [[480, 175, 480, 100]] },
  { cue: 43, src: SHOT("paid"), title: TITLE, region: [330, 110, 780, 487], focus: [[800, 513, 107, 29]] },
];
