// Lesson 26: the charge as the buyer sees it, and its one Debit line in the merchant portal.
import { join } from "node:path";
import { CARD_DONE, OWNER, PAID, boxes, debit, merchantPayments, openDetail, payPage, payment } from "../fixtures/m6";
import { prepare, serve, shoot } from "../harness";

const PAGE = "/pay/pt_9QmXv2LkT7rYw4Hn";
const paid = payment({ ...PAID, operations: [debit("APPROVED")] });

prepare();
await serve();
await shoot(
  [
    { name: "debiting", path: PAGE, fixtures: payPage({ status: "DEBITING", ...CARD_DONE }), wait: "text=Taking the payment" },
    { name: "paid", path: PAGE, fixtures: payPage({ status: "PAID", ...CARD_DONE, rrn: PAID.rrn }), wait: "text=Reference number" },
    {
      name: "declined",
      path: PAGE,
      fixtures: payPage({ status: "DECLINED", ...CARD_DONE, declineCode: "CARD_INSUFFICIENT_FUNDS" }),
      wait: "text=Payment declined",
    },
    { name: "list-paid", path: "/merchant/payments", as: OWNER, fixtures: merchantPayments(paid), wait: "text=ORDER-1042" },
    {
      name: "detail",
      path: "/merchant/payments",
      as: OWNER,
      fixtures: merchantPayments(paid),
      act: async (page) => {
        await openDetail!(page);
        await boxes(page, "detail", ["Bank fee", "Calls to the card scheme", "Debit", "Approved", "Webhooks"]);
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-26-debit"),
);
