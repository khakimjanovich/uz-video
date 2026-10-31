// A first run of the harness: one merchant page, one bank page, the pay page with the real card frame.
import { join } from "node:path";
import { ADMIN_SESSION, MERCHANT_SESSION, SHOP } from "../fixtures/common";
import { CARDS, prepare, serve, shoot } from "../harness";

const partner = { ...SHOP, status: "ACTIVE", emailVerified: true, contractNumber: "C-2026-0042" };

prepare();
await serve();
await shoot(
  [
    {
      name: "merchant-overview",
      path: "/merchant",
      as: { username: "owner@toycorner.example.com" },
      fixtures: {
        ...MERCHANT_SESSION,
        "GET /api/v1/partner/me": partner,
        "GET /api/v1/partner/sales-points": [
          {
            id: "0b6f2c1e-8d4a-4c2b-9e1f-3a5d7c9e1b20",
            partnerId: SHOP.id,
            name: "Toy Corner online",
            websiteUrl: "https://toycorner.example.com",
            returnUrls: ["https://toycorner.example.com/thanks"],
            status: "ACTIVE",
            schemes: ["UZCARD", "HUMO"],
            refundWindowWorkingDays: 10,
            refundExtensionMaxCalendarDays: 60,
          },
        ],
      },
    },
    {
      name: "admin-partners",
      path: "/admin",
      as: { username: "staff1" },
      fixtures: {
        ...ADMIN_SESSION,
        "GET /api/v1/admin/partners": { items: [partner], page: 0, size: 20, totalItems: 1, totalPages: 1 },
      },
    },
    {
      name: "pay-page",
      path: "/pay/pt_screens0001",
      fixtures: {
        "GET /api/v1/pay/*": {
          status: "CREATED",
          amount: 249900,
          orderId: "ORDER-1042",
          description: "Wooden train set",
          merchantName: "Toy Corner",
          hasLogo: false,
          schemes: ["UZCARD", "HUMO"],
          expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
          cardEntry: {
            frameUrl: `${CARDS}/entry/4b8f9a1e-2c3d-4e5f-8a9b-0c1d2e3f4a5b`,
            sessionId: "4b8f9a1e-2c3d-4e5f-8a9b-0c1d2e3f4a5b",
            expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
          },
        },
      },
    },
  ],
  join(import.meta.dir, "../../.screens-out/proof"),
);
