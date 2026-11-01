// Lesson 28: a paid payment and the first webhook its news became.
import { join } from "node:path";
import { OWNER, PAID, at, boxes, debit, merchantPayments, openDetail, payment } from "../fixtures/m6";
import { prepare, serve, shoot } from "../harness";

const paid = payment({ ...PAID, operations: [debit("APPROVED")] });
const event = { eventId: "evt_4f1c9a2e7b", type: "payment.paid", occurredAt: at(-2), deliveredAt: at(-2), undelivered: false, attempts: [{ attempt: 1, url: "https://toycorner.example.com/hooks/pay", httpStatus: 200, attemptedAt: at(-2) }] };

prepare();
await serve();
await shoot(
  [
    {
      name: "detail-webhook",
      path: "/merchant/payments",
      as: OWNER,
      fixtures: merchantPayments(paid, { "GET /api/v1/partner/payments/*/webhooks": [event] }),
      act: async (page) => {
        await openDetail!(page);
        await page.getByText("payment.paid").waitFor();
        await boxes(page, "detail-webhook", ["PAID", "Webhooks", "payment.paid", "Delivered"]);
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-28-outbox-webhooks"),
);
