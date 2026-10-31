import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 25: a hotel key card. The page for one buyer only (0–1), the link and its fingerprint (3–4),
// the page, the card frame and the token (5–8), one lock (9), the close (10).
const LINK = { merchant: [0, 1], m6Link: [1.5, 1], buyer: [3, 1] } as const;
const LINK_EDGES = [{ from: "merchant", to: "m6Link" }, { from: "m6Link", to: "buyer" }] as const;
const PAGE = { buyer: [0, 1], m6Page: [1.5, 1], m6Zone: [3, 1], m6Frame: [1.5, 2.1] } as const;
const PAGE_EDGES = [{ from: "buyer", to: "m6Page" }, { from: "m6Page", to: "m6Zone", label: "session" }, { from: "m6Zone", to: "m6Frame" }] as const;
const ZONE_WALL = { label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" } as const;

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 0,
    layout: { buyer: [0, 1], m6Page: [3, 1], attacker: [1.5, 2.1] },
    edges: [{ from: "buyer", to: "m6Page" }],
    packets: [{ from: "buyer", to: "m6Page", label: "open" }, { from: "attacker", to: "m6Page", label: "?", delay: 45, stopAt: 0.6 }],
  },
  {
    cue: 1,
    layout: { buyer: [0, 1], m6HotelKey: [1.5, 1], m6Room: [3, 1] },
    edges: [{ from: "buyer", to: "m6HotelKey" }, { from: "m6HotelKey", to: "m6Room" }],
    packets: [{ from: "m6HotelKey", to: "m6Room", label: "open", delay: 30 }],
    badges: { m6HotelKey: "one guest" },
  },
  { cue: 3, layout: LINK, edges: [...LINK_EDGES], accent: ["m6Link"], packets: [{ from: "merchant", to: "m6Link", label: "one-time key" }, { from: "m6Link", to: "buyer", label: "link", delay: 45 }] },
  {
    cue: 4,
    layout: { ...LINK, m6Ecom: [0, 2.1], m6Fingerprint: [1.5, 2.1] },
    edges: [...LINK_EDGES, { from: "m6Ecom", to: "m6Fingerprint", label: "keeps" }],
    accent: ["m6Fingerprint"],
    badges: { m6Link: "expires" },
  },
  { cue: 5, layout: { buyer: [0, 1], m6Page: [1.5, 1] }, edges: [{ from: "buyer", to: "m6Page" }], accent: ["m6Page"], badges: { m6Page: "website · amount · cards" } },
  {
    cue: 6,
    layout: PAGE,
    edges: [...PAGE_EDGES],
    frames: [ZONE_WALL],
    packets: [{ from: "m6Page", to: "m6Zone", label: "open session" }, { from: "m6Zone", to: "m6Frame", label: "card frame", delay: 55 }],
    accent: ["m6Frame"],
  },
  {
    cue: 7,
    layout: { ...PAGE, attacker: [0, 2.1] },
    edges: [...PAGE_EDGES],
    frames: [ZONE_WALL],
    packets: [{ from: "m6Frame", to: "m6Page", label: "token" }, { from: "attacker", to: "m6Page", label: "message", delay: 50, stopAt: 0.7 }],
    badges: { m6Page: "frame only" },
  },
  {
    cue: 8,
    layout: { m6Page: [0, 1], m6Ecom: [1.5, 1], m6Zone: [3, 1] },
    edges: [{ from: "m6Page", to: "m6Ecom" }, { from: "m6Ecom", to: "m6Zone" }],
    frames: [ZONE_WALL],
    packets: [{ from: "m6Page", to: "m6Ecom", label: "token" }, { from: "m6Ecom", to: "m6Zone", label: "charge", delay: 70 }],
    badges: { m6Ecom: "this payment's card?" },
  },
  {
    cue: 9,
    layout: { buyer: [0, 1], m6Lock: [1.5, 1], m6Ecom: [3, 1] },
    edges: [{ from: "buyer", to: "m6Lock" }, { from: "m6Lock", to: "m6Ecom" }],
    packets: [
      { from: "buyer", to: "m6Lock", label: "click", delay: 10 },
      { from: "buyer", to: "m6Lock", label: "click", delay: 24 },
      { from: "m6Lock", to: "m6Ecom", label: "one", delay: 65 },
    ],
    accent: ["m6Lock"],
  },
];

export const map: BuildMapStep[] = [
  { cue: 2, part: 6, current: ["buyer", "payment"], units: { ecom: "payment page" } },
  { cue: 10, part: 6, current: ["payment", "procport", "card"], units: { ecom: "charge next" } },
];
