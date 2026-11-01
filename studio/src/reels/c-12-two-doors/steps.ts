import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 12: a counter and a mail slot. Dilnoza asks for one more door (0–2), the bridge (3–4), two kinds of visitor (5–7),
// one big entrance (8–10), two narrow doors (11), the payers' door (12–18), the callers' door (19–28), what each visitor meets (29–44),
// every convenient door (45–49), Dilnoza's answers (50), next (51).
const VISITORS = { buyer: [0, 0.2], m2Ecom: [0, 1.8], card: [3, 1] } as const;
const ROOM = { label: "Locked room", from: [3, 1], to: [3, 1], tone: "wall" } as const;
const V: Beat = { layout: VISITORS, frames: [ROOM] };
const BIG: Beat = {
  layout: { ...VISITORS, m2BigDoor: [1.6, 1] },
  edges: [{ from: "buyer", to: "m2BigDoor" }, { from: "m2Ecom", to: "m2BigDoor" }, { from: "m2BigDoor", to: "card" }],
  frames: [ROOM],
};
const DOORS = { buyer: [0, 0.2], m2Ecom: [0, 1.8], ingress: [1.6, 0.2], partnerdoor: [1.6, 1.8], card: [3, 1] } as const;
const WALL = { label: "Locked room", from: [1.6, 0.2], to: [3, 1.8], tone: "wall" } as const;
const D: Beat = {
  layout: DOORS,
  edges: [{ from: "buyer", to: "ingress" }, { from: "m2Ecom", to: "partnerdoor" }, { from: "ingress", to: "card" }, { from: "partnerdoor", to: "card" }],
  frames: [WALL],
};
const ODD = { ...DOORS, attacker: [0, 1] } as const;
const SLOT = { m2Ecom: [0, 1], partnerdoor: [1.5, 1], card: [3, 0.2], m2AdapterA: [3, 1], cardsKeycloak: [3, 1.8] } as const;
const SL: Beat = {
  layout: SLOT,
  edges: [{ from: "m2Ecom", to: "partnerdoor" }, { from: "partnerdoor", to: "card" }, { from: "partnerdoor", to: "m2AdapterA" }, { from: "partnerdoor", to: "cardsKeycloak" }],
};
const UNLISTED: Beat = {
  layout: { m2Unlisted: [0, 1], partnerdoor: [1.5, 1], card: [3, 1] },
  edges: [{ from: "m2Unlisted", to: "partnerdoor", broken: true }, { from: "partnerdoor", to: "card" }],
};
const WATCH: Beat = { layout: { card: [0, 1], cardsObserve: [1.5, 1], m2Team: [3, 1] }, edges: [{ from: "card", to: "cardsObserve" }, { from: "cardsObserve", to: "m2Team" }] };
const ASK = { bankStaff: [0.4, 1], card: [2.6, 1] } as const;
const ASK_ROOM = { ...ROOM, from: [2.6, 1], to: [2.6, 1] } as const;
const BANK: Beat = { layout: { buyer: [0, 0.2], m2Ecom: [0, 1.8], m2BankCounter: [2.4, 0.2], m2MailSlot: [2.4, 1.8] }, edges: [{ from: "buyer", to: "m2BankCounter" }, { from: "m2Ecom", to: "m2MailSlot" }] };

export const diagram: DiagramStep<BuildId>[] = [
  // Dilnoza asks for one more door.
  { cue: 0, layout: ASK, frames: [ASK_ROOM], badges: { bankStaff: "Dilnoza" } },
  { cue: 1, layout: ASK, edges: [{ from: "bankStaff", to: "card", label: "one more door?" }], frames: [ASK_ROOM], packets: [{ from: "bankStaff", to: "card", label: "admin page" }] },
  { cue: 2, layout: ASK, edges: [{ from: "bankStaff", to: "card", broken: true }], frames: [ASK_ROOM], badges: { card: "Timur: no" } },
  // Two kinds of visitor.
  { cue: 5, ...V, accent: ["buyer", "m2Ecom"] },
  { cue: 6, ...V, packets: [{ from: "buyer", to: "card", label: "type a card" }], badges: { buyer: "from the internet" } },
  { cue: 7, ...V, packets: [{ from: "m2Ecom", to: "card", label: "charge" }], badges: { m2Ecom: "own servers" } },
  // One big entrance.
  { cue: 8, ...BIG },
  { cue: 9, ...BIG, packets: [{ from: "buyer", to: "m2BigDoor", label: "opened" }, { from: "m2Ecom", to: "m2BigDoor", label: "opened", delay: 30 }], badges: { m2BigDoor: "clear text" } },
  { cue: 10, ...BIG, danger: ["m2BigDoor"], badges: { m2BigDoor: "most valuable box" } },
  // Two narrow doors: a counter and a mail slot.
  { cue: 11, ...BANK },
  // The payers' door: the counter.
  { cue: 13, ...D, packets: [{ from: "buyer", to: "ingress", label: "encrypted" }] },
  { cue: 14, ...D, badges: { ingress: "trusted certificate" } },
  {
    cue: 15,
    ...D,
    packets: [
      { from: "ingress", to: "card", label: "show frame" },
      { from: "ingress", to: "card", label: "send card", delay: 35 },
      { from: "ingress", to: "card", label: "send code", delay: 70 },
    ],
  },
  { cue: 16, ...D, layout: ODD, packets: [{ from: "attacker", to: "ingress", label: "anything else", stopAt: 0.85 }], badges: { ingress: "not found" } },
  {
    cue: 17,
    ...D,
    packets: [0, 20, 40].map((delay, i) => ({ from: "buyer" as const, to: "ingress" as const, label: "card", delay, stopAt: i === 2 ? 0.85 : undefined })),
    badges: { ingress: "the bank's rate" },
  },
  { cue: 18, ...D, packets: [{ from: "buyer", to: "ingress", label: "load page" }, { from: "buyer", to: "ingress", label: "load page", delay: 25 }], badges: { ingress: "never limited" } },
  // The callers' door: the mail slot.
  { cue: 20, ...SL, packets: [{ from: "m2Ecom", to: "partnerdoor", label: "sealed" }] },
  { cue: 21, ...SL, packets: [{ from: "m2Ecom", to: "partnerdoor", label: "sealed · card vault" }], badges: { m2Ecom: "a name outside" } },
  { cue: 22, ...SL, badges: { partnerdoor: "reads the name" } },
  { cue: 23, ...SL, packets: [{ from: "partnerdoor", to: "card", label: "still sealed" }], badges: { partnerdoor: "never opens it" } },
  { cue: 24, ...SL, badges: { partnerdoor: "pass-through" } },
  { cue: 25, ...SL, accent: ["card", "m2AdapterA", "cardsKeycloak"], badges: { partnerdoor: "a few names" } },
  { cue: 26, ...UNLISTED, packets: [{ from: "m2Unlisted", to: "partnerdoor", label: "other name", stopAt: 0.85 }], badges: { partnerdoor: "refused" } },
  { cue: 27, ...SL, packets: [{ from: "partnerdoor", to: "card", label: "certificate · token" }], badges: { card: "checks the caller" } },
  { cue: 28, ...SL, badges: { partnerdoor: "no key needed" } },
  // What each visitor meets.
  { cue: 29, ...D, accent: ["buyer", "m2Ecom"] },
  {
    cue: 31,
    layout: { buyer: [0.4, 1], ingress: [2.6, 1] },
    edges: [{ from: "buyer", to: "ingress", label: "encrypted" }],
    badges: { buyer: "padlock", ingress: "trusted certificate" },
  },
  {
    cue: 33,
    layout: { bankStaff: [0.4, 1], ingress: [2.6, 1] },
    edges: [{ from: "bankStaff", to: "ingress" }],
    packets: [{ from: "bankStaff", to: "ingress", label: "/admin" }],
    badges: { bankStaff: "Dilnoza's idea" },
  },
  { cue: 34, layout: { bankStaff: [0.4, 1], ingress: [2.6, 1] }, edges: [{ from: "bankStaff", to: "ingress" }], packets: [{ from: "ingress", to: "bankStaff", label: "not found" }] },
  { cue: 35, layout: { bankStaff: [0.4, 1], ingress: [2.6, 1] }, edges: [{ from: "bankStaff", to: "ingress" }], badges: { ingress: "names nothing" } },
  // The callers' side.
  { cue: 40, ...UNLISTED, packets: [{ from: "m2Unlisted", to: "partnerdoor", label: "knock", stopAt: 0.85 }] },
  { cue: 41, ...UNLISTED, badges: { partnerdoor: "closes" } },
  { cue: 42, ...UNLISTED, badges: { card: "never reached" } },
  {
    cue: 43,
    layout: { m2Ecom: [0, 1], partnerdoor: [1.5, 1], card: [3, 1] },
    edges: [{ from: "m2Ecom", to: "partnerdoor" }, { from: "partnerdoor", to: "card", broken: true }],
    packets: [{ from: "m2Ecom", to: "partnerdoor", label: "listed name" }],
    badges: { card: "bad certificate: no" },
  },
  // Monitoring.
  { cue: 44, ...WATCH, packets: [{ from: "cardsObserve", to: "m2Team", label: "alert" }], badges: { card: "stops answering" } },
  // Every convenient door becomes the attacker's door.
  { cue: 45, ...BIG, danger: ["m2BigDoor"], badges: { m2BigDoor: "the attacker's door" } },
  { cue: 46, ...D, badges: { ingress: "frame traffic only" } },
  { cue: 47, ...D, badges: { partnerdoor: "nothing readable" } },
  {
    cue: 48,
    layout: { ingress: [0, 0.2], partnerdoor: [0, 1.8], m2Db: [2, 0], m2ZoneVault: [2, 1], m2UsageLog: [2, 2] },
    frames: [{ label: "No door at all", from: [2, 0], to: [2, 2], tone: "wall" }],
  },
  { cue: 49, layout: { m2Firewall: [0.4, 1], ingress: [2.6, 0.2], partnerdoor: [2.6, 1.8] }, edges: [{ from: "m2Firewall", to: "ingress" }, { from: "m2Firewall", to: "partnerdoor" }], badges: { m2Firewall: "two openings" } },
  // Dilnoza gets her answers outside the card zone.
  { cue: 50, layout: ASK, frames: [ASK_ROOM], accent: ["bankStaff"], badges: { bankStaff: "admin portal" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 3, part: 3, current: ["frame", "card", "payment"] },
  { cue: 4, part: 3, current: ["frame", "card", "bin", "adapters", "cardsinfra"], units: { cards: "two doors" } },
  { cue: 12, part: 3, current: ["frame"], units: { cards: "payers' door" } },
  { cue: 19, part: 3, current: ["card", "adapters", "procport"], units: { cards: "callers' door" } },
  { cue: 51, part: 3, current: ["procport"], units: { cards: "certificate" } },
];

// The buyer at the payers' door: the frame, and its answer to sending too fast.
const FORM = [460, 268, 520, 360] as const;
export const screens: ScreenStep[] = [
  { cue: 30, src: "screens/c-12-two-doors/typed.png", title: "Payment page", region: [440, 20, 560, 350] },
  { cue: 32, src: "screens/c-12-two-doors/typed.png", title: "Payment page · card frame", region: [...FORM], focus: [[555, 375, 340, 40]] },
  {
    cue: 36,
    src: "screens/c-12-two-doors/too-fast.png",
    title: "Payment page · card frame",
    region: [...FORM],
    focus: [[555, 505, 340, 36]],
    beats: [
      { cue: 38, region: [...FORM], focus: [[555, 552, 340, 30]] },
      { cue: 39, region: [...FORM] },
    ],
  },
];
