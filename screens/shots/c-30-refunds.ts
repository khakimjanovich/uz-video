// Lesson 30: giving money back: the refund box, the dialog, a reversal; the cap and the window; the bank's refund by application.
import { join } from "node:path";
import { CARD_DONE, OWNER, PAID, STAFF, admin, adminPayment, at, boxes, days, debit, merchantPayments, openDetail, payPage, payment } from "../fixtures/m6";
import { prepare, serve, shoot } from "../harness";

type Page = Parameters<typeof boxes>[0];
const paid = payment({ ...PAID, operations: [debit("APPROVED")] });
const reversed = payment({ ...PAID, state: "REVERSED", status: "REVERSED", returnedAt: at(0), operations: [debit("APPROVED"), { kind: "REVERSAL", state: "APPROVED", amount: 249900, reason: "Shoes returned, wrong size", startedAt: at(0), finishedAt: at(0) }] });
const large = payment({ ...PAID, orderId: "ORDER-0977", description: "Playground set", amount: 1_480_000_000, fee: 29_600_000, operations: [debit("APPROVED")] });
const old = payment({ ...PAID, orderId: "ORDER-0612", description: "Rocking horse", createdAt: days(-40), paidAt: days(-40), refundableUntil: days(-26), refundDaysLeft: 0, operations: [debit("APPROVED", { startedAt: days(-40), finishedAt: days(-40) })] });
const giveBack = async (page: Page) => {
  await openDetail!(page);
  await page.getByRole("button", { name: "Give back" }).click();
  await page.getByRole("dialog", { name: "Give the money back?" }).getByLabel("Reason").fill("Shoes returned, wrong size");
  await page.waitForTimeout(300);
};
let refunded = false; // the payment read again after the refund comes back reversed
const oldAdmin = adminPayment({ orderId: "ORDER-0612", description: "Rocking horse", createdAt: days(-40), paidAt: days(-40), rrn: "604512870001" });
const staff = admin({ "GET /api/v1/admin/payments": [oldAdmin], "GET /api/v1/admin/payments/review": [] });
const staffRefund = async (page: Page) => {
  await page.getByRole("button", { name: "Refund by application" }).click();
  await page.getByLabel("Application number").fill("APP-2026-1187");
  await page.getByRole("dialog").getByLabel("Reason").fill("Rocking horse returned");
  await page.getByRole("dialog").getByLabel("Note").fill("Written application received; the refund window closed on the merchant's side.");
  await page.waitForTimeout(300);
};

prepare();
await serve();
await shoot(
  [
    { name: "box", path: "/merchant/payments", as: OWNER, fixtures: merchantPayments(paid), act: async (p) => { await openDetail!(p); await boxes(p, "box", ["Refundable until", "Give back"]); } },
    {
      name: "dialog",
      path: "/merchant/payments",
      as: OWNER,
      fixtures: merchantPayments(paid),
      act: async (p) => {
        await giveBack(p);
        const m = await p.locator(".mantine-Modal-content").boundingBox();
        console.log("  dialog · modal:", m && [m.x, m.y, m.width, m.height].map(Math.round).join(", "));
      },
    },
    {
      name: "reversed",
      path: "/merchant/payments",
      as: OWNER,
      fixtures: merchantPayments(paid, {
        "GET /api/v1/partner/payments": () => ({ body: [refunded ? reversed : paid] }),
        "GET /api/v1/partner/payments/*": () => ({ body: refunded ? reversed : paid }),
        "POST /api/v1/partner/payments/*/refund": () => ((refunded = true), { body: reversed }),
      }),
      act: async (p) => {
        await giveBack(p);
        await p.getByRole("dialog", { name: "Give the money back?" }).getByRole("button", { name: "Give back" }).click();
        await p.getByText("Reversal").waitFor();
        await p.waitForTimeout(500);
        await boxes(p, "reversed", ["Reversal", "Reversed"]);
      },
    },
    { name: "buyer-returned", path: "/pay/pt_9QmXv2LkT7rYw4Hn", fixtures: payPage({ status: "REVERSED", ...CARD_DONE, rrn: PAID.rrn }), wait: "text=Money returned" },
    { name: "over-cap", path: "/merchant/payments", as: OWNER, fixtures: merchantPayments(large), act: async (p) => { await openDetail!(p); await boxes(p, "over-cap", ["Above the refund limit"]); } },
    { name: "closed", path: "/merchant/payments", as: OWNER, fixtures: merchantPayments(old), act: async (p) => { await openDetail!(p); await boxes(p, "closed", ["The refund window has closed"]); } },
    { name: "viewer", path: "/merchant/payments", as: OWNER, fixtures: merchantPayments(paid, {}, "OBSERVER"), act: openDetail },
    {
      name: "staff-form",
      path: "/admin/payments",
      as: STAFF,
      fixtures: staff,
      act: async (p) => {
        await p.getByText("ORDER-0612").waitFor();
        await boxes(p, "staff-list", ["Refund by application"]);
        await staffRefund(p);
        const m = await p.locator(".mantine-Modal-content").boundingBox();
        console.log("  staff-form · modal:", m && [m.x, m.y, m.width, m.height].map(Math.round).join(", "));
      },
    },
    {
      name: "staff-sent",
      path: "/admin/payments",
      as: STAFF,
      fixtures: { ...staff, "POST /api/v1/admin/payments/*/refund-requests": () => ({ status: 201, body: { id: "rr-1", paymentId: oldAdmin.id, applicationRef: "APP-2026-1187", reason: "Rocking horse returned", note: "x", status: "PENDING", requestedBy: "staff1", createdAt: at(0), expiresAt: days(3) } }) },
      act: async (p) => {
        await p.getByText("ORDER-0612").waitFor();
        await staffRefund(p);
        await p.getByRole("button", { name: "Send for approval" }).click();
        await p.getByText("Sent to another admin").waitFor();
        await p.waitForTimeout(500);
        await boxes(p, "staff-sent", ["Sent to another admin", "Refund by application"]);
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-30-refunds"),
);
