// Lesson 18: one admin asks to switch the merchant on, a second admin decides, the history names both.
import { join } from "node:path";
import { ADMIN_SESSION, SHOP } from "../fixtures/common";
import { ACTIVATION, CHECKER, MAKER, ago, approvals, boxes, inMinutes, kyb } from "../fixtures/m45";
import { prepare, serve, shoot } from "../harness";

const PAGE = "/admin/partners/" + SHOP.id;
const BEFORE = [
  { fromStatus: "WAITING_CONTRACT", toStatus: "APPROVED", changedBy: MAKER, reason: "Contract C-2026-0042 signed", changedAt: "2026-10-04T11:20:00Z" },
  { fromStatus: "VERIFIED", toStatus: "WAITING_CONTRACT", changedBy: "system", changedAt: "2026-10-03T09:16:00Z" },
];
const AFTER = [{ fromStatus: "APPROVED", toStatus: "ACTIVE", changedBy: CHECKER, reason: `Requested by ${MAKER}`, changedAt: ago(1) }, ...BEFORE];
const partner = (status: string, history: object[]) => ({
  ...ADMIN_SESSION,
  "GET /api/v1/partners/*": { ...SHOP, status, emailVerified: true, contractNumber: "C-2026-0042" },
  "GET /api/v1/admin/partners/*/documents": { kyb: kyb("APPROVED"), documents: [] },
  "GET /api/v1/admin/partners/*/history": history,
  "GET /api/v1/admin/partners/*/sales-points": [],
  "POST /api/v1/admin/partners/*/activation-requests": ACTIVATION,
});
const WAITING = approvals({
  activations: [ACTIVATION],
  fees: [{ id: "f1", kind: "CREATE", status: "PENDING", requestedBy: MAKER, createdAt: ago(30), rule: { id: "r1", level: "BANK", percent: 1.5, fixedFee: 0, validFrom: inMinutes(60), status: "PROPOSED", proposedBy: MAKER, createdAt: ago(30) } }],
  windows: [{ id: "w1", salesPointId: "0b6f2c1e-8d4a-4c2b-9e1f-3a5d7c9e1b20", calendarDays: 30, reason: "Made-to-order toys", status: "PENDING", requestedBy: MAKER, createdAt: ago(60), expiresAt: inMinutes(3000) }],
  refunds: [{ id: "x1", amount: 249900, applicationRef: "ORDER-1042", reason: "Buyer never received it", requestedBy: MAKER, createdAt: ago(90), expiresAt: inMinutes(3000) }],
});

prepare();
await serve();
await shoot(
  [
    {
      name: "request",
      path: PAGE,
      as: { username: MAKER },
      fixtures: partner("APPROVED", BEFORE),
      act: async (page) => {
        await page.getByRole("button", { name: "Request activation" }).waitFor();
        await boxes(page, "request", {
          actions: page.locator(".mantine-Card-root", { hasText: "Actions" }).first(),
          button: page.getByRole("button", { name: "Request activation" }),
          line: page.getByText("Ask a second admin"),
        });
      },
    },
    {
      name: "request-confirm",
      path: PAGE,
      as: { username: MAKER },
      fixtures: partner("APPROVED", BEFORE),
      act: async (page) => {
        await page.getByRole("button", { name: "Request activation" }).click();
        await boxes(page, "confirm", { dialog: page.getByRole("dialog") });
      },
    },
    {
      name: "requested",
      path: PAGE,
      as: { username: MAKER },
      fixtures: partner("APPROVED", BEFORE),
      act: async (page) => {
        await page.getByRole("button", { name: "Request activation" }).click();
        await page.getByRole("dialog").getByRole("button", { name: "Request activation" }).click();
        await page.getByText("Activation requested").waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "requested", { toast: page.getByText("Activation requested") });
      },
    },
    {
      name: "approvals-maker-plain",
      path: "/admin/approvals",
      as: { username: MAKER },
      fixtures: { ...ADMIN_SESSION, ...WAITING },
      act: async (page) => {
        await page.getByRole("button", { name: "Approve" }).waitFor();
      },
    },
    {
      name: "approvals-maker",
      path: "/admin/approvals",
      as: { username: MAKER },
      fixtures: { ...ADMIN_SESSION, ...WAITING },
      act: async (page) => {
        await page.getByRole("button", { name: "Approve" }).hover({ force: true });
        await page.getByText("You made this request").waitFor();
        await boxes(page, "maker", {
          tabs: page.getByRole("tablist"),
          card: page.locator(".mantine-Card-root").first(),
          approve: page.getByRole("button", { name: "Approve" }),
          reject: page.getByRole("button", { name: "Reject" }),
          tip: page.getByText("You made this request"),
        });
      },
    },
    {
      name: "approvals-checker",
      path: "/admin/approvals",
      as: { username: CHECKER },
      fixtures: { ...ADMIN_SESSION, ...WAITING },
      act: async (page) => {
        await boxes(page, "checker", { card: page.locator(".mantine-Card-root").first(), approve: page.getByRole("button", { name: "Approve" }) });
      },
    },
    {
      name: "approved",
      path: "/admin/approvals",
      as: { username: CHECKER },
      fixtures: { ...ADMIN_SESSION, ...WAITING, "POST /api/v1/admin/activation-requests/*/approve": {} },
      act: async (page) => {
        await page.getByRole("button", { name: "Approve" }).click();
        await page.getByText("Toy Corner is now active").waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "approved", { toast: page.getByText("Toy Corner is now active") });
      },
    },
    {
      name: "history",
      path: PAGE,
      as: { username: CHECKER },
      fixtures: partner("ACTIVE", AFTER),
      act: async (page) => {
        await page.getByText(`Requested by ${MAKER}`).waitFor();
        await page.locator(".mantine-Card-root", { hasText: "History" }).last().scrollIntoViewIfNeeded();
        await boxes(page, "history", { history: page.locator(".mantine-Card-root", { hasText: "History" }).last(), line: page.getByText(`Requested by ${MAKER}`) });
      },
    },
    {
      name: "tabs",
      path: "/admin/approvals",
      as: { username: CHECKER },
      fixtures: { ...ADMIN_SESSION, ...WAITING },
      act: async (page) => {
        await boxes(page, "tabs", { tabs: page.getByRole("tablist") });
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-18-four-eyes"),
);
