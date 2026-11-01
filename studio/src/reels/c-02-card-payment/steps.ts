import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";
import { BANK, MERCHANT, PAY } from "../../series/build/screens-m01";

// Lesson 2: how a card payment works. One story carries it: the corner shop's tab book.
// The tab book (cues 0–5), two banks and the network (6–11), asking and answering (12–16), settlement and the fee (17–21),
// reversal and refund (22–28), the product (29–42), what it protects (43–52), back to the tab book (53–56), next (57).
const BOOK_SHOP = { shop: [0.5, 1], tabBook: [2.5, 1] } as const;
const BOOK_EDGE = [{ from: "shop", to: "tabBook" }] as const;
const DESK = { buyer: [0, 1], shop: [1.5, 1], tabBook: [3, 1] } as const;
const DESK_EDGES = [{ from: "buyer", to: "shop" }, { from: "shop", to: "tabBook" }] as const;
const TWO_BANKS = { acquirer: [0.5, 1], issuer: [2.5, 1] } as const;
const NET = { acquirer: [0, 1], network: [1.5, 1], issuer: [3, 1] } as const;
const NET_EDGES = [{ from: "acquirer", to: "network" }, { from: "network", to: "issuer" }] as const;
const BOOK = { ...NET, tabBook: [0, 2.2] } as const;
const BOOK_EDGES = [...NET_EDGES, { from: "acquirer", to: "tabBook" }] as const;
const ASK = [{ from: "acquirer", to: "network", label: "OK?" }, { from: "network", to: "issuer", label: "OK?", delay: 40 }] as const;
const YES = [{ from: "issuer", to: "network", label: "yes", delay: 10 }, { from: "network", to: "acquirer", label: "yes", delay: 45 }] as const;
const BATCH = [{ from: "issuer", to: "network", label: "money", delay: 10 }, { from: "network", to: "acquirer", label: "money", delay: 50 }] as const;
const SPLIT = { acquirer: [0.6, 1], feeacc: [2.6, 0.3], wallet: [2.6, 1.7] } as const;
const SPLIT_EDGES = [{ from: "acquirer", to: "feeacc", label: "fee" }, { from: "acquirer", to: "wallet", label: "the rest" }] as const;
const PAIRS = { tabBook: [0.6, 1], wallet: [2.6, 1] } as const;
const BACK = { wallet: [0.6, 1], buyer: [2.6, 1] } as const;
const BACK_EDGE = [{ from: "wallet", to: "buyer" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Has money moved? The tab book.
  { cue: 0, layout: { buyer: [0.5, 1], shop: [2.5, 1] }, edges: [{ from: "buyer", to: "shop" }], packets: [{ from: "buyer", to: "shop", label: "pay" }], badges: { shop: "paid?" } },
  { cue: 1, layout: BOOK_SHOP, edges: [...BOOK_EDGE] },
  { cue: 2, layout: DESK, edges: [...DESK_EDGES], packets: [{ from: "buyer", to: "shop", label: "bread" }, { from: "shop", to: "tabBook", label: "one line", delay: 45 }] },
  { cue: 3, layout: DESK, edges: [...DESK_EDGES], badges: { tabBook: "no cash yet" } },
  { cue: 4, layout: DESK, edges: [...DESK_EDGES], packets: [{ from: "buyer", to: "shop", label: "cash, every line" }], badges: { tabBook: "end of the week" } },
  { cue: 5, layout: DESK, edges: [...DESK_EDGES], badges: { shop: "paid", tabBook: "no money yet" } },
  // Two banks, and the network between them.
  { cue: 6, layout: TWO_BANKS },
  { cue: 7, layout: { ...TWO_BANKS, shop: [0.5, 2.2] }, edges: [{ from: "shop", to: "acquirer" }], accent: ["acquirer"], badges: { acquirer: "the shop's bank" } },
  { cue: 9, layout: { ...TWO_BANKS, buyer: [2.5, 2.2] }, edges: [{ from: "buyer", to: "issuer" }], accent: ["issuer"], badges: { issuer: "the buyer's bank" } },
  { cue: 10, layout: { ...TWO_BANKS, buyer: [2.5, 2.2] }, edges: [{ from: "issuer", to: "buyer", label: "the card" }], badges: { issuer: "holds the money" } },
  { cue: 11, layout: NET, edges: [...NET_EDGES], accent: ["network"], badges: { network: "carries messages" } },
  // Asking and answering: a promise, not money.
  { cue: 12, layout: NET, edges: [...NET_EDGES], packets: [...ASK] },
  { cue: 13, layout: NET, edges: [...NET_EDGES], shake: { issuer: 0.3 }, badges: { issuer: "card · money" } },
  { cue: 14, layout: NET, edges: [...NET_EDGES], packets: [...YES], badges: { issuer: "in seconds" } },
  { cue: 15, layout: BOOK, edges: [...BOOK_EDGES], packets: [{ from: "acquirer", to: "tabBook", label: "a promise" }] },
  { cue: 16, layout: BOOK, edges: [...BOOK_EDGES], badges: { tabBook: "a line, not money" } },
  // Settlement: the money moves later, in one batch.
  { cue: 17, layout: BOOK, edges: [...BOOK_EDGES], badges: { tabBook: "money: later" } },
  { cue: 18, layout: BOOK, edges: [...BOOK_EDGES], packets: [...BATCH], badges: { network: "one batch" } },
  { cue: 19, layout: BOOK, edges: [...BOOK_EDGES], packets: [...BATCH], accent: ["network"], badges: { network: "settlement" } },
  { cue: 20, layout: SPLIT, edges: [...SPLIT_EDGES], packets: [{ from: "acquirer", to: "feeacc", label: "fee" }, { from: "acquirer", to: "wallet", label: "the rest", delay: 30 }] },
  { cue: 21, layout: PAIRS, badges: { tabBook: "the yes: seconds", wallet: "the money: later" } },
  // Giving money back: before and after settlement.
  { cue: 22, layout: PAIRS, badges: { tabBook: "before settlement", wallet: "after settlement" } },
  { cue: 23, layout: { tabBook: [1.5, 1] }, badges: { tabBook: "no money moved" } },
  { cue: 24, layout: { tabBook: [1.5, 1] }, crossed: ["tabBook"] },
  { cue: 25, layout: { tabBook: [1.5, 1] }, crossed: ["tabBook"], accent: ["tabBook"], badges: { tabBook: "reversal" } },
  { cue: 26, layout: BACK, edges: [...BACK_EDGE], badges: { wallet: "money moved" } },
  { cue: 27, layout: BACK, edges: [...BACK_EDGE], packets: [{ from: "wallet", to: "buyer", label: "a new movement" }] },
  { cue: 28, layout: BACK, edges: [...BACK_EDGE], accent: ["buyer"], badges: { buyer: "refund" } },
  // What it protects: the yes is not money, and the two ways back never mix.
  { cue: 43, layout: PAIRS, badges: { tabBook: "the yes", wallet: "the money" } },
  { cue: 44, layout: PAIRS, danger: ["tabBook"], badges: { tabBook: "yes = money?" } },
  {
    cue: 45,
    layout: { network: [0, 1], acquirer: [1.5, 1], shop: [3, 1] },
    edges: [{ from: "network", to: "acquirer" }, { from: "acquirer", to: "shop" }],
    packets: [{ from: "acquirer", to: "shop", label: "paid at once" }, { from: "network", to: "acquirer", label: "batch", delay: 50, stopAt: 0.5 }],
    danger: ["acquirer"],
    badges: { acquirer: "money never came" },
  },
  { cue: 46, layout: PAIRS, danger: ["tabBook", "wallet"], badges: { tabBook: "reversal?", wallet: "refund?" } },
  { cue: 47, layout: { tabBook: [0.6, 1], buyer: [2.6, 1] }, crossed: ["tabBook"], danger: ["buyer"], badges: { tabBook: "already settled", buyer: "money never back" } },
  {
    cue: 48,
    layout: { tabBook: [0.4, 0.3], wallet: [0.4, 1.7], buyer: [2.6, 1] },
    edges: [{ from: "tabBook", to: "buyer" }, { from: "wallet", to: "buyer" }],
    crossed: ["tabBook"],
    packets: [{ from: "wallet", to: "buyer", label: "refund" }],
    danger: ["buyer"],
    badges: { buyer: "paid twice" },
  },
  { cue: 49, layout: { acquirer: [0, 1], shop: [1.5, 1], buyer: [3, 1] }, danger: ["acquirer", "shop", "buyer"], shake: { acquirer: 0.5, shop: 0.62, buyer: 0.75 } },
  { cue: 50, layout: PAIRS, accent: ["tabBook", "wallet"] },
  { cue: 51, layout: PAIRS, accent: ["tabBook", "wallet"], badges: { tabBook: "approved ≠ paid out" } },
  { cue: 52, layout: PAIRS, accent: ["tabBook", "wallet"], badges: { tabBook: "approved ≠ paid out", wallet: "reversal ≠ refund" } },
  // Back to the tab book.
  { cue: 53, layout: BOOK_SHOP, edges: [...BOOK_EDGE] },
  { cue: 54, layout: BOOK_SHOP, edges: [...BOOK_EDGE], packets: [{ from: "shop", to: "tabBook", label: "a line" }], badges: { tabBook: "in seconds" } },
  { cue: 55, layout: BOOK_SHOP, edges: [...BOOK_EDGE], badges: { tabBook: "money: end of week" } },
  { cue: 56, layout: BOOK_SHOP, edges: [...BOOK_EDGE], crossed: ["tabBook"], badges: { tabBook: "cross out · hand back" } },
];

// The product: the buyer's page, the shop's portal, the bank's portal, the daily report.
export const screens: ScreenStep[] = [
  { cue: 29, src: "screens/c-02-card-payment/pay-typed.png", title: PAY.cardTitle, region: PAY.top, focus: [PAY.header] },
  { cue: 30, src: "screens/c-02-card-payment/pay-typed.png", title: PAY.cardTitle, region: PAY.frame, focus: [PAY.fields] },
  {
    cue: 31,
    src: "screens/c-02-card-payment/pay-debiting.png",
    title: PAY.title,
    region: PAY.status,
    focus: [PAY.taking],
  },
  { cue: 32, src: "screens/c-02-card-payment/pay-paid.png", title: PAY.title, region: PAY.status, focus: [PAY.paid] },
  { cue: 34, src: "screens/c-02-card-payment/merchant-payments.png", title: MERCHANT.listTitle, region: MERCHANT.list },
  { cue: 36, src: "screens/c-02-card-payment/merchant-payments.png", title: MERCHANT.listTitle, region: MERCHANT.list, focus: [MERCHANT.paidRow] },
  {
    cue: 37,
    src: "screens/c-02-card-payment/merchant-payment.png",
    title: MERCHANT.listTitle,
    region: MERCHANT.drawer,
    focus: [MERCHANT.facts, MERCHANT.calls],
    beats: [{ cue: 38, region: MERCHANT.drawer, focus: [MERCHANT.refund] }],
  },
  { cue: 39, src: "screens/c-02-card-payment/merchant-giveback.png", title: MERCHANT.listTitle, region: MERCHANT.dialog, focus: [MERCHANT.rule] },
  {
    cue: 40,
    src: "screens/c-02-card-payment/admin-payments.png",
    title: BANK.title,
    region: BANK.list,
    focus: [BANK.reversed, BANK.refunded],
  },
  { cue: 42, src: "screens/c-02-card-payment/merchant-reports.png", title: MERCHANT.reportsTitle, region: MERCHANT.reports, focus: [MERCHANT.reportRow] },
];

export const map: BuildMapStep[] = [
  { cue: 8, part: 0, current: ["payment"], units: { ecom: "the acquirer" } },
  { cue: 57, part: 0, current: ["card", "frame"], units: { cards: "card data" } },
];
