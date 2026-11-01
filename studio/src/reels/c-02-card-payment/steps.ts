import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";
import { BANK, MERCHANT, PAY } from "../../series/build/screens-m01";

// Lesson 2: how a card payment works. One shop carries it: Malika's forty bouquets on a Friday night.
// Paid, but no money (0–6), the bridge from lesson 1 (7–8), two banks and the network (9–13), the yes is a promise (14–16), settlement and the fee (17–21),
// approved is not paid out (22–24), reversal and refund (25–36), the product (37–46), promised and yours (47–48), next (49).
const SALE = { buyer: [0.5, 1], shop: [2.5, 1] } as const;
const SALE_EDGE = [{ from: "buyer", to: "shop" }] as const;
const ACCOUNT = { shop: [0.5, 1], wallet: [2.5, 1] } as const;
const ACCOUNT_EDGE = [{ from: "shop", to: "wallet" }] as const;
const TWO_BANKS = { acquirer: [0.5, 1], issuer: [2.5, 1] } as const;
const NET = { acquirer: [0, 1], network: [1.5, 1], issuer: [3, 1] } as const;
const NET_EDGES = [{ from: "acquirer", to: "network" }, { from: "network", to: "issuer" }] as const;
const YES = { ...NET, promise: [0, 2.2] } as const;
const YES_EDGES = [...NET_EDGES, { from: "acquirer", to: "promise" }] as const;
const ASK = [{ from: "acquirer", to: "network", label: "OK?" }, { from: "network", to: "issuer", label: "OK?", delay: 40 }] as const;
const ANSWER = [{ from: "issuer", to: "network", label: "yes", delay: 10 }, { from: "network", to: "acquirer", label: "yes", delay: 45 }] as const;
const BATCH = [{ from: "issuer", to: "network", label: "money", delay: 10 }, { from: "network", to: "acquirer", label: "money", delay: 50 }] as const;
const SPLIT = { acquirer: [0.6, 1], feeacc: [2.6, 0.3], wallet: [2.6, 1.7] } as const;
const SPLIT_EDGES = [{ from: "acquirer", to: "feeacc", label: "fee" }, { from: "acquirer", to: "wallet", label: "the rest" }] as const;
const PAIRS = { promise: [0.6, 1], wallet: [2.6, 1] } as const;
const BACK = { wallet: [0.6, 1], buyer: [2.6, 1] } as const;
const BACK_EDGE = [{ from: "wallet", to: "buyer" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Friday night: forty bouquets, forty "paid". Saturday: nothing in the account.
  { cue: 0, layout: SALE, edges: [...SALE_EDGE], badges: { shop: "Fri 21:00" } },
  { cue: 1, layout: SALE, edges: [...SALE_EDGE], packets: [{ from: "buyer", to: "shop", label: "40 bouquets" }] },
  { cue: 2, layout: SALE, edges: [...SALE_EDGE], accent: ["shop"], badges: { shop: "paid ×40" } },
  { cue: 3, layout: ACCOUNT, edges: [...ACCOUNT_EDGE], badges: { shop: "paid ×40", wallet: "Sat" } },
  { cue: 4, layout: ACCOUNT, edges: [...ACCOUNT_EDGE], danger: ["wallet"], badges: { shop: "paid ×40", wallet: "0" } },
  { cue: 5, layout: ACCOUNT, edges: [...ACCOUNT_EDGE], badges: { shop: "paid ×40", wallet: "0" } },
  { cue: 6, layout: ACCOUNT, edges: [...ACCOUNT_EDGE], badges: { shop: "paid = ?", wallet: "0" } },
  // Two banks, and the network between them.
  { cue: 9, layout: TWO_BANKS },
  { cue: 10, layout: { ...TWO_BANKS, shop: [0.5, 2.2] }, edges: [{ from: "shop", to: "acquirer" }], accent: ["acquirer"], badges: { acquirer: "Malika's bank" } },
  { cue: 11, layout: { ...TWO_BANKS, shop: [0.5, 2.2], buyer: [2.5, 2.2] }, edges: [{ from: "shop", to: "acquirer" }, { from: "issuer", to: "buyer", label: "the card" }], accent: ["issuer"], badges: { issuer: "holds the money" } },
  { cue: 12, layout: NET, edges: [...NET_EDGES], accent: ["network"], packets: [...ASK], badges: { network: "may this card pay?" } },
  { cue: 13, layout: NET, edges: [...NET_EDGES], shake: { issuer: 0.3 }, packets: [...ANSWER], badges: { issuer: "~2 seconds" } },
  // The yes is a promise.
  { cue: 14, layout: YES, edges: [...YES_EDGES], accent: ["promise"], packets: [{ from: "acquirer", to: "promise", label: "a promise" }] },
  { cue: 15, layout: YES, edges: [...YES_EDGES], badges: { issuer: "money set aside" } },
  { cue: 16, layout: YES, edges: [...YES_EDGES], badges: { issuer: "money set aside", promise: "nothing moved" } },
  // Settlement, overnight and in bulk; then the fee and one transfer.
  { cue: 17, layout: YES, edges: [...YES_EDGES], badges: { promise: "money: later" } },
  { cue: 18, layout: NET, edges: [...NET_EDGES], packets: [...BATCH], badges: { network: "one batch" } },
  { cue: 19, layout: NET, edges: [...NET_EDGES], accent: ["network"], badges: { network: "settlement" } },
  { cue: 20, layout: SPLIT, edges: [...SPLIT_EDGES], packets: [{ from: "acquirer", to: "feeacc", label: "fee" }, { from: "acquirer", to: "wallet", label: "the rest", delay: 20 }] },
  { cue: 21, layout: SPLIT, edges: [...SPLIT_EDGES], accent: ["wallet"], badges: { wallet: "Monday: one transfer" } },
  // Approved is not paid out.
  { cue: 22, layout: PAIRS, accent: ["promise", "wallet"], badges: { promise: "approved", wallet: "paid out" } },
  {
    cue: 23,
    layout: { network: [0, 1], acquirer: [1.5, 1], shop: [3, 1] },
    edges: [{ from: "network", to: "acquirer" }, { from: "acquirer", to: "shop" }],
    packets: [{ from: "acquirer", to: "shop", label: "paid on yes" }, { from: "network", to: "acquirer", label: "batch", delay: 50, stopAt: 0.5 }],
    badges: { acquirer: "never settles" },
  },
  {
    cue: 24,
    layout: { network: [0, 1], acquirer: [1.5, 1], shop: [3, 1] },
    edges: [{ from: "network", to: "acquirer", broken: true }, { from: "acquirer", to: "shop" }],
    danger: ["acquirer"],
    badges: { acquirer: "covers the gap" },
  },
  // Sunday: cancel my order. Reversal or refund, decided by settlement.
  { cue: 25, layout: SALE, edges: [...SALE_EDGE], packets: [{ from: "buyer", to: "shop", label: "cancel" }], badges: { shop: "Sun" } },
  { cue: 26, layout: PAIRS, badges: { promise: "not settled?", wallet: "settled?" } },
  { cue: 27, layout: { promise: [1.5, 1] }, badges: { promise: "today: nothing moved" } },
  { cue: 28, layout: { promise: [1.5, 1] }, crossed: ["promise"] },
  { cue: 29, layout: { promise: [1.5, 1] }, crossed: ["promise"], accent: ["promise"], badges: { promise: "reversal" } },
  { cue: 30, layout: BACK, edges: [...BACK_EDGE], badges: { wallet: "settled Friday" } },
  { cue: 31, layout: BACK, edges: [...BACK_EDGE], packets: [{ from: "wallet", to: "buyer", label: "a new movement" }] },
  { cue: 32, layout: BACK, edges: [...BACK_EDGE], accent: ["buyer"], badges: { buyer: "refund" } },
  // Mixed up, someone pays.
  { cue: 33, layout: PAIRS, danger: ["promise", "wallet"], badges: { promise: "reversal?", wallet: "refund?" } },
  { cue: 34, layout: { promise: [0.6, 1], buyer: [2.6, 1] }, crossed: ["promise"], danger: ["buyer"], badges: { promise: "already settled", buyer: "money never back" } },
  {
    cue: 35,
    layout: { promise: [0.4, 0.3], wallet: [0.4, 1.7], buyer: [2.6, 1] },
    edges: [{ from: "promise", to: "buyer" }, { from: "wallet", to: "buyer" }],
    crossed: ["promise"],
    packets: [{ from: "wallet", to: "buyer", label: "refund" }],
    danger: ["buyer"],
    badges: { buyer: "paid twice" },
  },
  { cue: 36, layout: PAIRS, accent: ["promise", "wallet"], badges: { promise: "reversal", wallet: "refund" } },
  // Promised, then yours.
  { cue: 47, layout: { shop: [0.5, 1], promise: [2.5, 1] }, edges: [{ from: "shop", to: "promise" }], badges: { shop: "paid", promise: "promised" } },
  { cue: 48, layout: ACCOUNT, edges: [...ACCOUNT_EDGE], accent: ["wallet"], badges: { shop: "payout", wallet: "yours" } },
];

// The product: the buyer's page, Malika's portal, the bank's portal, Monday's report.
export const screens: ScreenStep[] = [
  { cue: 37, src: "screens/c-02-card-payment/pay-typed.png", title: PAY.cardTitle, region: PAY.top, focus: [PAY.header] },
  { cue: 38, src: "screens/c-02-card-payment/pay-typed.png", title: PAY.cardTitle, region: PAY.frame, focus: [PAY.fields] },
  { cue: 39, src: "screens/c-02-card-payment/pay-debiting.png", title: PAY.title, region: PAY.status, focus: [PAY.taking] },
  { cue: 40, src: "screens/c-02-card-payment/pay-paid.png", title: PAY.title, region: PAY.status, focus: [PAY.paid] },
  { cue: 41, src: "screens/c-02-card-payment/merchant-payments.png", title: MERCHANT.listTitle, region: MERCHANT.list, focus: [MERCHANT.paidRow] },
  {
    cue: 42,
    src: "screens/c-02-card-payment/merchant-payment.png",
    title: MERCHANT.listTitle,
    region: MERCHANT.drawer,
    focus: [MERCHANT.facts, MERCHANT.calls, MERCHANT.refund],
  },
  { cue: 43, src: "screens/c-02-card-payment/merchant-giveback.png", title: MERCHANT.listTitle, region: MERCHANT.dialog, focus: [MERCHANT.rule] },
  { cue: 44, src: "screens/c-02-card-payment/admin-payments.png", title: BANK.title, region: BANK.list, focus: [BANK.reversed, BANK.refunded] },
  { cue: 45, src: "screens/c-02-card-payment/merchant-reports.png", title: MERCHANT.reportsTitle, region: MERCHANT.reports },
  { cue: 46, src: "screens/c-02-card-payment/merchant-reports.png", title: MERCHANT.reportsTitle, region: MERCHANT.reports, focus: [MERCHANT.reportRow] },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the one before.
  { cue: 7, part: 1, current: ["payment", "procport", "card", "procsvc"], units: { cards: "asks the centre" } },
  { cue: 8, part: 1, current: ["procsvc"], units: { ecom: "the acquirer" } },
  { cue: 49, part: 1, current: ["card", "frame"], units: { cards: "card data" } },
];
