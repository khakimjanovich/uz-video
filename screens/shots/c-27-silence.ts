// Lesson 27: a charge with no answer: the buyer's page, the merchant's payment, the bank's review queue.
import { join } from "node:path";
import { CARD_DONE, OWNER, PAID, STAFF, admin, adminPayment, at, boxes, debit, merchantPayments, openDetail, payPage, payment } from "../fixtures/m6";
import { prepare, serve, shoot } from "../harness";

const PAGE = "/pay/pt_9QmXv2LkT7rYw4Hn";
const silent = payment({ state: "UNKNOWN", status: "UNKNOWN", operations: [debit("UNKNOWN")] });
const paid = payment({ ...PAID, operations: [debit("APPROVED")] });
const review = payment({ state: "MANUAL_REVIEW", status: "MANUAL_REVIEW", operations: [debit("UNKNOWN")] });
const queued = adminPayment({ status: "MANUAL_REVIEW", state: "MANUAL_REVIEW", createdAt: at(-185) });
const reviewFixtures = admin({ "GET /api/v1/admin/payments": [queued], "GET /api/v1/admin/payments/review": [queued] });
const toReview = async (page: Parameters<typeof boxes>[0]) => {
  await page.getByRole("tab", { name: "Needs review" }).click();
  await page.getByText("ORDER-1042").waitFor();
  await page.waitForTimeout(300);
};

prepare();
await serve();
await shoot(
  [
    {
      name: "pay-unknown",
      path: PAGE,
      fixtures: payPage({ status: "UNKNOWN", ...CARD_DONE, resultWindowSeconds: 1 }),
      wait: "text=Don't pay again",
    },
    { name: "list-unknown", path: "/merchant/payments", as: OWNER, fixtures: merchantPayments(silent), wait: "text=ORDER-1042" },
    {
      name: "detail-unknown",
      path: "/merchant/payments",
      as: OWNER,
      fixtures: merchantPayments(silent),
      act: async (page) => {
        await openDetail!(page);
        await boxes(page, "detail-unknown", ["Debit", "No answer"]);
      },
    },
    { name: "detail-paid", path: "/merchant/payments", as: OWNER, fixtures: merchantPayments(paid), act: openDetail },
    {
      name: "detail-review",
      path: "/merchant/payments",
      as: OWNER,
      fixtures: merchantPayments(review),
      act: openDetail,
    },
    {
      name: "admin-review",
      path: "/admin/payments",
      as: STAFF,
      fixtures: reviewFixtures,
      act: async (page) => {
        await toReview(page);
        await boxes(page, "admin-review", ["Needs review", "3 hours ago", "Being checked", "Not debited"]);
      },
    },
    {
      name: "admin-resolve",
      path: "/admin/payments",
      as: STAFF,
      fixtures: reviewFixtures,
      act: async (page) => {
        await toReview(page);
        await page.getByRole("button", { name: "Debited", exact: true }).click();
        await page.getByLabel("The scheme's reference for the debit").fill("604512873310");
        await page.getByLabel("Note").fill("Confirmed by phone with the network's duty desk, Dilnoza, 14:05.");
        await page.waitForTimeout(300);
        await boxes(page, "admin-resolve", ["The scheme took the money", "Resolve"]);
        const m = await page.locator(".mantine-Modal-content").boundingBox();
        console.log("  modal:", m && [m.x, m.y, m.width, m.height].map(Math.round).join(", "));
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-27-silence"),
);
