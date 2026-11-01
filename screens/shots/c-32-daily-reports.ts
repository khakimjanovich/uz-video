// Lesson 32: the merchant's daily reports, a day with a minus, and the empty page of a new shop.
import { join } from "node:path";
import { MERCHANT_SESSION } from "../fixtures/common";
import { GIFT_SITE, PARTNER, SHOP_SITE, SITES } from "../fixtures/m78";
import { prepare, serve, shoot } from "../harness";

const day = (businessDay: string, salesPointId: string, paidCount: number, paidAmount: number, refundedCount: number, refundedAmount: number) => {
  const fee = Math.round(paidAmount * 0.02);
  const refundedFee = Math.round(refundedAmount * 0.02);
  const net = paidAmount - fee;
  return { businessDay, salesPointId, paidCount, paidAmount, fee, net, refundedCount, refundedAmount, refundedFee, payout: net - (refundedAmount - refundedFee) };
};

const merchant = { ...MERCHANT_SESSION, "GET /api/v1/partner/me": PARTNER, "GET /api/v1/partner/sales-points": SITES };

prepare();
await serve();
await shoot(
  [
    {
      name: "reports",
      path: "/merchant/reports",
      as: { username: "owner@toycorner.example.com" },
      fixtures: {
        ...merchant,
        "GET /api/v1/partner/reports": [
          day("2026-10-30", SHOP_SITE.id, 1, 249900, 1, 49900),
          day("2026-10-29", SHOP_SITE.id, 3, 612000, 0, 0),
          day("2026-10-29", GIFT_SITE.id, 1, 19900, 2, 129800),
          day("2026-10-28", SHOP_SITE.id, 5, 1048500, 0, 0),
          day("2026-10-28", GIFT_SITE.id, 2, 74800, 0, 0),
        ],
      },
      wait: "text=You receive",
    },
    {
      name: "reports-empty",
      path: "/merchant/reports",
      as: { username: "owner@toycorner.example.com" },
      fixtures: { ...merchant, "GET /api/v1/partner/reports": [] },
      wait: "text=No reports yet",
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-32-daily-reports"),
);
