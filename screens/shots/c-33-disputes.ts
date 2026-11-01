// Lesson 33: a complaint registered on a paid payment, the disputes list, evidence asked for and given,
// a loss recorded by one admin and approved by a second.
import { join } from "node:path";
import { ADMIN_SESSION, MERCHANT_SESSION, SHOP } from "../fixtures/common";
import { ADMIN_LOOKUPS, boxes, tidy, GIFT_SITE, isoDay, isoTime, PARTNER, SHOP_SITE, SITES } from "../fixtures/m78";
import { prepare, serve, shoot } from "../harness";

const FIRST = "sara"; // records the loss
const SECOND = "tom"; // approves it

const payment = (id: string, orderId: string, amount: number, description: string, state: string, days: number, site = SHOP_SITE) => ({
  id,
  partnerId: SHOP.id,
  salesPointId: site.id,
  source: "API",
  orderId,
  amount,
  description,
  status: "PAID",
  state,
  cardMask: "123456******7890",
  cardScheme: "UZCARD",
  terminalId: "T0420017",
  fee: Math.round(amount * 0.02),
  net: amount - Math.round(amount * 0.02),
  rrn: "630412778190",
  paidAt: isoTime(days),
  createdAt: isoTime(days),
  testMode: false,
});
const TRAIN = payment("9a1b2c3d-0000-4000-8000-000000001042", "ORDER-1042", 249900, "Wooden train set", "PAID", -9);
const PAYMENTS = [
  payment("9a1b2c3d-0000-4000-8000-000000001051", "ORDER-1051", 74800, "Puzzle, 500 pieces", "PAID", -2, GIFT_SITE),
  payment("9a1b2c3d-0000-4000-8000-000000001047", "ORDER-1047", 129900, "Doll house", "PAID", -5),
  TRAIN,
  payment("9a1b2c3d-0000-4000-8000-000000001038", "ORDER-1038", 39900, "Kite", "PAID", -12),
];

const dispute = (over: Record<string, unknown>) => ({
  id: "d1500000-0000-4000-8000-000000000001",
  paymentId: TRAIN.id,
  partnerId: SHOP.id,
  salesPointId: SHOP_SITE.id,
  source: "SCHEME",
  scheme: "UZCARD",
  claimRef: "CLM-2026-55120",
  amount: TRAIN.amount,
  reason: "The cardholder says they never bought this.",
  receivedOn: isoDay(-1),
  schemeDeadline: isoDay(20),
  evidenceDeadlineLatest: isoDay(16),
  evidenceDeadlineSuggested: isoDay(10),
  state: "REGISTERED",
  dueSoon: false,
  evidence: [],
  createdAt: isoTime(-1),
  ...over,
});
const EVIDENCE = [
  { id: "e1000000-0000-4000-8000-000000000001", fileName: "delivery-receipt.pdf", contentType: "application/pdf", size: 182000, uploadedBy: "owner@toycorner.example.com", uploadedAt: isoTime(-1, 14) },
  { id: "e1000000-0000-4000-8000-000000000002", fileName: "signed-handover.jpg", contentType: "image/jpeg", size: 940000, uploadedBy: "owner@toycorner.example.com", uploadedAt: isoTime(-1, 15) },
];
const ASKED = {
  state: "EVIDENCE_REQUESTED",
  evidenceDeadline: isoDay(5),
  evidenceNote: "Send proof of delivery: the courier's receipt and the signed handover.",
};
const PENDING = dispute({
  ...ASKED,
  state: "SUBMITTED",
  evidence: EVIDENCE,
  sentOn: isoDay(0),
  pendingResult: { result: "LOST", costs: 0, note: "The card network ruled for the cardholder: the delivery address did not match.", requestedBy: FIRST, requestedAt: isoTime(0, 9) },
});
const LIST = [
  dispute({ id: "d1500000-0000-4000-8000-000000000003", source: "DIRECT", scheme: undefined, claimRef: undefined, amount: 39900, salesPointId: SHOP_SITE.id, schemeDeadline: isoDay(-1), receivedOn: isoDay(-12) }),
  dispute({ id: "d1500000-0000-4000-8000-000000000002", amount: 129900, schemeDeadline: isoDay(1), dueSoon: true, claimRef: "CLM-2026-55098" }),
  dispute({}),
  dispute({ id: "d1500000-0000-4000-8000-000000000004", amount: 74800, salesPointId: GIFT_SITE.id, ...ASKED, evidenceDeadline: isoDay(8), claimRef: "CLM-2026-55131" }),
];
const page = (items: unknown[]) => ({ items, page: 0, size: 20, totalItems: items.length, totalPages: 1 });

const admin = (username: string, fixtures: Record<string, unknown>) => ({
  as: { username },
  fixtures: { ...ADMIN_SESSION, ...ADMIN_LOOKUPS, ...fixtures },
});
const openDispute = (d: unknown) => ({ "GET /api/v1/admin/disputes": page([d]), "GET /api/v1/admin/disputes/*": d });
const openFirstRow = async (p: import("@playwright/test").Page) => {
  await p.locator("tbody tr").first().click();
  await p.locator(".mantine-Drawer-body").waitFor();
  await p.waitForTimeout(400);
};

prepare();
await serve();
await shoot(
  [
    {
      name: "payments",
      path: "/admin/payments",
      ...admin(FIRST, { "GET /api/v1/admin/payments": PAYMENTS }),
      wait: "text=ORDER-1042",
      act: async (p) => boxes(p, "payments", { register: "tbody tr:nth-child(3) >> text=Register complaint", row: "tbody tr:nth-child(3)" }),
    },
    {
      name: "register",
      path: "/admin/payments",
      ...admin(FIRST, { "GET /api/v1/admin/payments": PAYMENTS }),
      act: async (p) => {
        await p.locator("tbody tr:nth-child(3) >> text=Register complaint").click();
        const modal = p.locator(".mantine-Modal-content");
        await modal.locator("text=Scheme claim").click();
        await modal.getByLabel("Claim reference").fill("CLM-2026-55120");
        await modal.getByLabel("What the payer says").fill("The cardholder says they never bought this.");
        await modal.getByLabel("Received on").fill(isoDay(-1));
        await modal.getByLabel("Answer due").fill(isoDay(20));
        await p.waitForTimeout(400);
        await boxes(p, "register", { modal: ".mantine-Modal-content", source: ".mantine-SegmentedControl-root", claim: "label:has-text('Claim reference')", dates: "label:has-text('Answer due')", submit: ".mantine-Modal-content button[type=submit]" });
      },
    },
    {
      name: "payments-disputed",
      path: "/admin/payments",
      ...admin(FIRST, { "GET /api/v1/admin/payments": PAYMENTS.map((x) => (x.id === TRAIN.id ? { ...x, state: "DISPUTED" } : x)) }),
      wait: "text=ORDER-1042",
      act: async (p) => boxes(p, "payments-disputed", { badge: "tbody tr:nth-child(3) .mantine-Badge-root" }),
    },
    {
      name: "disputes",
      path: "/admin/disputes",
      ...admin(FIRST, { "GET /api/v1/admin/disputes": page(LIST) }),
      wait: "text=Due soon",
      act: async (p) => boxes(p, "disputes", { overdue: "tbody tr:nth-child(1)", soon: "tbody tr:nth-child(2)", table: "table" }),
    },
    {
      name: "ask-evidence",
      path: "/admin/disputes",
      ...admin(FIRST, openDispute(dispute({}))),
      act: async (p) => {
        await openFirstRow(p);
        await p.locator(".mantine-Drawer-body >> text=Ask for evidence").click();
        const modal = p.locator(".mantine-Modal-content");
        await modal.getByLabel("Note").fill("Send proof of delivery: the courier's receipt and the signed handover.");
        await p.waitForTimeout(400);
        await boxes(p, "ask-evidence", { modal: ".mantine-Modal-content", text: ".mantine-Modal-content p", date: ".mantine-Modal-content input[type=date]" });
      },
    },
    {
      name: "merchant-upload",
      path: "/merchant/payments",
      as: { username: "owner@toycorner.example.com" },
      fixtures: {
        ...MERCHANT_SESSION,
        "GET /api/v1/partner/me": PARTNER,
        "GET /api/v1/partner/sales-points": SITES,
        "GET /api/v1/partner/payments": [{ ...TRAIN, state: "DISPUTED" }],
        "GET /api/v1/partner/payments/*": {
          ...TRAIN,
          state: "DISPUTED",
          operations: [{ kind: "DEBIT", state: "APPROVED", amount: TRAIN.amount, startedAt: TRAIN.createdAt, finishedAt: TRAIN.createdAt }],
        },
        "GET /api/v1/partner/payments/*/disputes": [dispute({ ...ASKED, evidence: EVIDENCE.slice(0, 1) })],
        "GET /api/v1/partner/payments/*/webhooks": [],
      },
      act: async (p) => {
        await openFirstRow(p);
        await p.locator("text=The bank asks for evidence").waitFor();
        await p.waitForTimeout(400);
        await boxes(p, "merchant-upload", { asked: ".mantine-Alert-root", upload: "button:has-text('Upload a file')", drawer: ".mantine-Drawer-content" });
      },
    },
    {
      name: "files",
      path: "/admin/disputes",
      ...admin(FIRST, openDispute(dispute({ ...ASKED, evidence: EVIDENCE }))),
      act: async (p) => {
        await openFirstRow(p);
        await boxes(p, "files", { files: "text=2 files from the merchant", sent: ".mantine-Drawer-body button:has-text('Answer sent')", drawer: ".mantine-Drawer-content" });
      },
    },
    {
      name: "record-lost",
      path: "/admin/disputes",
      ...admin(FIRST, openDispute(dispute({ ...ASKED, state: "SUBMITTED", evidence: EVIDENCE, sentOn: isoDay(0) }))),
      act: async (p) => {
        await openFirstRow(p);
        await p.locator(".mantine-Drawer-body >> text=Record result").click();
        const modal = p.locator(".mantine-Modal-content");
        await modal.locator(".mantine-SegmentedControl-root >> text=Lost").click();
        await modal.getByLabel("Note").fill("The card network ruled for the cardholder: the delivery address did not match.");
        await p.waitForTimeout(400);
        await boxes(p, "record-lost", { modal: ".mantine-Modal-content", lost: ".mantine-SegmentedControl-root" });
      },
    },
    {
      name: "pending",
      path: "/admin/disputes",
      ...admin(FIRST, openDispute(PENDING)),
      act: async (p) => {
        await openFirstRow(p);
        await boxes(p, "pending", { banner: ".mantine-Alert-root:has-text('second admin')", approve: "button:has-text('Approve loss')", drawer: ".mantine-Drawer-content" });
      },
    },
    {
      name: "approve",
      path: "/admin/disputes",
      ...admin(SECOND, openDispute(PENDING)),
      act: async (p) => {
        await openFirstRow(p);
        await boxes(p, "approve", { approve: "button:has-text('Approve loss')", user: `text=${SECOND}` });
      },
    },
    {
      name: "charged-back",
      path: "/admin/payments",
      ...admin(SECOND, { "GET /api/v1/admin/payments": PAYMENTS.map((x) => (x.id === TRAIN.id ? { ...x, state: "CHARGED_BACK" } : x)) }),
      wait: "text=ORDER-1042",
      act: async (p) => {
        await tidy(p);
        await boxes(p, "charged-back", { badge: "tbody tr:nth-child(3) .mantine-Badge-root" });
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-33-disputes"),
);
