import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 29: payment links. One shop carries it: a regular customer asks Malika in a messenger, late on a Wednesday, to pay now.
// The order in a chat (0–3), the bridge from lessons 26 and 21 (4–5), what the link must be (6–14), making a link (15–17),
// an ordinary payment behind it (18–23), token, fingerprint, time, same page, expiry (24–29), almost nothing new (30–31),
// the merchant portal (32–46), the buyer's side and expiry (47–53), what it protects (54–57), next (57).
const CHAT = { buyer: [0, 1], m6Messenger: [1.5, 1], m6Seller: [3, 1] } as const;
const CHAT_EDGES = [{ from: "buyer", to: "m6Messenger" }, { from: "m6Messenger", to: "m6Seller" }] as const;
const SAFE = { m6Bill: [0, 1], m6Page: [3, 1] } as const;
const MAKE = { m6Portal: [0, 1], salespoint: [1.5, 0.2], m6Bill: [1.5, 1.8], buyer: [3, 1.8] } as const;
const MAKE_EDGES = [{ from: "m6Portal", to: "salespoint", label: "live" }, { from: "m6Portal", to: "m6Bill" }, { from: "m6Bill", to: "buyer" }] as const;
const BEHIND = { m6Bill: [0, 1], m6Payment: [1.5, 1], salespoint: [3, 1] } as const;
const BEHIND_EDGES = [{ from: "m6Bill", to: "m6Payment" }, { from: "m6Payment", to: "salespoint" }] as const;
const PRINT = { m6Bill: [0, 1], m6Ecom: [1.5, 2.1], m6Fingerprint: [3, 2.1], buyer: [3, 1] } as const;
const PRINT_EDGES = [{ from: "m6Bill", to: "buyer" }, { from: "m6Ecom", to: "m6Fingerprint", label: "keeps" }] as const;
const PAY = { buyer: [0, 1], m6Page: [1.5, 1], m6Frame: [3, 1] } as const;
const PAY_EDGES = [{ from: "buyer", to: "m6Page" }, { from: "m6Page", to: "m6Frame" }] as const;
const chat = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: CHAT, edges: [...CHAT_EDGES], ...rest });
const safe = (cue: number, badge: string): DiagramStep<BuildId> => ({ cue, layout: SAFE, edges: [{ from: "m6Bill", to: "m6Page" }], badges: { m6Bill: badge } });
const make = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: MAKE, edges: [...MAKE_EDGES], ...rest });
const behind = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: BEHIND, edges: [...BEHIND_EDGES], ...rest });
const print = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: PRINT, edges: [...PRINT_EDGES], ...rest });
const pay = (cue: number, rest: Partial<DiagramStep<BuildId>>): DiagramStep<BuildId> => ({ cue, layout: PAY, edges: [...PAY_EDGES], ...rest });

export const diagram: DiagramStep<BuildId>[] = [
  // Wednesday night: a regular asks in a messenger to pay now.
  chat(1, { accent: ["m6Messenger"], packets: [{ from: "buyer", to: "m6Seller", label: "pay now?" }], badges: { m6Messenger: "Wed 23:00", buyer: "birthday bouquet" } }),
  chat(2, { packets: [{ from: "buyer", to: "m6Seller", label: "how much?" }, { from: "m6Seller", to: "buyer", label: "180", delay: 50 }], badges: { m6Seller: "price agreed" } }),
  chat(3, { badges: { m6Seller: "no site · no developer" } }),
  // What the link must be.
  { cue: 6, layout: { m6Seller: [0, 1], m6Ecom: [3, 1] }, edges: [{ from: "m6Seller", to: "m6Ecom", broken: true }], badges: { m6Seller: "no server" } },
  chat(7, { packets: [{ from: "m6Seller", to: "buyer", label: "link" }], badges: { m6Seller: "easy" } }),
  safe(8, "still safe"),
  { ...safe(9, "the real bank page"), packets: [{ from: "m6Bill", to: "m6Page", label: "open" }] },
  { cue: 10, layout: { m6Bill: [0, 1], salespoint: [3, 1] }, edges: [{ from: "m6Bill", to: "salespoint" }], badges: { salespoint: "checked by the bank" } },
  safe(11, "for a while"),
  { cue: 12, layout: { m6Ecom: [0, 1], m6Fingerprint: [3, 1] }, edges: [{ from: "m6Ecom", to: "m6Fingerprint" }], badges: { m6Fingerprint: "secret unreadable" } },
  { cue: 14, layout: { m6Seller: [0, 1], m6Bill: [1.5, 1], buyer: [3, 1] }, edges: [{ from: "m6Seller", to: "m6Bill" }, { from: "m6Bill", to: "buyer" }], accent: ["m6Bill"] },
  // Making a link, and the ordinary payment behind it.
  make(15, { accent: ["m6Portal"], badges: { m6Portal: "admin or operator" } }),
  make(16, { packets: [{ from: "m6Portal", to: "salespoint", label: "pick" }] }),
  make(17, { badges: { m6Bill: "amount · what · how long" } }),
  behind(18, { accent: ["m6Payment"] }),
  { ...behind(18, { badges: { m6Payment: "no API client" } }), layout: { ...BEHIND, merchant: [0, 2.1] }, crossed: ["merchant"] },
  behind(20, { badges: { m6Payment: "no return address" } }),
  behind(21, { badges: { m6Payment: "the same" } }),
  behind(22, { badges: { salespoint: "limits apply" } }),
  behind(23, { badges: { salespoint: "fee applies" } }),
  // Token, fingerprint, time, the same page, expiry.
  print(24, { badges: { m6Bill: "one-time page token" } }),
  print(25, { accent: ["m6Fingerprint"] }),
  print(26, { badges: { m6Bill: "shown once" } }),
  print(27, { badges: { m6Bill: "up to the maximum" } }),
  pay(28, { packets: [{ from: "buyer", to: "m6Page", label: "pay" }, { from: "m6Page", to: "m6Frame", label: "card", delay: 45 }] }),
  { cue: 29, layout: { m6Bill: [1.5, 1] }, crossed: ["m6Bill"], badges: { m6Bill: "expired" } },
  // Almost nothing new.
  behind(30, { accent: ["m6Payment"], badges: { m6Payment: "almost nothing new" } }),
  { ...behind(30, { badges: { salespoint: "every old rule" } }), layout: { ...BEHIND, merchant: [0, 2.1] }, crossed: ["merchant"] },
  // Into the chat, and the buyer's side.
  chat(44, { packets: [{ from: "m6Seller", to: "buyer", label: "link" }] }),
  { cue: 47, layout: { m6Messenger: [0, 1], buyer: [3, 1] }, edges: [{ from: "m6Messenger", to: "buyer" }], accent: ["buyer"], packets: [{ from: "m6Messenger", to: "buyer", label: "tap" }] },
  // What it protects.
  pay(54, { accent: ["m6Page"], badges: { buyer: "same safe page" } }),
  { cue: 55, layout: { m6Frame: [0, 1], m6Messenger: [3, 0.2], m6Seller: [3, 1.8] }, edges: [{ from: "m6Frame", to: "m6Messenger", broken: true }, { from: "m6Frame", to: "m6Seller", broken: true }], accent: ["m6Frame"] },
  { cue: 56, layout: { m6Ecom: [0, 1], m6Fingerprint: [3, 1] }, edges: [{ from: "m6Ecom", to: "m6Fingerprint" }], badges: { m6Fingerprint: "no working links" } },
  behind(57, { accent: ["salespoint"], badges: { salespoint: "guards every link" } }),
  behind(58, { accent: ["m6Payment"], badges: { m6Payment: "a payment, no server" } }),
  behind(59, { badges: { salespoint: "what guards it?" } }),
  behind(60, { accent: ["salespoint"], badges: { salespoint: "every old rule" } }),
];

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["merchant", "payment", "frame", "card"], units: { ecom: "payment links" } },
  // The bridge: what this lesson uses from the ones before.
  { cue: 4, part: 5, current: ["merchant", "payment", "buyer", "partner"] },
  { cue: 5, part: 5, current: ["payment", "buyer"] },
  { cue: 61, part: 5, current: ["merchant", "payment", "card", "procport"], units: { ecom: "refunds next" } },
];

const SHOT = (name: string) => `screens/c-29-payment-links/${name}.png`;
const LINKS = "Merchant portal · Payment links";
const PAGE = "Payment page";
const ALL = [250, 80, 1180, 600] as const;
const LEFT = [255, 80, 900, 563] as const;
const TOP = [400, 20, 640, 400] as const;
const DONE = [330, 40, 780, 487] as const;
export const screens: ScreenStep[] = [
  {
    cue: 32,
    src: SHOT("page"),
    title: LINKS,
    region: [...ALL],
    beats: [
      { cue: 33, region: [250, 80, 720, 450], focus: [[256, 112, 602, 34]] },
      { cue: 34, region: [800, 80, 640, 400], focus: [[1338, 98, 69, 46]] },
    ],
  },
  { cue: 35, src: SHOT("no-live"), title: LINKS, region: [440, 215, 560, 470], focus: [[512, 280, 416, 70]], beats: [{ cue: 36, region: [440, 215, 560, 470], focus: [[510, 310, 420, 26]] }] },
  { cue: 37, src: SHOT("form"), title: LINKS, region: [440, 225, 560, 450], focus: [[512, 370, 416, 160]], beats: [{ cue: 38, region: [440, 225, 560, 450], focus: [[512, 528, 416, 62]] }] },
  { cue: 39, src: SHOT("too-long"), title: LINKS, region: [440, 195, 560, 510], focus: [[525, 580, 390, 40]] },
  { cue: 40, src: SHOT("form"), title: LINKS, region: [440, 225, 560, 450], focus: [[848, 598, 94, 46]] },
  { cue: 41, src: SHOT("ready"), title: LINKS, region: [440, 320, 560, 262], beats: [{ cue: 42, region: [440, 320, 560, 262], focus: [[512, 396, 416, 50]] }] },
  { cue: 43, src: SHOT("copied"), title: LINKS, region: [440, 320, 560, 262], focus: [[738, 503, 84, 44]] },
  { cue: 45, src: SHOT("list-new"), title: LINKS, region: [...LEFT], focus: [[262, 255, 640, 60]] },
  { cue: 46, src: SHOT("viewer"), title: LINKS, region: [800, 80, 640, 400], focus: [[1290, 95, 130, 52]] },
  { cue: 48, src: SHOT("buyer-open"), title: PAGE, region: [...TOP], focus: [[539, 110, 362, 135]] },
  { cue: 49, src: SHOT("buyer-paid"), title: PAGE, region: [...DONE], focus: [[480, 380, 480, 110]], beats: [{ cue: 50, region: [330, 110, 780, 487], focus: [[530, 508, 380, 34]] }] },
  { cue: 51, src: SHOT("list-paid"), title: LINKS, region: [...LEFT], focus: [[262, 255, 640, 60]] },
  { cue: 52, src: SHOT("list-paid"), title: LINKS, region: [...LEFT], focus: [[262, 318, 640, 60]] },
  { cue: 53, src: SHOT("buyer-expired"), title: PAGE, region: [...DONE], focus: [[480, 175, 480, 100]] },
];
