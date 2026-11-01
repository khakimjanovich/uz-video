// Lessons 2–7 (module 0–1): the pay page from card to "Paid", the merchant's payments and daily reports,
// the bank's payments list. Dates follow today (UTC), so "Refundable until" stays in the future on every run.
import type { Page } from "@playwright/test";
import { ADMIN_SESSION, MERCHANT_SESSION, SHOP } from "./common";
import { CARDS, type Fixtures, type Shot } from "../harness";

const DAY = 86_400_000;
const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z").getTime();
const at = (days: number, time: string) => new Date(today + days * DAY).toISOString().slice(0, 10) + `T${time}Z`;
const day = (days: number) => new Date(today + days * DAY).toISOString().slice(0, 10);

const SITE = {
  id: "0b6f2c1e-8d4a-4c2b-9e1f-3a5d7c9e1b20",
  partnerId: SHOP.id,
  name: "Toy Corner online",
  websiteUrl: "https://toycorner.example.com",
  returnUrls: ["https://toycorner.example.com/thanks"],
  status: "ACTIVE",
  schemes: ["UZCARD", "HUMO"],
  refundWindowWorkingDays: 10,
  refundExtensionMaxCalendarDays: 60,
};
const PARTNER = { ...SHOP, status: "ACTIVE", emailVerified: true, contractNumber: "C-2026-0042" };
const MASK = "123456******7890";

// The buyer's payment: a wooden train set, paid by a made-up card.
const ORDER = { amount: 249900, orderId: "ORDER-1042", description: "Wooden train set", merchantName: "Toy Corner", hasLogo: false };
const SESSION_A = "4b8f9a1e-2c3d-4e5f-8a9b-0c1d2e3f4a5b";
const SESSION_B = "9c1d2e3f-4a5b-4e5f-8a9b-4b8f9a1e2c3d";
const entry = (session: string) => ({
  frameUrl: `${CARDS}/entry/${session}`,
  sessionId: session,
  expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
});
const page = (extra: object) => ({
  ...ORDER,
  schemes: ["UZCARD", "HUMO"],
  expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
  returnUrl: "https://toycorner.example.com/thanks",
  ...extra,
});
const BOUND = { maskedCard: MASK, cardBank: "Example Bank", cardScheme: "UZCARD" };

const op = (kind: string, amount: number, startedAt: string, reason?: string) => ({
  kind,
  state: "APPROVED",
  amount,
  reason,
  startedAt,
  finishedAt: startedAt.replace(/:00Z$/, ":03Z"),
});

// The shop's payments, newest first.
const payment = (p: { id: string; orderId: string; description: string; amount: number; state: string; created: string; extra?: object }) => ({
  id: p.id,
  salesPointId: SITE.id,
  orderId: p.orderId,
  description: p.description,
  amount: p.amount,
  state: p.state,
  status: p.state,
  fee: Math.round(p.amount * 0.02),
  net: p.amount - Math.round(p.amount * 0.02),
  createdAt: p.created,
  testMode: false,
  ...p.extra,
});
const PAID = payment({
  id: "5a1e0c3d-7b2f-4e6a-9d18-2c4b6e8f0a11",
  orderId: "ORDER-1042",
  description: "Wooden train set",
  amount: 249900,
  state: "PAID",
  created: at(0, "09:41:00"),
  extra: {
    rrn: "604512345678",
    paidAt: at(0, "09:41:06"),
    operations: [op("DEBIT", 249900, at(0, "09:41:00"))],
    refundableUntil: at(14, "23:59:00"),
    refundDaysLeft: 10,
  },
});
const PAYMENTS = [
  PAID,
  payment({ id: "6b2f1d4e-8c3a-4f7b-8e29-3d5c7f9a1b22", orderId: "ORDER-1041", description: "Puzzle, 500 pieces", amount: 89000, state: "REVERSED", created: at(0, "08:12:00") }),
  payment({ id: "7c3a2e5f-9d4b-4a8c-9f3a-4e6d8a0b2c33", orderId: "ORDER-1040", description: "Building blocks", amount: 129900, state: "PAID", created: at(-1, "17:05:00") }),
  payment({ id: "8d4b3f6a-0e5c-4b9d-8a4b-5f7e9b1c3d44", orderId: "ORDER-1038", description: "Rocking horse", amount: 415000, state: "REFUNDED", created: at(-4, "12:30:00") }),
  payment({ id: "9e5c4a7b-1f6d-4c0e-9b5c-6a8f0c2d4e55", orderId: "ORDER-1036", description: "Toy kitchen", amount: 312000, state: "PAID", created: at(-5, "10:18:00") }),
];

// The same payments in the bank's own list: the card column holds masked numbers only.
const MASKS = ["123456******7890", "234567******1204", "345678******5531", "456789******0187", "567890******3349"];
const ADMIN_PAYMENTS = PAYMENTS.map((p, k) => ({
  id: p.id,
  partnerId: SHOP.id,
  salesPointId: SITE.id,
  source: "API",
  orderId: p.orderId,
  amount: p.amount,
  description: p.description,
  status: p.state,
  state: p.state,
  cardMask: MASKS[k],
  fee: p.fee,
  net: p.net,
  rrn: `6045123456${70 + k}`,
  createdAt: p.createdAt,
  testMode: false,
}));

const REPORTS = [
  { businessDay: day(-1), paidCount: 14, paidAmount: 3184000, refundedCount: 1, refundedAmount: 415000 },
  { businessDay: day(-2), paidCount: 11, paidAmount: 2569500, refundedCount: 0, refundedAmount: 0 },
  { businessDay: day(-3), paidCount: 9, paidAmount: 1987000, refundedCount: 0, refundedAmount: 0 },
].map((r) => {
  const fee = Math.round(r.paidAmount * 0.02);
  const refundedFee = Math.round(r.refundedAmount * 0.02);
  const net = r.paidAmount - fee;
  return { ...r, salesPointId: SITE.id, fee, net, refundedFee, payout: net - (r.refundedAmount - refundedFee) };
});

const MERCHANT: Fixtures = {
  ...MERCHANT_SESSION,
  "GET /api/v1/partner/me": PARTNER,
  "GET /api/v1/partner/sales-points": [SITE],
  "GET /api/v1/partner/payments": PAYMENTS,
  "GET /api/v1/partner/payments/*": PAID,
  "GET /api/v1/partner/payments/*/disputes": [],
  "GET /api/v1/partner/payments/*/webhooks": [],
  "GET /api/v1/partner/reports": REPORTS,
};
const ADMIN: Fixtures = {
  ...ADMIN_SESSION,
  "GET /api/v1/admin/payments": ADMIN_PAYMENTS,
  "GET /api/v1/admin/payments/review": [],
  "GET /api/v1/admin/partners": { items: [PARTNER], page: 0, size: 20, totalItems: 1, totalPages: 1 },
  "GET /api/v1/partners/*": PARTNER,
  "GET /api/v1/admin/sales-points/*": SITE,
};

/** Prints an element's box in page pixels, to place a screen step's region and focus. */
export async function box(page: Page, label: string, selector: string) {
  const b = await page.locator(selector).first().boundingBox();
  console.log(`  ${label}: ${b ? [b.x, b.y, b.width, b.height].map(Math.round).join(", ") : "none"}`);
}
const frame = (p: Page) => p.frameLocator("iframe").first();
async function typeCard(p: Page) {
  await frame(p).locator("#pan").pressSequentially("1234561234567890");
  await frame(p).locator("#expiry").pressSequentially("0929");
}

const PAY = "/pay/pt_screens0001";
const merchant = { username: "owner@toycorner.example.com" };
const staff = { username: "staff1" };

export const M01_SHOTS: Record<string, Shot> = {
  // The card form: the card zone's frame inside the bank's page; number and date, no code box.
  "pay-card": {
    name: "pay-card",
    path: PAY,
    fixtures: { "GET /api/v1/pay/*": page({ status: "CREATED", cardEntry: entry(SESSION_A) }) },
    act: async (p) => {
      await frame(p).locator("#pan").waitFor();
      await p.waitForTimeout(800);
      await box(p, "header", "text=Secure payment page of the bank");
      await box(p, "frame", "iframe");
    },
  },
  "pay-typed": {
    name: "pay-typed",
    path: PAY,
    fixtures: { "GET /api/v1/pay/*": page({ status: "CREATED", cardEntry: entry(SESSION_A) }) },
    act: async (p) => {
      await frame(p).locator("#pan").waitFor();
      await p.waitForTimeout(800);
      await typeCard(p);
      await box(p, "frame", "iframe");
    },
  },
  // Too many tries: the frame's session ends, the page opens a new one and says why.
  "pay-ended": {
    name: "pay-ended",
    path: PAY,
    fixtures: (() => {
      let reads = 0;
      return {
        "GET /api/v1/pay/*": () => ({ body: page({ status: "CREATED", cardEntry: entry(reads++ === 0 ? SESSION_A : SESSION_B) }) }),
        "POST /entry/v1/sessions/*/card": () => ({ status: 409, body: { code: "SESSION_ATTEMPTS_EXCEEDED", detail: "Too many tries." } }),
      };
    })(),
    act: async (p) => {
      await frame(p).locator("#pan").waitFor();
      await p.waitForTimeout(800);
      await typeCard(p);
      await frame(p).locator("button[type=submit]").first().click();
      await p.getByText("That attempt ended").waitFor();
      await p.waitForTimeout(2500);
      await box(p, "alert", "text=That attempt ended");
      await box(p, "frame", "iframe");
    },
  },
  // The card bound: one short line, then the bank asking.
  "pay-debiting": {
    name: "pay-debiting",
    path: PAY,
    fixtures: { "GET /api/v1/pay/*": page({ status: "DEBITING", ...BOUND }) },
    act: async (p) => {
      await p.getByText("Taking the payment").waitFor();
      await box(p, "card line", "text=123456******7890");
      await box(p, "taking", "text=Taking the payment");
      await box(p, "asked", "text=Your bank is being asked");
    },
  },
  "pay-paid": {
    name: "pay-paid",
    path: PAY,
    fixtures: { "GET /api/v1/pay/*": page({ status: "PAID", ...BOUND, rrn: "604512345678", paidAt: at(0, "09:41:06") }) },
    act: async (p) => {
      await p.getByText("Reference number").waitFor();
      await box(p, "paid", "h4");
      await box(p, "reference", "text=Reference number");
    },
  },
  "merchant-payments": {
    name: "merchant-payments",
    path: "/merchant/payments",
    as: merchant,
    fixtures: MERCHANT,
    act: async (p) => {
      await p.getByText("ORDER-1042").waitFor();
      await box(p, "table", "table");
      await box(p, "paid row", "tr:has-text('ORDER-1042')");
    },
  },
  "merchant-payment": {
    name: "merchant-payment",
    path: "/merchant/payments",
    as: merchant,
    fixtures: MERCHANT,
    act: async (p) => {
      await p.getByText("ORDER-1042").first().click();
      await p.getByText("Refundable until").waitFor();
      await p.waitForTimeout(600);
      await box(p, "drawer", ".mantine-Drawer-content");
      await box(p, "amount", ".mantine-Drawer-content >> text=Amount");
      await box(p, "refund box", ".mantine-Drawer-content >> text=Refundable until");
      await box(p, "give back", ".mantine-Drawer-content >> button:has-text('Give back')");
      await box(p, "calls", ".mantine-Drawer-content >> text=Calls to the card scheme");
    },
  },
  "merchant-giveback": {
    name: "merchant-giveback",
    path: "/merchant/payments",
    as: merchant,
    fixtures: MERCHANT,
    act: async (p) => {
      await p.getByText("ORDER-1042").first().click();
      await p.getByRole("button", { name: "Give back" }).click();
      await p.getByText("Give the money back?").waitFor();
      await p.waitForTimeout(600);
      await box(p, "modal", ".mantine-Modal-content");
      await box(p, "rule", "text=On the day of payment");
    },
  },
  "merchant-reports": {
    name: "merchant-reports",
    path: "/merchant/reports",
    as: merchant,
    fixtures: MERCHANT,
    act: async (p) => {
      await p.locator("th:has-text('You receive')").waitFor();
      await box(p, "table", "table");
      await box(p, "first row", "tbody tr");
    },
  },
  "admin-payments": {
    name: "admin-payments",
    path: "/admin/payments",
    as: staff,
    fixtures: ADMIN,
    act: async (p) => {
      await p.getByText("ORDER-1042").waitFor();
      await p.waitForTimeout(600);
      await box(p, "table", "table");
      await box(p, "card head", "th:has-text('Card')");
      await box(p, "reversed", "td >> text=Reversed");
      await box(p, "refunded", "td >> text=Refunded");
      await box(p, "row 1042", "tr:has-text('ORDER-1042')");
    },
  },
};

/** This lesson's shots, by name. */
export const pick = (...names: string[]) => names.map((n) => M01_SHOTS[n]);
