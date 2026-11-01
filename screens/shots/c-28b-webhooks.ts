// Lesson 28b: a payment's webhooks: delivered, retrying, waiting, undelivered, sent again; none for a link.
import { join } from "node:path";
import { OWNER, PAID, at, boxes, debit, merchantPayments, openDetail, payment } from "../fixtures/m6";
import { prepare, serve, shoot } from "../harness";

const HOOK = "https://toycorner.example.com/hooks/pay";
const paid = payment({ ...PAID, operations: [debit("APPROVED")] });
// The merchant's server never answered: no status, no error text ("Last answer: no answer").
const tried = (n: number) => Array.from({ length: n }, (_, i) => ({ attempt: i + 1, url: HOOK, attemptedAt: at(-60 + i * 5) }));
const delivered = { eventId: "evt_4f1c9a2e7b", type: "payment.paid", occurredAt: at(-2), deliveredAt: at(-2), undelivered: false, attempts: [{ attempt: 1, url: HOOK, httpStatus: 200, attemptedAt: at(-2) }] };
const retrying = { eventId: "evt_8b2d6e1f30", type: "payment.paid", occurredAt: at(-20), nextAttemptAt: at(4), undelivered: false, attempts: tried(3) };
const waiting = { eventId: "evt_8b2d6e1f31", type: "payment.reversed", occurredAt: at(-5), nextAttemptAt: at(1), undelivered: false, attempts: [] };
const undelivered = { eventId: "evt_8b2d6e1f30", type: "payment.paid", occurredAt: at(-24 * 60), undelivered: true, attempts: tried(12) };
const webhooks = (list: unknown[]) => merchantPayments(paid, { "GET /api/v1/partner/payments/*/webhooks": list });
const open = (name: string, marks: string[]) => async (page: Parameters<typeof boxes>[0]) => {
  await openDetail!(page);
  await page.getByText(marks[0]).first().waitFor();
  await boxes(page, name, marks);
};

prepare();
await serve();
await shoot(
  [
    { name: "delivered", path: "/merchant/payments", as: OWNER, fixtures: webhooks([delivered]), act: open("delivered", ["payment.paid", "Delivered", "1 attempt", "Webhooks"]) },
    {
      name: "retrying",
      path: "/merchant/payments",
      as: OWNER,
      fixtures: webhooks([retrying, waiting]),
      act: open("retrying", ["Retrying", "Next attempt", "Last answer", "Waiting for an earlier event", "payment.reversed"]),
    },
    {
      name: "undelivered",
      path: "/merchant/payments",
      as: OWNER,
      fixtures: webhooks([undelivered]),
      act: open("undelivered", ["Undelivered", "We tried for 24 hours", "Send again"]),
    },
    {
      name: "queued",
      path: "/merchant/payments",
      as: OWNER,
      fixtures: { ...webhooks([undelivered]), "POST /api/v1/partner/payments/*/webhooks/*/replay": () => ({ status: 202, body: {} }) },
      act: async (page) => {
        await openDetail!(page);
        await page.getByRole("button", { name: /Send again/ }).click();
        await page.getByText("Queued").waitFor();
        await page.waitForTimeout(500);
        await boxes(page, "queued", ["Queued"]);
      },
    },
    {
      name: "link",
      path: "/merchant/payments",
      as: OWNER,
      fixtures: merchantPayments(payment({ ...PAID, orderId: "ORDER-1042", description: "Hand-knitted scarf", operations: [debit("APPROVED")] })),
      act: open("link", ["No webhook was sent"]),
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-28b-webhooks"),
);
