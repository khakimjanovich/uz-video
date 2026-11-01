// Module 6 (payments) sample data: one toy shop, its live website, payments in every state, the pay page.
import { ADMIN_SESSION, MERCHANT_SESSION, SHOP } from "./common";
import { CARDS, type Fixtures, type Shot } from "../harness";

export const OWNER = { username: "owner@toycorner.example.com" };
export const STAFF = { username: "staff1" };
const at = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();
const days = (n: number) => at(n * 24 * 60);

export const PARTNER = { ...SHOP, status: "ACTIVE", emailVerified: true, contractNumber: "C-2026-0042" };
export const WEBSITE = {
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

const PAYMENT_ID = "5e2a9c41-7b3d-4f8e-a1c6-9d0b2e4f6a18";
/** One merchant payment (the cabinet's shape); override what a beat needs. */
export const payment = (over: Record<string, unknown> = {}) => ({
  id: PAYMENT_ID,
  salesPointId: WEBSITE.id,
  orderId: "ORDER-1042",
  amount: 249900,
  description: "Wooden train set",
  state: "CREATED",
  status: "CREATED",
  createdAt: at(-3),
  testMode: false,
  operations: [],
  ...over,
});
export const PAID = {
  state: "PAID",
  status: "PAID",
  rrn: "604512873310",
  fee: 4998,
  net: 244902,
  paidAt: at(-2),
  refundableUntil: days(13),
  refundDaysLeft: 9,
};
export const debit = (state: string, over: Record<string, unknown> = {}) => ({
  kind: "DEBIT",
  state,
  amount: 249900,
  startedAt: at(-2),
  ...(state === "REQUESTED" || state === "UNKNOWN" ? {} : { finishedAt: at(-2) }),
  ...over,
});

/** The merchant's payments page; `detail` opens the one payment's drawer. */
export function merchantPayments(p: ReturnType<typeof payment>, extra: Fixtures = {}, role = "ADMIN"): Fixtures {
  return {
    ...MERCHANT_SESSION,
    "GET /api/v1/session": { admin: false, merchantRole: role },
    "GET /api/v1/partner/me": PARTNER,
    "GET /api/v1/partner/sales-points": [WEBSITE],
    "GET /api/v1/partner/payments": [p],
    "GET /api/v1/partner/payments/*": p,
    "GET /api/v1/partner/payments/*/disputes": [],
    "GET /api/v1/partner/payments/*/webhooks": [],
    ...extra,
  };
}

export const openDetail: Shot["act"] = async (page) => {
  await page.locator("tbody tr").first().click();
  await page.getByText("Calls to the card scheme").waitFor();
  await page.waitForTimeout(400);
};

/** The bank's pay page; `status` and the rest override a fresh, unpaid page. */
export const payPage = (over: Record<string, unknown> = {}) => ({
  "GET /api/v1/pay/*": {
    status: "CREATED",
    amount: 249900,
    orderId: "ORDER-1042",
    description: "Wooden train set",
    merchantName: "Toy Corner",
    hasLogo: false,
    schemes: ["UZCARD", "HUMO"],
    expiresAt: at(30),
    returnUrl: "https://toycorner.example.com/thanks",
    cardEntry: {
      frameUrl: `${CARDS}/entry/4b8f9a1e-2c3d-4e5f-8a9b-0c1d2e3f4a5b`,
      sessionId: "4b8f9a1e-2c3d-4e5f-8a9b-0c1d2e3f4a5b",
      expiresAt: at(10),
    },
    ...over,
  },
});
export const CARD_DONE = { maskedCard: "•••• •••• •••• 4417", cardEntry: undefined };

export const admin = (extra: Fixtures): Fixtures => ({
  ...ADMIN_SESSION,
  "GET /api/v1/admin/partners": { items: [PARTNER], page: 0, size: 20, totalItems: 1, totalPages: 1 },
  "GET /api/v1/admin/partners/*": PARTNER,
  "GET /api/v1/partners/*": PARTNER,
  "GET /api/v1/admin/sales-points/*": WEBSITE,
  ...extra,
});
/** One payment as the bank console lists it. */
export const adminPayment = (over: Record<string, unknown> = {}) => ({
  id: PAYMENT_ID,
  partnerId: SHOP.id,
  salesPointId: WEBSITE.id,
  source: "API",
  clientId: "toycorner-shop",
  orderId: "ORDER-1042",
  amount: 249900,
  description: "Wooden train set",
  status: "PAID",
  state: "PAID",
  cardMask: "•••• •••• •••• 4417",
  cardScheme: "UZCARD",
  merchantId: "MID-000418",
  terminalId: "TID-0042",
  createdAt: at(-90),
  testMode: false,
  ...over,
});
export { at, days };

type Page = Parameters<NonNullable<Shot["act"]>>[0];
/** An error answer as the server sends it: its status, code and the English detail. */
export const problem = (status: number, code: string, detail: string) => () => ({ status, body: { title: code, status, code, detail } });
/** What the card frame posts to the page (a card token, or "this session ended"), sent from inside the frame. */
export async function fromFrame(page: Page, message: Record<string, unknown>) {
  const frame = page.frames().find((f) => f.url().startsWith(CARDS));
  if (!frame) throw new Error("no card frame on the page");
  await frame.evaluate((m) => parent.postMessage(m, "*"), message);
}
export const CARD_MESSAGE = { v: 1, cardToken: `ctk_${"3f".repeat(16)}`, maskedPan: "•••• 4417", expiry: "12/29", scheme: "UZCARD" };
/** Prints each text's box in page pixels, for the lesson's screen regions and marks. */
export async function boxes(page: Page, name: string, texts: string[]) {
  for (const text of texts) {
    const found = page.getByText(text, { exact: false });
    const b = (await found.count()) ? await found.last().boundingBox() : null;
    console.log(`  ${name} · ${text}: ${b ? [b.x, b.y, b.width, b.height].map(Math.round).join(", ") : "not found"}`);
  }
}
